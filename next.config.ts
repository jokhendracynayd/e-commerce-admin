import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'image01-in.oneplus.net',
      'm.media-amazon.com',
      'cynayd.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'res.cloudinary.com'
    ]
  },
  /* config options here */
};

export default nextConfig;
