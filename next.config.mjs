/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", port: "" },
      { protocol: "https", hostname: "dgzmokcshopxlsimyjqx.supabase.co", port: "" },
      { protocol: "https", hostname: "github.com", port: "" },
    ]
  }
};

export default nextConfig;
