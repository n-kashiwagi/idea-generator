# アイデアジェネレーターアプリケーション

このアプリケーションは、単語の組み合わせからアイデアを生成し保存するためのツールです。

## 機能

- Will、Must、PESTの3つのカテゴリに分類された単語帳
- パスワード認証によるログイン機能
- 単語帳への単語追加・削除機能
- 単語の選択機能（手動選択またはランダム選択）
- 選択した単語の組み合わせに基づくアイデア入力と保存機能
- 保存したアイデアの再表示機能
- タブ切り替えによる単語カテゴリの表示切替

## ログイン情報

- パスワード: `sysidealink`

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

## 使用方法

### ログイン
1. アプリケーションにアクセスするとログイン画面が表示されます
2. パスワード「sysidealink」を入力してログインします

### 単語の選択
1. 単語帳から単語をクリックして選択します
2. または「ランダム」ボタンをクリックしてランダムに単語を選択します
3. 「解除」ボタンをクリックして選択を解除できます

### アイデアの入力と保存
1. 「単語1」と「単語2」の両方が選択されると、アイデア入力欄が有効になります
2. アイデアを入力して「アイデアを保存」ボタンをクリックします
3. 保存したアイデアは、次回同じ単語の組み合わせを選んだときに自動的に表示されます

### 単語の管理
1. 画面右上の「単語管理」ボタンをクリックします
2. 表示されたモーダルウィンドウで単語の追加・削除ができます
3. 新しい単語を入力して「追加」ボタンをクリックすると単語が追加されます
4. 単語の横にある「×」ボタンをクリックすると単語が削除されます
5. 「変更を保存」ボタンをクリックして変更を保存します

### ログアウト
1. 画面右上の「ログアウト」ボタンをクリックしてログアウトします

## ファイル構成

- `index.html` - メインのHTMLファイル
- `css/style.css` - スタイルシート
- `js/app.js` - クライアントサイドのJavaScript
- `server.js` - サーバーサイドのNode.jsコード
- `data/word_bank.json` - 単語帳データ
- `data/idea_bank.json` - 保存されたアイデアデータ
- `package.json` - プロジェクト設定
- `render.yaml` - Render.com用のデプロイ設定
