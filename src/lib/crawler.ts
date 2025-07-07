import { chromium, Browser, Page } from 'playwright';
import OpenAI from 'openai';

interface PageContent {
  url: string;
  title: string;
  content: string;
  metaDescription: string;
  headings: string[];
}

export async function analyzeWebsite(url: string): Promise<string[]> {
  let browser: Browser | null = null;
  
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    const visitedUrls = new Set<string>();
    const pageContents: PageContent[] = [];
    const baseUrl = new URL(url).origin;
    
    await crawlPage(page, url, baseUrl, visitedUrls, pageContents, 0);
    
    const keywords = await extractKeywordsWithAI(pageContents);
    
    return keywords;
  } catch (error) {
    console.error('Crawling error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function crawlPage(
  page: Page,
  url: string,
  baseUrl: string,
  visitedUrls: Set<string>,
  pageContents: PageContent[],
  depth: number
): Promise<void> {
  if (depth > 2 || visitedUrls.has(url)) {
    return;
  }
  
  visitedUrls.add(url);
  
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    
    const content = await page.evaluate(() => {
      const getText = (selector: string): string => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => el.textContent?.trim() || '').join(' ');
      };
      
      const title = document.title;
      const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const body = document.body?.innerText || '';
      const headings = getText('h1, h2, h3');
      
      return { title, metaDescription, body, headings };
    });
    
    pageContents.push({
      url,
      title: content.title,
      content: content.body,
      metaDescription: content.metaDescription,
      headings: content.headings.split(' ').filter(h => h.length > 0)
    });
    
    const links = await page.evaluate((baseUrl) => {
      const anchors = document.querySelectorAll('a[href]');
      return Array.from(anchors)
        .map(a => (a as HTMLAnchorElement).href)
        .filter(href => href.startsWith(baseUrl));
    }, baseUrl);
    
    for (const link of links.slice(0, 3)) {
      if (visitedUrls.size < 5) {
        await crawlPage(page, link, baseUrl, visitedUrls, pageContents, depth + 1);
      }
    }
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
  }
}

async function extractKeywordsWithAI(pageContents: PageContent[]): Promise<string[]> {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not found');
    return extractKeywordsFallback(pageContents);
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const combinedContent = pageContents.map(page => 
      `URL: ${page.url}\nTitle: ${page.title}\nDescription: ${page.metaDescription}\nHeadings: ${page.headings.join(', ')}\nContent: ${page.content.slice(0, 1000)}...`
    ).join('\n\n');

    const prompt = `
あなたはSEOのエキスパートです。以下のウェブサイトの内容を分析し、Google検索で上位表示を狙えるような検索キーワードを10個提案してください。

分析の観点:
1. ビジネスの核心的な価値提案に関連するキーワード
2. ターゲット顧客が検索しそうなキーワード
3. 競合性と検索ボリュームのバランスが良いキーワード
4. ロングテールキーワード（2-4語の組み合わせ）を含める
5. 会社名や一般的すぎる単語は避ける

ウェブサイトの内容:
${combinedContent}

以下の形式で、検索キーワードを10個提案してください:
1. [キーワード]
2. [キーワード]
...
10. [キーワード]

各キーワードは日本語で、実際にユーザーが検索しそうな自然な表現にしてください。`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0].message.content || '';
    const keywords = content
      .split('\n')
      .filter(line => line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(keyword => keyword.length > 0)
      .slice(0, 10);

    return keywords.length > 0 ? keywords : extractKeywordsFallback(pageContents);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return extractKeywordsFallback(pageContents);
  }
}

function extractKeywordsFallback(pageContents: PageContent[]): string[] {
  const wordFrequency = new Map<string, number>();
  const stopWords = new Set([
    'の', 'に', 'は', 'を', 'た', 'が', 'で', 'て', 'と', 'し', 'れ', 'さ', 'ある', 'いる', 'も', 'する',
    'から', 'な', 'こと', 'として', 'い', 'や', 'れる', 'など', 'なっ', 'ない', 'この', 'ため', 'その',
    'あっ', 'よう', 'また', 'もの', 'という', 'あり', 'まで', 'られ', 'なる', 'へ', 'か', 'だ', 'これ',
    'によって', 'により', 'おり', 'より', 'による', 'ず', 'なり', 'られる', 'において', 'ば', 'なかっ',
    'なく', 'しかし', 'について', 'だけ', 'だっ', 'その後', 'できる', 'それ', 'ところ', 'ものの', 'つ',
    'および', 'いう', 'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for',
    'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from'
  ]);
  
  pageContents.forEach(page => {
    const allText = `${page.title} ${page.metaDescription} ${page.headings.join(' ')} ${page.content}`;
    
    const words = allText
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    words.forEach(word => {
      wordFrequency.set(word, (wordFrequency.get(word) || 0) + 1);
    });
  });
  
  const sortedWords = Array.from(wordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50);
  
  const importantWords = sortedWords.map(([word]) => word);
  
  const keywords: string[] = [];
  
  for (let i = 0; i < Math.min(importantWords.length, 10); i++) {
    if (i < 5) {
      keywords.push(importantWords[i]);
    } else {
      const combo = `${importantWords[Math.floor(Math.random() * 5)]} ${importantWords[i]}`;
      keywords.push(combo);
    }
  }
  
  return keywords.slice(0, 10);
}