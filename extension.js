const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Ignore DotENV extension is now active!");

  // Create status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = "ignore-dotenv.removeFromHistory";
  statusBarItem.tooltip = "Remove .env from Git History";
  statusBarItem.text = "$(warning) Remove .env from History";
  statusBarItem.hide();

  // Command to check and update .gitignore
  let checkGitignoreDisposable = vscode.commands.registerCommand(
    "ignore-dotenv.checkGitignore",
    async () => {
      try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;
        const gitignorePath = path.join(rootPath, ".gitignore");

        // Check if .gitignore exists
        if (!fs.existsSync(gitignorePath)) {
          // Create .gitignore file with .env entry
          fs.writeFileSync(gitignorePath, ".env\n");
          vscode.window.showInformationMessage(
            "Created .gitignore file with .env entry"
          );
          return;
        }

        // Read .gitignore content
        const content = fs.readFileSync(gitignorePath, "utf8");

        // Check if .env is already in .gitignore
        if (!content.includes(".env")) {
          // Append .env to .gitignore
          fs.appendFileSync(gitignorePath, "\n.env\n");
          vscode.window.showInformationMessage("Added .env to .gitignore");
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );

  // Command to remove .env from Git history
  let removeFromHistoryDisposable = vscode.commands.registerCommand(
    "ignore-dotenv.removeFromHistory",
    async () => {
      try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage("No workspace folder found");
          return;
        }

        const rootPath = workspaceFolders[0].uri.fsPath;

        // Show warning message with more details
        const confirm = await vscode.window.showWarningMessage(
          "This will permanently remove .env files from Git history. This is a destructive operation that will rewrite history. Are you sure you want to continue?",
          { modal: true },
          "Yes, Remove from History",
          "No, Cancel"
        );

        if (confirm !== "Yes, Remove from History") {
          return;
        }

        // Show progress notification
        vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: "Removing .env from Git history",
            cancellable: false,
          },
          async (progress) => {
            progress.report({ increment: 0 });

            // Execute Git commands
            const commands = [
              'git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all',
              "git push origin --force --all",
            ];

            for (const command of commands) {
              progress.report({ increment: 50 });
              await new Promise((resolve, reject) => {
                exec(command, { cwd: rootPath }, (error, stdout, stderr) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  resolve();
                });
              });
            }

            progress.report({ increment: 100 });
          }
        );

        vscode.window.showInformationMessage(
          "Successfully removed .env files from Git history"
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Error removing .env from history: ${error.message}`
        );
      }
    }
  );

  // Function to check for .env files in Git
  const checkForEnvFiles = async () => {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) return;

    const git = gitExtension.exports.getAPI(1);
    if (!git) return;

    const repositories = git.repositories;
    if (repositories.length === 0) return;

    const repository = repositories[0];
    const changes = repository.state.workingTreeChanges;

    const hasEnvFile = changes.some((change) =>
      change.uri.path.endsWith(".env")
    );

    if (hasEnvFile) {
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  };

  // Subscribe to Git changes
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (gitExtension) {
    const git = gitExtension.exports.getAPI(1);
    if (git) {
      git.repositories.forEach((repository) => {
        context.subscriptions.push(
          repository.state.onDidChange(() => checkForEnvFiles())
        );
      });
    }
  }

  context.subscriptions.push(
    checkGitignoreDisposable,
    removeFromHistoryDisposable,
    statusBarItem
  );

  // Initial check
  checkForEnvFiles();
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
