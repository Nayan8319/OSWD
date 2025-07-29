const fs = require('fs');
const archiver = require('archiver');

const output = fs.createWriteStream('Demo.zip');
const archive = archiver('zip', { zlib: { level: 9 } }); // High compression

output.on('close', () => {
  console.log(`Zip complete! Total bytes: ${archive.pointer()} bytes`);
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the output file
archive.pipe(output);

// Add entire folder to the archive
archive.directory('Demo/', false);

// Finalize the archive
archive.finalize();
