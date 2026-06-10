const conexion = require('../config/db');

const fechaVenta = `
    CASE
        WHEN v.fecha::text LIKE '%+00%' THEN
            (v.fecha::timestamptz AT TIME ZONE 'America/Mexico_City')
        ELSE
            (v.fecha::timestamp)
    END
`;

const ventasPorDia = async (req, res) => {
    try {
        const sql = `
            SELECT
                TO_CHAR(${fechaVenta}, 'DD/MM/YYYY') AS periodo,
                TO_CHAR(${fechaVenta}, 'HH12:MI AM') AS hora,
                e.nombre AS especie,
                d.cantidad,
                d.precio,
                d.subtotal AS total
            FROM ventas v
            INNER JOIN detalle_venta d ON v.id_venta = d.id_venta
            INNER JOIN especies e ON d.id_especie = e.id_especie
            ORDER BY ${fechaVenta} DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log('ERROR ventasPorDia:', error.message);
        res.status(500).json({
            mensaje: error.message
        });
    }
};

const ventasPorSemana = async (req, res) => {
    try {
        const sql = `
            SELECT
                CONCAT('Semana ', EXTRACT(WEEK FROM ${fechaVenta})) AS periodo,
                e.nombre AS especie,
                SUM(d.cantidad) AS cantidad,
                d.precio,
                SUM(d.subtotal) AS total
            FROM ventas v
            INNER JOIN detalle_venta d ON v.id_venta = d.id_venta
            INNER JOIN especies e ON d.id_especie = e.id_especie
            GROUP BY
                EXTRACT(WEEK FROM ${fechaVenta}),
                e.nombre,
                d.precio
            ORDER BY
                EXTRACT(WEEK FROM ${fechaVenta}) DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log('ERROR ventasPorSemana:', error.message);
        res.status(500).json({
            mensaje: error.message
        });
    }
};

const ventasPorMes = async (req, res) => {
    try {
        const sql = `
            SELECT
                TO_CHAR(${fechaVenta}, 'TMMonth YYYY') AS periodo,
                e.nombre AS especie,
                SUM(d.cantidad) AS cantidad,
                d.precio,
                SUM(d.subtotal) AS total
            FROM ventas v
            INNER JOIN detalle_venta d ON v.id_venta = d.id_venta
            INNER JOIN especies e ON d.id_especie = e.id_especie
            GROUP BY
                EXTRACT(YEAR FROM ${fechaVenta}),
                EXTRACT(MONTH FROM ${fechaVenta}),
                TO_CHAR(${fechaVenta}, 'TMMonth YYYY'),
                e.nombre,
                d.precio
            ORDER BY
                EXTRACT(YEAR FROM ${fechaVenta}) DESC,
                EXTRACT(MONTH FROM ${fechaVenta}) DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log('ERROR ventasPorMes:', error.message);
        res.status(500).json({
            mensaje: error.message
        });
    }
};

const topEspeciesVendidas = async (req, res) => {
    try {
        const sql = `
            SELECT
                e.nombre AS especie,
                SUM(d.cantidad) AS cantidad,
                SUM(d.subtotal) AS total,
                'Alta demanda' AS estado
            FROM detalle_venta d
            INNER JOIN especies e ON d.id_especie = e.id_especie
            GROUP BY e.nombre
            ORDER BY SUM(d.cantidad) DESC
            LIMIT 10
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

const stockCritico = async (req, res) => {
    try {
        const sql = `
            SELECT
                nombre,
                nombre_cientifico,
                stock,
                stock_minimo,
                CASE
                    WHEN stock = 0 THEN 'Agotado'
                    WHEN stock <= stock_minimo THEN 'Stock bajo'
                    ELSE 'Disponible'
                END AS estado
            FROM especies
            WHERE stock <= stock_minimo
            ORDER BY stock ASC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

const plagasPorSeveridad = async (req, res) => {
    try {
        const sql = `
            SELECT
                severidad,
                COUNT(*) AS total,
                CASE
                    WHEN severidad = 'Alta' THEN 'Atención inmediata'
                    WHEN severidad = 'Media' THEN 'Seguimiento recomendado'
                    ELSE 'Control preventivo'
                END AS recomendacion
            FROM plagas
            GROUP BY severidad
            ORDER BY total DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

module.exports = {
    ventasPorDia,
    ventasPorSemana,
    ventasPorMes,
    topEspeciesVendidas,
    stockCritico,
    plagasPorSeveridad
};