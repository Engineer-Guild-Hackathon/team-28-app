"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Share2, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// ダミーデータ
const DUMMY_POLL = {
  id: "1",
  title: "好きなプログラミング言語は？",
  description:
    "あなたが最も好きなプログラミング言語を教えてください。理由もコメントで共有できます。",
  category: "テクノロジー",
  createdAt: "2025-09-01T10:00:00Z",
  author: {
    name: "山田太郎",
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
};

const formattedDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "yyyy年MM月dd日", { locale: ja });
  } catch (error) {
    console.error("日付のフォーマットに失敗しました:", error);
    return dateString;
  }
};

export default function PollPage() {
  const params = useParams();
  const pollId = params.id as string;

  const [poll, setPoll] = useState(DUMMY_POLL);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // 本来はここでAPIからデータを取得
  useEffect(() => {
    // 実際のアプリでは、ここでAPIから投票データを取得
    // const fetchPoll = async () => {
    //   try {
    //     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    //     const response = await fetch(`${apiBaseUrl}/polls/${pollId}`);
    //     if (!response.ok) throw new Error("投票データの取得に失敗しました");
    //     const data = await response.json();
    //     setPoll(data);
    //   } catch (err) {
    //     console.error("Error fetching poll:", err);
    //     setError("投票データの取得に失敗しました");
    //   }
    // };
    // fetchPoll();
  }, [pollId]);

  // 投票結果の割合を計算
  const getVotePercentage = (votes: number) => {
    return (votes / poll.totalVotes) * 100;
  };

  // 投票を送信
  const handleVote = async () => {
    if (!selectedOption) {
      setError("選択肢を選んでください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 実際のアプリでは、ここでAPIに投票を送信
      // const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // const response = await fetch(`${apiBaseUrl}/polls/${pollId}/vote`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ optionId: selectedOption }),
      // });

      // if (!response.ok) throw new Error("投票の送信に失敗しました");

      // 成功した場合、投票結果を更新
      // const updatedPoll = await response.json();
      // setPoll(updatedPoll);

      // ダミーデータを更新（実際のAPIではこれは不要）
      const updatedOptions = poll.options.map((option) => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });

      setPoll({
        ...poll,
        options: updatedOptions,
        totalVotes: poll.totalVotes + 1,
      });

      setHasVoted(true);
      setMessage("投票が完了しました！");
    } catch (err) {
      console.error("Error submitting vote:", err);
      setError("投票の送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const router = useRouter();

  // 少し待ってからメッセージを消す
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

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

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-6">
            {message}
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2">
                  {poll.category}
                </Badge>
                <CardTitle className="text-2xl mb-2">{poll.title}</CardTitle>
                <CardDescription className="text-gray-600">
                  {poll.description}
                </CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <div className="flex items-center mr-4">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <span>{formattedDate(poll.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="mr-1 h-4 w-4" />
                <span>{poll.comments} コメント</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-semibold">
                    {poll.author.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  作成者: {poll.author.name}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                総投票数:{" "}
                <span className="font-semibold">{poll.totalVotes}</span>
              </div>
            </div>

            {/* 投票セクション */}
            {!hasVoted ? (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">投票する</h3>
                <RadioGroup
                  value={selectedOption || ""}
                  onValueChange={setSelectedOption}
                >
                  <div className="space-y-3">
                    {poll.options.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2 border border-gray-200 rounded-md p-4"
                      >
                        <RadioGroupItem
                          value={option.id}
                          id={`option-${option.id}`}
                        />
                        <Label
                          htmlFor={`option-${option.id}`}
                          className="flex-grow font-normal cursor-pointer"
                        >
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={handleVote}
                  disabled={isSubmitting || !selectedOption}
                >
                  {isSubmitting ? "送信中..." : "投票する"}
                </Button>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">投票結果</h3>
                <div className="space-y-4">
                  {poll.options.map((option) => (
                    <div key={option.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span
                          className={
                            option.id === selectedOption
                              ? "font-medium text-blue-600"
                              : ""
                          }
                        >
                          {option.text}{" "}
                          {option.id === selectedOption && "（あなたの投票）"}
                        </span>
                        <span className="text-gray-600">
                          {option.votes} 票 (
                          {getVotePercentage(option.votes).toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={getVotePercentage(option.votes)}
                        className={`h-2 ${
                          option.id === selectedOption
                            ? "bg-gray-200"
                            : "bg-gray-100"
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* コメント投稿エリア (必要に応じて実装) */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">コメント</h3>
              <Button variant="outline" className="w-full">
                コメントを見る ({poll.comments})
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={() => router.back()}>
              戻る
            </Button>
            {hasVoted && (
              <Button variant="outline" className="text-blue-600">
                結果をシェア
              </Button>
            )}
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
