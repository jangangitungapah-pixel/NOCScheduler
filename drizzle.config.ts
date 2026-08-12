import { defineConfig } from "drizzle-kit";

import { loadLocalDatabaseEnv } from "./src/db/load-local-env";

loadLocalDatabaseEnv();

const databaseUrl =
  process.env.DATABASE_URL ?? "postgresql://nocscheduler:nocscheduler@localhost:5432/nocscheduler";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
  migrations: {
    prefix: "timestamp",
  },
  strict: true,
  verbose: true,
});
