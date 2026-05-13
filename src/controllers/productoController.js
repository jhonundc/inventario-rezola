const inventarioService = require('../services/inventarioService');

const obtenerProductos = async (req, res, next) => {
  try {
    const productos = await inventarioService.obtenerTodos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const crearProducto = async (req, res, next) => {
  try {
    const producto = await inventarioService.crear(req.body);
    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerProductos,
  crearProducto,
};
