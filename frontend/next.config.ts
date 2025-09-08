import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 静的エクスポートを有効化
  distDir: "out", // 出力ディレクトリを指定（デフォルトは.next）
  images: {
    unoptimized: true, // 静的エクスポート時に必要
  },
};

export default nextConfig;
