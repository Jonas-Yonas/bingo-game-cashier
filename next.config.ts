import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone", // For Docker optimization
  images: {
    domains: ["lh3.googleusercontent.com"], // Allow Google auth images
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("child_process").execSync("prisma generate");
    }
    return config;
  },
};

export default nextConfig;
