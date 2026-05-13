const sql = require('mssql/msnodesqlv8');

const config = {
  server: '(localdb)\\MSSQLLocalDB',
  database: process.env.DB_DATABASE,
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
};

// Si DB_TRUSTED_CONNECTION es true, usar autenticación de Windows
if (process.env.DB_TRUSTED_CONNECTION === 'true') {
  config.authentication = {
    type: 'ntlm',
    options: {
      domain: '',
    },
  };
}

let pool = null;

const connectDB = async () => {
  try {
    pool = await sql.connect(config);
    console.log('✓ Conexión a SQL Server establecida correctamente');
    console.log(`  Servidor: ${config.server}`);
    console.log(`  Base de datos: ${config.database}`);
    return pool;
  } catch (error) {
    console.error('✗ Error al conectar a SQL Server:', error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('La conexión a la base de datos no ha sido inicializada');
  }
  return pool;
};

const closeDB = async () => {
  if (pool) {
    await pool.close();
    console.log('Conexión a SQL Server cerrada');
  }
};

module.exports = { connectDB, getPool, closeDB };
