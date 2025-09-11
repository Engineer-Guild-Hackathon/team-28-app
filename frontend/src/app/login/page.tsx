"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Header from "@/components/common/header";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const loginUrl = `${apiBaseUrl}/auth/login`;
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.detail || "Login failed"}`);
        return;
      }

      setMessage("Login successful!");
    } catch (err) {
      console.error(err);
      const errorMsg =
        err instanceof Error
          ? `An error occurred: ${err.message}`
          : `An error occurred: ${String(err)}`;
      setMessage(errorMsg);
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* 共通ヘッダーコンポーネント */}
      <Header />

      {/* メインコンテンツ */}
      <main className="flex flex-grow items-start justify-center px-40 py-5">
        <div className="w-full max-w-[960px] py-5 flex flex-col items-center">
          <div className="w-full text-center py-7 mb-8">
            <h2 className="text-4xl font-bold text-gray-900">
              おかえりなさい！
            </h2>
          </div>

          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.includes("Error")
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
            <div className="px-4 py-2">
              <Input
                type="text"
                placeholder="ユーザーネーム"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-14 rounded-lg"
              />
            </div>
            <div className="px-4 py-2">
              <Input
                type="password"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-lg"
              />
            </div>

            <div className="w-full text-center px-4 pt-1 pb-3">
              <Link
                href="/forgot-password"
                className="text-sm text-gray-500 hover:underline"
              >
                パスワードを忘れましたか？
              </Link>
            </div>

            <div className="px-4 py-3 w-full">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-10 rounded-lg"
              >
                ログイン
              </Button>
            </div>

            <div className="w-full text-center px-4 pt-1 pb-3">
              <p className="text-sm text-gray-500">
                アカウントをもっていませんか？{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  サインアップ
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
