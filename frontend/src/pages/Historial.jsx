import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Historial() {

    const [cierres, setCierres] = useState([]);

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril',
        'Mayo', 'Junio', 'Julio', 'Agosto',
        'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const obtenerCierres = async () => {
        const respuesta = await API.get('/cierres');
        setCierres(respuesta.data);
    };

    useEffect(() => {
        const cargarCierres = async () => {
            await obtenerCierres();
        };

        cargarCierres();
    }, []);

    const verDetalle = (cierre) => {

        const detalleVentas = cierre.detalle_ventas || [];
        const detallePlagas = cierre.detalle_plagas || [];

        let html = `
            <div style="text-align:left">
                <p><b>Periodo:</b> ${meses[cierre.mes - 1]} ${cierre.anio}</p>
                <p><b>Total vendido:</b> $${Number(cierre.total_ventas).toFixed(2)}</p>
                <p><b>Productos vendidos:</b> ${cierre.productos_vendidos}</p>
                <p><b>Plagas registradas:</b> ${cierre.plagas_registradas}</p>
                <p><b>Stock crítico:</b> ${cierre.especies_criticas}</p>
                <p><b>Fecha de cierre:</b> ${new Date(cierre.fecha_cierre).toLocaleString()}</p>

                <hr style="margin: 15px 0"/>

                <h3 style="font-size:18px; font-weight:bold; margin-bottom:10px;">
                    🌱 Plantas vendidas
                </h3>
        `;

        if (detalleVentas.length === 0) {
            html += `<p>No hay detalle de ventas registrado.</p>`;
        } else {
            detalleVentas.forEach((item) => {
                html += `
                    <div style="margin-bottom:12px; padding:10px; border-radius:10px; background:#f0fdf4;">
                        <p><b>Planta:</b> ${item.especie}</p>
                        <p><b>Cantidad vendida:</b> ${item.cantidad}</p>
                        <p><b>Total generado:</b> $${Number(item.total).toFixed(2)}</p>
                        <p><b>Última venta:</b> ${
                            item.ultima_fecha_venta
                                ? new Date(item.ultima_fecha_venta).toLocaleString()
                                : 'Sin fecha'
                        }</p>
                    </div>
                `;
            });
        }

        html += `
                <hr style="margin: 15px 0"/>

                <h3 style="font-size:18px; font-weight:bold; margin-bottom:10px;">
                    🐛 Plagas registradas
                </h3>
        `;

        if (detallePlagas.length === 0) {
            html += `<p>No hay detalle de plagas registrado.</p>`;
        } else {
            detallePlagas.forEach((item) => {
                html += `
                    <div style="margin-bottom:12px; padding:10px; border-radius:10px; background:#fef2f2;">
                        <p><b>Tipo de plaga:</b> ${item.tipo_plaga}</p>
                        <p><b>Sección:</b> ${item.seccion}</p>
                        <p><b>Severidad:</b> ${item.severidad}</p>
                        <p><b>Fecha:</b> ${new Date(item.fecha).toLocaleDateString()}</p>
                        <p><b>Descripción:</b> ${item.descripcion || 'Sin descripción'}</p>
                    </div>
                `;
            });
        }

        html += `</div>`;

        Swal.fire({
            title: 'Detalle del cierre',
            html,
            width: 750,
            confirmButtonText: 'Cerrar'
        });
    };

    return (
        <MainLayout>

            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-white">
                    Historial de Cierres 📚
                </h1>

                <p className="text-gray-500 dark:text-gray-300 mt-2">
                    Consulta los cierres mensuales, ventas por planta y plagas registradas.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl overflow-hidden">

                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                    Cierres registrados
                </h2>

                <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {
                        cierres.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-300">
                                Aún no hay cierres mensuales registrados
                            </p>
                        ) : (
                            cierres.map((cierre) => (
                                <div
                                    key={cierre.id_cierre}
                                    className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                                Periodo
                                            </p>

                                            <h3 className="text-xl font-bold dark:text-white">
                                                {meses[cierre.mes - 1]} {cierre.anio}
                                            </h3>
                                        </div>

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                            ${Number(cierre.total_ventas).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-5">
                                        <div className="bg-green-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Productos
                                            </p>
                                            <p className="font-bold text-green-600">
                                                {cierre.productos_vendidos}
                                            </p>
                                        </div>

                                        <div className="bg-red-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Plagas
                                            </p>
                                            <p className="font-bold text-red-600">
                                                {cierre.plagas_registradas}
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Stock crítico
                                            </p>
                                            <p className="font-bold text-yellow-600">
                                                {cierre.especies_criticas}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Fecha cierre
                                            </p>
                                            <p className="font-bold text-blue-600 text-sm">
                                                {new Date(cierre.fecha_cierre).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => verDetalle(cierre)}
                                        className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold"
                                    >
                                        Ver detalle
                                    </button>
                                </div>
                            ))
                        )
                    }
                </div>

                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full min-w-[1050px]">

                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 text-left dark:text-white">Periodo</th>
                                <th className="p-4 text-left dark:text-white">Ventas</th>
                                <th className="p-4 text-left dark:text-white">Productos</th>
                                <th className="p-4 text-left dark:text-white">Plagas</th>
                                <th className="p-4 text-left dark:text-white">Stock crítico</th>
                                <th className="p-4 text-left dark:text-white">Fecha cierre</th>
                                <th className="p-4 text-left dark:text-white">Detalle</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                cierres.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="p-6 text-center text-gray-500 dark:text-gray-300"
                                        >
                                            Aún no hay cierres mensuales registrados
                                        </td>
                                    </tr>
                                ) : (
                                    cierres.map((cierre) => (
                                        <tr
                                            key={cierre.id_cierre}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="p-4 dark:text-gray-200">
                                                {meses[cierre.mes - 1]} {cierre.anio}
                                            </td>

                                            <td className="p-4 font-bold text-green-600">
                                                ${Number(cierre.total_ventas).toFixed(2)}
                                            </td>

                                            <td className="p-4 dark:text-gray-200">
                                                {cierre.productos_vendidos}
                                            </td>

                                            <td className="p-4 dark:text-gray-200">
                                                {cierre.plagas_registradas}
                                            </td>

                                            <td className="p-4 dark:text-gray-200">
                                                {cierre.especies_criticas}
                                            </td>

                                            <td className="p-4 dark:text-gray-200">
                                                {new Date(cierre.fecha_cierre).toLocaleString()}
                                            </td>

                                            <td className="p-4">
                                                <button
                                                    onClick={() => verDetalle(cierre)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold"
                                                >
                                                    Ver detalle
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )
                            }
                        </tbody>

                    </table>
                </div>

            </div>

        </MainLayout>
    );
}

export default Historial;