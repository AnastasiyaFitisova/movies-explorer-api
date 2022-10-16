const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {res.send('Hello')});

app.listen(PORT, () => {
  console.log(`Сeрвер запущен на ${PORT} порту`);
});