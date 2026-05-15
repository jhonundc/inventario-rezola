const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';
  
  console.error(`[${status}] ${message}`);
  console.error('Stack:', err.stack);
  
  res.status(status).json({
    error: message,
    message: message, // Compatibilidad con frontend
    status: status,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorMiddleware;
