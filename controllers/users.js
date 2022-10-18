require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFound = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const Unauthorized = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new NotFound('Нет данных о пользователе'));
    }
    return res.status(200).send(user);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const updateUserInfo = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash,
    });
    return res.status(201).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    if (err.code === 11000) {
      return next(new Conflict('Пользователь с таким email уже зарегистрирован'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new Unauthorized('Неправильные почта или пароль'));
    }
    const passwordIsValid = bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return next(new Unauthorized('Неправильные почта или пароль'));
    }
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'SECRET',
      { expiresIn: '7d' },
    );
    res.cookie('jwt', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).send(user.toJSON());
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('jwt');
    return res.status(200).send({ message: 'Выполнен выход' });
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
  logout,
};
