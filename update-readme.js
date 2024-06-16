import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Construct __dirname in ES module scope
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Define the source and destination paths
const sourcePath = path.join(__dirname, "./apps/npm-package/README.md");
const destinationPath = path.join(__dirname, "README.md");

// Copy the file
fs.copyFile(sourcePath, destinationPath, (err) => {
  if (err) {
    console.error("Error:", err);
    process.exit(1);
  }
  console.log(`README.md has been copied to ${destinationPath}`);
});
