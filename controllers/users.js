const User = require('../models/user');

const NotFound = require('../errors/NotFound');
const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');

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

module.exports = {
  getUserInfo,
  updateUserInfo,
};
