"use client";

import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Settings,
  Heart,
  PenSquare,
  BarChart3,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// ダミーデータ
const USER_DATA = {
  id: "user123",
  name: "山田 太郎",
  username: "yamada_taro",
  email: "yamada@example.com",
  bio: "UI/UXデザイナー。新しいテクノロジーに興味があります。趣味は写真撮影とカフェ巡りです。",
  joinedDate: new Date("2023-04-15"),
  followersCount: 128,
  followingCount: 95,
};

// 作成した投票のダミーデータ
const MY_POLLS = [
  {
    id: "poll1",
    title: "好きなプログラミング言語は？",
    description: "あなたが最も好きなプログラミング言語を教えてください。",
    category: "テクノロジー",
    createdAt: new Date("2025-08-15"),
    votesCount: 245,
    commentsCount: 32,
  },
  {
    id: "poll2",
    title: "リモートワーク vs オフィスワーク",
    description: "あなたの好きな働き方はどちらですか？",
    category: "ワークスタイル",
    createdAt: new Date("2025-09-01"),
    votesCount: 178,
    commentsCount: 26,
  },
  {
    id: "poll3",
    title: "今年のおすすめ映画は？",
    description: "2025年に公開されたおすすめ映画を教えてください。",
    category: "エンターテイメント",
    createdAt: new Date("2025-09-08"),
    votesCount: 98,
    commentsCount: 41,
  },
];

// 参加した投票のダミーデータ
const PARTICIPATED_POLLS = [
  {
    id: "poll4",
    title: "次の旅行先はどこがいい？",
    description: "次の休暇に行きたい旅行先を選んでください。",
    category: "旅行",
    createdAt: new Date("2025-08-20"),
    votedAt: new Date("2025-08-21"),
    author: "旅行好き",
  },
  {
    id: "poll5",
    title: "朝ごはんの定番は？",
    description: "あなたの朝食の定番メニューを教えてください。",
    category: "フード",
    createdAt: new Date("2025-08-25"),
    votedAt: new Date("2025-08-26"),
    author: "食べログマニア",
  },
  {
    id: "poll6",
    title: "お気に入りのスマートフォンブランドは？",
    description: "あなたが愛用しているスマートフォンブランドを教えてください。",
    category: "テクノロジー",
    createdAt: new Date("2025-09-05"),
    votedAt: new Date("2025-09-06"),
    author: "ガジェット好き",
  },
];

// お気に入り登録した投票のダミーデータ
const FAVORITE_POLLS = [
  {
    id: "poll7",
    title: "理想の休日の過ごし方は？",
    description: "あなたの理想の休日の過ごし方を選んでください。",
    category: "ライフスタイル",
    createdAt: new Date("2025-08-10"),
    author: "休日研究家",
  },
  {
    id: "poll8",
    title: "最高のコーヒーチェーンは？",
    description: "あなたがよく利用するコーヒーチェーンはどこですか？",
    category: "フード",
    createdAt: new Date("2025-08-28"),
    author: "コーヒーマイスター",
  },
];

export default function MyPage() {
  // 必要に応じてタブの状態を管理できるようにstateを残しておく

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* プロフィールカード (サイドバー) */}
          <div className="lg:w-1/4">
            <Card className="shadow-md">
              <CardHeader className="flex flex-col items-center pb-2">
                <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-3xl font-bold">
                    {USER_DATA.name.substring(0, 2)}
                  </span>
                </div>
                <CardTitle className="mt-4 text-xl">{USER_DATA.name}</CardTitle>
                <p className="text-gray-500">@{USER_DATA.username}</p>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  プロフィール編集
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1">
            <Tabs defaultValue="my-polls" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="my-polls" className="flex items-center">
                  <PenSquare className="h-4 w-4 mr-2" />
                  作成した投票
                </TabsTrigger>
                <TabsTrigger value="participated" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  参加した投票
                </TabsTrigger>
                <TabsTrigger value="favorites" className="flex items-center">
                  <Heart className="h-4 w-4 mr-2" />
                  お気に入り
                </TabsTrigger>
              </TabsList>

              {/* 作成した投票 */}
              <TabsContent value="my-polls">
                <h2 className="text-2xl font-bold mb-4">作成した投票</h2>
                <div className="space-y-4">
                  {MY_POLLS.map((poll) => (
                    <Card
                      key={poll.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {poll.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {poll.description}
                            </p>
                          </div>
                          <Badge variant="outline">{poll.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-0">
                        <p className="text-xs text-gray-500">
                          {format(poll.createdAt, "yyyy年MM月dd日", {
                            locale: ja,
                          })}
                        </p>
                        <div className="flex space-x-3 text-sm">
                          <span className="flex items-center">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            {poll.votesCount}票
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {poll.commentsCount}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 参加した投票 */}
              <TabsContent value="participated">
                <h2 className="text-2xl font-bold mb-4">参加した投票</h2>
                <div className="space-y-4">
                  {PARTICIPATED_POLLS.map((poll) => (
                    <Card
                      key={poll.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {poll.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {poll.description}
                            </p>
                          </div>
                          <Badge variant="outline">{poll.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="text-xs text-gray-500">
                          <p>
                            投票日:{" "}
                            {format(poll.votedAt, "yyyy年MM月dd日", {
                              locale: ja,
                            })}
                          </p>
                          <p className="mt-1">作成者: {poll.author}</p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* お気に入り */}
              <TabsContent value="favorites">
                <h2 className="text-2xl font-bold mb-4">お気に入り</h2>
                <div className="space-y-4">
                  {FAVORITE_POLLS.map((poll) => (
                    <Card
                      key={poll.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {poll.title}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {poll.description}
                            </p>
                          </div>
                          <Badge variant="outline">{poll.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="flex justify-between pt-0">
                        <div className="text-xs text-gray-500">
                          <p>
                            作成日:{" "}
                            {format(poll.createdAt, "yyyy年MM月dd日", {
                              locale: ja,
                            })}
                          </p>
                          <p className="mt-1">作成者: {poll.author}</p>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </>
  );
}
