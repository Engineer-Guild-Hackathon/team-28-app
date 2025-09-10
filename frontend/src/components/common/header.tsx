"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { categories } from "@/constants/categories";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
            <h1 className="text-xl font-bold text-gray-900">DecideBox</h1>
          </div>

          <div className="flex-1 mx-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="px-4 py-2 hover:text-blue-600"
                  >
                    <Link href="/">ホーム</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="px-4 py-2 hover:text-blue-600"
                  >
                    <Link href="/explore">探す</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="px-4 py-2 hover:text-blue-600">
                    カテゴリー
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-1 p-2">
                      {categories.map((category) => (
                        <li
                          key={category}
                          className="py-1 px-2 hover:bg-gray-100 rounded-md"
                        >
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/category/${category}`}
                              className="block"
                            >
                              {category}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className="px-4 py-2 hover:text-blue-600"
                  >
                    <Link href="/poll/new">作成する</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex space-x-3">
            <Button
              asChild
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Link href="/signup">登録</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200 border-gray-200"
            >
              <Link href="/login">ログイン</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
