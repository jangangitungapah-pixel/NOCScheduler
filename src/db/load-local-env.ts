import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

/**
 * Load local CLI database configuration without overriding an explicitly
 * provided DATABASE_URL (for example CI, staging, or production tooling).
 *
 * Next.js loads .env* files for the application runtime, but standalone
 * Drizzle/tsx commands are plain Node.js processes and need an explicit load.
 */
export function loadLocalDatabaseEnv() {
  if (process.env.DATABASE_URL) return;

  for (const path of [".env.local", ".env"]) {
    if (!existsSync(path)) continue;

    loadEnvFile(path);
    if (process.env.DATABASE_URL) return;
  }
}
