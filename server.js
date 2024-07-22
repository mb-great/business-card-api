const express = require('express');
const cardRoutes = require('./routes');

const app = express();
const port = 3000;

// Route to handle the root URL
app.get('/', (req, res) => {
  res.send('Welcome to the Business Card API. Use /business-card to generate a business card.');
});

app.use('/business-card', cardRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
