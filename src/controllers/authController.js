const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const createToken = (user) => {
  const payload = {
    id: user.id,
    nombre: user.nombre,
    usuario: user.usuario,
    rolId: user.rolId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', {
    expiresIn: '8h',
  });
};

const register = async (req, res, next) => {
  try {
    const { nombre, usuario, correo, password, rolId } = req.body;

    if (!nombre || !usuario || !correo || !password) {
      const error = new Error('Todos los campos son obligatorios.');
      error.status = 400;
      throw error;
    }

    const existingUser = await authService.findUserByUsername(usuario);
    if (existingUser) {
      const error = new Error('El nombre de usuario ya está en uso.');
      error.status = 400;
      throw error;
    }

    const existingEmail = await authService.findUserByEmail(correo);
    if (existingEmail) {
      const error = new Error('El correo ya está registrado.');
      error.status = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authService.createUser({
      nombre,
      usuario,
      correo,
      passwordHash,
      rolId: rolId || 2,
      activo: 1,
    });

    const token = createToken(user);
    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      const error = new Error('Usuario y contraseña son requeridos.');
      error.status = 400;
      throw error;
    }

    const user = await authService.findUserByUsername(usuario);
    if (!user) {
      const error = new Error('Usuario o contraseña inválidos.');
      error.status = 401;
      throw error;
    }

    const passwordMatches = await bcrypt.compare(password, user.PasswordHash);
    if (!passwordMatches) {
      const error = new Error('Usuario o contraseña inválidos.');
      error.status = 401;
      throw error;
    }

    const responseUser = {
      id: user.Id,
      nombre: user.Nombre,
      usuario: user.Usuario,
      correo: user.Correo,
      rolId: user.RolId,
      activo: user.Activo,
    };

    const token = createToken({
      id: user.Id,
      nombre: user.Nombre,
      usuario: user.Usuario,
      rolId: user.RolId,
    });

    res.json({
      user: responseUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
