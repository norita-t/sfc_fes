# SFC Festival Guide

慶應SFCの学園祭向けに作成した、モバイルファーストのデジタルパンフレット兼ナビゲーション用 Web アプリです。

この実装は **日本語UI** で構成しつつ、タイトルは要件どおり **SFC Festival Guide** を維持しています。

## できること

- ホーム
  - クイック導線（マップ / イベント / タイムテーブル / フード / お気に入り）
  - Recommended Now
  - Popular Right Now
  - 混雑サマリー
  - Less Crowded Picks
  - Rain-friendly indoor recommendations
  - Staff Picks
  - QRコード導線プレースホルダー
- イベント一覧
  - カード表示
  - 検索
  - カテゴリ / 時間 / 混雑度 / 屋内外フィルター
  - 開始順 / 人気順 / 空いている順ソート
- イベント詳細
  - 説明、時間、場所、カテゴリ、混雑度、画像プレースホルダー
  - お気に入り
  - 地図で見る
  - 関連イベント
- マップ
  - クリック可能な簡易キャンパスマップ
  - エリア別混雑表示
  - エリアごとの開催イベント一覧
  - 簡易ルート案内（モック）
- タイムテーブル
  - 時間帯ごとの一覧
  - カテゴリ / 場所フィルター
  - タップで詳細へ
- フード
  - ブース名、メニュー、場所、営業時間、混雑度
  - 軽食 / 食事 / ドリンク / デザートで絞り込み
- お気に入り
  - localStorage 永続化

## 技術方針

- 依存なしの静的構成（HTML / CSS / ES Modules）
- モバイルファースト
- コンポーネント分割された構成
- 将来 Firebase Firestore に置き換えやすい repository パターン
- 現在は mock data を使用

## 起動方法

依存パッケージは不要です。ローカルサーバーだけ立てれば動きます。

### Python

```bash
cd sfc-festival-guide
python3 -m http.server 4173
```

ブラウザで `http://localhost:4173` を開いてください。

## データ件数

- イベント: 12件
- フードブース: 5件
- ロケーション: 5件
- カテゴリ: 7件

## ディレクトリ構成

```text
sfc-festival-guide/
├── index.html
├── assets/
│   └── styles.css
└── src/
    ├── app.js
    ├── main.js
    ├── router.js
    ├── components/
    │   ├── bottomNav.js
    │   ├── cards.js
    │   ├── shell.js
    │   └── ui.js
    ├── data/
    │   └── mockData.js
    ├── pages/
    │   ├── eventDetailPage.js
    │   ├── eventsPage.js
    │   ├── favoritesPage.js
    │   ├── foodPage.js
    │   ├── homePage.js
    │   ├── mapPage.js
    │   ├── notFoundPage.js
    │   └── timetablePage.js
    ├── services/
    │   ├── festivalRepository.js
    │   ├── firebaseFestivalRepository.js
    │   └── mockFestivalRepository.js
    ├── store/
    │   └── favoritesStore.js
    └── utils/
        ├── helpers.js
        ├── recommendations.js
        ├── route.js
        └── time.js
```

## Firestore への拡張ポイント

`src/services/firebaseFestivalRepository.js` を本実装に置き換えれば、UI 側を大きく崩さずに差し替え可能です。

想定コレクション:

- `events`
- `locations`
- `categories`
- `foodBooths`

`src/app.js` で現在の `mockFestivalRepository` を Firestore 用 repository に置き換えるだけで移行できる構成にしています。

## 実運用で次に足したいもの

- 混雑度のリアルタイム更新
- 日付切り替え対応
- PWA 化
- QRコード本番導線
- バリアフリー / 雨天動線 / 迷子対応の案内強化
- Staff/Admin 向け更新画面
