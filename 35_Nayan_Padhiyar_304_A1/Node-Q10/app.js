console.log("Current file:", __dirname);
console.log("Current file name:", __filename);

setTimeout(() => {
  console.log("Executed after 1 second");
}, 1000);

setImmediate(() => {
  console.log("Executed after events using setImmediate");
});

console.log("Process Platform:", process.platform);
console.log("Memory Use:", process.memoryUsage());
