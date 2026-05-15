const sql = require('mssql/msnodesqlv8');
const { getPool } = require('../config/db');

const findUserByUsername = async (usuario) => {
  const pool = getPool();
  const result = await pool.request()
    .input('usuario', sql.NVarChar(50), usuario)
    .query('SELECT * FROM Usuarios WHERE Usuario = @usuario');

  return result.recordset[0] || null;
};

const findUserByEmail = async (correo) => {
  const pool = getPool();
  const result = await pool.request()
    .input('correo', sql.NVarChar(100), correo)
    .query('SELECT * FROM Usuarios WHERE Correo = @correo');

  return result.recordset[0] || null;
};

const createUser = async ({ nombre, usuario, correo, passwordHash, rolId = 2, activo = 1 }) => {
  try {
    const pool = getPool();
    const result = await pool.request()
      .input('nombre', sql.NVarChar(100), nombre)
      .input('usuario', sql.NVarChar(50), usuario)
      .input('correo', sql.NVarChar(100), correo)
      .input('passwordHash', sql.NVarChar(255), passwordHash)
      .input('rolId', sql.Int, rolId)
      .input('activo', sql.Bit, activo)
      .query(`
        INSERT INTO Usuarios (Nombre, Usuario, Correo, PasswordHash, RolId, Activo)
        VALUES (@nombre, @usuario, @correo, @passwordHash, @rolId, @activo);
        SELECT SCOPE_IDENTITY() AS id;
      `);

    const newUserId = result.recordset[0].id;

    return {
      id: newUserId,
      nombre,
      usuario,
      correo,
      rolId,
      activo,
    };
  } catch (error) {
    console.error('Error en createUser:', error.message);
    throw error;
  }
};

module.exports = {
  findUserByUsername,
  findUserByEmail,
  createUser,
};
