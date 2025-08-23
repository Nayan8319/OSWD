const fs = require('fs');
const unzipper = require('unzipper');

fs.createReadStream('Demo.zip')
  .pipe(unzipper.Extract({ path: 'extracted' }))
  .on('close', () => console.log('Extraction complete.'));
