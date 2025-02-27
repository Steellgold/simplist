import { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui"],
  experimental: {
    authInterrupts: true
  },
  images: {
    remotePatterns: [
      { hostname: "cdn.simplist.blog" },
    ]
  }
}

export default nextConfig