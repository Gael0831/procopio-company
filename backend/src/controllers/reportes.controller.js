const conexion = require('../config/db');

const ventasPorDia = async (req, res) => {
    try {
        const sql = `
            SELECT 
                TO_CHAR(fecha, 'YYYY-MM-DD') AS periodo,
                SUM(total) AS total
            FROM ventas
            GROUP BY TO_CHAR(fecha, 'YYYY-MM-DD')
            ORDER BY periodo DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};

const ventasPorSemana = async (req, res) => {
    try {
        const sql = `
            SELECT 
                CONCAT('Semana ', EXTRACT(WEEK FROM fecha)) AS periodo,
                SUM(total) AS total
            FROM ventas
            GROUP BY EXTRACT(WEEK FROM fecha)
            ORDER BY EXTRACT(WEEK FROM fecha) DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};

const ventasPorMes = async (req, res) => {
    try {
        const sql = `
            SELECT 
                TO_CHAR(fecha, 'Month') AS periodo,
                SUM(total) AS total
            FROM ventas
            GROUP BY EXTRACT(MONTH FROM fecha), TO_CHAR(fecha, 'Month')
            ORDER BY EXTRACT(MONTH FROM fecha)
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};

const topEspeciesVendidas = async (req, res) => {
    try {
        const sql = `
            SELECT 
                e.nombre,
                SUM(d.cantidad) AS cantidad_vendida,
                SUM(d.subtotal) AS total_generado
            FROM detalle_venta d
            INNER JOIN especies e ON d.id_especie = e.id_especie
            GROUP BY e.nombre
            ORDER BY cantidad_vendida DESC
            LIMIT 5
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};

const stockCritico = async (req, res) => {
    try {
        const sql = `
            SELECT *
            FROM especies
            WHERE stock <= stock_minimo
            ORDER BY stock ASC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json(error);
    }
};

const plagasPorSeveridad = async (req, res) => {
    try {
        const sql = `
            SELECT 
                severidad,
                COUNT(*) AS total
            FROM plagas
            GROUP BY severidad
            ORDER BY total DESC
        `;

        const resultado = await conexion.query(sql);
        res.json(resultado.rows);

    } catch (error) {
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