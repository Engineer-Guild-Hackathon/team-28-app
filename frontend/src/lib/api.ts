// APIクライアント関数
const API_BASE_URL = "/api/v0";

// 投票のデータ型定義
export interface Poll {
  theme_id: string;
  theme_name: string;
  create_at: string;
  category: number; // カテゴリーを整数型に変更
  author: string;
  description?: string; // 説明フィールド
}

export interface PollResponse {
  themes: Poll[];
}

// ユーザー情報の型定義
export interface User {
  user_id: string;
  username: string;
  displayname?: string;
}

// 投票の選択肢
export interface PollChoice {
  choice_id: string;
  text: string;
  votes: number;
}

// 投票の詳細情報（選択肢を含む）
export interface PollDetail extends Poll {
  choices: PollChoice[];
}

// カテゴリーIDとテキストのマッピング
export const CATEGORY_MAP: Record<number, string> = {
  1: "すべて",
  2: "一般",
  3: "食べ物",
  4: "ライフスタイル",
  5: "テクノロジー",
  6: "エンタメ",
  7: "スポーツ",
  8: "政治",
};

// カテゴリーIDからテキストを取得する関数
export function getCategoryText(categoryId: number): string {
  return CATEGORY_MAP[categoryId] || "不明なカテゴリー";
}

// 投票検索API（検索クエリで検索）
export async function searchPolls(query?: string): Promise<PollResponse> {
  const url = `${API_BASE_URL}/polls/search${
    query ? `?query=${encodeURIComponent(query)}` : ""
  }`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("検索に失敗しました");
  }

  return await response.json();
}

// 投票検索API（カテゴリーで検索）
export async function getPollsByCategory(
  category: string
): Promise<PollResponse> {
  // 注意: このエンドポイントは後で実装予定のため、現在は検索APIを使用
  const url = `${API_BASE_URL}/polls/search?query=${encodeURIComponent(
    category
  )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("カテゴリー検索に失敗しました");
  }

  return await response.json();
}

// 投票詳細取得API
export async function getPollById(id: string): Promise<PollDetail> {
  // 直接IDで投票を取得
  const url = `${API_BASE_URL}/polls/${id}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("投票の取得に失敗しました");
  }

  const pollData = await response.json();

  // 選択肢情報も含めて返す
  // 注意: 選択肢を取得するAPIが別の場合は、追加リクエストが必要
  return {
    ...pollData,
    choices: pollData.choices || [],
  };
}

// 新規投票作成用のデータ型
export interface CreatePollData {
  title: string;
  description?: string;
  category: number; // カテゴリーを整数型に変更
  choices: string[];
}

// 新規投票作成API
export async function createPoll(pollData: CreatePollData): Promise<Poll> {
  // 注意: このエンドポイントは後で実装予定
  const url = `${API_BASE_URL}/polls`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pollData),
    credentials: "include", // Cookieを送信するために必要
  });

  if (!response.ok) {
    throw new Error("投票の作成に失敗しました");
  }

  return await response.json();
}

// ユーザー情報を取得するAPI
export async function getUserInfo(): Promise<User> {
  const url = `${API_BASE_URL}/users/me`;

  const response = await fetch(url, {
    credentials: "include", // Cookieを送信するために必要
  });

  if (!response.ok) {
    throw new Error("ユーザー情報の取得に失敗しました");
  }

  return await response.json();
}

// ユーザーが作成した投票一覧を取得するAPI
export async function getUserPolls(): Promise<PollResponse> {
  const url = `${API_BASE_URL}/users/me/polls`;

  const response = await fetch(url, {
    credentials: "include", // Cookieを送信するために必要
  });

  if (!response.ok) {
    throw new Error("投票一覧の取得に失敗しました");
  }

  return await response.json();
}

// ユーザーが参加した投票一覧を取得するAPI
export async function getUserVotedPolls(): Promise<PollResponse> {
  const url = `${API_BASE_URL}/users/me/voted`;

  const response = await fetch(url, {
    credentials: "include", // Cookieを送信するために必要
  });

  if (!response.ok) {
    throw new Error("参加した投票の取得に失敗しました");
  }

  return await response.json();
}

// 投票に投票するAPI
export async function voteOnPoll(
  pollId: string,
  choiceId: string
): Promise<void> {
  const url = `${API_BASE_URL}/polls/${pollId}/vote`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ choice_id: choiceId }),
    credentials: "include", // Cookieを送信するために必要
  });

  if (!response.ok) {
    throw new Error("投票に失敗しました");
  }
}
