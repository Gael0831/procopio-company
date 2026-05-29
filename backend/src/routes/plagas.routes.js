const express = require('express');

const router = express.Router();

const {
    obtenerPlagas,
    agregarPlaga,
    eliminarPlaga
} = require('../controllers/plagas.controller');

router.get('/', obtenerPlagas);

router.post('/', agregarPlaga);

router.delete('/:id', eliminarPlaga);

module.exports = router;