"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Toast from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User } from "@/types/user";

const USER_DATA: User = {
  username: "山田太郎",
  displayname: "yamada_taro",
};

// フォームのバリデーションスキーマ
// TODO: 8文字以上のパスワードを強制
const formSchema = z
  .object({
    username: z.string().min(3, {
      message: "ユーザー名は3文字以上である必要があります。",
    }),
    displayname: z.string().min(1, {
      message: "表示名を入力してください。",
    }),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // 新しいパスワードが入力されている場合のみ現在のパスワードを必須にする
      if (data.newPassword && !data.currentPassword) {
        return false;
      }
      return true;
    },
    {
      message: "現在のパスワードを入力してください。",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // 新しいパスワードが入力されている場合は確認パスワードも必要で、一致する必要がある
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "新しいパスワードと確認パスワードが一致しません。",
      path: ["confirmPassword"],
    }
  );

export default function EditProfilePage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // React Hook Formの設定
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: USER_DATA.username,
      displayname: USER_DATA.displayname,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // フォーム送信処理
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("更新に失敗しました");
        }
        // 成功時の処理
        setMessage("プロフィールを更新しました");
        setToastType("success");
        setToastVisible(true);

        // 3秒後にマイページへ遷移
        setTimeout(() => {
          router.push("/mypage");
        }, 3000);
      })
      .catch((err) => {
        // エラー時の処理
        setMessage(err instanceof Error ? err.message : "エラーが発生しました");
        setToastType("error");
        setToastVisible(true);
      });
  }

  return (
    <>
      <Header />
      {toastVisible && message && (
        <Toast
          message={message}
          type={toastType}
          onClose={() => setToastVisible(false)}
        />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 戻るボタン */}
        <Link
          href="/mypage"
          className="flex items-center text-gray-600 mb-6 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          マイページに戻る
        </Link>

        <div className="max-w-3xl mx-auto">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl">プロフィール編集</CardTitle>
              <CardDescription>
                プロフィール情報を更新します。変更を保存するには「更新する」ボタンをクリックしてください。
              </CardDescription>
            </CardHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  {/* 名前 */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>名前</FormLabel>
                        <FormControl>
                          <Input placeholder="名前を入力" {...field} />
                        </FormControl>
                        <FormDescription>
                          あなたの氏名または表示名です。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 表示名 */}
                  <FormField
                    control={form.control}
                    name="displayname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>表示名</FormLabel>
                        <FormControl>
                          <Input placeholder="ユーザー名を入力" {...field} />
                        </FormControl>
                        <FormDescription>
                          ユーザー名はプロフィールURLで使用されます。
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* パスワード変更セクション */}
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">パスワード変更</h3>
                    <p className="text-sm text-gray-500">
                      パスワードを変更する場合のみ入力してください。変更しない場合は空欄のままで構いません。
                    </p>

                    {/* 現在のパスワード */}
                    <FormField
                      control={form.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>現在のパスワード</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="現在のパスワード"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* 新しいパスワード */}
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>新しいパスワード</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="新しいパスワード"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            パスワードは8文字以上で設定してください。
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* パスワード確認 */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>パスワード確認</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="パスワード確認"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/mypage")}
                  >
                    キャンセル
                  </Button>
                  <Button type="submit">更新する</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </main>
    </>
  );
}
