import { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  images: {
    remotePatterns: [
      { hostname: "cdn.simplist.blog" },
    ]
  }
}

export default nextConfig