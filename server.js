const express = require('express');
const app = express();
const port = 80;

app.use(express.static('FRONTEND'));

// Favicon route
app.get('/favicon.ico', (req, res) => {
  res.sendFile(__dirname + '/FRONTEND/favicon.ico');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
