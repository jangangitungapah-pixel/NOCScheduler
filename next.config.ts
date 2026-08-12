import type { NextConfig } from "next";

import { validateEnv } from "./src/lib/validation/env";

validateEnv(process.env);

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
