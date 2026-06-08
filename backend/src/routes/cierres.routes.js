const express = require('express');

const router = express.Router();

const {
    cerrarMes,
    obtenerCierres
} = require('../controllers/cierres.controller');

router.post('/cerrar-mes', cerrarMes);

router.get('/', obtenerCierres);

module.exports = router;