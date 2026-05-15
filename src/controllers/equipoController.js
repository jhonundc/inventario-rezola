const inventarioService = require('../services/inventarioService');

// ============ HARDWARE (EQUIPOS) ============
const obtenerEquipos = async (req, res, next) => {
  try {
    const equipos = await inventarioService.obtenerTodosEquipos();
    res.json(equipos);
  } catch (error) {
    next(error);
  }
};

const obtenerEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      const error = new Error('ID de equipo inválido.');
      error.status = 400;
      throw error;
    }

    const equipo = await inventarioService.obtenerEquipoPorId(Number(id));

    if (!equipo) {
      const error = new Error('Equipo no encontrado.');
      error.status = 404;
      throw error;
    }

    res.json(equipo);
  } catch (error) {
    next(error);
  }
};

const crearEquipo = async (req, res, next) => {
  try {
    const {
      tipoEquipo,
      tipo,
      nombre,
      descripcionModelo,
      descripcion,
      modelo,
      marca,
      serie,
      codigoPatrimonial,
      procesador,
      ram,
      almacenamiento,
      sistemaOperativo,
      ubicacionFisica,
      usuarioAsignado,
      responsableId,
      autorizadoPorId,
      ubicacionId,
      estado,
      estadoId,
      proveedorId,
      observaciones,
    } = req.body;

    const tipoEquipoValue = (tipoEquipo || tipo || nombre || '').trim();
    const descripcionModeloValue = (descripcionModelo || descripcion || modelo || '').trim();
    const marcaValue = marca ? marca.trim() : '';
    const estadoValue = estado ? String(estado).trim() : (estadoId ? String(estadoId) : 'Desconocido');

    if (!tipoEquipoValue) {
      const error = new Error('El tipo de equipo es requerido.');
      error.status = 400;
      throw error;
    }

    if (!marcaValue) {
      const error = new Error('La marca del equipo es requerida.');
      error.status = 400;
      throw error;
    }

    if (!descripcionModeloValue) {
      const error = new Error('La descripción del modelo es requerida.');
      error.status = 400;
      throw error;
    }

    const datosEquipo = {
      tipoEquipo: tipoEquipoValue,
      descripcionModelo: descripcionModeloValue,
      marca: marcaValue,
      serie: serie ? serie.trim() : (req.body.numeroSerie ? String(req.body.numeroSerie).trim() : null),
      codigoPatrimonial: codigoPatrimonial ? codigoPatrimonial.trim() : null,
      procesador: procesador ? procesador.trim() : null,
      ram: ram ? ram.trim() : null,
      almacenamiento: almacenamiento ? almacenamiento.trim() : null,
      sistemaOperativo: sistemaOperativo ? sistemaOperativo.trim() : null,
      ubicacionFisica: ubicacionFisica ? ubicacionFisica.trim() : null,
      usuarioAsignado: usuarioAsignado ? usuarioAsignado.trim() : null,
      responsableId: responsableId ? Number(responsableId) : null,
      autorizadoPorId: autorizadoPorId ? Number(autorizadoPorId) : null,
      ubicacionId: ubicacionId ? Number(ubicacionId) : null,
      estado: estadoValue,
      estadoId: estadoId ? Number(estadoId) : null,
      proveedorId: proveedorId ? Number(proveedorId) : null,
      observaciones: observaciones ? observaciones.trim() : null,
    };

    const equipo = await inventarioService.crearEquipo(datosEquipo);
    res.status(201).json(equipo);
  } catch (error) {
    next(error);
  }
};

const actualizarEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      tipoEquipo,
      tipo,
      nombre,
      descripcionModelo,
      descripcion,
      modelo,
      marca,
      serie,
      codigoPatrimonial,
      procesador,
      ram,
      almacenamiento,
      sistemaOperativo,
      ubicacionFisica,
      usuarioAsignado,
      responsableId,
      autorizadoPorId,
      ubicacionId,
      estado,
      estadoId,
      proveedorId,
      observaciones,
    } = req.body;

    if (!id || isNaN(id)) {
      const error = new Error('ID de equipo inválido.');
      error.status = 400;
      throw error;
    }

    const equipoExistente = await inventarioService.obtenerEquipoPorId(Number(id));
    if (!equipoExistente) {
      const error = new Error('Equipo no encontrado.');
      error.status = 404;
      throw error;
    }

    const datos = {};
    if (tipoEquipo !== undefined || tipo !== undefined || nombre !== undefined) {
      const tipoEquipoValue = (tipoEquipo || tipo || nombre || '').trim();
      datos.tipoEquipo = tipoEquipoValue || null;
    }
    if (descripcionModelo !== undefined || descripcion !== undefined || modelo !== undefined) {
      const descripcionModeloValue = (descripcionModelo || descripcion || modelo || '').trim();
      datos.descripcionModelo = descripcionModeloValue || null;
    }
    if (marca !== undefined) datos.marca = marca ? marca.trim() : null;
    if (serie !== undefined) datos.serie = serie ? serie.trim() : null;
    if (codigoPatrimonial !== undefined) datos.codigoPatrimonial = codigoPatrimonial ? codigoPatrimonial.trim() : null;
    if (procesador !== undefined) datos.procesador = procesador ? procesador.trim() : null;
    if (ram !== undefined) datos.ram = ram ? ram.trim() : null;
    if (almacenamiento !== undefined) datos.almacenamiento = almacenamiento ? almacenamiento.trim() : null;
    if (sistemaOperativo !== undefined) datos.sistemaOperativo = sistemaOperativo ? sistemaOperativo.trim() : null;
    if (ubicacionFisica !== undefined) datos.ubicacionFisica = ubicacionFisica ? ubicacionFisica.trim() : null;
    if (usuarioAsignado !== undefined) datos.usuarioAsignado = usuarioAsignado ? usuarioAsignado.trim() : null;
    if (responsableId !== undefined) datos.responsableId = responsableId ? Number(responsableId) : null;
    if (autorizadoPorId !== undefined) datos.autorizadoPorId = autorizadoPorId ? Number(autorizadoPorId) : null;
    if (ubicacionId !== undefined) datos.ubicacionId = ubicacionId ? Number(ubicacionId) : null;
    if (estado !== undefined) datos.estado = estado ? String(estado).trim() : null;
    if (estadoId !== undefined) datos.estadoId = estadoId ? Number(estadoId) : null;
    if (proveedorId !== undefined) datos.proveedorId = proveedorId ? Number(proveedorId) : null;
    if (observaciones !== undefined) datos.observaciones = observaciones ? observaciones.trim() : null;

    const equipoActualizado = await inventarioService.actualizarEquipo(Number(id), datos);
    res.json(equipoActualizado);
  } catch (error) {
    next(error);
  }
};

const eliminarEquipo = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      const error = new Error('ID de equipo inválido.');
      error.status = 400;
      throw error;
    }

    const equipoExistente = await inventarioService.obtenerEquipoPorId(Number(id));
    if (!equipoExistente) {
      const error = new Error('Equipo no encontrado.');
      error.status = 404;
      throw error;
    }

    const eliminado = await inventarioService.eliminarEquipo(Number(id));

    if (eliminado) {
      res.json({ mensaje: 'Equipo eliminado correctamente.' });
    } else {
      const error = new Error('No se pudo eliminar el equipo.');
      error.status = 500;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

// ============ SOFTWARE ============
const obtenerSoftware = async (req, res, next) => {
  try {
    const software = await inventarioService.obtenerTodoSoftware();
    res.json(software);
  } catch (error) {
    next(error);
  }
};

const crearSoftware = async (req, res, next) => {
  try {
    const {
      nombreSoftware,
      tipoSoftware,
      versionSoftware,
      proveedorEntidad,
      tipoLicencia,
      numeroLicencias,
      estadoLicencia,
      equiposUsuariosAsignados,
      usoFinalidad,
      responsableId,
      autorizadoPorId,
      ubicacionId,
      observaciones,
    } = req.body;

    if (!nombreSoftware || nombreSoftware.trim() === '') {
      const error = new Error('El nombre del software es requerido.');
      error.status = 400;
      throw error;
    }

    if (!tipoSoftware || tipoSoftware.trim() === '') {
      const error = new Error('El tipo de software es requerido.');
      error.status = 400;
      throw error;
    }

    const datosSoftware = {
      nombreSoftware: nombreSoftware.trim(),
      tipoSoftware: tipoSoftware.trim(),
      versionSoftware: versionSoftware ? versionSoftware.trim() : null,
      proveedorEntidad: proveedorEntidad ? proveedorEntidad.trim() : null,
      tipoLicencia: tipoLicencia ? tipoLicencia.trim() : null,
      numeroLicencias: numeroLicencias ? Number(numeroLicencias) : 0,
      estadoLicencia: estadoLicencia ? estadoLicencia.trim() : null,
      equiposUsuariosAsignados: equiposUsuariosAsignados ? equiposUsuariosAsignados.trim() : null,
      usoFinalidad: usoFinalidad ? usoFinalidad.trim() : null,
      responsableId: responsableId ? Number(responsableId) : null,
      autorizadoPorId: autorizadoPorId ? Number(autorizadoPorId) : null,
      ubicacionId: ubicacionId ? Number(ubicacionId) : null,
      observaciones: observaciones ? observaciones.trim() : null,
    };

    const software = await inventarioService.crearSoftware(datosSoftware);
    res.status(201).json(software);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Hardware
  obtenerEquipos,
  obtenerEquipo,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
  // Software
  obtenerSoftware,
  crearSoftware,
};
