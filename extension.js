const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Ignore DotENV extension is now active!");

  let disposable = vscode.commands.registerCommand(
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

  context.subscriptions.push(disposable);

  // Check for Git repository and run the command
  const gitExtension = vscode.extensions.getExtension("vscode.git");
  if (gitExtension) {
    const git = gitExtension.exports.getAPI(1);
    if (git) {
      const repositories = git.repositories;
      if (repositories.length > 0) {
        vscode.commands.executeCommand("ignore-dotenv.checkGitignore");
      }
    }
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
