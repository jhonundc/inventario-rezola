const sql = require('mssql');
const { getPool } = require('../config/db');

const mapHardwareRow = (row) => ({
  id: row.Id,
  tipoEquipo: row.TipoEquipo,
  descripcionModelo: row.DescripcionModelo,
  marca: row.Marca,
  serie: row.Serie,
  codigoPatrimonial: row.CodigoPatrimonial,
  procesador: row.Procesador,
  ram: row.RAM,
  almacenamiento: row.Almacenamiento,
  sistemaOperativo: row.SistemaOperativo,
  responsableId: row.ResponsableId,
  autorizadoPorId: row.AutorizadoPorId,
  ubicacionId: row.UbicacionId,
  estado: row.Estado,
  estadoId: row.EstadoId,
  proveedorId: row.ProveedorId,
  observaciones: row.Observaciones,
  fechaRegistro: row.FechaRegistro,
  // campos legacy para compatibilidad con la interfaz existente
  tipo: row.TipoEquipo,
  modelo: row.DescripcionModelo,
  numeroSerie: row.Serie,
  ubicacion: row.UbicacionId,
  estado: row.EstadoId,
  valor: row.Valor || null,
});

const mapSoftwareRow = (row) => ({
  id: row.Id,
  nombreSoftware: row.NombreSoftware,
  tipoSoftware: row.TipoSoftware,
  versionSoftware: row.VersionSoftware,
  proveedorEntidad: row.ProveedorEntidad,
  tipoLicencia: row.TipoLicencia,
  numeroLicencias: row.NumeroLicencias,
  estadoLicencia: row.EstadoLicencia,
  equiposUsuariosAsignados: row.EquiposUsuariosAsignados,
  usoFinalidad: row.UsoFinalidad,
  responsableId: row.ResponsableId,
  autorizadoPorId: row.AutorizadoPorId,
  ubicacionId: row.UbicacionId,
  observaciones: row.Observaciones,
  fechaRegistro: row.FechaRegistro,
});

const obtenerTodosEquipos = async () => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM InventarioHardware ORDER BY FechaRegistro DESC');

    return result.recordset.map(mapHardwareRow);
  } catch (error) {
    console.error('Error al obtener equipos:', error.message);
    throw error;
  }
};

const obtenerEquipoPorId = async (id) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM InventarioHardware WHERE Id = @id');

    if (result.recordset.length === 0) {
      return null;
    }

    return mapHardwareRow(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener equipo:', error.message);
    throw error;
  }
};

const crearEquipo = async (data) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('tipoEquipo', sql.NVarChar(100), data.tipoEquipo)
      .input('descripcionModelo', sql.NVarChar(255), data.descripcionModelo || null)
      .input('marca', sql.NVarChar(100), data.marca)
      .input('serie', sql.NVarChar(100), data.serie || null)
      .input('codigoPatrimonial', sql.NVarChar(100), data.codigoPatrimonial || null)
      .input('procesador', sql.NVarChar(255), data.procesador || null)
      .input('ram', sql.NVarChar(100), data.ram || null)
      .input('almacenamiento', sql.NVarChar(100), data.almacenamiento || null)
      .input('sistemaOperativo', sql.NVarChar(100), data.sistemaOperativo || null)
      .input('ubicacionFisica', sql.NVarChar(255), data.ubicacionFisica || null)
      .input('usuarioAsignado', sql.NVarChar(255), data.usuarioAsignado || null)
      .input('responsableId', sql.Int, data.responsableId || null)
      .input('autorizadoPorId', sql.Int, data.autorizadoPorId || null)
      .input('ubicacionId', sql.Int, data.ubicacionId || null)
      .input('estado', sql.NVarChar(50), data.estado || 'Desconocido')
      .input('estadoId', sql.Int, data.estadoId || null)
      .input('proveedorId', sql.Int, data.proveedorId || null)
      .input('observaciones', sql.NVarChar(sql.MAX), data.observaciones || null)
      .query(`
        INSERT INTO InventarioHardware (
          TipoEquipo, DescripcionModelo, Marca, Serie, CodigoPatrimonial,
          Procesador, RAM, Almacenamiento, SistemaOperativo, UbicacionFisica,
          UsuarioAsignado, ResponsableId, AutorizadoPorId, UbicacionId, Estado,
          EstadoId, ProveedorId, Observaciones
        ) VALUES (
          @tipoEquipo, @descripcionModelo, @marca, @serie, @codigoPatrimonial,
          @procesador, @ram, @almacenamiento, @sistemaOperativo, @ubicacionFisica,
          @usuarioAsignado, @responsableId, @autorizadoPorId, @ubicacionId, @estado,
          @estadoId, @proveedorId, @observaciones
        );
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS id;
      `);

    if (!result.recordset || result.recordset.length === 0) {
      throw new Error('No se pudo obtener el ID del hardware creado');
    }

    const hardwareId = result.recordset[0].id;
    const nuevoHardware = await obtenerEquipoPorId(hardwareId);
    return nuevoHardware;
  } catch (error) {
    console.error('Error al crear equipo:', error.message);
    throw error;
  }
};

