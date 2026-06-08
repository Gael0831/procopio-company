const conexion = require('../config/db');

const cerrarMes = async (req, res) => {
    try {
        const fechaActual = new Date();
        const mes = fechaActual.getMonth() + 1;
        const anio = fechaActual.getFullYear();

        const existe = await conexion.query(
            `
            SELECT * FROM cierres_mensuales
            WHERE mes = $1 AND anio = $2
            `,
            [mes, anio]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'Este mes ya fue cerrado anteriormente'
            });
        }

        const resumen = await conexion.query(`
            SELECT
                COALESCE(SUM(v.total), 0) AS total_ventas,
                COALESCE(SUM(d.cantidad), 0) AS productos_vendidos
            FROM ventas v
            LEFT JOIN detalle_venta d ON v.id_venta = d.id_venta
            WHERE EXTRACT(MONTH FROM v.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM v.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        `);

        const detalleVentas = await conexion.query(`
            SELECT
                e.nombre AS especie,
                SUM(d.cantidad) AS cantidad,
                SUM(d.subtotal) AS total,
                MAX(v.fecha) AS ultima_fecha_venta
            FROM detalle_venta d
            INNER JOIN ventas v ON d.id_venta = v.id_venta
            INNER JOIN especies e ON d.id_especie = e.id_especie
            WHERE EXTRACT(MONTH FROM v.fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM v.fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            GROUP BY e.nombre
            ORDER BY total DESC
        `);

        const plagas = await conexion.query(`
            SELECT COUNT(*) AS total
            FROM plagas
            WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
        `);

        const detallePlagas = await conexion.query(`
            SELECT
                seccion,
                tipo_plaga,
                severidad,
                fecha,
                descripcion
            FROM plagas
            WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)
            ORDER BY fecha DESC
        `);

        const stockCritico = await conexion.query(`
            SELECT COUNT(*) AS total
            FROM especies
            WHERE stock <= stock_minimo
        `);

        const totalVentas = resumen.rows[0].total_ventas;
        const productosVendidos = resumen.rows[0].productos_vendidos;
        const plagasRegistradas = plagas.rows[0].total;
        const especiesCriticas = stockCritico.rows[0].total;

        const insertar = await conexion.query(
            `
            INSERT INTO cierres_mensuales(
                mes,
                anio,
                total_ventas,
                productos_vendidos,
                plagas_registradas,
                especies_criticas,
                detalle_ventas,
                detalle_plagas
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [
                mes,
                anio,
                totalVentas,
                productosVendidos,
                plagasRegistradas,
                especiesCriticas,
                JSON.stringify(detalleVentas.rows),
                JSON.stringify(detallePlagas.rows)
            ]
        );

        res.json({
            success: true,
            mensaje: 'Mes cerrado correctamente',
            cierre: insertar.rows[0]
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            mensaje: 'Error al cerrar el mes'
        });
    }
};

const obtenerCierres = async (req, res) => {
    try {
        const resultado = await conexion.query(`
            SELECT *
            FROM cierres_mensuales
            ORDER BY anio DESC, mes DESC
        `);

        res.json(resultado.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener cierres'
        });
    }
};

module.exports = {
    cerrarMes,
    obtenerCierres
};