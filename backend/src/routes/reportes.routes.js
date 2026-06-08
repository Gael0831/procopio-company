const express = require('express');

const router = express.Router();

const {
    ventasPorDia,
    ventasPorSemana,
    ventasPorMes,
    topEspeciesVendidas,
    stockCritico,
    plagasPorSeveridad
} = require('../controllers/reportes.controller');

router.get('/ventas-dia', ventasPorDia);
router.get('/ventas-semana', ventasPorSemana);
router.get('/ventas-mes', ventasPorMes);
router.get('/top-especies', topEspeciesVendidas);
router.get('/stock-critico', stockCritico);
router.get('/plagas-severidad', plagasPorSeveridad);

module.exports = router;