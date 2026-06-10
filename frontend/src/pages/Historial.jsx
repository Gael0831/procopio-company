import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import {
    FaHistory,
    FaEye,
    FaShoppingCart,
    FaBug,
    FaLeaf,
    FaCalendarAlt,
    FaBoxOpen,
    FaDollarSign
} from 'react-icons/fa';

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

    const totalHistorico = cierres.reduce(
        (total, cierre) => total + Number(cierre.total_ventas),
        0
    );

    const productosHistoricos = cierres.reduce(
        (total, cierre) => total + Number(cierre.productos_vendidos),
        0
    );

    const plagasHistoricas = cierres.reduce(
        (total, cierre) => total + Number(cierre.plagas_registradas),
        0
    );

    const verDetalle = (cierre) => {

        const detalleVentas = cierre.detalle_ventas || [];
        const detallePlagas = cierre.detalle_plagas || [];

        let html = `
            <div style="text-align:left">
                <div style="padding:16px; border-radius:18px; background:#ecfdf5; margin-bottom:16px;">
                    <p><b>Periodo:</b> ${meses[cierre.mes - 1]} ${cierre.anio}</p>
                    <p><b>Total vendido:</b> $${Number(cierre.total_ventas).toFixed(2)}</p>
                    <p><b>Productos vendidos:</b> ${cierre.productos_vendidos}</p>
                    <p><b>Plagas registradas:</b> ${cierre.plagas_registradas}</p>
                    <p><b>Stock crítico:</b> ${cierre.especies_criticas}</p>
                    <p><b>Fecha de cierre:</b> ${new Date(cierre.fecha_cierre).toLocaleString()}</p>
                </div>

                <h3 style="font-size:18px; font-weight:bold; margin-bottom:10px;">
                    🌱 Plantas vendidas
                </h3>
        `;

        if (detalleVentas.length === 0) {
            html += `<p>No hay detalle de ventas registrado.</p>`;
        } else {
            detalleVentas.forEach((item) => {
                html += `
                    <div style="margin-bottom:12px; padding:12px; border-radius:14px; background:#f0fdf4; border:1px solid #bbf7d0;">
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
                <hr style="margin: 18px 0"/>

                <h3 style="font-size:18px; font-weight:bold; margin-bottom:10px;">
                    🐛 Plagas registradas
                </h3>
        `;

        if (detallePlagas.length === 0) {
            html += `<p>No hay detalle de plagas registrado.</p>`;
        } else {
            detallePlagas.forEach((item) => {
                html += `
                    <div style="margin-bottom:12px; padding:12px; border-radius:14px; background:#fef2f2; border:1px solid #fecaca;">
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
            width: 800,
            confirmButtonText: 'Cerrar',
            confirmButtonColor: '#15803d'
        });
    };

    return (
        <MainLayout>

            <div className="mb-10">
                <div className="relative overflow-hidden rounded-[2.2rem] p-8 md:p-10 bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_28%)]" />

                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-5">
                            📚 Archivo administrativo
                        </span>

                        <h1 className="text-4xl md:text-6xl font-black text-white">
                            Historial de Cierres
                        </h1>

                        <p className="text-green-50/90 mt-3 max-w-3xl text-lg">
                            Consulta los cierres mensuales, ventas consolidadas, plagas registradas y stock crítico histórico.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-green-700 to-emerald-500 text-white shadow-xl">
                    <FaHistory className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Cierres</p>
                    <p className="text-4xl font-black mt-2">{cierres.length}</p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-yellow-600 to-orange-500 text-white shadow-xl">
                    <FaDollarSign className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Ventas históricas</p>
                    <p className="text-4xl font-black mt-2">${totalHistorico.toFixed(2)}</p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-xl">
                    <FaBoxOpen className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Productos</p>
                    <p className="text-4xl font-black mt-2">{productosHistoricos}</p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-red-700 to-rose-500 text-white shadow-xl">
                    <FaBug className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Plagas</p>
                    <p className="text-4xl font-black mt-2">{plagasHistoricas}</p>
                </div>

            </div>

            <div className="card-pro card-hover p-8 overflow-hidden">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-green-900 dark:text-white">
                            Cierres registrados
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300">
                            Registro histórico de cierres mensuales del sistema.
                        </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black">
                        {cierres.length} registros
                    </span>
                </div>

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
                                    className="bg-white/80 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] p-5 shadow-lg"
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                                                <FaCalendarAlt />
                                                Periodo
                                            </p>

                                            <h3 className="text-xl font-black dark:text-white mt-1">
                                                {meses[cierre.mes - 1]} {cierre.anio}
                                            </h3>
                                        </div>

                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-black">
                                            ${Number(cierre.total_ventas).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-5">
                                        <div className="bg-green-50 dark:bg-slate-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Productos
                                            </p>
                                            <p className="font-black text-green-600">
                                                {cierre.productos_vendidos}
                                            </p>
                                        </div>

                                        <div className="bg-red-50 dark:bg-slate-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Plagas
                                            </p>
                                            <p className="font-black text-red-600">
                                                {cierre.plagas_registradas}
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-slate-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Stock crítico
                                            </p>
                                            <p className="font-black text-yellow-600">
                                                {cierre.especies_criticas}
                                            </p>
                                        </div>

                                        <div className="bg-blue-50 dark:bg-slate-700 p-3 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-300">
                                                Fecha cierre
                                            </p>
                                            <p className="font-black text-blue-600 text-sm">
                                                {new Date(cierre.fecha_cierre).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => verDetalle(cierre)}
                                        className="mt-5 w-full btn-primary flex items-center justify-center gap-2"
                                    >
                                        <FaEye />
                                        Ver detalle
                                    </button>
                                </div>
                            ))
                        )
                    }
                </div>

                <div className="hidden lg:block overflow-x-auto rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                    <table className="w-full min-w-[1050px]">

                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-4 text-left">Periodo</th>
                                <th className="p-4 text-left">Ventas</th>
                                <th className="p-4 text-left">Productos</th>
                                <th className="p-4 text-left">Plagas</th>
                                <th className="p-4 text-left">Stock crítico</th>
                                <th className="p-4 text-left">Fecha cierre</th>
                                <th className="p-4 text-left">Detalle</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white/70 dark:bg-slate-900/70">
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
                                            className="border-b border-slate-100 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            <td className="p-4 dark:text-gray-200 font-black">
                                                {meses[cierre.mes - 1]} {cierre.anio}
                                            </td>

                                            <td className="p-4 font-black text-green-600">
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
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                                >
                                                    <FaEye />
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