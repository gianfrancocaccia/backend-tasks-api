const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Email y contraseña son obligatorios'
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe'
      });
    }

    user = new User({ email, password });
    await user.save();

    const payload = {
      id: user._id
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      ok: true,
      token
    });

  } catch (error) {
    console.error('❌ ERROR REGISTER:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error en el servidor'
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Email y contraseña son obligatorios'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales inválidas'
      });
    }

    const passwordCorrecto = await bcrypt.compare(password, user.password);
    if (!passwordCorrecto) {
      return res.status(400).json({
        ok: false,
        msg: 'Credenciales inválidas'
      });
    }

    const payload = {
      id: user._id
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      ok: true,
      token
    });

  } catch (error) {
    console.error('❌ ERROR LOGIN:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error en el servidor'
    });
  }
};


exports.usuarioAutenticado = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');

    res.json({
      ok: true,
      user
    });

  } catch (error) {
    console.error('❌ ERROR USUARIO:', error);
    res.status(500).json({
      ok: false,
      msg: 'Error en el servidor'
    });
  }
};
