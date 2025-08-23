const fs = require('fs');

fs.writeFileSync('example.txt', 'Hello, this is a test file!');

fs.appendFileSync('example.txt', '\nAppended line.');

const content = fs.readFileSync('example.txt', 'utf-8');
console.log("File Content:\n", content);

fs.renameSync('example.txt', 'rename.txt');

if (fs.existsSync('rename.txt')) {
  console.log('rename.txt exists!');
}
