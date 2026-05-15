// Modelo para equipos de hardware
class Equipo {
  constructor({ 
    id, 
    numeroSerie, 
    tipo, 
    marca, 
    modelo, 
    especificaciones, 
    estado, 
    usuarioAsignadoId, 
    fechaAdquisicion, 
    fechaVencimientoGarantia, 
    valor, 
    ubicacion, 
    observaciones,
    fechaCreacion,
    fechaActualizacion 
  }) {
    this.id = id;
    this.numeroSerie = numeroSerie;
    this.tipo = tipo;
    this.marca = marca;
    this.modelo = modelo;
    this.especificaciones = especificaciones;
    this.estado = estado;
    this.usuarioAsignadoId = usuarioAsignadoId;
    this.fechaAdquisicion = fechaAdquisicion;
    this.fechaVencimientoGarantia = fechaVencimientoGarantia;
    this.valor = valor;
    this.ubicacion = ubicacion;
    this.observaciones = observaciones;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
  }
}

// Modelo para software
class Software {
  constructor({
    id,
    nombre,
    tipo,
    version,
    licencia,
    clave,
    estado,
    fechaExpiracion,
    hardwareId,
    costoLicencia,
    descripcion,
    proveedor,
    fechaCreacion,
    fechaActualizacion
  }) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.version = version;
    this.licencia = licencia;
    this.clave = clave;
    this.estado = estado;
    this.fechaExpiracion = fechaExpiracion;
    this.hardwareId = hardwareId;
    this.costoLicencia = costoLicencia;
    this.descripcion = descripcion;
    this.proveedor = proveedor;
    this.fechaCreacion = fechaCreacion;
    this.fechaActualizacion = fechaActualizacion;
  }
}

module.exports = {
  Equipo,
  Software
};
