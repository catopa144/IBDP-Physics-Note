# Obsidian Notes - IB Physics

このリポジトリは、[Quartz](https://quartz.jzhao.xyz/)を使用してObsidianノートをGitHub Pagesで公開しています。

## 🌐 公開サイト

公開サイトはこちら: `https://your-username.github.io/obsidian-notes/`

## 📝 ローカルでの実行方法

### 前提条件
- Node.js 18以上
- npm

### セットアップ

1. リポジトリをクローン:
```bash
git clone https://github.com/your-username/obsidian-notes.git
cd obsidian-notes
```

2. 依存関係をインストール:
```bash
npm install
```

3. ローカルサーバーを起動:
```bash
npx quartz build --serve
```

ブラウザで `http://localhost:8080` を開いてサイトを確認できます。

## 🔄 更新とデプロイ

### Obsidianでノートを編集

1. Obsidianでノートを通常通り編集
2. 変更をコミット:
```bash
git add .
git commit -m "ノートを更新"
```

3. GitHubにプッシュ:
```bash
git push origin main
```

GitHub Actionsが自動的にビルドとデプロイを実行します。数分後に公開サイトに変更が反映されます。

## 📁 ディレクトリ構造

- `IB Physics/` - Obsidianノート(コンテンツ)
- `quartz/` - Quartzのコアファイル
- `public/` - ビルド成果物(自動生成)
- `quartz.config.ts` - Quartzの設定ファイル
- `quartz.layout.ts` - レイアウト設定

## ⚙️ カスタマイズ

### サイトタイトルの変更

`quartz.config.ts`の`pageTitle`を編集:

```typescript
configuration: {
  pageTitle: "あなたのサイトタイトル",
  // ...
}
```

### ベースURLの変更

`quartz.config.ts`の`baseUrl`を編集:

```typescript
configuration: {
  baseUrl: "your-username.github.io/repository-name",
  // ...
}
```

## 🛠️ トラブルシューティング

### ビルドエラーが発生する場合

```bash
# キャッシュをクリア
rm -rf .quartz-cache public node_modules
npm install
npx quartz build
```

### リンクが正しく機能しない場合

- Obsidianのリンク形式(`[[ページ名]]`)を使用していることを確認
- ファイル名に特殊文字が含まれていないか確認

## 📚 参考リンク

- [Quartz公式ドキュメント](https://quartz.jzhao.xyz/)
- [GitHub Pages](https://pages.github.com/)

## 📄 ライセンス

このプロジェクトのコンテンツは個人の学習ノートです。
