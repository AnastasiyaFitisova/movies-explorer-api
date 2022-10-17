const express = require('express');
const { celebrate, Joi } = require('celebrate');

const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');

const userRoutes = express.Router();

userRoutes.get('/me', getUserInfo); // возвращает информацию о текущем пользователе

userRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
  }),
}), updateUserInfo); // обновляет информацию о пользователе

module.exports = {
  userRoutes,
};
