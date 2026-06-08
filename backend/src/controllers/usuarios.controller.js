const conexion = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {

    try {

        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                success: false,
                mensaje: 'Correo y contraseña son obligatorios'
            });
        }

        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correoRegex.test(correo)) {
            return res.status(400).json({
                success: false,
                mensaje: 'El formato del correo no es válido'
            });
        }

        const sql = `
            SELECT * FROM usuarios
            WHERE correo = $1 AND password = $2
        `;

        const resultado = await conexion.query(sql, [correo, password]);

        if(resultado.rows.length > 0){

            const usuario = resultado.rows[0];

            const token = jwt.sign(
                {
                    id_usuario: usuario.id_usuario,
                    correo: usuario.correo,
                    rol: usuario.rol
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '8h'
                }
            );

            res.json({
                success: true,
                mensaje: 'Login correcto',
                token,
                usuario
            });

        }else{

            res.json({
                success: false,
                mensaje: 'Correo o contraseña incorrectos'
            });

        }

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            mensaje: 'Error en el servidor',
            error
        });

    }

};

module.exports = {
    login
};