# Env Ignore

A VSCode extension that automatically manages `.env` files in `.gitignore` to prevent accidentally committing sensitive environment variables to Git repositories.

## Features

- Automatically checks for `.gitignore` file when working with Git repositories
- Creates `.gitignore` file if it doesn't exist and adds `.env` entry
- Adds `.env` to existing `.gitignore` if it's not already there
- Works automatically when you open a Git repository

## How it Works

The extension activates when you open a workspace that contains a Git repository. It then:

1. Checks if a `.gitignore` file exists
2. If `.gitignore` doesn't exist, creates it with `.env` entry
3. If `.gitignore` exists but doesn't contain `.env`, adds it
4. Shows a notification when changes are made

## Requirements

- VSCode 1.80.0 or higher
- Git extension for VSCode

## Extension Settings

This extension does not contribute any settings.

## Known Issues

None at the moment.

## Release Notes

### 0.0.1

Initial release of Env Ignore