const actualizarEquipo = async (id, data) => {
  try {
    const pool = getPool();
    const setters = [];
    const request = pool.request().input('id', sql.Int, id);

    const addSetter = (column, paramName, type, value) => {
      setters.push(`${column} = @${paramName}`);
      request.input(paramName, type, value);
    };

    if (data.tipoEquipo !== undefined) addSetter('TipoEquipo', 'tipoEquipo', sql.NVarChar(100), data.tipoEquipo);
    if (data.descripcionModelo !== undefined) addSetter('DescripcionModelo', 'descripcionModelo', sql.NVarChar(255), data.descripcionModelo);
    if (data.marca !== undefined) addSetter('Marca', 'marca', sql.NVarChar(100), data.marca);
    if (data.serie !== undefined) addSetter('Serie', 'serie', sql.NVarChar(100), data.serie);
    if (data.codigoPatrimonial !== undefined) addSetter('CodigoPatrimonial', 'codigoPatrimonial', sql.NVarChar(100), data.codigoPatrimonial);
    if (data.procesador !== undefined) addSetter('Procesador', 'procesador', sql.NVarChar(255), data.procesador);
    if (data.ram !== undefined) addSetter('RAM', 'ram', sql.NVarChar(100), data.ram);
    if (data.almacenamiento !== undefined) addSetter('Almacenamiento', 'almacenamiento', sql.NVarChar(100), data.almacenamiento);
    if (data.sistemaOperativo !== undefined) addSetter('SistemaOperativo', 'sistemaOperativo', sql.NVarChar(100), data.sistemaOperativo);
    if (data.ubicacionFisica !== undefined) addSetter('UbicacionFisica', 'ubicacionFisica', sql.NVarChar(255), data.ubicacionFisica);
    if (data.usuarioAsignado !== undefined) addSetter('UsuarioAsignado', 'usuarioAsignado', sql.NVarChar(255), data.usuarioAsignado);
    if (data.responsableId !== undefined) addSetter('ResponsableId', 'responsableId', sql.Int, data.responsableId);
    if (data.autorizadoPorId !== undefined) addSetter('AutorizadoPorId', 'autorizadoPorId', sql.Int, data.autorizadoPorId);
    if (data.ubicacionId !== undefined) addSetter('UbicacionId', 'ubicacionId', sql.Int, data.ubicacionId);
    if (data.estado !== undefined) addSetter('Estado', 'estado', sql.NVarChar(50), data.estado);
    if (data.estadoId !== undefined) addSetter('EstadoId', 'estadoId', sql.Int, data.estadoId);
    if (data.proveedorId !== undefined) addSetter('ProveedorId', 'proveedorId', sql.Int, data.proveedorId);
    if (data.observaciones !== undefined) addSetter('Observaciones', 'observaciones', sql.NVarChar(sql.MAX), data.observaciones);

    if (setters.length === 0) {
      return await obtenerEquipoPorId(id);
    }

    const query = `UPDATE InventarioHardware SET ${setters.join(', ')} WHERE Id = @id`;
    await request.query(query);

    return await obtenerEquipoPorId(id);
  } catch (error) {
    console.error('Error al actualizar equipo:', error.message);
    throw error;
  }
};

const eliminarEquipo = async (id) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM InventarioHardware WHERE Id = @id');

    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error('Error al eliminar equipo:', error.message);
    throw error;
  }
};

const obtenerTodoSoftware = async () => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .query('SELECT * FROM InventarioSoftware ORDER BY FechaRegistro DESC');

    return result.recordset.map(mapSoftwareRow);
  } catch (error) {
    console.error('Error al obtener software:', error.message);
    throw error;
  }
};

const obtenerSoftwarePorId = async (id) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM InventarioSoftware WHERE Id = @id');

    if (result.recordset.length === 0) {
      return null;
    }

    return mapSoftwareRow(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener software por ID:', error.message);
    throw error;
  }
};

const crearSoftware = async (data) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('nombreSoftware', sql.NVarChar(150), data.nombreSoftware)
      .input('tipoSoftware', sql.NVarChar(100), data.tipoSoftware)
      .input('versionSoftware', sql.NVarChar(100), data.versionSoftware || null)
      .input('proveedorEntidad', sql.NVarChar(150), data.proveedorEntidad || null)
      .input('tipoLicencia', sql.NVarChar(100), data.tipoLicencia || null)
      .input('numeroLicencias', sql.Int, Number.isInteger(data.numeroLicencias) ? data.numeroLicencias : 0)
      .input('estadoLicencia', sql.NVarChar(50), data.estadoLicencia || null)
      .input('equiposUsuariosAsignados', sql.NVarChar(255), data.equiposUsuariosAsignados || null)
      .input('usoFinalidad', sql.NVarChar(255), data.usoFinalidad || null)
      .input('responsableId', sql.Int, data.responsableId || null)
      .input('autorizadoPorId', sql.Int, data.autorizadoPorId || null)
      .input('ubicacionId', sql.Int, data.ubicacionId || null)
      .input('observaciones', sql.NVarChar(sql.MAX), data.observaciones || null)
      .query(`
        INSERT INTO InventarioSoftware (
          NombreSoftware, TipoSoftware, VersionSoftware, ProveedorEntidad,
          TipoLicencia, NumeroLicencias, EstadoLicencia, EquiposUsuariosAsignados,
          UsoFinalidad, ResponsableId, AutorizadoPorId, UbicacionId, Observaciones
        ) VALUES (
          @nombreSoftware, @tipoSoftware, @versionSoftware, @proveedorEntidad,
          @tipoLicencia, @numeroLicencias, @estadoLicencia, @equiposUsuariosAsignados,
          @usoFinalidad, @responsableId, @autorizadoPorId, @ubicacionId, @observaciones
        );
        SELECT CAST(SCOPE_IDENTITY() AS INT) AS id;
      `);

    if (!result.recordset || result.recordset.length === 0) {
      throw new Error('No se pudo obtener el ID del software creado');
    }

    const softwareId = result.recordset[0].id;
    return await obtenerSoftwarePorId(softwareId);
  } catch (error) {
    console.error('Error al crear software:', error.message);
    throw error;
  }
};

module.exports = {
  // Hardware
  obtenerTodosEquipos,
  obtenerEquipoPorId,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
  // Software
  obtenerTodoSoftware,
  crearSoftware,
};
