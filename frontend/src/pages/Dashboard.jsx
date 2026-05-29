import MainLayout from '../layouts/MainLayout';
import { useEffect, useState } from 'react';
import API from '../api/axios';

import {
    FaLeaf,
    FaShoppingCart,
    FaBug
} from 'react-icons/fa';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

function Dashboard() {

    const [resumen, setResumen] = useState({
        total_ventas: 0,
        inventario_critico: 0,
        plagas_altas: 0,
        total_especies: 0
    });

    const [ventasData, setVentasData] = useState([]);

    const obtenerResumen = async () => {
        const respuesta = await API.get(
            '/dashboard/resumen'
        );

        setResumen(respuesta.data);
    };

    const obtenerVentasMes = async () => {
        const respuesta = await API.get(
            '/dashboard/ventas-mes'
        );

        setVentasData(respuesta.data);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            await obtenerResumen();
            await obtenerVentasMes();
        };

        cargarDatos();
    }, []);

    return (
        <MainLayout>

            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-5xl font-bold text-green-800 dark:text-white">
                        Dashboard 🌱
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Estadísticas reales del sistema Procopio Company
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                    <p className="font-semibold">
                        Administrador
                    </p>

                    <p className="text-gray-500 text-sm">
                        admin@procopio.com
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Ventas totales
                            </h2>

                            <p className="text-4xl mt-4 text-green-600 font-bold">
                                ${Number(resumen.total_ventas).toFixed(2)}
                            </p>
                        </div>

                        <FaShoppingCart size={50} className="text-green-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Stock crítico
                            </h2>

                            <p className="text-4xl mt-4 text-yellow-500 font-bold">
                                {resumen.inventario_critico}
                            </p>
                        </div>

                        <FaLeaf size={50} className="text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Plagas altas
                            </h2>

                            <p className="text-4xl mt-4 text-red-500 font-bold">
                                {resumen.plagas_altas}
                            </p>
                        </div>

                        <FaBug size={50} className="text-red-500" />
                    </div>
                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-green-800 dark:text-white">
                    Ventas por mes
                </h2>

                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ventasData}>
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="ventas"
                                fill="#16a34a"
                                radius={[12, 12, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </MainLayout>
    );
}

export default Dashboard;