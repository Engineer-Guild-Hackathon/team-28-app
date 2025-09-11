"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Header from "@/components/common/header";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // サインアップ処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // パスワード確認
    if (password !== confirmPassword) {
      setMessage("エラー: パスワードが一致しません");
      return;
    }

    try {
      // FormDataを使って画像も一緒に送信
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const signupUrl = `${apiBaseUrl}/auth/signup`;

      const res = await fetch(signupUrl, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`エラー: ${errorData.detail || "登録に失敗しました"}`);
        return;
      }

      setMessage("登録が完了しました！");
      // ログインページにリダイレクト
      router.push("/login");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err instanceof Error
          ? `エラーが発生しました: ${err.message}`
          : `エラーが発生しました: ${String(err)}`;
      setMessage(errorMsg);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* 共通ヘッダーコンポーネント */}
      <Header />

      {/* メインコンテンツ */}
      <main className="flex flex-grow items-start justify-center px-4 sm:px-6 lg:px-8 py-5">
        <div className="w-full max-w-[960px] py-5 flex flex-col items-center">
          <div className="w-full text-center py-7">
            <h2 className="text-4xl font-bold text-gray-900">アカウント登録</h2>
            <p className="mt-3 text-gray-600">
              DecideBoxコミュニティに参加して、投票を作成したり参加したりしましょう
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md w-full max-w-[480px] ${
                message.includes("エラー")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[480px] space-y-3"
          >
            {/* ユーザー名 */}
            <div className="px-4 py-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                ユーザーネーム
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="ユーザーネーム"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 rounded-lg"
                required
              />
            </div>

            {/* パスワード */}
            <div className="px-4 py-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                パスワード
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワード (8文字以上)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-lg"
                minLength={8}
                required
              />
            </div>

            {/* パスワード確認 */}
            <div className="px-4 py-2">
              <Label
                htmlFor="confirm-password"
                className="text-sm font-medium text-gray-700 mb-1 block"
              >
                パスワード確認
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="パスワードを再入力"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 rounded-lg"
                minLength={8}
                required
              />
            </div>

            <div className="px-4 py-4 w-full">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 rounded-lg"
              >
                登録する
              </Button>
            </div>

            <div className="w-full text-center px-4 pt-1 pb-3">
              <p className="text-sm text-gray-500">
                すでにアカウントをお持ちですか？
                <Link href="/login" className="text-blue-600 hover:underline">
                  ログイン
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
