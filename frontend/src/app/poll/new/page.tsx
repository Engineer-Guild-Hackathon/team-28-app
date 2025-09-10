"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/common/header";
import { categories } from "@/constants/categories";
import { PlusCircle, Trash2 } from "lucide-react";

export default function NewPollPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("一般");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 選択肢を追加する
  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  // 選択肢を削除する
  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    }
  };

  // 選択肢を更新する
  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // フォームのバリデーション
  const validateForm = () => {
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return false;
    }

    // 最低2つの選択肢が必要
    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      setError("最低2つの選択肢が必要です");
      return false;
    }

    // 重複する選択肢がないか確認
    const uniqueOptions = new Set(
      validOptions.map((opt) => opt.trim().toLowerCase())
    );
    if (uniqueOptions.size !== validOptions.length) {
      setError("重複する選択肢があります");
      return false;
    }

    return true;
  };

  // 投票を作成する
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // APIリクエストの準備
      const filteredOptions = options.filter((opt) => opt.trim() !== "");
      const pollData = {
        title,
        description,
        category,
        options: filteredOptions,
      };

      // TODO: APIとの連携
      // const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      // const response = await fetch(`${apiBaseUrl}/polls`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(pollData),
      // });

      // if (!response.ok) {
      //   throw new Error("投票の作成に失敗しました");
      // }

      // const data = await response.json();

      // 成功したら投票ページに遷移
      console.log("投票を作成しました:", pollData);
      alert("投票を作成しました！");
      router.push("/"); // 成功したらホームページに遷移
    } catch (err) {
      console.error("エラー:", err);
      setError("投票の作成に失敗しました。再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 共通ヘッダーコンポーネント */}
      <Header />

      {/* メインコンテンツ */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            新しい投票を作成
          </h1>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* タイトル */}
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                タイトル <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="質問や投票のタイトルを入力"
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100文字
              </p>
            </div>

            {/* 説明 */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                説明（任意）
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="投票についての詳細や説明を入力（任意）"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500文字
              </p>
            </div>

            {/* カテゴリー */}
            <div className="mb-6">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                カテゴリー
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {categories
                  .filter((cat) => cat !== "すべて")
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
              </select>
            </div>

            {/* 選択肢 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                選択肢 <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                最低2つの選択肢が必要です（最大10個）
              </p>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`選択肢 ${index + 1}`}
                      className="flex-1"
                      maxLength={100}
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="ml-2 text-gray-500"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {options.length < 10 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="mt-3 flex items-center"
                >
                  <PlusCircle size={16} className="mr-1" /> 選択肢を追加
                </Button>
              )}
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-3 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "作成中..." : "投票を作成する"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
