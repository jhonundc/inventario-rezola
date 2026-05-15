const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', productoController.obtenerProductos);
router.post('/', authMiddleware, adminMiddleware, productoController.crearProducto);

module.exports = router;
