# SEOキーワード分析ツール

AIを活用したウェブサイト分析とSEOキーワード提案ツールです。PlaywrightでWebサイトをクロールし、OpenAI APIを使用してビジネス価値の高いSEOキーワードを自動生成します。

## 主な機能

- 🔍 **自動ウェブサイトクロール**: Playwrightを使用してサイト内リンクを再帰的に探索
- 🤖 **AI powered キーワード生成**: OpenAI APIでビジネス価値の高いキーワードを提案
- 📊 **根拠付きキーワード**: 各キーワードに対して選定理由と検索意図を説明
- 👀 **クロール過程の可視化**: ブラウザを表示してリアルタイムでクロール状況を確認
- 🎯 **ターゲット別分析**: ビジネスの価値提案と顧客の検索意図を考慮

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Playwrightブラウザの設定

```bash
npx playwright install
```

### 3. 環境変数の設定

`.env.example`をコピーして`.env.local`ファイルを作成し、環境変数を設定してください：

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集し、OpenAI APIキーを設定：

```bash
OPENAI_API_KEY=your_openai_api_key_here
SHOW_BROWSER=false  # オプション: デフォルトのブラウザ表示設定
```

OpenAI APIキーは[OpenAI Platform](https://platform.openai.com/api-keys)で取得できます。

## 使用方法

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスしてください。

### アプリケーションの使い方

1. **URLを入力**: 分析したいウェブサイトのURLを入力
2. **ブラウザ表示の選択**: 「ブラウザを表示してクロール過程を可視化」にチェックすると、Playwrightの動作が見えます
3. **分析開始**: 「分析開始」ボタンをクリック
4. **結果の確認**: 10個のSEOキーワードが根拠とともに表示されます
5. **詳細確認**: 各キーワードをクリックすると、選定理由が表示されます

## ビルドとデプロイ

### 本番ビルド

```bash
npm run build
```

### 本番サーバー起動

```bash
npm run start
```

### Vercelでのデプロイ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Vercelでデプロイする場合は、環境変数の設定を忘れずに行ってください。

## 技術スタック

- **フロントエンド**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **バックエンド**: Next.js API Routes
- **ウェブクロール**: Playwright
- **AI分析**: OpenAI API (GPT-3.5-turbo)
- **UI**: アコーディオン形式の結果表示

## プロジェクト構造

```
src/
├── app/
│   ├── api/analyze/route.ts    # API エンドポイント
│   ├── page.tsx                # メインページ
│   └── layout.tsx              # レイアウト
├── lib/
│   ├── crawler.ts              # Playwrightクローラー
│   └── progress-emitter.ts     # 進捗通知システム
└── types/
    └── keyword.ts              # 型定義
```

## 仕様詳細

### クロール仕様
- 最大5ページまで
- 最大深度2レベル
- タイムアウト15秒
- サイト内リンクのみ

### AI分析項目
- ビジネスの核心的価値提案
- ターゲット顧客の検索意図
- 競合性と検索ボリュームのバランス
- ロングテールキーワード
- 具体的な選定根拠

## ライセンス

MIT License

## 貢献

プルリクエストや Issue の報告を歓迎します。

## サポート

問題が発生した場合は、以下を確認してください：

1. OpenAI APIキーが正しく設定されているか
2. Playwrightブラウザが正しくインストールされているか（`npx playwright install`）
3. 対象URLが正しくアクセス可能か

---

**注意**: このツールは教育・研究目的で作成されています。商用利用の際は適切なレート制限とコスト管理を行ってください。