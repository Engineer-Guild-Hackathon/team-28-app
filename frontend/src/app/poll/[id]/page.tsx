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
import { CalendarIcon, Share2, MessageSquare, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
  getPollById,
  voteOnPoll,
  PollChoice,
  getCategoryText,
} from "@/lib/api";

// 投票データの型定義
interface PollData {
  id: string;
  title: string;
  description: string;
  category: number; // カテゴリーIDを整数型に変更
  categoryText: string; // カテゴリー表示用テキスト
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
  comments: number;
}

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

  const [poll, setPoll] = useState<PollData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // APIからデータを取得
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setIsLoading(true);
        // APIからデータを取得
        const data = await getPollById(pollId);

        // 取得したデータを変換
        const pollData: PollData = {
          id: data.theme_id,
          title: data.theme_name,
          description: data.description || "", // 説明がない場合は空文字
          category: data.category, // カテゴリーIDを整数として取得
          categoryText: getCategoryText(data.category), // カテゴリーIDからテキストに変換
          createdAt: data.create_at,
          author: {
            id: data.author,
            name: `ユーザーID: ${
              data.author ? data.author.substring(0, 8) : "匿名"
            }...`,
          },
          // APIから取得した選択肢を使用
          options: data.choices.map((choice: PollChoice) => ({
            id: choice.choice_id,
            text: choice.text,
            votes: choice.votes || 0,
          })),
          // 総投票数を計算
          totalVotes: data.choices.reduce(
            (acc: number, choice: PollChoice) => acc + (choice.votes || 0),
            0
          ),
          comments: 0, // コメント数はAPIから取得できない場合は0
        };

        setPoll(pollData);
      } catch (err) {
        console.error("Error fetching poll:", err);
        setError("投票データの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  // 投票結果の割合を計算
  const getVotePercentage = (votes: number) => {
    if (!poll || poll.totalVotes === 0) return 0;
    return (votes / poll.totalVotes) * 100;
  };

  // 投票を送信
  const handleVote = async () => {
    if (!selectedOption || !poll) {
      setError("選択肢を選んでください");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // APIに投票を送信
      await voteOnPoll(pollId, selectedOption);

      // 投票成功後、投票結果を更新
      const updatedOptions = poll.options.map((option) => {
        if (option.id === selectedOption) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });

      // 投票データを更新
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

        {isLoading ? (
          <Card className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 text-lg">投票データを読み込み中...</p>
          </Card>
        ) : !poll ? (
          <Card className="p-12 text-center">
            <p className="text-red-500 text-lg">
              投票データの取得に失敗しました
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              再読み込み
            </Button>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {poll.categoryText}
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
        )}
      </main>
    </div>
  );
}
