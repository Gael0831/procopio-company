const conexion = require('../config/db');

const ventasPorDia = async (req, res) => {
    try {
        const sql = `
            SELECT
                TO_CHAR(v.fecha, 'DD/MM/YYYY') AS periodo,
                e.nombre AS especie,
                d.cantidad,
                d.precio,
                d.subtotal AS total,
                TO_CHAR(v.fecha, 'HH12:MI AM') AS hora
            FROM ventas v
            INNER JOIN detalle_venta d
                ON v.id_venta = d.id_venta
            INNER JOIN especies e
                ON d.id_especie = e.id_especie
            ORDER BY v.fecha DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const ventasPorSemana = async (req, res) => {
    try {
        const sql = `
            SELECT
                CONCAT('Semana ', EXTRACT(WEEK FROM v.fecha)) AS periodo,
                e.nombre AS especie,
                SUM(d.cantidad) AS cantidad,
                d.precio,
                SUM(d.subtotal) AS total
            FROM ventas v
            INNER JOIN detalle_venta d
                ON v.id_venta = d.id_venta
            INNER JOIN especies e
                ON d.id_especie = e.id_especie
            GROUP BY EXTRACT(WEEK FROM v.fecha), e.nombre, d.precio
            ORDER BY EXTRACT(WEEK FROM v.fecha) DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const ventasPorMes = async (req, res) => {
    try {
        const sql = `
            SELECT
                TO_CHAR(v.fecha, 'TMMonth YYYY') AS periodo,
                e.nombre AS especie,
                SUM(d.cantidad) AS cantidad,
                d.precio,
                SUM(d.subtotal) AS total
            FROM ventas v
            INNER JOIN detalle_venta d
                ON v.id_venta = d.id_venta
            INNER JOIN especies e
                ON d.id_especie = e.id_especie
            GROUP BY 
                EXTRACT(YEAR FROM v.fecha),
                EXTRACT(MONTH FROM v.fecha),
                TO_CHAR(v.fecha, 'TMMonth YYYY'),
                e.nombre,
                d.precio
            ORDER BY 
                EXTRACT(YEAR FROM v.fecha) DESC,
                EXTRACT(MONTH FROM v.fecha) DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
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
            INNER JOIN especies e
                ON d.id_especie = e.id_especie
            GROUP BY e.nombre
            ORDER BY cantidad DESC
            LIMIT 10
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
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
        console.log(error);
        res.status(500).json(error);
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
        console.log(error);
        res.status(500).json(error);
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