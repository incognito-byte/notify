# Notify CLI

[![Tests](https://github.com/incognito-byte/notify/actions/workflows/test.yml/badge.svg)](https://github.com/incognito-byte/notify/actions/workflows/test.yml)

**Run any command and automatically create a GitHub issue when it finishes.**

`notify` is a lightweight CLI tool that runs any script or command and notifies you by creating a GitHub issue upon completion — whether the command succeeds or fails. It supports per-project configuration via a `.notify` file or uses a default `notifier` repository.

## Features

- Run any command (npm, bun, go, etc.) and track its result
- Automatically create a GitHub issue on success or failure
- Supports `.notify` config files for per-repo customization
- Automatically creates a default `notifier` repository if none is specified
- Prompts to install `gh` CLI if it's missing
- Interactive setup with `notify init`

## Installation

Globally via npm:

```bash
npm install -g notify
```

## Example

Let's say you have a long-running build process:

```bash
# Initialize notify in your project (creates .notify config)
notify init

# Run any command with notifications
notify "npm run build"

# If command succeeds, creates an issue like:
# [Notification] ✅ Success
# Command: go run main.go
# Result: ✅ Success
# Time: 10/5/2025, 3:23:25 PM
# Working Directory: /path

# If build fails, creates an issue like:
# [Notification] ❌ Failed (exit 1)
# Command: go run main.go
# Result: ❌ Failed (exit )
# Time: 10/5/2025, 6:52:49 PM
# Working Directory: /path
```

## Configuration

Create a `.notify` file in your project root:

```json
{
  "repo": "username/notifications-repo"
}
```
