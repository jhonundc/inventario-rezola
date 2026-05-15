const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      const error = new Error('Token no proporcionado.');
      error.status = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret');
    req.user = decoded;
    next();
  } catch (error) {
    error.status = error.status || 401;
    error.message = error.message || 'Token inválido o expirado.';
    next(error);
  }
};

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      const error = new Error('No autenticado.');
      error.status = 401;
      throw error;
    }

    if (req.user.rolId !== 1) {
      const error = new Error('Solo administradores pueden realizar esta acción.');
      error.status = 403;
      throw error;
    }

    next();
  } catch (error) {
    error.status = error.status || 403;
    next(error);
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
