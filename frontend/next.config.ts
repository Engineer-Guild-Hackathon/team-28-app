import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination: "http://team-28-app-backend-1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;