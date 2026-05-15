const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

// ============ HARDWARE - EQUIPO ============
// Obtener todos los equipos
router.get('/hardware', equipoController.obtenerEquipos);

// Obtener un equipo por ID
router.get('/hardware/:id', equipoController.obtenerEquipo);

// Crear equipo
router.post('/hardware', equipoController.crearEquipo);

// Actualizar equipo
router.put('/hardware/:id', equipoController.actualizarEquipo);

// Eliminar equipo
router.delete('/hardware/:id', equipoController.eliminarEquipo);

// ============ SOFTWARE ============
// Obtener todo el software
router.get('/software', equipoController.obtenerSoftware);

// Crear software
router.post('/software', equipoController.crearSoftware);

module.exports = router;
