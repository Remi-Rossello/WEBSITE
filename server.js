const express = require('express');
const app = express();
const port = 80;

app.use(express.static('public'));

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
