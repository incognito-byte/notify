import fs from "fs/promises";
import path from "path";

export async function readConfig() {
  // Use the original working directory if available, otherwise use current directory
  const workingDir = process.env.ORIGINAL_CWD || process.cwd();
  const file = path.resolve(workingDir, ".notify");
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return { repo: "notifier" };
  }
}
