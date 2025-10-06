#!/usr/bin/env node

import { spawn } from "child_process";
import chalk from "chalk";
import { readConfig } from "../src/utils/readConfig";
import { checkGh } from "../src/utils/checkGh";
import { createIssue } from "../src/commands/createIssue";
import { init } from "../src/commands/init";
import { notifyFileExists } from "../src/utils/notifyFileExists";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(chalk.yellow("Usage: notify <command> OR notify init"));
    process.exit(0);
  }

  await checkGh();

  const cmd = args[0];

  if (cmd === "init") {
    await init();
    process.exit(0);
  }

  const { exists, workingDir } = await notifyFileExists();
  if (!exists) {
    console.log(chalk.yellow("Need to create a .notify file"));
    await init();
  }

  const command = args.join(" ");
  console.log(chalk.cyan(`Running: ${command}`));

  const child = spawn(command, {
    stdio: "inherit",
    shell: true,
    cwd: workingDir,
  });

  child.on("close", async (code) => {
    const status = code === 0 ? "✅ Success" : `❌ Failed (exit ${code})`;
    const colorCodedStatus =
      code === 0 ? chalk.green(status) : chalk.red(status);
    console.log(`\nCommand finished: ${colorCodedStatus}`);

    const config = await readConfig();

    const summary = `Command: ${command}\nResult: ${status}\nTime: ${new Date().toLocaleString()}\nWorking Directory: ${workingDir}`;

    await createIssue(config, summary, status);
  });
}

main().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
