import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Next.js from bundling pdf-parse — must be loaded as native Node.js module
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
