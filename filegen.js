// This is a script that generates 5 folders and markdown files for each folder
const fs = require('fs');
const path = require('path');

// Set the project folder name here
const folderName = 'AI_Avatar_Generator';
const sectionCount = 5;

const dirName = path.join(folderName, "/en/");

// Create folders "Section_0" through to "Section_4" if they don't exist
for (let i = 0; i < sectionCount; i++) {
  const folder = path.join(dirName, `Section_${i}`);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
} 

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function getUserInput() {
  return new Promise((resolve, reject) => {
    readline.question('Enter lesson name: ', (input) => {
      resolve(input);
    });
  });
}

// Each Section folder will have markdown files, with it's own numbering
// So the folder/file structure would look like:
// Section_0
// Lesson_1_Getting_started.md
// Lesson_2_Installing.md
// Section_1
// Lesson_1_First_feature.md

// Get the user to enter file names, or enter nothing to go to the next secion
async function createFiles() {
  for (let i = 0; i < 5; i++) {
    let fileNumber = 1;
    let fileName = await getUserInput();
    while (fileName) {
      const filePath = path.join(dirName, `Section_${i}`, `Lesson_${fileNumber}_${fileName}.md`);
      // Replace spaces with _ and remove punctuation
      fileName = fileName.replace(/ /g, '_').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      fs.writeFileSync
      (filePath, `# ${fileName}`);
      fileNumber++;
      fileName = await getUserInput();
    }
  }
  readline.close();
}

createFiles();
