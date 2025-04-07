# Ignore DotEnv - Automatically Add .env to .gitignore & Remove from Git History

A VSCode extension that helps you protect sensitive environment variables by automatically managing `.env` files in `.gitignore`. Never accidentally commit `.env` files to Git again! Also includes a feature to safely remove `.env` files from Git history if they were previously committed.

## 🔑 Key Features

- 🔒 **Protect Your Secrets**: Automatically prevents `.env` files from being committed to Git
- 🗑️ **Remove .env from Git History**: One-click solution to remove sensitive `.env` files from Git history (button appears in the bottom-right corner of VSCode)
- 🚫 **Automatic .gitignore Management**: Creates or updates `.gitignore` to include `.env`
- ⚡ **Zero Configuration**: Works instantly when you open a Git repository
- 🔍 **Smart Detection**: Automatically detects Git repositories and existing `.gitignore` files

## 🤔 Why Use This Extension?

- Prevent accidental exposure of API keys, passwords, and sensitive credentials
- Fix security issues when `.env` files are accidentally pushed to GitHub
- Save time by automating `.gitignore` management for environment variables
- Protect your project's security with zero manual configuration
- Remove exposed `.env` files from Git history without losing local changes

## How it Works

The extension activates automatically when you open a Git repository in VSCode:

1. 📝 Checks for existing `.gitignore` file
2. ✨ Creates `.gitignore` with `.env` entry if it doesn't exist
3. ➕ Adds `.env` to existing `.gitignore` if not already present
4. 🔔 Notifies you when changes are made
5. 🧹 Provides a one-click solution to remove `.env` from Git history while keeping your local files intact

## Where to Find the Remove .env Button

When you open a Git repository that has `.env` files in its history:

1. Look at the bottom-right corner of your VSCode window
2. You'll see a "Remove .env from Github History" button
3. Click this button to safely remove `.env` files from your repository's history
4. The button remains visible to ensure you can always clean your Git history when needed

Note: The extension preserves your local `.env` files while ensuring they're not tracked in Git. If you've already committed `.env` files to GitHub, you'll see a convenient button to safely remove them from the repository history.

## Requirements

- VSCode 1.80.0 or higher
- Git extension for VSCode

## Extension Settings

This extension works out of the box with no configuration needed.

## Known Issues

None at the moment.

## Release Notes

### 0.0.7

- Enhanced: "Remove .env from Github History" button visibility improved

### 0.0.6

- Added: One-click removal of .env from Git history

### 0.0.2

- Added: Extension preview image

### 0.0.1

- Initial release of Ignore Env
