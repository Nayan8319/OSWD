function getResponse(input) {
  const message = input.trim().toLowerCase();

  const responses = {
    "hello": "Hi! ",
    "what is node.js": "Node.js is a runtime environment that lets you run JavaScript on the server.",
    "how are you": "I'm just a bot, but thanks for asking!",
    "what can you do": "I can answer questions about Node.js and help with basic coding queries.",
    "tell me a joke": "Why do programmers prefer dark mode? Because light attracts bugs!",
    "what is npm": "NPM stands for Node Package Manager, and it's used to manage packages in Node.js.",
    "what is express": "Express is a web application framework for Node.js, designed for building web applications and APIs.",
    "how to create a server": "You can create a server in Node.js using the 'http' module or frameworks like Express.",
    "what is middleware": "Middleware is a function that processes requests and responses in Express applications.",
    "what is a callback": "A callback is a function passed into another function as an argument, which is executed after the completion of that function.",
    "what is a promise": "A promise is an object representing the eventual completion or failure of an asynchronous operation.",
    "what is a function": "A function is a block of code that can be executed multiple times, often taking inputs and returning outputs.",
    "what is an array": "An array is a data structure that can hold multiple values in a single variable, accessible by index.",
    "what is an object": "An object is a collection of key-value pairs, where keys are strings and values can be any data type.",
    "what is a module": "A module is a reusable piece of code that can be imported and used in other files in Node.js.",
    "what is a package": "A package is a collection of modules that can be shared and reused, often published to the NPM registry.",
    "what is a route": "A route defines a path in your application that responds to specific HTTP requests.",
    "what is a database": "A database is a structured collection of data that can be accessed and managed.",
    "what is json": "JSON stands for JavaScript Object Notation, a lightweight data interchange format that is easy to read and write.",
    "what is a rest api": "A REST API is an architectural style for designing networked applications, using HTTP requests to access and manipulate data.",
    "bye": "Goodbye! Happy coding!"
  };

  return responses[message] || "Sorry, I don't understand that.";
}

module.exports = { getResponse };
