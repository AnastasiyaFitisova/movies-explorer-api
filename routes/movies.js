const express = require('express');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const { validationOfCreateMovies, validationOfDeleteMovie } = require('../middlewares/validation');

const movieRoutes = express.Router();

movieRoutes.get('/', getMovies); // возвращает все сохранённые текущим  пользователем фильмы

movieRoutes.post('/', validationOfCreateMovies, createMovie); // cоздаёт фильм с переданными в теле данными

movieRoutes.delete('/:_id ', validationOfDeleteMovie, deleteMovie); // удаляет сохранённый фильм по id

module.exports = movieRoutes;
