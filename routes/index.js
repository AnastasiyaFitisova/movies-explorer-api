const router = require('express').Router();

const auth = require('../middlewares/auth');
const movieRoutes = require('./movies');
const userRoutes = require('./users');

const { validationOfLogin, validationOfCreateUser } = require('../middlewares/validation');
const { createUser, login, logout } = require('../controllers/users');

router.post('/signin', validationOfLogin, login);

router.post('/signup', validationOfCreateUser, createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);
router.get('/logout', logout);

module.exports = router;
