const conexion = require('../config/db');

const obtenerEspecies = async (req, res) => {

    try {

        const sql = `
            SELECT * FROM especies
            ORDER BY id_especie ASC
        `;

        const resultado = await conexion.query(sql);

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};

const agregarEspecie = async (req, res) => {

    try {

        const {
            nombre,
            nombre_cientifico,
            precio,
            stock,
            stock_minimo
        } = req.body;
        if (
            !nombre ||
            !nombre_cientifico ||
            !precio ||
            !stock ||
            !stock_minimo
        ) {

            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }
        if (
            precio <= 0 ||
            stock < 0 ||
            stock_minimo < 0
        ) {

            return res.status(400).json({
                success: false,
                mensaje: 'Datos inválidos'
            });
        }

        const sql = `
            INSERT INTO especies(
                nombre,
                nombre_cientifico,
                precio,
                stock,
                stock_minimo
            )
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
        `;

        const resultado = await conexion.query(sql, [
            nombre,
            nombre_cientifico,
            Number(precio),
            Number(stock),
            Number(stock_minimo)
        ]);

        res.json({
            success: true,
            mensaje: 'Especie agregada',
            especie: resultado.rows[0]
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            mensaje: 'Error al agregar especie',
            error: error.message
        });

    }

};

const eliminarEspecie = async (req, res) => {

    try {

        const { id } = req.params;

        const sql = `
            DELETE FROM especies
            WHERE id_especie = $1
        `;

        await conexion.query(sql, [id]);

        res.json({
            success: true,
            mensaje: 'Especie eliminada'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            mensaje: 'No se puede eliminar'
        });

    }

};

const actualizarEspecie = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            nombre,
            nombre_cientifico,
            precio,
            stock,
            stock_minimo
        } = req.body;

        const sql = `
            UPDATE especies
            SET
                nombre = $1,
                nombre_cientifico = $2,
                precio = $3,
                stock = $4,
                stock_minimo = $5
            WHERE id_especie = $6
        `;

        await conexion.query(sql, [
            nombre,
            nombre_cientifico,
            precio,
            stock,
            stock_minimo,
            id
        ]);

        res.json({
            success: true,
            mensaje: 'Especie actualizada'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};

module.exports = {
    obtenerEspecies,
    agregarEspecie,
    eliminarEspecie,
    actualizarEspecie
};