
const readline = require('readline');
const { getResponse } = require('./chatbot');

const read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'You: '
});

console.log("Welcome to Node.js Chatbot! Type your question (type 'bye' to exit)");
read.prompt();

read.on('line', (line) => {
  const input = line.trim();
  const response = getResponse(input);
  console.log(`Bot: ${response}`);

  if (input.toLowerCase() === 'bye') {
    read.close();
  } else {
    read.prompt();
  }
});
