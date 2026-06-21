import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
};

export default nextConfig;
