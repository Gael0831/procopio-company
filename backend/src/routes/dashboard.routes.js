const express = require('express');

const router = express.Router();

const {
    obtenerResumen,
    ventasPorMes
} = require('../controllers/dashboard.controller');

router.get('/resumen', obtenerResumen);

router.get('/ventas-mes', ventasPorMes);

module.exports = router;