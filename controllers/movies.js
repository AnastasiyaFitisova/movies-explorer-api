const Movie = require('../models/movie');

const InternalServerError = require('../errors/InternalServerError');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const getMovies = async (req, res, next) => {
  try {
    const cards = await Movie.find({});
    return res.status(200).send(cards);
  } catch (err) {
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
    } = req.body;
    const card = await new Movie(
      {
        owner,
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        nameRU,
        nameEN,
        movieId,
      },
    ).save();
    return res.status(200).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

const deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return next(new NotFound('Фильм не существует'));
    } if (userId !== movie.owner.toString()) {
      return next(new Forbidden('Нет прав на удаление фильма'));
    }
    await Movie.findByIdAndDelete(movieId);
    return res.status(200).send(movie);
  } catch (err) {
    if ((err.kind === 'ObjectID')) {
      return next(new BadRequest('Ошибка в запросе'));
    }
    return next(new InternalServerError('Произошла ошибка на сервере'));
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
