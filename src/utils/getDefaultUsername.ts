import { execSync } from "child_process";

export function getDefaultUsername() {
  return execSync("gh api user --jq .login", {
    encoding: "utf-8",
  }).trim();
}
