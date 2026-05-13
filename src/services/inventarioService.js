const sql = require('mssql');
const { getPool } = require('../config/db');
const Producto = require('../models/productoModel');

const obtenerTodos = async () => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM Productos');
    
    return result.recordset.map(row => new Producto({
      id: row.id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      precio: row.precio,
      stock: row.stock,
      categoria: row.categoria,
    }));
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    throw error;
  }
};

const crear = async (data) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), data.nombre)
      .input('descripcion', sql.NVarChar(255), data.descripcion)
      .input('precio', sql.Decimal(10, 2), data.precio)
      .input('stock', sql.Int, data.stock)
      .input('categoria', sql.NVarChar(50), data.categoria)
      .query(`
        INSERT INTO Productos (nombre, descripcion, precio, stock, categoria)
        VALUES (@nombre, @descripcion, @precio, @stock, @categoria);
        SELECT SCOPE_IDENTITY() as id;
      `);
    
    const nuevoProducto = new Producto({
      id: result.recordset[0].id,
      ...data,
    });
    
    return nuevoProducto;
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    throw error;
  }
};

module.exports = {
  obtenerTodos,
  crear,
};
