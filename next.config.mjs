/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", port: "" },
      { protocol: "https", hostname: "dgzmokcshopxlsimyjqx.supabase.co", port: "" },
      { protocol: "https", hostname: "github.com", port: "" },
      { protocol: "https", hostname: "flag.vercel.app", port: "" },
      { protocol: "https", hostname: "uaparser.js.org", port: "" },
    ]
  }
};

export default nextConfig;
