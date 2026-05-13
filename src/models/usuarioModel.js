class Usuario {
  constructor({ id, nombre, usuario, correo, rolId, activo, fechaCreacion }) {
    this.id = id;
    this.nombre = nombre;
    this.usuario = usuario;
    this.correo = correo;
    this.rolId = rolId;
    this.activo = activo;
    this.fechaCreacion = fechaCreacion;
  }
}

module.exports = Usuario;
