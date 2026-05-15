const express = require('express');
const cors = require('cors');
const path = require('path');
const productoRoutes = require('./routes/productoRoutes');
const equipoRoutes = require('./routes/equipoRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/equipos', equipoRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/inventario.html'));
});

module.exports = app;
