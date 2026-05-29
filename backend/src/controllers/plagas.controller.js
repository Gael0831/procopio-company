const conexion = require('../config/db');

const obtenerPlagas = async (req, res) => {

    try {

        const sql = `
            SELECT 
                id_plaga,
                seccion,
                tipo_plaga,
                severidad,
                fecha,
                descripcion
            FROM plagas
            ORDER BY fecha DESC
        `;

        const resultado = await conexion.query(sql);

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);
        res.status(500).json(error);

    }

};

const agregarPlaga = async (req, res) => {

    try {

        const {
            seccion,
            tipo_plaga,
            severidad,
            fecha,
            descripcion
        } = req.body;

        const sql = `
            INSERT INTO plagas(
                seccion,
                tipo_plaga,
                severidad,
                fecha,
                descripcion
            )
            VALUES($1,$2,$3,$4,$5)
        `;

        await conexion.query(sql, [
            seccion,
            tipo_plaga,
            severidad,
            fecha,
            descripcion
        ]);

        res.json({
            success: true,
            mensaje: 'Incidencia registrada'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json(error);

    }

};

const eliminarPlaga = async (req, res) => {

    try {

        const { id } = req.params;

        const sql = `
            DELETE FROM plagas
            WHERE id_plaga = $1
        `;

        await conexion.query(sql, [id]);

        res.json({
            success: true,
            mensaje: 'Incidencia eliminada'
        });

    } catch (error) {

        console.log(error);
        res.status(500).json(error);

    }

};

module.exports = {
    obtenerPlagas,
    agregarPlaga,
    eliminarPlaga
};