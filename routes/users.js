const express = require('express');

const {
  getUserInfo, updateUserInfo,
} = require('../controllers/users');
const { validationOfUpdateUserInfo } = require('../middlewares/validation');

const userRoutes = express.Router();

userRoutes.get('/me', getUserInfo); // возвращает информацию о текущем пользователе

userRoutes.patch('/me', validationOfUpdateUserInfo, updateUserInfo); // обновляет информацию о пользователе

module.exports = userRoutes;
