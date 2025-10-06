import path from "path";
import fs from "fs";
import chalk from "chalk";

export async function notifyFileExists(
  createFile?: boolean,
  config?: { repo: string }
): Promise<{ exists: boolean; workingDir: string }> {
  const workingDir = process.cwd();
  const notifyFilePath = path.resolve(workingDir, ".notify");
  const exists = fs.existsSync(notifyFilePath);
  if (createFile && !exists) {
    await fs.promises.writeFile(
      notifyFilePath,
      JSON.stringify(config, null, 2)
    );
    console.log(chalk.green("✅ .notify file created!"));

    const gitignoreFilePath = path.resolve(workingDir, ".gitignore");
    const gitignoreExists = fs.existsSync(gitignoreFilePath);
    if (gitignoreExists) {
      await fs.promises.appendFile(gitignoreFilePath, "\n.notify\n");
    } else {
      await fs.promises.writeFile(gitignoreFilePath, ".notify\n");
    }

    console.log(chalk.green("✅ .notify file added to .gitignore!"));
  }
  return { exists, workingDir };
}
