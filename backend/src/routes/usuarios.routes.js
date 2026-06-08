const express = require('express');

const router = express.Router();

const {
    login,
    restablecerPassword
} = require('../controllers/usuarios.controller');

router.post('/login', login);
router.put('/restablecer-password', restablecerPassword);

module.exports = router;