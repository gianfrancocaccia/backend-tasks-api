
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email y contraseña son obligatorios' });
    }


    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }


    user = new User({ email, password });
    await user.save();


    const payload = {
      id: user.id
    };


    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (error, token) => {
        if (error) throw error;
        res.status(201).json({ token });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {

    if (!email || !password) {
      return res.status(400).json({ msg: 'Email y contraseña son obligatorios' });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const passwordCorrecto = await bcrypt.compare(password, user.password);
    if (!passwordCorrecto) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }


    const payload = {
      id: user.id
    };


    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};


exports.usuarioAutenticado = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Error en el servidor' });
  }
};
