import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [command, distDir, ...args] = process.argv.slice(2);

if (!command || !distDir) {
  console.error("Usage: node scripts/run-next.mjs <command> <distDir> [...nextArgs]");
  process.exit(1);
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nextBin = resolve(projectRoot, "node_modules", "next", "dist", "bin", "next");

const child = spawn(process.execPath, [nextBin, command, ...args], {
  cwd: projectRoot,
  env: {
    ...process.env,
    NOCSCHEDULER_NEXT_DIST_DIR: distDir,
  },
  stdio: "inherit",
});

function forwardSignal(signal) {
  if (!child.killed) child.kill(signal);
}

process.once("SIGINT", () => forwardSignal("SIGINT"));
process.once("SIGTERM", () => forwardSignal("SIGTERM"));

child.once("error", (error) => {
  console.error(error);
  process.exit(1);
});

child.once("exit", (code) => {
  process.exit(code ?? 0);
});
