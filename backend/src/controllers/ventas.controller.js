const conexion = require('../config/db');

const registrarVenta = async (req, res) => {

    try {

        const {
            id_especie,
            cantidad,
            precio,
            id_usuario
        } = req.body;

        if (
            !id_especie ||
            !cantidad ||
            !precio ||
            !id_usuario
        ) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (
            Number(cantidad) <= 0 ||
            !Number.isInteger(Number(cantidad))
        ) {
            return res.status(400).json({
                success: false,
                mensaje: 'La cantidad debe ser un número entero mayor a cero'
            });
        }

        if (Number(precio) <= 0) {
            return res.status(400).json({
                success: false,
                mensaje: 'El precio no es válido'
            });
        }

        const subtotal = Number(cantidad) * Number(precio);

        const stockResultado = await conexion.query(
            `
            SELECT stock
            FROM especies
            WHERE id_especie = $1
            `,
            [id_especie]
        );

        if (stockResultado.rows.length === 0) {
            return res.status(404).json({
                success: false,
                mensaje: 'La especie no existe'
            });
        }

        const stockActual = Number(stockResultado.rows[0].stock);

        if (stockActual < Number(cantidad)) {
            return res.status(400).json({
                success: false,
                mensaje: 'Stock insuficiente'
            });
        }

        const ventaResultado = await conexion.query(
            `
            INSERT INTO ventas(
                total,
                id_usuario,
                fecha
            )
            VALUES(
                $1,
                $2,
                TO_CHAR(
                    NOW() AT TIME ZONE 'America/Mexico_City',
                    'YYYY-MM-DD HH24:MI:SS'
                )
            )
            RETURNING id_venta, fecha
            `,
            [
                subtotal,
                id_usuario
            ]
        );

        const idVenta = ventaResultado.rows[0].id_venta;
        const fechaVenta = ventaResultado.rows[0].fecha;

        await conexion.query(
            `
            INSERT INTO detalle_venta(
                id_venta,
                id_especie,
                cantidad,
                precio,
                subtotal
            )
            VALUES($1,$2,$3,$4,$5)
            `,
            [
                idVenta,
                id_especie,
                cantidad,
                precio,
                subtotal
            ]
        );

        await conexion.query(
            `
            UPDATE especies
            SET stock = stock - $1
            WHERE id_especie = $2
            `,
            [
                cantidad,
                id_especie
            ]
        );

        res.json({
            success: true,
            mensaje: 'Venta registrada correctamente',
            id_venta: idVenta,
            total: subtotal,
            fecha: fechaVenta
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            mensaje: 'Error al registrar la venta'
        });

    }

};

const obtenerVentas = async (req, res) => {

    try {

        const sql = `
            SELECT
                v.id_venta,
                v.fecha::text AS fecha,
                v.total,
                e.nombre AS especie,
                d.cantidad,
                d.precio,
                d.subtotal
            FROM ventas v
            INNER JOIN detalle_venta d
                ON v.id_venta = d.id_venta
            INNER JOIN especies e
                ON d.id_especie = e.id_especie
            ORDER BY v.id_venta DESC
        `;

        const resultado = await conexion.query(sql);

        res.json(resultado.rows);

    } catch (error) {

        console.log('ERROR OBTENER VENTAS:', error.message);

        res.status(500).json({
            success: false,
            mensaje: error.message,
            codigo: error.code,
            detalle: error.detail
        });

    }

};

module.exports = {
    registrarVenta,
    obtenerVentas
};