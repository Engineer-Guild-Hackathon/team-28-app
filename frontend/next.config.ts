import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 動的ルーティングを使用するためoutput: exportを削除
  distDir: "out", // 出力ディレクトリを指定（デフォルトは.next）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
