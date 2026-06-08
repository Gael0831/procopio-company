const express = require('express');

const router = express.Router();

const {
    obtenerResumen,
    ventasPorMes,
    ultimasVentas,
    especiesCriticas,
    plagasRecientes,
    resumenPorPeriodo
} = require('../controllers/dashboard.controller');

router.get('/resumen', obtenerResumen);

router.get('/ventas-mes', ventasPorMes);

router.get('/ultimas-ventas', ultimasVentas);

router.get('/especies-criticas', especiesCriticas);

router.get('/plagas-recientes', plagasRecientes);

router.get('/resumen-periodo/:periodo', resumenPorPeriodo);

module.exports = router;