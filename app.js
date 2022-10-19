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
const NotFound = require('./errors/NotFound');

const { NODE_ENV, MONGO_DB } = process.env;
const { PORT = 3000 } = process.env;

const app = express();

app.use(cors({
  origin: [],
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(requestLogger);

app.use(helmet());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorLogger);

app.use('/', router);

app.use(errors());

app.use(errorsHandler);

async function main() {
  await mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : 'mongodb://localhost:27017/moviesdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
