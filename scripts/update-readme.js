import { promises as fsPromises } from "node:fs";

async function updateReadme() {
  try {
    // Read the contents of both files
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

    // If different, copy the file
    await copyFile(sourcePath, destinationPath);
    console.log(`README.md has been copied to ${destinationPath}`);

    // After copying, add the file to git
    const addResult = await exec("git add README.md");
    console.log(addResult.stdout);

    // Commit the changes
    const commitResult = await exec('git commit -m "chore: 🤖 sync README.md"');
    console.log(commitResult.stdout);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

updateReadme();
