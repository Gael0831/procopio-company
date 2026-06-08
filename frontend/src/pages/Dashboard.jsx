import MainLayout from '../layouts/MainLayout';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

    const navigate = useNavigate();

    const [resumen, setResumen] = useState({
        total_ventas: 0,
        inventario_critico: 0,
        plagas_altas: 0,
        total_especies: 0
    });

    const [ventasData, setVentasData] = useState([]);
    const [periodo, setPeriodo] = useState('mes');

    const [resumenPeriodo, setResumenPeriodo] = useState({
        total_ventas: 0,
        total_operaciones: 0
    });

    const [ultimasVentas, setUltimasVentas] = useState([]);
    const [especiesCriticas, setEspeciesCriticas] = useState([]);
    const [plagasRecientes, setPlagasRecientes] = useState([]);

    const obtenerResumen = async () => {
        const respuesta = await API.get('/dashboard/resumen');
        setResumen(respuesta.data);
    };

    const obtenerVentasMes = async () => {
        const respuesta = await API.get('/dashboard/ventas-mes');
        setVentasData(respuesta.data);
    };

    const obtenerResumenPeriodo = async () => {
        const respuesta = await API.get(`/dashboard/resumen-periodo/${periodo}`);
        setResumenPeriodo(respuesta.data);
    };

    const obtenerUltimasVentas = async () => {
        const respuesta = await API.get('/dashboard/ultimas-ventas');
        setUltimasVentas(respuesta.data);
    };

    const obtenerEspeciesCriticas = async () => {
        const respuesta = await API.get('/dashboard/especies-criticas');
        setEspeciesCriticas(respuesta.data);
    };

    const obtenerPlagasRecientes = async () => {
        const respuesta = await API.get('/dashboard/plagas-recientes');
        setPlagasRecientes(respuesta.data);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            await obtenerResumen();
            await obtenerVentasMes();
            await obtenerUltimasVentas();
            await obtenerEspeciesCriticas();
            await obtenerPlagasRecientes();
        };

        cargarDatos();

        const intervalo = setInterval(() => {
            cargarDatos();
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        const cargarPeriodo = async () => {
            await obtenerResumenPeriodo();
        };

        cargarPeriodo();
    }, [periodo]);

    const cerrarMes = async () => {

        const confirmacion = await Swal.fire({
            icon: 'warning',
            title: '¿Cerrar mes?',
            text: 'Se guardará el resumen mensual en el historial. Los datos no se eliminarán.',
            showCancelButton: true,
            confirmButtonText: 'Sí, cerrar mes',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) {
            return;
        }

        try {
            const respuesta = await API.post('/cierres/cerrar-mes');

            if (respuesta.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Mes cerrado',
                    text: respuesta.data.mensaje
                });

                navigate('/historial');
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo cerrar',
                text: error.response?.data?.mensaje || 'Ocurrió un error'
            });
        }
    };

    const botonPeriodo = (valor, texto) => (
        <button
            onClick={() => setPeriodo(valor)}
            className={
                periodo === valor
                    ? 'bg-green-700 text-white px-5 py-2 rounded-xl font-semibold'
                    : 'bg-green-100 text-green-700 hover:bg-green-200 px-5 py-2 rounded-xl font-semibold'
            }
        >
            {texto}
        </button>
    );

    return (
        <MainLayout>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-10">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-white">
                        Dashboard 🌱
                    </h1>

                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                        Estadísticas reales del sistema Procopio Company
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                    <p className="font-semibold dark:text-white">
                        Administrador
                    </p>

                    <p className="text-gray-500 dark:text-gray-300 text-sm">
                        admin@procopio.com
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h2 className="text-2xl font-bold text-green-800 dark:text-white">
                        Cierre mensual
                    </h2>

                    <p className="text-gray-500 dark:text-gray-300 mt-1">
                        Guarda el resumen del mes actual en el historial administrativo.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate('/historial')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-semibold"
                    >
                        📚 Ver historial
                    </button>

                    <button
                        onClick={cerrarMes}
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-semibold"
                    >
                        🔒 Cerrar mes
                    </button>
                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl mb-10">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    <div>
                        <h2 className="text-2xl font-bold text-green-800 dark:text-white">
                            Resumen por periodo
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300 mt-1">
                            Consulta ventas y operaciones por día, semana, mes o año.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {botonPeriodo('hoy', 'Hoy')}
                        {botonPeriodo('semana', 'Semana')}
                        {botonPeriodo('mes', 'Mes')}
                        {botonPeriodo('anio', 'Año')}
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                    <div
                        onClick={() => navigate('/ventas')}
                        className="bg-green-50 dark:bg-gray-700 p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all"
                    >
                        <p className="text-gray-500 dark:text-gray-300">
                            Ventas del periodo
                        </p>

                        <p className="text-4xl font-bold text-green-600 mt-2">
                            ${Number(resumenPeriodo.total_ventas).toFixed(2)}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Clic para ver ventas
                        </p>
                    </div>

                    <div
                        onClick={() => navigate('/ventas')}
                        className="bg-blue-50 dark:bg-gray-700 p-6 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all"
                    >
                        <p className="text-gray-500 dark:text-gray-300">
                            Operaciones realizadas
                        </p>

                        <p className="text-4xl font-bold text-blue-600 mt-2">
                            {resumenPeriodo.total_operaciones}
                        </p>

                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                            Clic para ver historial
                        </p>
                    </div>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">

                <div
                    onClick={() => navigate('/ventas')}
                    className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white">
                                Ventas totales
                            </h2>

                            <p className="text-4xl mt-4 text-green-600 font-bold">
                                ${Number(resumen.total_ventas).toFixed(2)}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Clic para ver ventas
                            </p>
                        </div>

                        <FaShoppingCart size={50} className="text-green-500" />
                    </div>
                </div>

                <div
                    onClick={() => navigate('/especies')}
                    className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white">
                                Stock crítico
                            </h2>

                            <p className="text-4xl mt-4 text-yellow-500 font-bold">
                                {resumen.inventario_critico}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Clic para ver inventario
                            </p>
                        </div>

                        <FaLeaf size={50} className="text-yellow-500" />
                    </div>
                </div>

                <div
                    onClick={() => navigate('/plagas')}
                    className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold dark:text-white">
                                Plagas altas
                            </h2>

                            <p className="text-4xl mt-4 text-red-500 font-bold">
                                {resumen.plagas_altas}
                            </p>

                            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                                Clic para ver incidencias
                            </p>
                        </div>

                        <FaBug size={50} className="text-red-500" />
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-800 dark:text-white">
                            Últimas ventas
                        </h2>

                        <button
                            onClick={() => navigate('/ventas')}
                            className="text-green-600 font-semibold hover:underline"
                        >
                            Ver todas
                        </button>
                    </div>

                    <div className="space-y-4">
                        {
                            ultimasVentas.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-300">
                                    No hay ventas recientes
                                </p>
                            ) : (
                                ultimasVentas.map((venta) => (
                                    <div
                                        key={venta.id_venta}
                                        className="border-b border-gray-200 dark:border-gray-700 pb-3"
                                    >
                                        <p className="font-bold dark:text-white">
                                            {venta.especie}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Cantidad: {venta.cantidad}
                                        </p>

                                        <p className="text-green-600 font-semibold">
                                            ${venta.total}
                                        </p>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            Stock crítico
                        </h2>

                        <button
                            onClick={() => navigate('/especies')}
                            className="text-yellow-600 font-semibold hover:underline"
                        >
                            Ver inventario
                        </button>
                    </div>

                    <div className="space-y-4">
                        {
                            especiesCriticas.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-300">
                                    No hay especies en stock crítico
                                </p>
                            ) : (
                                especiesCriticas.map((especie, index) => (
                                    <div
                                        key={index}
                                        className="border-b border-gray-200 dark:border-gray-700 pb-3"
                                    >
                                        <p className="font-bold dark:text-white">
                                            {especie.nombre}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            Stock: {especie.stock} / Mínimo: {especie.stock_minimo}
                                        </p>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
                            Plagas recientes
                        </h2>

                        <button
                            onClick={() => navigate('/plagas')}
                            className="text-red-600 font-semibold hover:underline"
                        >
                            Ver incidencias
                        </button>
                    </div>

                    <div className="space-y-4">
                        {
                            plagasRecientes.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-300">
                                    No hay incidencias recientes
                                </p>
                            ) : (
                                plagasRecientes.map((plaga, index) => (
                                    <div
                                        key={index}
                                        className="border-b border-gray-200 dark:border-gray-700 pb-3"
                                    >
                                        <p className="font-bold dark:text-white">
                                            {plaga.tipo_plaga}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            {plaga.seccion}
                                        </p>

                                        <span
                                            className={
                                                plaga.severidad === 'Alta'
                                                    ? 'inline-block mt-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold'
                                                    : plaga.severidad === 'Media'
                                                    ? 'inline-block mt-2 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-semibold'
                                                    : 'inline-block mt-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold'
                                            }
                                        >
                                            {plaga.severidad}
                                        </span>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>

            </div>

            <div
                onClick={() => navigate('/reportes')}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl cursor-pointer hover:scale-[1.01] transition-all"
            >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-green-800 dark:text-white">
                        Ventas por mes
                    </h2>

                    <p className="text-green-600 font-semibold">
                        Clic para generar reportes
                    </p>
                </div>

                <div className="w-full min-w-0 h-[350px] min-h-[350px]">
                    <ResponsiveContainer width="100%" height={350}>
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