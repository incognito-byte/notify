#!/usr/bin/env node

import { spawn } from "child_process";
import chalk from "chalk";
import { readConfig } from "../src/utils/readConfig";
import { checkGh } from "../src/utils/checkGh";
import { ensureDefaultRepo } from "../src/utils/ensureDefaultRepo";
import { createIssue } from "../src/commands/createIssue";
import { init } from "../src/commands/init";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.yellow("Usage: notify <command> OR notify init"));
    process.exit(0);
  }

  const cmd = args[0];

  // handle "notify init"
  if (cmd === "init") {
    await init();
    process.exit(0);
  }

  // Ensure gh exists
  await checkGh();

  // Run the user's command
  const command = args.join(" ");
  console.log(chalk.cyan(`Running: ${command}`));

  // Use the original working directory if available, otherwise use current directory
  const workingDir = process.env.ORIGINAL_CWD || process.cwd();
  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
    cwd: workingDir,
  });

  child.on("close", async (code) => {
    const status = code === 0 ? "✅ Success" : `❌ Failed (exit ${code})`;
    console.log(chalk.green(`\nCommand finished: ${status}`));

    const config = await readConfig();
    await ensureDefaultRepo(config);

    // Read config again in case it was updated by ensureDefaultRepo
    const updatedConfig = await readConfig();

    const summary = `Command: ${command}\nResult: ${status}\nTime: ${new Date().toLocaleString()}`;

    await createIssue(updatedConfig, summary, status);
  });
}

// Run the main function
main().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
