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
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    // Validar campos requeridos
    if (!nombre || nombre.trim() === '') {
      const error = new Error('El nombre del producto es requerido.');
      error.status = 400;
      throw error;
    }

    if (precio === undefined || precio === null || precio < 0) {
      const error = new Error('El precio es requerido y debe ser mayor o igual a 0.');
      error.status = 400;
      throw error;
    }

    if (stock === undefined || stock === null || stock < 0) {
      const error = new Error('El stock es requerido y debe ser mayor o igual a 0.');
      error.status = 400;
      throw error;
    }

    const producto = await inventarioService.crear({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : '',
      precio: Number(precio),
      stock: Number(stock),
      categoria: categoria ? categoria.trim() : 'General',
    });

    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerProductos,
  crearProducto,
};
