import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "files.stripe.com",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
