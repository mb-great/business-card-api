const express = require('express');
const cardRoutes = require('./routes');

const app = express();
const port = 3000;

app.use('/business-card', cardRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
