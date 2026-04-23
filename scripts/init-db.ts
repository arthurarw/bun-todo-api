import { spawn } from "bun";

const processResult = spawn({
  cmd: ["bun", "run", "scripts/migrate.ts"],
  stdout: "inherit",
  stderr: "inherit"
});

const exitCode = await processResult.exited;
if (exitCode !== 0) {
  process.exit(exitCode);
}
