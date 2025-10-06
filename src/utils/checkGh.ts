import { execSync } from "child_process";
import chalk from "chalk";

export async function checkGh() {
  try {
    execSync("gh --version", { stdio: "ignore" });
  } catch {
    console.log(chalk.red("GitHub CLI (gh) not found."));
    console.log(chalk.yellow("Visit https://cli.github.com/ to install `gh`"));
    process.exit(1);
  }
}
