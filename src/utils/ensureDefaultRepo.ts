import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

export async function ensureDefaultRepo(config: { repo: string }) {
  // Only handle the default "notifier" case
  if (config.repo !== "notifier") return;

  try {
    execSync(`gh repo view ${config.repo}`, { stdio: "ignore" });
  } catch {
    console.log(chalk.yellow(`Creating default repo: ${config.repo}`));
    execSync(`gh repo create ${config.repo} --private`, {
      stdio: "inherit",
    });

    // Get the current user and update config with full repo name
    try {
      const userOutput = execSync("gh api user --jq .login", {
        encoding: "utf8",
      });
      const username = userOutput.trim();
      const fullRepoName = `${username}/${config.repo}`;

      // Update the config file with the full repo name
      const updatedConfig = { ...config, repo: fullRepoName };
      const workingDir = process.env.ORIGINAL_CWD || process.cwd();
      const configFile = path.resolve(workingDir, ".notify");
      await fs.writeFile(configFile, JSON.stringify(updatedConfig, null, 2));

      console.log(
        chalk.green(`✅ Updated config with full repo name: ${fullRepoName}`)
      );
    } catch (error) {
      console.log(
        chalk.yellow("⚠️  Could not update config with full repo name")
      );
    }
  }
}
