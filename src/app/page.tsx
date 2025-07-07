'use client';

import { useState } from 'react';
import { KeywordWithReason } from '@/types/keyword';

export default function Home() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState<KeywordWithReason[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<number | null>(null);

  const analyzeWebsite = async () => {
    if (!url) {
      setError('URLを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setKeywords([]);
    setSelectedKeyword(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      setKeywords(data.keywords);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          SEOキーワード分析ツール
        </h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              ウェブサイトのURL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={analyzeWebsite}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? '分析中...' : '分析開始'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </div>

        {keywords.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">検索キーワード候補</h2>
            <div className="grid gap-3">
              {keywords.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition duration-150 cursor-pointer"
                    onClick={() => setSelectedKeyword(selectedKeyword === index ? null : index)}
                  >
                    <span className="text-gray-800 font-medium">{item.keyword}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">#{index + 1}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedKeyword === index ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {selectedKeyword === index && (
                    <div className="p-4 bg-blue-50 border-t border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">このキーワードを選んだ理由</h3>
                      <p className="text-sm text-gray-600">{item.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
