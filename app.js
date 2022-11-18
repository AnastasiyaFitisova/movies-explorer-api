require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { errorsHandler } = require('./middlewares/errorsHandler');

const {
  PORT = 4000,
  MONGO_DB = 'mongodb://localhost:27017/moviesdb',
} = process.env;

const app = express();

app.use(cors({
  origin: ['https://afitis.nomoredomains.icu', 'https://afitis.nomoredomains.icu'],
  credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger);

app.use(helmet());

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

async function main() {
  await mongoose.connect(MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
