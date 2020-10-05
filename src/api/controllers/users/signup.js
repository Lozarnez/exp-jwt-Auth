// Carga los módulos
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Utiliza las variables de entorno
const dotenv = require('dotenv');

// Carga el modelo
const User = require('../../models/user');

// Carga las variables de entorno
dotenv.config();

module.exports = async ({ body }, res) => {
  // ACTION
  const { password, passwordConfirmation, email, username } = body;

  if (password === passwordConfirmation) {
    const newUser = User({
      password: Bcrypt.hashSync(password, 10),
      email,
      username,
    });

    try {
      const savedUser = await newUser.save();

      // Si guardó el usuario, regresa: email, id y username, para firmarlo con jsonwebtoken
      const token = jwt.sign(
        { email, id: savedUser.id, username },
        process.env.API_KEY,
        { expiresIn: process.env.TOKEN_EXPIRES_IN },
      );

      // Con los datos firmados, regresa el token que contiene la información para obtener los datos del usuario
      return res.status(201).json({ token });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: error,
      });
    }
  }

  return res.status(400).json({
    status: 400,
    message: 'Las contraseñas no coinciden, intenta nuevamente.'
  });
}
