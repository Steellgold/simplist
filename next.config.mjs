/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "placehold.co", protocol: "https" }
    ]
  }
};

export default nextConfig;
