import { input, confirm } from "@inquirer/prompts";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { notifyFileExists } from "../utils/notifyFileExists";
import { getDefaultUsername } from "../utils/getDefaultUsername";

export async function init() {
  const repo = await input({
    message:
      "GitHub repo for notifications (write in format of owner/repo or leave blank to to use default notifier repository)",
    default: "",
  });

  const hasToken = process.env.GITHUB_TOKEN;
  let setupToken = false;

  if (!hasToken) {
    setupToken = await confirm({
      message:
        "Set up GitHub token to avoid 'self-assigned' issues and receive mobile notifications? (Recommended)",
      default: false,
    });
  }

  const username = getDefaultUsername();

  const config = {
    repo: repo || `${username}/notifier`,
  };

  const { workingDir } = await notifyFileExists(true, config);

  if (setupToken) {
    await setupGitHubToken(workingDir);
  }
}

async function setupGitHubToken(workingDir: string) {
  console.log(chalk.cyan("\n🔑 Setting up GitHub token..."));
  console.log(
    chalk.yellow(
      "This will help avoid 'self-assigned' issues and receive mobile notifications in GitHub."
    )
  );

  const method = await input({
    message:
      "Choose setup method: (1) Create new PAT, (2) Use existing token, (3) Skip",
    default: "1",
  });

  switch (method) {
    case "1":
      await createNewPAT(workingDir);
      break;
    case "2":
      await useExistingToken(workingDir);
      break;
    case "3":
      console.log(
        chalk.yellow(
          "⚠️  Skipping token setup. You will not receive mobile notifications."
        )
      );
      break;
    default:
      console.log(chalk.red("Invalid option. Skipping token setup."));
  }
}

async function createNewPAT(workingDir: string) {
  console.log(
    chalk.cyan("\n📝 Creating Fine-grained Personal Access Token...")
  );
  console.log(
    chalk.yellow(
      "1. Go to: https://github.com/settings/personal-access-tokens/new"
    )
  );
  console.log(chalk.yellow("2. Click 'Generate new token' (Fine-grained)"));
  console.log(
    chalk.yellow("3. Set Repository access: 'Only select repositories'")
  );
  console.log(chalk.yellow("4. Select your repository"));
  console.log(
    chalk.yellow(
      "5. Under Repository permissions, set 'Issues' to 'Read and write'"
    )
  );
  console.log(chalk.yellow("6. Copy the generated token"));
  console.log(
    chalk.gray("Note: Fine-grained tokens provide minimal required permissions")
  );

  const token = await input({
    message: "Paste your GitHub token here:",
    default: "",
  });

  if (token) {
    await saveTokenToEnvFile(workingDir, token);
    console.log(chalk.green("✅ Token saved to .env file!"));
    console.log(
      chalk.cyan("💡 The .env file has been added to .gitignore for security.")
    );
  }
}

async function useExistingToken(workingDir: string) {
  const token = await input({
    message: "Enter your existing GitHub token:",
    default: "",
  });

  if (token) {
    await saveTokenToEnvFile(workingDir, token);
    console.log(chalk.green("✅ Token saved to .env file!"));
  }
}

async function saveTokenToEnvFile(workingDir: string, token: string) {
  const envFile = path.resolve(workingDir, ".env");
  const envContent = `GITHUB_TOKEN=${token}\n`;

  await fs.writeFile(envFile, envContent);

  const gitignorePath = path.resolve(workingDir, ".gitignore");
  try {
    const gitignoreContent = await fs.readFile(gitignorePath, "utf8");
    if (!gitignoreContent.includes(".env")) {
      await fs.appendFile(gitignorePath, "\n.env\n");
    }
  } catch {
    await fs.writeFile(gitignorePath, ".env\n");
  }
}
