// This script will fetch all the filenames in a directory and write them to a JSON object
const fs = require('fs');
const path = require('path');

// Set the project folder name here
const folderName = 'AI_Avatar_Generator';

const dirName = path.join(folderName, "/en/");
const outputFile = path.join(folderName, "/map.json");

const subfolders = fs.readdirSync(dirName).filter(file => fs.lstatSync(path.join(dirName, file)).isDirectory());
// Traverse through all the subfolders and fetch the filenames
const fileNames = subfolders.map(folder => {
  return fs.readdirSync(path.join(dirName, folder)).map(file => {
    // console.log(path.join(dirName, folder, file));
    return file
  });
});

// Flatten the array of arrays
const flatFiles = fileNames.reduce((acc, curr) => {
  return acc.concat(curr);
}
, []);

// Make a JSON object with the filenames, filename as key an empty value
const map = flatFiles.reduce((acc, curr) => {
  acc[curr] = '';
  return acc;
}
, {});

// Print filenames
console.log(map);

// Write the JSON object to a file with double quotes
fs.writeFileSync(outputFile, JSON.stringify(map, null, 2));
