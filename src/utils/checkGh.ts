import { execSync } from "child_process";
import chalk from "chalk";
import { confirm } from "@inquirer/prompts";

export async function checkGh() {
  try {
    execSync("gh --version", { stdio: "ignore" });
  } catch {
    console.log(chalk.red("GitHub CLI (gh) not found."));
    const install = await confirm({
      message: "Install GitHub CLI?",
      default: true,
    });
    if (install) {
      console.log(
        chalk.cyan(
          "Visit https://cli.github.com/ to install `gh`, then re-run notify."
        )
      );
    }
    process.exit(1);
  }
}
