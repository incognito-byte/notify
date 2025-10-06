import { execSync } from "child_process";
import chalk from "chalk";

export async function ensureDefaultRepo(config: { repo: string }) {
  try {
    execSync(`gh repo view ${config.repo}`, { stdio: "ignore" });
  } catch {
    console.log(chalk.yellow(`Creating repo: ${config.repo}`));
    execSync(`gh repo create ${config.repo} --private`, {
      stdio: "inherit",
    });
  }
}
