const conexion = require('../config/db');

const obtenerResumen = async (req, res) => {

    try {

        const sql = `
            SELECT
                (
                    SELECT COALESCE(SUM(total), 0)
                    FROM ventas
                ) AS total_ventas,

                (
                    SELECT COUNT(*)
                    FROM especies
                    WHERE stock <= stock_minimo
                ) AS inventario_critico,

                (
                    SELECT COUNT(*)
                    FROM plagas
                    WHERE severidad = 'Alta'
                ) AS plagas_altas,

                (
                    SELECT COUNT(*)
                    FROM especies
                ) AS total_especies
        `;

        const resultado = await conexion.query(sql);

        res.json(resultado.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};

const ventasPorMes = async (req, res) => {

    try {

        const sql = `
            SELECT
                TO_CHAR(fecha, 'Month') AS mes,
                SUM(total) AS ventas
            FROM ventas
            GROUP BY
                EXTRACT(MONTH FROM fecha),
                TO_CHAR(fecha, 'Month')
            ORDER BY
                EXTRACT(MONTH FROM fecha)
        `;

        const resultado = await conexion.query(sql);

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};

module.exports = {
    obtenerResumen,
    ventasPorMes
};