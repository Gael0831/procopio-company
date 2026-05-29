const express = require('express');

const router = express.Router();

const {
    obtenerEspecies,
    agregarEspecie,
    eliminarEspecie,
    actualizarEspecie
} = require('../controllers/especies.controller');

router.get('/', obtenerEspecies);

router.post('/', agregarEspecie);

router.delete('/:id', eliminarEspecie);

router.put('/:id', actualizarEspecie);

module.exports = router;