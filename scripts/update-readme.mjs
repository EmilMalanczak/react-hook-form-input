import { promises as fsPromises } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sourcePath = path.join(__dirname, "../apps/npm-package/README.md");
const destinationPath = path.join(__dirname, "../README.md");

async function updateReadme() {
  try {
    const [sourceContent, destinationContent] = await Promise.all([
      fsPromises.readFile(sourcePath, "utf8"),
      fsPromises.readFile(destinationPath, "utf8"),
    ]);

    // Compare the contents of the source and destination files
    const shouldUpdateGit = sourceContent !== destinationContent;

    if (!shouldUpdateGit) {
      console.log("No changes detected in README.md. No update required.");

      return;
    }

    await fsPromises.copyFile(sourcePath, destinationPath);
    console.log(`README.md has been copied to ${destinationPath}`);

    const addResult = await fsPromises.exec("git add README.md");
    console.log(addResult.stdout);

    // Commit the changes
    const commitResult = await fsPromises.exec(
      'git commit -m "chore: 🤖 sync README.md"'
    );
    console.log(commitResult.stdout);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

updateReadme();
