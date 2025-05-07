import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // For Docker optimization
  images: {
    domains: ["lh3.googleusercontent.com"], // Allow Google auth images
  },
};

export default nextConfig;
