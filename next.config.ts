import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lock file tracing to this project so Next.js ignores lockfiles
  // outside the project (e.g. pnpm-lock.yaml in a parent folder).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
