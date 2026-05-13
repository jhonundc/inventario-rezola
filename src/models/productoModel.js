// Modelo de ejemplo para un producto.
// Aquí puedes usar Mongoose, Sequelize, TypeORM u otra librería.

class Producto {
  constructor({ id, nombre, descripcion, precio, stock, categoria }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
    this.categoria = categoria;
  }
}

module.exports = Producto;
