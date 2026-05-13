const express = require('express');
const cors = require('cors');
const path = require('path');
const productoRoutes = require('./routes/productoRoutes');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.json({ message: 'API de inventario en funcionamiento' });
});

module.exports = app;
