import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "files.stripe.com",
      "res.cloudinary.com",
    ],
  },
};

export default nextConfig;
