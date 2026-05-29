import MainLayout from '../layouts/MainLayout';

import API from '../api/axios';

import { useEffect, useState } from 'react';

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

function Reportes() {

    const [especies, setEspecies] = useState([]);

    const obtenerEspecies = async () => {

        const respuesta = await API.get(
            '/especies'
        );

        setEspecies(respuesta.data);

    };

    useEffect(() => {

        obtenerEspecies();

    }, []);

    const exportarPDF = () => {

        const doc = new jsPDF();

        doc.setFontSize(20);

        doc.text(
            'Reporte de Inventario - Procopio Company',
            14,
            20
        );

        autoTable(doc, {

            startY: 35,

            head: [[
                'Nombre',
                'Nombre científico',
                'Precio',
                'Stock'
            ]],

            body: especies.map((especie) => ([
                especie.nombre,
                especie.nombre_cientifico,
                `$${especie.precio}`,
                especie.stock
            ]))

        });

        doc.save('reporte_inventario.pdf');

    };

    const exportarExcel = () => {

        const datos = especies.map((especie) => ({
            Nombre: especie.nombre,
            Cientifico: especie.nombre_cientifico,
            Precio: especie.precio,
            Stock: especie.stock
        }));

        const worksheet = XLSX.utils.json_to_sheet(datos);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            'Inventario'
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
            'reporte_inventario.xlsx'
        );

    };

    return (

        <MainLayout>

            <div className="flex justify-between items-center mb-10">

                <div>

                    <h1 className="text-5xl font-bold text-green-800">
                        Reportes 📄
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Exportación de inventario y estadísticas
                    </p>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

                    <h2 className="text-2xl font-bold mb-6">
                        Exportar PDF
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Descargar reporte completo de inventario en PDF.
                    </p>

                    <button
                        onClick={exportarPDF}
                        className="
                            bg-red-500
                            hover:bg-red-600
                            text-white
                            px-6
                            py-3
                            rounded-2xl
                            font-semibold
                        "
                    >
                        Descargar PDF
                    </button>

                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

                    <h2 className="text-2xl font-bold mb-6">
                        Exportar Excel
                    </h2>

                    <p className="text-gray-500 mb-6">
                        Descargar reporte completo en Excel.
                    </p>

                    <button
                        onClick={exportarExcel}
                        className="
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            px-6
                            py-3
                            rounded-2xl
                            font-semibold
                        "
                    >
                        Descargar Excel
                    </button>

                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

                <h2 className="text-2xl font-bold mb-6">
                    Vista previa de inventario
                </h2>

                <table className="w-full min-w-[800px]">

                    <thead>

                        <tr className="border-b">

                            <th className="p-4 text-left">
                                Nombre
                            </th>

                            <th className="p-4 text-left">
                                Científico
                            </th>

                            <th className="p-4 text-left">
                                Precio
                            </th>

                            <th className="p-4 text-left">
                                Stock
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            especies.map((especie) => (

                                <tr
                                    key={especie.id_especie}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-4">
                                        {especie.nombre}
                                    </td>

                                    <td className="p-4">
                                        {especie.nombre_cientifico}
                                    </td>

                                    <td className="p-4">
                                        ${especie.precio}
                                    </td>

                                    <td className="p-4">
                                        {especie.stock}
                                    </td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </MainLayout>

    )
}

export default Reportes