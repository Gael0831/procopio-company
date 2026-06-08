import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { useEffect, useState } from 'react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function Reportes() {

    const [tipoReporte, setTipoReporte] = useState('inventario');
    const [datos, setDatos] = useState([]);

    const configuraciones = {
        inventario: {
            titulo: 'Inventario general',
            endpoint: '/especies',
            columnas: ['Nombre', 'Nombre científico', 'Precio', 'Stock', 'Stock mínimo'],
            mapear: (item) => [
                item.nombre,
                item.nombre_cientifico,
                `$${item.precio}`,
                item.stock,
                item.stock_minimo
            ]
        },
        ventasDia: {
            titulo: 'Ventas por día',
            endpoint: '/reportes/ventas-dia',
            columnas: ['Día', 'Total'],
            mapear: (item) => [
                item.periodo,
                `$${item.total}`
            ]
        },
        ventasSemana: {
            titulo: 'Ventas por semana',
            endpoint: '/reportes/ventas-semana',
            columnas: ['Semana', 'Total'],
            mapear: (item) => [
                item.periodo,
                `$${item.total}`
            ]
        },
        ventasMes: {
            titulo: 'Ventas por mes',
            endpoint: '/reportes/ventas-mes',
            columnas: ['Mes', 'Total'],
            mapear: (item) => [
                item.periodo,
                `$${item.total}`
            ]
        },
        topEspecies: {
            titulo: 'Top especies vendidas',
            endpoint: '/reportes/top-especies',
            columnas: ['Especie', 'Cantidad vendida', 'Total generado'],
            mapear: (item) => [
                item.nombre,
                item.cantidad_vendida,
                `$${item.total_generado}`
            ]
        },
        stockCritico: {
            titulo: 'Stock crítico',
            endpoint: '/reportes/stock-critico',
            columnas: ['Nombre', 'Stock', 'Stock mínimo'],
            mapear: (item) => [
                item.nombre,
                item.stock,
                item.stock_minimo
            ]
        },
        plagasSeveridad: {
            titulo: 'Plagas por severidad',
            endpoint: '/reportes/plagas-severidad',
            columnas: ['Severidad', 'Total'],
            mapear: (item) => [
                item.severidad,
                item.total
            ]
        }
    };

    const obtenerReporte = async () => {
        const config = configuraciones[tipoReporte];

        const respuesta = await API.get(config.endpoint);

        setDatos(respuesta.data);
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

        doc.setFontSize(18);

        doc.text(
            `${config.titulo} - Procopio Company`,
            14,
            20
        );

        autoTable(doc, {
            startY: 35,
            head: [config.columnas],
            body: datos.map(config.mapear)
        });

        doc.save(`${config.titulo}.pdf`);
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

    return (
        <MainLayout>

            <div className="flex justify-between items-center mb-10">

                <div>
                    <h1 className="text-5xl font-bold text-green-800 dark:text-green-300">
                        Reportes 📄
                    </h1>

                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                        Consulta y exportación de información del invernadero
                    </p>
                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl mb-10">

                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                    Seleccionar reporte
                </h2>

                <select
                    value={tipoReporte}
                    onChange={(e) => setTipoReporte(e.target.value)}
                    className="w-full md:w-[400px] border p-3 rounded-xl"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

                    <h2 className="text-2xl font-bold mb-6 dark:text-white">
                        Exportar PDF
                    </h2>

                    <p className="text-gray-500 dark:text-gray-300 mb-6">
                        Descargar el reporte seleccionado en PDF.
                    </p>

                    <button
                        onClick={exportarPDF}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold"
                    >
                        Descargar PDF
                    </button>

                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

                    <h2 className="text-2xl font-bold mb-6 dark:text-white">
                        Exportar Excel
                    </h2>

                    <p className="text-gray-500 dark:text-gray-300 mb-6">
                        Descargar el reporte seleccionado en Excel.
                    </p>

                    <button
                        onClick={exportarExcel}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold"
                    >
                        Descargar Excel
                    </button>

                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                    Vista previa: {configActual.titulo}
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">

                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                {
                                    configActual.columnas.map((columna) => (
                                        <th
                                            key={columna}
                                            className="p-4 text-left dark:text-white"
                                        >
                                            {columna}
                                        </th>
                                    ))
                                }
                            </tr>
                        </thead>

                        <tbody>
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
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            {
                                                configActual.mapear(item).map((valor, i) => (
                                                    <td
                                                        key={i}
                                                        className="p-4 dark:text-gray-200"
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
    )
}

export default Reportes;