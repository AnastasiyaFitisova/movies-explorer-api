const express = require('express');

const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

const app = express();

app.use(express.json());

app.use('/users', userRoutes);

app.use('/movies', movieRoutes);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
