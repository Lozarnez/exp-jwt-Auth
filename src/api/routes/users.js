const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

// Con POST, en el ENDPOINT " /signup ", se registra el usuario
router.post('/signup', userController.signup);

module.exports = router;
