import { Button } from "../ui/button";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-200">
      <div className="flex justify-between items-center px-10 py-5">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4">
            {/* ロゴアイコン部分 */}
            <div className="w-4 h-4 relative">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <path
                  d="M8 1L1 5L8 9L15 5L8 1Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M1 11L8 15L15 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M1 8L8 12L15 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
          <h1 className="font-bold text-lg text-gray-900">DecideBox</h1>
        </div>

        <div className="flex justify-end gap-8 grow">
          <nav className="flex items-center gap-9">
            <Link href="/" className="text-sm font-medium text-gray-900">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium text-gray-900">
              Explore
            </Link>
            <Link href="/create" className="text-sm font-medium text-gray-900">
              Create
            </Link>
          </nav>

          <div className="flex gap-2">
            <Button
              asChild
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 min-w-[84px]"
            >
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-gray-100 border-none min-w-[84px]"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
