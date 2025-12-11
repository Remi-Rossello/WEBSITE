const express = require('express');
const app = express();
const port = 80;

app.use(express.static('FRONTEND'));

// Define test routes
app.get('/hello', (req, res) => {
  res.send('Hello World! YES IT WORKS');
});

app.get('/hello_test', (req, res) => {
  res.send('Hello test');
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.sendFile(__dirname + '/FRONTEND/favicon.ico');
});

// Computer route
app.get('/Computers', (req, res) => {
  res.sendFile('Not available yet');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
