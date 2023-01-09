// Use like node renamer.js /path/to/directory
const fs = require('fs');
const path = require('path');

// Replace spaces with underscores in the given file or directory name
function replaceSpaces(fileOrDir) {
  const newName = fileOrDir.replace(/ /g, '_');
  if (newName !== fileOrDir) {
    fs.renameSync(fileOrDir, newName);
  }
}

// Recursively process the given directory
function processDirectory(dir) {
  fs.readdirSync(dir).forEach((fileOrDir) => {
    const fileOrDirPath = path.join(dir, fileOrDir);
    const stats = fs.statSync(fileOrDirPath);
    if (stats.isDirectory()) {
      processDirectory(fileOrDirPath);
    } else {
      replaceSpaces(fileOrDirPath);
    }
  });
}

// Replace spaces with underscores in all file names in the given directory
function replaceSpacesInDirectory(dir) {
  processDirectory(dir);
  replaceSpaces(dir);
}

// Check if a directory was specified on the command line
if (process.argv.length < 3) {
  console.error('Error: No directory specified');
  console.error('Usage: node replace-spaces.js <directory>');
  process.exit(1);
}

const dir = process.argv[2];

// Replace spaces with underscores in all file names in the specified directory
replaceSpacesInDirectory(dir);
