import { execSync } from "child_process";
import { getDefaultUsername } from "../utils/getDefaultUsername";
import chalk from "chalk";

export async function createIssue(
  config: { repo: string },
  summary: string,
  status: string
) {
  const title = `[Notification] ${status}`;

  try {
    const username = getDefaultUsername();
    const repo = config.repo;

    const token = process.env.GITHUB_TOKEN;
    const ghCommand = token
      ? `GITHUB_TOKEN=${token} gh issue create --repo ${repo} --title "${title}" --body "${summary}" --assignee ${username}`
      : `gh issue create --repo ${repo} --title "${title}" --body "${summary}" --assignee ${username}`;

    execSync(ghCommand, {
      stdio: "inherit",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(chalk.red("Failed to create issue:"), err.message);
    } else {
      console.error(chalk.red("Failed to create issue:"), String(err));
    }
  }
}
