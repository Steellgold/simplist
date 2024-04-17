/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com", port: "" },
      { protocol: "https", hostname: "dgzmokcshopxlsimyjqx.supabase.co", port: "" },
    ]
  }
};

export default nextConfig;
