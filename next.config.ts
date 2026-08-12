import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

import { validateEnv } from "./src/lib/validation/env";

validateEnv(process.env);

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;
