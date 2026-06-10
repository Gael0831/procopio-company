const conexion = require('../config/db');

const fechaUltimoCierre = `
    (
        SELECT COALESCE(MAX(fecha_cierre), '1900-01-01'::timestamp)
        FROM cierres_mensuales
    )
`;

const fechaVenta = `(ventas.fecha::timestamp)`;
const fechaVentaAlias = `(v.fecha::timestamp)`;
const fechaPlaga = `(plagas.fecha::timestamp)`;
const fechaPlagaAlias = `(p.fecha::timestamp)`;

const obtenerResumen = async (req, res) => {
    try {
        const sql = `
            SELECT
                (
                    SELECT COALESCE(SUM(total), 0)
                    FROM ventas
                    WHERE ${fechaVenta} > ${fechaUltimoCierre}
                ) AS total_ventas,

                (
                    SELECT COUNT(*)
                    FROM especies
                    WHERE stock <= stock_minimo
                ) AS inventario_critico,

                (
                    SELECT COUNT(*)
                    FROM plagas
                    WHERE ${fechaPlaga} > ${fechaUltimoCierre}
                    AND severidad = 'Alta'
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
                TO_CHAR(${fechaVenta}, 'TMMonth') AS mes,
                SUM(total) AS ventas
            FROM ventas
            WHERE ${fechaVenta} > ${fechaUltimoCierre}
            GROUP BY
                EXTRACT(MONTH FROM ${fechaVenta}),
                TO_CHAR(${fechaVenta}, 'TMMonth')
            ORDER BY
                EXTRACT(MONTH FROM ${fechaVenta})
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
                v.fecha::text AS fecha,
                v.total,
                e.nombre AS especie,
                d.cantidad
            FROM ventas v
            INNER JOIN detalle_venta d ON v.id_venta = d.id_venta
            INNER JOIN especies e ON d.id_especie = e.id_especie
            WHERE ${fechaVentaAlias} > ${fechaUltimoCierre}
            ORDER BY v.id_venta DESC
            LIMIT 5
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
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
        console.log(error);
        res.status(500).json(error);
    }
};

const plagasRecientes = async (req, res) => {
    try {
        const sql = `
            SELECT
                p.seccion,
                p.tipo_plaga,
                p.severidad,
                p.fecha
            FROM plagas p
            WHERE ${fechaPlagaAlias} > ${fechaUltimoCierre}
            ORDER BY ${fechaPlagaAlias} DESC
            LIMIT 5
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const resumenPorPeriodo = async (req, res) => {
    try {
        const { periodo } = req.params;

        const hoyMexico = `(NOW() AT TIME ZONE 'America/Mexico_City')`;

        let condicionFecha = `${fechaVenta} > ${fechaUltimoCierre}`;

        if (periodo === 'hoy') {
            condicionFecha += ` AND DATE(${fechaVenta}) = DATE(${hoyMexico})`;
        }

        if (periodo === 'semana') {
            condicionFecha += ` AND ${fechaVenta} >= DATE_TRUNC('week', ${hoyMexico})`;
        }

        if (periodo === 'mes') {
            condicionFecha += ` AND ${fechaVenta} >= DATE_TRUNC('month', ${hoyMexico})`;
        }

        if (periodo === 'anio') {
            condicionFecha += ` AND ${fechaVenta} >= DATE_TRUNC('year', ${hoyMexico})`;
        }

        const sql = `
            SELECT
                COALESCE(SUM(v.total), 0) AS total_ventas,
                COUNT(DISTINCT v.id_venta) AS ventas_encontradas,
                COALESCE(SUM(d.cantidad), 0) AS productos_vendidos
            FROM ventas v
            INNER JOIN detalle_venta d
                ON v.id_venta = d.id_venta
            WHERE ${condicionFecha.replaceAll('ventas.fecha', 'v.fecha')}
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