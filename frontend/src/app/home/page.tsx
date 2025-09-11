"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/common/header";

// ダミーデータ：投票項目
const popularPolls = [
  {
    id: 1,
    title: "好きな季節は？",
    votes: 1289,
    options: ["春", "夏", "秋", "冬"],
    creator: {
      name: "山田太郎",
    },
    category: "一般",
  },
  {
    id: 2,
    title: "最も好きな食べ物は？",
    votes: 876,
    options: ["ラーメン", "寿司", "カレー", "ピザ", "パスタ"],
    creator: {
      name: "佐藤花子",
    },
    category: "食べ物",
  },
  {
    id: 3,
    title: "理想の休日の過ごし方は？",
    votes: 642,
    options: [
      "自宅でリラックス",
      "アウトドア活動",
      "友達と外出",
      "趣味に没頭",
      "旅行",
    ],
    creator: {
      name: "鈴木一郎",
    },
    category: "ライフスタイル",
  },
  {
    id: 4,
    title: "最も使用頻度の高いSNSは？",
    votes: 512,
    options: ["Twitter", "Instagram", "Facebook", "TikTok", "LinkedIn"],
    creator: {
      name: "田中美咲",
    },
    category: "テクノロジー",
  },
  {
    id: 5,
    title: "2024年のベスト映画は？",
    votes: 489,
    options: [
      "デューン 砂の惑星PART2",
      "インサイド・ヘッド2",
      "マッドマックス:フュリオサ",
      "ゴジラxコング:新たなる帝国",
    ],
    creator: {
      name: "高橋健太",
    },
    category: "エンタメ",
  },
];

// カテゴリーのリスト
import { categories } from "@/constants/categories";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  // カテゴリーでフィルタリングした投票を取得
  const filteredPolls =
    selectedCategory === "すべて"
      ? popularPolls
      : popularPolls.filter((poll) => poll.category === selectedCategory);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 共通ヘッダーコンポーネント */}
      <Header />

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヒーローセクション */}
        <section className="bg-blue-600 rounded-xl text-white p-8 mb-12">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">みんなの意見を集めよう</h2>
            <p className="text-xl mb-6">
              簡単に投票を作成して、友達や同僚と共有できます。
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link href="/poll/new">投票を作成する</Link>
            </Button>
          </div>
        </section>

        {/* カテゴリータブ */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* 人気の投票一覧 */}
        <h3 className="text-xl font-bold text-gray-900 mb-6">人気の投票</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => (
            <div
              key={poll.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {poll.title}
                </h4>
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span className="mr-4">
                    <span className="font-medium text-blue-600">
                      {poll.votes}
                    </span>{" "}
                    票
                  </span>
                  <span className="flex items-center">
                    <span className="bg-gray-200 px-2 py-1 rounded-full text-xs">
                      {poll.category}
                    </span>
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  {poll.options.slice(0, 3).map((option, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-1 h-4 rounded-full mr-2 ${
                          ["bg-blue-500", "bg-green-500", "bg-purple-500"][
                            index % 3
                          ]
                        }`}
                      />
                      <span className="text-sm text-gray-700 line-clamp-1">
                        {option}
                      </span>
                    </div>
                  ))}
                  {poll.options.length > 3 && (
                    <div className="text-xs text-gray-500 ml-3">
                      + {poll.options.length - 3} 選択肢
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {poll.creator.name.charAt(0)}
                      </span>
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {poll.creator.name}
                    </span>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    <Link href={`/polls/${poll.id}`}>投票する</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* もっと見るボタン */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            もっと見る
          </Button>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">DecideBox</h2>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                簡単な投票で、みんなの意見を集めよう
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  製品
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      機能
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      プラン
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      活用事例
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  リソース
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      ヘルプセンター
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      ブログ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      開発者向け
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  会社情報
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      私たちについて
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      プライバシー
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm text-gray-600 hover:text-blue-600"
                    >
                      利用規約
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row md:justify-between">
            <p className="text-xs text-gray-500">
              © 2025 DecideBox, Inc. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600">
                <span className="sr-only">GitHub</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
