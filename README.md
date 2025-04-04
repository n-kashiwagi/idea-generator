# アイデアジェネレーターアプリケーション

このアプリケーションは、単語の組み合わせからアイデアを生成し保存するためのツールです。

## 機能

- Will、Must、PESTの3つのカテゴリに分類された単語帳
- 単語の選択機能（手動選択またはランダム選択）
- 選択した単語の組み合わせに基づくアイデア入力と保存機能
- 保存したアイデアの再表示機能
- タブ切り替えによる単語カテゴリの表示切替

## デプロイ方法

### Render.comへのデプロイ

1. GitHubリポジトリを作成し、アプリケーションのコードをプッシュします
2. Render.comにアカウントを作成し、ログインします
3. 「New Web Service」を選択し、GitHubリポジトリと連携します
4. 以下の設定を行います：
   - Name: idea-generator（任意の名前）
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. 「Create Web Service」をクリックしてデプロイを開始します

## ローカルでの実行方法

1. リポジトリをクローンします
2. 依存関係をインストールします：`npm install`
3. サーバーを起動します：`node server.js`
4. ブラウザで `http://localhost:3000` にアクセスします

## ファイル構成

- `index.html` - メインのHTMLファイル
- `css/style.css` - スタイルシート
- `js/app.js` - クライアントサイドのJavaScript
- `server.js` - サーバーサイドのNode.jsコード
- `data/word_bank.json` - 単語帳データ
- `data/idea_bank.json` - 保存されたアイデアデータ
- `package.json` - プロジェクト設定
- `render.yaml` - Render.com用のデプロイ設定
