import { execSync } from "child_process";
import chalk from "chalk";

export async function ensureRepoExists(config: { repo: string }) {
  try {
    execSync(`gh repo view ${config.repo}`, { stdio: "ignore" });
    console.log(chalk.green(`Repo ${config.repo} already exists`));
  } catch {
    console.log(chalk.yellow(`Creating repo: ${config.repo}`));
    execSync(`gh repo create ${config.repo} --private`, {
      stdio: "inherit",
    });
  }
}
