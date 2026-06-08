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

        const subtotal = cantidad * precio;

        const verificarStock = `
            SELECT stock
            FROM especies
            WHERE id_especie = $1
        `;

        const stockResultado = await conexion.query(
            verificarStock,
            [id_especie]
        );

        if(stockResultado.rows.length === 0){

            return res.json({
                success: false,
                mensaje: 'La especie no existe'
            });

        }

        const stockActual =
            stockResultado.rows[0].stock;

        if(stockActual < cantidad){

            return res.json({
                success: false,
                mensaje: 'Stock insuficiente'
            });

        }

        const crearVenta = `
            INSERT INTO ventas(
                total,
                id_usuario
            )
            VALUES($1,$2)
            RETURNING id_venta
        `;

        const ventaResultado = await conexion.query(
            crearVenta,
            [
                subtotal,
                id_usuario
            ]
        );

        const idVenta =
            ventaResultado.rows[0].id_venta;

        const crearDetalle = `
            INSERT INTO detalle_venta(
                id_venta,
                id_especie,
                cantidad,
                precio,
                subtotal
            )
            VALUES($1,$2,$3,$4,$5)
        `;

        await conexion.query(
            crearDetalle,
            [
                idVenta,
                id_especie,
                cantidad,
                precio,
                subtotal
            ]
        );

        const actualizarStock = `
            UPDATE especies
            SET stock = stock - $1
            WHERE id_especie = $2
        `;

        await conexion.query(
            actualizarStock,
            [
                cantidad,
                id_especie
            ]
        );

        res.json({
            success: true,
            mensaje: 'Venta registrada',
            id_venta: idVenta,
            total: subtotal
        });

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};

const obtenerVentas = async (req, res) => {

    try {

        const sql = `
            SELECT
                v.id_venta,
                (v.fecha AT TIME ZONE 'UTC' AT TIME ZONE 'America/Mexico_City') AS fecha,
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
            ORDER BY v.fecha DESC
        `;

        const resultado = await conexion.query(sql);

        res.json(resultado.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};

module.exports = {
    registrarVenta,
    obtenerVentas
};