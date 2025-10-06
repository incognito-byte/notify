import fs from "fs/promises";
import path from "path";
import { notifyFileExists } from "./notifyFileExists";
import chalk from "chalk";

export async function readConfig() {
  const { workingDir } = await notifyFileExists();
  try {
    const data = await fs.readFile(path.resolve(workingDir, ".notify"), "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log(chalk.yellow("No .notify file found"));
    console.log(chalk.yellow("Please run `notify init` to create one"));
    process.exit(1);
  }
}
