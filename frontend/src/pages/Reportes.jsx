import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { useEffect, useState } from 'react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import {
    FaFilePdf,
    FaFileExcel,
    FaChartBar,
    FaTable,
    FaDownload,
    FaClipboardList,
    FaLeaf,
    FaShoppingCart,
    FaExclamationTriangle,
    FaBug
} from 'react-icons/fa';

function Reportes() {

    const [tipoReporte, setTipoReporte] = useState('inventario');
    const [datos, setDatos] = useState([]);

    const formatearMoneda = (valor) => {
        return `$${Number(valor || 0).toFixed(2)}`;
    };

    const obtenerFecha = (fecha) => {
        return new Date(String(fecha).replace(' ', 'T'));
    };

    const prepararVentasDia = (ventas) => {
        return ventas.map((venta) => {
            const fecha = obtenerFecha(venta.fecha);

            return {
                periodo: fecha.toLocaleDateString('es-MX'),
                hora: fecha.toLocaleTimeString('es-MX', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                especie: venta.especie,
                cantidad: venta.cantidad,
                precio: venta.precio,
                total: venta.total
            };
        });
    };

    const prepararVentasAgrupadas = (ventas, tipo) => {
        const grupos = {};

        ventas.forEach((venta) => {
            const fecha = obtenerFecha(venta.fecha);

            let periodo = '';

            if (tipo === 'semana') {
                const inicio = new Date(fecha.getFullYear(), 0, 1);
                const dias = Math.floor((fecha - inicio) / (24 * 60 * 60 * 1000));
                const semana = Math.ceil((dias + inicio.getDay() + 1) / 7);
                periodo = `Semana ${semana}`;
            }

            if (tipo === 'mes') {
                periodo = fecha.toLocaleDateString('es-MX', {
                    month: 'long',
                    year: 'numeric'
                });
            }

            const clave = `${periodo}-${venta.especie}-${venta.precio}`;

            if (!grupos[clave]) {
                grupos[clave] = {
                    periodo,
                    especie: venta.especie,
                    cantidad: 0,
                    precio: venta.precio,
                    total: 0
                };
            }

            grupos[clave].cantidad += Number(venta.cantidad);
            grupos[clave].total += Number(venta.total);
        });

        return Object.values(grupos);
    };

    const configuraciones = {
        inventario: {
            titulo: 'Inventario general',
            endpoint: '/especies',
            columnas: ['Nombre', 'Nombre científico', 'Precio', 'Stock', 'Stock mínimo', 'Estado'],
            descripcion: 'Listado general de especies registradas en el inventario.',
            icono: <FaLeaf />,
            color: 'from-green-700 to-emerald-500',
            mapear: (item) => [
                item.nombre,
                item.nombre_cientifico,
                `$${Number(item.precio).toFixed(2)}`,
                item.stock,
                item.stock_minimo,
                Number(item.stock) <= Number(item.stock_minimo) ? 'Stock bajo' : 'Disponible'
            ]
        },
        ventasDia: {
            titulo: 'Ventas por día',
            endpoint: '/ventas',
            columnas: ['Día', 'Hora', 'Especie', 'Cantidad', 'Precio', 'Total'],
            descripcion: 'Detalle de ventas registradas por día.',
            icono: <FaShoppingCart />,
            color: 'from-blue-700 to-cyan-500',
            preparar: prepararVentasDia,
            mapear: (item) => [
                item.periodo,
                item.hora,
                item.especie,
                item.cantidad,
                formatearMoneda(item.precio),
                formatearMoneda(item.total)
            ]
        },
        ventasSemana: {
            titulo: 'Ventas por semana',
            endpoint: '/ventas',
            columnas: ['Semana', 'Especie', 'Cantidad', 'Precio', 'Total'],
            descripcion: 'Resumen semanal de especies vendidas.',
            icono: <FaShoppingCart />,
            color: 'from-indigo-700 to-blue-500',
            preparar: (ventas) => prepararVentasAgrupadas(ventas, 'semana'),
            mapear: (item) => [
                item.periodo,
                item.especie,
                item.cantidad,
                formatearMoneda(item.precio),
                formatearMoneda(item.total)
            ]
        },
        ventasMes: {
            titulo: 'Ventas por mes',
            endpoint: '/ventas',
            columnas: ['Mes', 'Especie', 'Cantidad', 'Precio', 'Total'],
            descripcion: 'Resumen mensual de ventas por especie.',
            icono: <FaChartBar />,
            color: 'from-purple-700 to-fuchsia-500',
            preparar: (ventas) => prepararVentasAgrupadas(ventas, 'mes'),
            mapear: (item) => [
                item.periodo,
                item.especie,
                item.cantidad,
                formatearMoneda(item.precio),
                formatearMoneda(item.total)
            ]
        },
        topEspecies: {
            titulo: 'Top especies vendidas',
            endpoint: '/reportes/top-especies',
            columnas: ['Especie', 'Cantidad vendida', 'Total generado', 'Estado'],
            descripcion: 'Ranking de especies con mayor venta.',
            icono: <FaChartBar />,
            color: 'from-yellow-600 to-orange-500',
            mapear: (item) => [
                item.especie,
                item.cantidad,
                `$${Number(item.total).toFixed(2)}`,
                item.estado
            ]
        },
        stockCritico: {
            titulo: 'Stock crítico',
            endpoint: '/reportes/stock-critico',
            columnas: ['Nombre', 'Nombre científico', 'Stock', 'Stock mínimo', 'Estado'],
            descripcion: 'Especies que requieren atención por inventario bajo.',
            icono: <FaExclamationTriangle />,
            color: 'from-red-700 to-rose-500',
            mapear: (item) => [
                item.nombre,
                item.nombre_cientifico,
                item.stock,
                item.stock_minimo,
                item.estado
            ]
        },
        plagasSeveridad: {
            titulo: 'Plagas por severidad',
            endpoint: '/reportes/plagas-severidad',
            columnas: ['Severidad', 'Total', 'Recomendación'],
            descripcion: 'Resumen de incidencias clasificadas por severidad.',
            icono: <FaBug />,
            color: 'from-red-800 to-orange-500',
            mapear: (item) => [
                item.severidad,
                item.total,
                item.recomendacion
            ]
        }
    };

    const obtenerReporte = async () => {
        try {
            setDatos([]);

            const config = configuraciones[tipoReporte];
            const respuesta = await API.get(config.endpoint);

            const datosPreparados = config.preparar
                ? config.preparar(respuesta.data || [])
                : respuesta.data || [];

            setDatos(datosPreparados);

        } catch (error) {
            console.log(error);
            setDatos([]);
        }
    };

    useEffect(() => {
        const cargarReporte = async () => {
            await obtenerReporte();
        };

        cargarReporte();
    }, [tipoReporte]);

    const exportarPDF = () => {
        const config = configuraciones[tipoReporte];
        const doc = new jsPDF();

        const totalRegistros = datos.length;
        const fecha = new Date().toLocaleString('es-MX');

        doc.setFillColor(22, 101, 52);
        doc.rect(0, 0, 220, 32, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.text('Procopio Company', 14, 14);

        doc.setFontSize(11);
        doc.text('Sistema Integral de Gestión Agrícola', 14, 22);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text(config.titulo, 14, 45);

        doc.setFontSize(10);
        doc.text(config.descripcion, 14, 53);
        doc.text(`Fecha de generación: ${fecha}`, 14, 60);
        doc.text(`Total de registros: ${totalRegistros}`, 14, 67);

        autoTable(doc, {
            startY: 78,
            head: [config.columnas],
            body: datos.map(config.mapear),
            theme: 'striped',
            headStyles: {
                fillColor: [22, 101, 52],
                textColor: 255,
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [240, 253, 244]
            }
        });

        const paginas = doc.internal.getNumberOfPages();

        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text(
                `Página ${i} de ${paginas}`,
                170,
                287
            );
        }

        doc.save(`${config.titulo} - Procopio Company.pdf`);
    };

    const exportarExcel = () => {
        const config = configuraciones[tipoReporte];

        const datosExcel = datos.map((item) => {
            const fila = {};
            const valores = config.mapear(item);

            config.columnas.forEach((columna, index) => {
                fila[columna] = valores[index];
            });

            return fila;
        });

        const worksheet = XLSX.utils.json_to_sheet(datosExcel);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            config.titulo
        );

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        const data = new Blob(
            [excelBuffer],
            {
                type:
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            }
        );

        saveAs(
            data,
            `${config.titulo}.xlsx`
        );
    };

    const configActual = configuraciones[tipoReporte];

    const totalMonetario = datos.reduce((total, item) => {
        if (item.total) return total + Number(item.total);
        if (item.precio && item.stock) return total + (Number(item.precio) * Number(item.stock));
        return total;
    }, 0);

    return (
        <MainLayout>

            <div className="mb-10">
                <div className="relative overflow-hidden rounded-[2.2rem] p-8 md:p-10 bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_28%)]" />

                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-5">
                            📄 Centro de reportes
                        </span>

                        <h1 className="text-4xl md:text-6xl font-black text-white">
                            Reportes
                        </h1>

                        <p className="text-green-50/90 mt-3 max-w-3xl text-lg">
                            Consulta, visualiza y exporta información operativa del invernadero en PDF y Excel.
                        </p>
                    </div>
                </div>
            </div>

            <div className="card-pro card-hover p-8 mb-10">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    <div>
                        <h2 className="text-3xl font-black text-green-900 dark:text-white">
                            Seleccionar reporte
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300">
                            Elige el tipo de información que deseas consultar.
                        </p>
                    </div>

                    <select
                        value={tipoReporte}
                        onChange={(e) => setTipoReporte(e.target.value)}
                        className="input-pro w-full xl:w-[420px]"
                    >
                        <option value="inventario">Inventario general</option>
                        <option value="ventasDia">Ventas por día</option>
                        <option value="ventasSemana">Ventas por semana</option>
                        <option value="ventasMes">Ventas por mes</option>
                        <option value="topEspecies">Top especies vendidas</option>
                        <option value="stockCritico">Stock crítico</option>
                        <option value="plagasSeveridad">Plagas por severidad</option>
                    </select>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <div className={`rounded-[2rem] p-7 bg-gradient-to-br ${configActual.color} text-white shadow-xl`}>
                    <div className="text-3xl mb-4 text-white/90">
                        {configActual.icono}
                    </div>

                    <p className="text-white/80 font-semibold">
                        Reporte activo
                    </p>

                    <p className="text-2xl font-black mt-2">
                        {configActual.titulo}
                    </p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-xl">
                    <FaClipboardList className="text-3xl mb-4 text-white/90" />

                    <p className="text-white/80 font-semibold">
                        Registros
                    </p>

                    <p className="text-4xl font-black mt-2">
                        {datos.length}
                    </p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-yellow-600 to-orange-500 text-white shadow-xl">
                    <FaTable className="text-3xl mb-4 text-white/90" />

                    <p className="text-white/80 font-semibold">
                        Total calculado
                    </p>

                    <p className="text-4xl font-black mt-2">
                        ${totalMonetario.toFixed(2)}
                    </p>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                <div className="card-pro card-hover p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl">
                            <FaFilePdf />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black dark:text-white">
                                Exportar PDF
                            </h2>

                            <p className="text-gray-500 dark:text-gray-300">
                                Documento listo para impresión o entrega.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={exportarPDF}
                        className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-6 py-4 rounded-2xl font-black shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                    >
                        <FaDownload />
                        Descargar PDF
                    </button>
                </div>

                <div className="card-pro card-hover p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-2xl">
                            <FaFileExcel />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black dark:text-white">
                                Exportar Excel
                            </h2>

                            <p className="text-gray-500 dark:text-gray-300">
                                Archivo editable para análisis externo.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={exportarExcel}
                        className="btn-primary w-full flex items-center justify-center gap-3"
                    >
                        <FaDownload />
                        Descargar Excel
                    </button>
                </div>

            </div>

            <div className="card-pro card-hover p-8 overflow-hidden">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-green-900 dark:text-white">
                            Vista previa
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300">
                            {configActual.descripcion}
                        </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black">
                        {datos.length} registros
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {
                        datos.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-300">
                                No hay datos disponibles
                            </p>
                        ) : (
                            datos.map((item, index) => {
                                const valores = configActual.mapear(item);

                                return (
                                    <div
                                        key={index}
                                        className="bg-white/80 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] p-5 shadow-lg"
                                    >
                                        {
                                            configActual.columnas.map((columna, i) => (
                                                <div
                                                    key={columna}
                                                    className="flex justify-between gap-4 border-b border-gray-100 dark:border-gray-700 py-2 last:border-b-0"
                                                >
                                                    <span className="font-black dark:text-white">
                                                        {columna}
                                                    </span>

                                                    <span className="text-right text-gray-600 dark:text-gray-300">
                                                        {valores[i]}
                                                    </span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                );
                            })
                        )
                    }
                </div>

                <div className="hidden lg:block overflow-x-auto rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                    <table className="w-full min-w-[700px]">

                        <thead className="bg-green-800 text-white">
                            <tr>
                                {
                                    configActual.columnas.map((columna) => (
                                        <th
                                            key={columna}
                                            className="p-4 text-left"
                                        >
                                            {columna}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>

                        <tbody className="bg-white/70 dark:bg-slate-900/70">
                            {
                                datos.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={configActual.columnas.length}
                                            className="p-6 text-center text-gray-500 dark:text-gray-300"
                                        >
                                            No hay datos disponibles
                                        </td>
                                    </tr>
                                ) : (
                                    datos.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-slate-100 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            {
                                                configActual.mapear(item).map((valor, i) => (
                                                    <td
                                                        key={i}
                                                        className="p-4 dark:text-gray-200 font-semibold"
                                                    >
                                                        {valor}
                                                    </td>
                                                ))
                                            }
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

export default Reportes;