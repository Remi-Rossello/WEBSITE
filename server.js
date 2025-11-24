const express = require('express');
const app = express();
const port = 80;

app.use(express.static('FRONTEND'));

app.get('/hello', (req, res) => {
  res.send('Hello World! YES IT WORKS');
});

app.get('/hello_test', (req, res) => {
  res.send('Hello test');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
