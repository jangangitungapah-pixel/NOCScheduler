import { z } from "zod";

const runtimeEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1).default("NOCScheduler"),
  FIREBASE_PROJECT_ID: z.string().trim().min(1).optional(),
});

export type RuntimeEnv = z.infer<typeof runtimeEnvSchema>;

export function validateEnv(env: NodeJS.ProcessEnv): RuntimeEnv {
  return runtimeEnvSchema.parse({
    NODE_ENV: env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: env.NEXT_PUBLIC_APP_NAME,
    FIREBASE_PROJECT_ID: env.FIREBASE_PROJECT_ID,
  });
}
