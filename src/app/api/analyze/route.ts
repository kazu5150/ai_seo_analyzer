import { NextRequest, NextResponse } from 'next/server';
import { analyzeWebsite } from '@/lib/crawler';

// Server-Sent Events用のレスポンスヘッダー
const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
};

export async function POST(request: NextRequest) {
  const { url, showBrowser = false } = await request.json();

  if (!url) {
    return NextResponse.json(
      { error: 'URLが必要です' },
      { status: 400 }
    );
  }

  // 通常のレスポンスとして処理
  try {
    const { keywords, metaInfo } = await analyzeWebsite(url, showBrowser);
    return NextResponse.json({ keywords, metaInfo });
  } catch (error) {
    console.error('Website analysis error:', error);
    return NextResponse.json(
      { error: 'ウェブサイトの分析中にエラーが発生しました' },
      { status: 500 }
    );
  }
}