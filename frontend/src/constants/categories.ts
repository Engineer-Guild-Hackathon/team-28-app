// カテゴリーのリスト（ID:名前のマッピング）
export const categoryMap = {
  1: "すべて",
  2: "一般",
  3: "食べ物",
  4: "ライフスタイル",
  5: "テクノロジー",
  6: "エンタメ",
  7: "スポーツ",
  8: "政治",
};

// カテゴリーIDのリスト
export const categoryIds = Object.keys(categoryMap).map(Number);

// カテゴリー名のリスト（後方互換性のため）
export const categories = Object.values(categoryMap);
