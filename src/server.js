require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`✓ Servidor escuchando en http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        const alternativePort = Number(PORT) + 1;
        console.warn(`Puerto ${PORT} en uso, intentando con ${alternativePort}...`);

        app.listen(alternativePort, () => {
          console.log(`✓ Servidor escuchando en http://localhost:${alternativePort}`);
        }).on('error', (err) => {
          console.error('Error al iniciar el servidor en el puerto alternativo:', err.message);
          process.exit(1);
        });
      } else {
        console.error('Error en el servidor:', error.message);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
