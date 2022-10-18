require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;

const { userRoutes } = require('./routes/users');
const { movieRoutes } = require('./routes/movies');

const { createUser, login, logout } = require('./controllers/users');

const { auth } = require('./middlewares/auth');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const BadRequest = require('./errors/BadRequest');

const app = express();

app.use(cors({
  origin: [],
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.get('/logout', logout);

app.use(auth);

app.use('/users', userRoutes);

app.use('/movies', movieRoutes);

app.use(errorLogger);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new BadRequest('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
