import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    const rybbitHost = process.env.NEXT_PUBLIC_RYBBIT_HOST?.replace(/\/$/, "");

    if (!rybbitHost) {
      return [];
    }

    return [
      {
        source: "/api/script.js",
        destination: `${rybbitHost}/api/script.js`,
      },
      {
        source: "/api/track",
        destination: `${rybbitHost}/api/track`,
      },
    ];
  },
};

export default nextConfig;
