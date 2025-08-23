const express = require('express');
const app = express(); 

app.use(express.static('public'));
app.get('/gethello', (req, res) => {
  res.send('Hello NodeJS');
})

app.listen(3000, () => {
  console.log('http://localhost:3000');
});