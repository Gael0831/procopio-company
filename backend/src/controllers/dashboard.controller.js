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

const ultimasVentas = async (req, res) => {
    try {
        const sql = `
            SELECT
                v.id_venta,
                v.fecha,
                v.total,
                e.nombre AS especie,
                d.cantidad
            FROM ventas v
            INNER JOIN detalle_venta d ON v.id_venta = d.id_venta
            INNER JOIN especies e ON d.id_especie = e.id_especie
            ORDER BY v.fecha DESC
            LIMIT 5
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};

const especiesCriticas = async (req, res) => {
    try {
        const sql = `
            SELECT nombre, stock, stock_minimo
            FROM especies
            WHERE stock <= stock_minimo
            ORDER BY stock ASC
            LIMIT 5
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};

const plagasRecientes = async (req, res) => {
    try {
        const sql = `
            SELECT seccion, tipo_plaga, severidad, fecha
            FROM plagas
            ORDER BY fecha DESC
            LIMIT 5
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};
const resumenPorPeriodo = async (req, res) => {
    try {
        const { periodo } = req.params;

        let condicionFecha = '';

        if (periodo === 'hoy') {
            condicionFecha = "DATE(fecha) = CURRENT_DATE";
        } else if (periodo === 'semana') {
            condicionFecha = "fecha >= DATE_TRUNC('week', CURRENT_DATE)";
        } else if (periodo === 'mes') {
            condicionFecha = "fecha >= DATE_TRUNC('month', CURRENT_DATE)";
        } else if (periodo === 'anio') {
            condicionFecha = "fecha >= DATE_TRUNC('year', CURRENT_DATE)";
        } else {
            condicionFecha = "TRUE";
        }

        const sql = `
            SELECT
                COALESCE(SUM(total), 0) AS total_ventas,
                COUNT(*) AS total_operaciones
            FROM ventas
            WHERE ${condicionFecha}
        `;

        const resultado = await conexion.query(sql);

        res.json(resultado.rows[0]);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {
    obtenerResumen,
    ventasPorMes,
    ultimasVentas,
    especiesCriticas,
    plagasRecientes,
    resumenPorPeriodo
};