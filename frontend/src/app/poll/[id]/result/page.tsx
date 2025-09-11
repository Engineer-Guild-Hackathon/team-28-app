"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Share2,
  MessageSquare,
  BarChart,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// ダミーデータ（実際のアプリではAPIから取得）
const DUMMY_POLL_RESULT = {
  id: "1",
  title: "好きなプログラミング言語は？",
  description:
    "あなたが最も好きなプログラミング言語を教えてください。理由もコメントで共有できます。",
  category: "テクノロジー",
  createdAt: "2025-09-01T10:00:00Z",
  endAt: "2025-10-01T10:00:00Z", // 投票終了日時
  author: {
    name: "山田太郎",
    avatar: "https://i.pravatar.cc/150?u=yamada",
  },
  options: [
    { id: "1", text: "JavaScript", votes: 245 },
    { id: "2", text: "Python", votes: 189 },
    { id: "3", text: "Java", votes: 104 },
    { id: "4", text: "TypeScript", votes: 156 },
    { id: "5", text: "C#", votes: 87 },
  ],
  totalVotes: 781,
  comments: 24,
  userVote: "1", // ユーザーが投票したオプションのID
};

// 日付フォーマット
const formattedDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "yyyy年MM月dd日 HH:mm", { locale: ja });
  } catch (error) {
    console.error("日付のフォーマットに失敗しました:", error);
    return dateString;
  }
};

export default function PollResultPage() {
  const params = useParams();
  const pollId = params.id as string;
  const [pollResult] = useState(DUMMY_POLL_RESULT);

  // 本来はここでAPIからデータを取得
  useEffect(() => {
    // 実際のアプリでは、ここでAPIから投票結果データを取得
    // const fetchPollResult = async () => {
    //   try {
    //     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    //     const response = await fetch(`${apiBaseUrl}/polls/${pollId}/results`);
    //     if (!response.ok) throw new Error("投票結果の取得に失敗しました");
    //     const data = await response.json();
    //     setPollResult(data);
    //   } catch (err) {
    //     console.error("Error fetching poll results:", err);
    //     setError("投票結果の取得に失敗しました");
    //   }
    // };
    // fetchPollResult();
  }, [pollId]);

  // 投票結果の割合を計算
  const getVotePercentage = (votes: number) => {
    return (votes / pollResult.totalVotes) * 100;
  };

  // 最多票を得たオプションを取得
  const getWinningOption = () => {
    if (!pollResult.options.length) return null;
    return pollResult.options.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  };

  const winningOption = getWinningOption();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 共通ヘッダーコンポーネント */}
      <Header />

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2">
                  {pollResult.category}
                </Badge>
                <div className="flex items-center space-x-2 mb-2">
                  <CardTitle className="text-2xl">{pollResult.title}</CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    結果
                  </Badge>
                </div>
                <CardDescription className="text-gray-600">
                  {pollResult.description}
                </CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-4 flex-wrap gap-3">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>作成: {formattedDate(pollResult.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>終了: {formattedDate(pollResult.endAt)}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>{pollResult.comments} コメント</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage
                    src={pollResult.author.avatar}
                    alt={pollResult.author.name}
                  />
                  <AvatarFallback>
                    {pollResult.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">
                  作成者: {pollResult.author.name}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                総投票数:{" "}
                <span className="font-semibold">{pollResult.totalVotes}</span>
              </div>
            </div>

            {/* 結果概要 */}
            {winningOption && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">
                  最多票を獲得したのは
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-900">
                    {winningOption.text}
                  </span>
                  <span className="text-lg text-blue-800">
                    {winningOption.votes}票 (
                    {getVotePercentage(winningOption.votes).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

            {/* 投票結果の詳細 */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                投票結果の詳細
              </h3>
              <div className="space-y-4">
                {pollResult.options.map((option) => (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          option.id === pollResult.userVote
                            ? "font-medium text-blue-600"
                            : ""
                        }
                      >
                        {option.text}{" "}
                        {option.id === pollResult.userVote &&
                          "（あなたの投票）"}
                      </span>
                      <span className="text-gray-600">
                        {option.votes} 票 (
                        {getVotePercentage(option.votes).toFixed(1)}%)
                      </span>
                    </div>
                    <Progress
                      value={getVotePercentage(option.votes)}
                      className={`h-3 ${
                        option.id === pollResult.userVote
                          ? "bg-blue-100"
                          : option.id === winningOption?.id
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* コメントセクション */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">コメント</h3>
              <Button variant="outline" className="w-full">
                コメントを見る ({pollResult.comments})
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <Link href={`/poll/${pollId}`}>投票ページに戻る</Link>
            </Button>
            <Button variant="outline" className="text-blue-600">
              結果をシェア
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
