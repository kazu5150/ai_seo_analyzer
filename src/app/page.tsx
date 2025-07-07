'use client';

import { useState } from 'react';
import { KeywordWithReason } from '@/types/keyword';
import { SEOMetaInfo } from '@/types/seo-meta';

export default function Home() {
  const [url, setUrl] = useState('');
  const [keywords, setKeywords] = useState<KeywordWithReason[]>([]);
  const [metaInfo, setMetaInfo] = useState<SEOMetaInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState<number | null>(null);
  const [showBrowser, setShowBrowser] = useState(false);
  const [activeTab, setActiveTab] = useState<'keywords' | 'meta'>('keywords');

  const analyzeWebsite = async () => {
    if (!url) {
      setError('URLを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setKeywords([]);
    setMetaInfo(null);
    setSelectedKeyword(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, showBrowser }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'エラーが発生しました');
      }

      setKeywords(data.keywords);
      setMetaInfo(data.metaInfo);
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

          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showBrowser}
                onChange={(e) => setShowBrowser(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                🔍 ブラウザを表示してクロール過程を可視化
              </span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              チェックを入れると、Playwrightがウェブサイトをクロールしている様子がブラウザで表示されます
            </p>
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

        {(keywords.length > 0 || metaInfo) && (
          <div className="mt-8">
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => setActiveTab('keywords')}
                className={`px-4 py-2 rounded-t-lg font-medium ${
                  activeTab === 'keywords'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                キーワード分析
              </button>
              <button
                onClick={() => setActiveTab('meta')}
                className={`px-4 py-2 rounded-t-lg font-medium ${
                  activeTab === 'meta'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                SEOメタ情報
              </button>
            </div>

            {activeTab === 'keywords' && keywords.length > 0 && (
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

            {activeTab === 'meta' && metaInfo && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">SEOメタ情報</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">基本情報</h3>
                    <div className="grid gap-3">
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">タイトル:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.title || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">メタディスクリプション:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.metaDescription || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">メタキーワード:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.metaKeywords || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">文字コード:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.charset || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">言語:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.language || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">HTTPステータス:</span>
                        <span className={`flex-1 font-medium ${
                          metaInfo.httpStatusCode >= 200 && metaInfo.httpStatusCode < 300 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metaInfo.httpStatusCode}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">読み込み時間:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.loadTime}ms</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">OGP (Open Graph Protocol)</h3>
                    <div className="grid gap-3">
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">OGタイトル:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.ogTitle || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">OG説明:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.ogDescription || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">OG画像:</span>
                        <span className="text-gray-800 flex-1 break-all">{metaInfo.ogImage || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">OG URL:</span>
                        <span className="text-gray-800 flex-1 break-all">{metaInfo.ogUrl || '(未設定)'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Twitter Card</h3>
                    <div className="grid gap-3">
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">Cardタイプ:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.twitterCard || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">タイトル:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.twitterTitle || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">説明:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.twitterDescription || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">画像:</span>
                        <span className="text-gray-800 flex-1 break-all">{metaInfo.twitterImage || '(未設定)'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">SEO関連設定</h3>
                    <div className="grid gap-3">
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">Canonical URL:</span>
                        <span className="text-gray-800 flex-1 break-all">{metaInfo.canonicalUrl || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">Robots:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.robots || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">Viewport:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.viewport || '(未設定)'}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-gray-600 w-40">著者:</span>
                        <span className="text-gray-800 flex-1">{metaInfo.author || '(未設定)'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">見出し構造</h3>
                    <div className="space-y-3">
                      {metaInfo.headings.h1.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-600 mb-1">H1 ({metaInfo.headings.h1.length}個)</h4>
                          <ul className="list-disc list-inside text-gray-800 space-y-1">
                            {metaInfo.headings.h1.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {metaInfo.headings.h2.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-600 mb-1">H2 ({metaInfo.headings.h2.length}個)</h4>
                          <ul className="list-disc list-inside text-gray-800 space-y-1">
                            {metaInfo.headings.h2.slice(0, 5).map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                            {metaInfo.headings.h2.length > 5 && (
                              <li className="text-gray-500">...他{metaInfo.headings.h2.length - 5}個</li>
                            )}
                          </ul>
                        </div>
                      )}
                      {metaInfo.headings.h3.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-600 mb-1">H3 ({metaInfo.headings.h3.length}個)</h4>
                          <ul className="list-disc list-inside text-gray-800 space-y-1">
                            {metaInfo.headings.h3.slice(0, 5).map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                            {metaInfo.headings.h3.length > 5 && (
                              <li className="text-gray-500">...他{metaInfo.headings.h3.length - 5}個</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {metaInfo.structuredData.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">構造化データ (JSON-LD)</h3>
                      <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm text-gray-800">
                          {JSON.stringify(metaInfo.structuredData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {metaInfo.alternateLanguages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 text-gray-800">代替言語</h3>
                      <div className="grid gap-2">
                        {metaInfo.alternateLanguages.map((alt, i) => (
                          <div key={i} className="flex">
                            <span className="font-medium text-gray-600 w-20">{alt.lang}:</span>
                            <span className="text-gray-800 flex-1 break-all">{alt.url}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
