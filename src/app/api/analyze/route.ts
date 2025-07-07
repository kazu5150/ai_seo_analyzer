import { NextRequest, NextResponse } from 'next/server';
import { analyzeWebsite } from '@/lib/crawler';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URLが必要です' },
        { status: 400 }
      );
    }

    const keywords = await analyzeWebsite(url);
    
    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('Website analysis error:', error);
    return NextResponse.json(
      { error: 'ウェブサイトの分析中にエラーが発生しました' },
      { status: 500 }
    );
  }
}