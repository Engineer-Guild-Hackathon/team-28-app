"use client";

import Link from "next/link";
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
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useEffect, useState } from "react";
import {
  getUserInfo,
  getUserPolls,
  getUserVotedPolls,
  Poll,
  getCategoryText,
} from "@/lib/api";
import { User } from "@/types/user";

// マイページ用の投票データの型
interface MyPoll {
  id: string;
  title: string;
  description: string;
  category: number; // カテゴリーIDを整数型に変更
  categoryText: string; // カテゴリー表示用テキスト
  createdAt: Date;
  votesCount?: number;
  commentsCount?: number;
  author?: string;
  votedAt?: Date;
}

export default function MyPage() {
  // 状態管理
  const [user, setUser] = useState<User | null>(null);
  const [myPolls, setMyPolls] = useState<MyPoll[]>([]);
  const [participatedPolls, setParticipatedPolls] = useState<MyPoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString);
    } catch (error) {
      console.error("日付の変換に失敗しました:", error);
      return new Date();
    }
  };

  // APIからデータを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // ユーザー情報の取得
        const userData = await getUserInfo();
        setUser({
          username: userData.username,
          displayname: userData.displayname || userData.id.substring(0, 8),
        });

        // 作成した投票の取得
        const myPollsData = await getUserPolls();
        const formattedMyPolls = myPollsData.themes.map((poll: Poll) => ({
          id: poll.theme_id,
          title: poll.theme_name,
          description: poll.description || "",
          category: poll.category, // カテゴリーIDを整数として取得
          categoryText: getCategoryText(poll.category), // カテゴリーIDからテキストに変換
          createdAt: formatDate(poll.create_at),
          votesCount: Math.floor(Math.random() * 300), // 仮データ（実際はAPIから取得）
          // commentsCount: Math.floor(Math.random() * 50), // 仮データ（実際はAPIから取得） 削除
        }));
        setMyPolls(formattedMyPolls);

        // 参加した投票の取得
        const participatedPollsData = await getUserVotedPolls();
        const formattedParticipatedPolls = participatedPollsData.themes.map(
          (poll: Poll) => ({
            id: poll.theme_id,
            title: poll.theme_name,
            description: poll.description || "",
            category: poll.category, // カテゴリーIDを整数として取得
            categoryText: getCategoryText(poll.category), // カテゴリーIDからテキストに変換
            createdAt: formatDate(poll.create_at),
            votedAt: new Date(), // 仮データ（実際はAPIから取得）
            author: poll.author || "匿名",
          })
        );
        setParticipatedPolls(formattedParticipatedPolls);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 text-lg">データを読み込み中...</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* プロフィールカード (サイドバー) */}
            <div className="lg:w-1/4">
              <Card className="shadow-md">
                <CardHeader className="flex flex-col items-center pb-2">
                  <div className="h-24 w-24 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white text-3xl font-bold">
                      {user?.username?.substring(0, 2) || "??"}
                    </span>
                  </div>
                  <CardTitle className="mt-4 text-xl">
                    {user?.username || "ユーザー"}
                  </CardTitle>
                  <p className="text-gray-500">
                    @{user?.displayname || "ユーザー"}
                  </p>
                </CardHeader>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <Link href="/mypage/edit">プロフィール編集</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* メインコンテンツ */}
            <div className="flex-1">
              <Tabs defaultValue="my-polls" className="w-full">
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="my-polls" className="flex items-center">
                    <PenSquare className="h-4 w-4 mr-2" />
                    作成した投票
                  </TabsTrigger>
                  <TabsTrigger
                    value="participated"
                    className="flex items-center"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    参加した投票
                  </TabsTrigger>
                </TabsList>

                {/* 作成した投票 */}
                <TabsContent value="my-polls">
                  <h2 className="text-2xl font-bold mb-4">作成した投票</h2>
                  {myPolls.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-gray-500">
                        まだ投票を作成していません
                      </p>
                      <Button className="mt-4">
                        <Link href="/poll/new">新しい投票を作成する</Link>
                      </Button>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {myPolls.map((poll) => (
                        <Link href={`/poll/${poll.id}`} key={poll.id}>
                          <Card className="hover:shadow-md transition-shadow">
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
                                <Badge variant="outline">
                                  {poll.categoryText}
                                </Badge>
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
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* 参加した投票 */}
                <TabsContent value="participated">
                  <h2 className="text-2xl font-bold mb-4">参加した投票</h2>
                  {participatedPolls.length === 0 ? (
                    <Card className="p-8 text-center">
                      <p className="text-gray-500">
                        まだ投票に参加していません
                      </p>
                      <Button className="mt-4">
                        <Link href="/explore">投票を探す</Link>
                      </Button>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {participatedPolls.map((poll) => (
                        <Link href={`/poll/${poll.id}`} key={poll.id}>
                          <Card className="hover:shadow-md transition-shadow">
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
                                <Badge variant="outline">
                                  {poll.categoryText}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardFooter className="flex justify-between pt-0">
                              <div className="text-xs text-gray-500">
                                <p>
                                  投票日:{" "}
                                  {poll.votedAt
                                    ? format(poll.votedAt, "yyyy年MM月dd日", {
                                        locale: ja,
                                      })
                                    : "不明"}
                                </p>
                                <p className="mt-1">作成者: {poll.author}</p>
                              </div>
                            </CardFooter>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
