const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const createToken = (user) => {
  const payload = {
    id: user.id || user.Id,
    nombre: user.nombre || user.Nombre,
    usuario: user.usuario || user.Usuario,
    rolId: user.rolId || user.RolId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'change_this_secret', {
    expiresIn: '8h',
  });
};

const register = async (req, res, next) => {
  try {
    const { nombre, usuario, correo, password, rolId } = req.body;

    // Validar campos requeridos
    if (!nombre || nombre.trim() === '') {
      const error = new Error('El nombre es requerido.');
      error.status = 400;
      throw error;
    }

    if (!usuario || usuario.trim() === '') {
      const error = new Error('El usuario es requerido.');
      error.status = 400;
      throw error;
    }

    if (!correo || correo.trim() === '') {
      const error = new Error('El correo es requerido.');
      error.status = 400;
      throw error;
    }

    if (!password || password === '') {
      const error = new Error('La contraseña es requerida.');
      error.status = 400;
      throw error;
    }

    // Validar que usuario no contenga espacios
    if (usuario.includes(' ')) {
      const error = new Error('El usuario no puede contener espacios.');
      error.status = 400;
      throw error;
    }

    // Validar formato de correo básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      const error = new Error('El correo debe ser válido.');
      error.status = 400;
      throw error;
    }

    // Verificar usuario duplicado
    const existingUser = await authService.findUserByUsername(usuario);
    if (existingUser) {
      const error = new Error('El nombre de usuario ya está en uso.');
      error.status = 409;
      throw error;
    }

    // Verificar email duplicado
    const existingEmail = await authService.findUserByEmail(correo);
    if (existingEmail) {
      const error = new Error('El correo ya está registrado.');
      error.status = 409;
      throw error;
    }

    // Hash de contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await authService.createUser({
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      correo: correo.trim(),
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

    if (!usuario || usuario.trim() === '') {
      const error = new Error('El usuario es requerido.');
      error.status = 400;
      throw error;
    }

    if (!password || password === '') {
      const error = new Error('La contraseña es requerida.');
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

    // Verificar que el usuario esté activo
    if (user.Activo === 0) {
      const error = new Error('La cuenta está inactiva.');
      error.status = 403;
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

    const token = createToken(responseUser);

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
