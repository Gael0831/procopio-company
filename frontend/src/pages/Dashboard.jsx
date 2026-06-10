import MainLayout from '../layouts/MainLayout';
import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    FaLeaf,
    FaShoppingCart,
    FaBug,
    FaCalendarCheck,
    FaBoxOpen,
    FaDollarSign
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
        ventas_encontradas: 0,
        productos_vendidos: 0
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
        const respuesta = await API.get('/ventas');
        const ventas = respuesta.data;

        const hoy = new Date();

        const ventasFiltradas = ventas.filter((venta) => {
            const fechaVenta = new Date(String(venta.fecha).replace(' ', 'T'));

            if (periodo === 'hoy') {
                return fechaVenta.toDateString() === hoy.toDateString();
            }

            if (periodo === 'semana') {
                const inicioSemana = new Date(hoy);
                inicioSemana.setDate(hoy.getDate() - hoy.getDay());
                inicioSemana.setHours(0, 0, 0, 0);

                return fechaVenta >= inicioSemana;
            }

            if (periodo === 'mes') {
                return (
                    fechaVenta.getMonth() === hoy.getMonth() &&
                    fechaVenta.getFullYear() === hoy.getFullYear()
                );
            }

            if (periodo === 'anio') {
                return fechaVenta.getFullYear() === hoy.getFullYear();
            }

            return true;
        });

        const totalVentas = ventasFiltradas.reduce(
            (total, venta) => total + Number(venta.total),
            0
        );

        const productosVendidos = ventasFiltradas.reduce(
            (total, venta) => total + Number(venta.cantidad),
            0
        );

        setResumenPeriodo({
            total_ventas: totalVentas,
            ventas_encontradas: ventasFiltradas.length,
            productos_vendidos: productosVendidos
        });
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
                    ? 'bg-gradient-to-r from-green-700 to-emerald-500 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-green-700/25 transition-all'
                    : 'bg-white/80 dark:bg-slate-800 text-green-700 dark:text-green-300 border border-green-100 dark:border-slate-700 hover:border-green-400 hover:bg-green-50 dark:hover:bg-slate-700 px-5 py-2.5 rounded-2xl font-bold transition-all'
            }
        >
            {texto}
        </button>
    );

    const tarjetaPeriodo = (titulo, valor, icono, color, ruta = '/ventas') => (
        <div
            onClick={() => navigate(ruta)}
            className={`
                group
                relative
                overflow-hidden
                rounded-[2rem]
                p-7
                cursor-pointer
                transition-all
                duration-300
                hover:-translate-y-1
                shadow-xl
                ${color}
            `}
        >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all" />

            <div className="relative z-10 flex justify-between items-start gap-4">
                <div>
                    <p className="text-white/80 font-semibold">
                        {titulo}
                    </p>

                    <p className="text-4xl font-black text-white mt-3">
                        {valor}
                    </p>

                    <p className="text-sm text-white/75 mt-3">
                        Clic para consultar detalle
                    </p>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl">
                    {icono}
                </div>
            </div>
        </div>
    );

    const tarjetaResumen = (titulo, valor, descripcion, icono, color, ruta) => (
        <div
            onClick={() => navigate(ruta)}
            className="card-pro card-hover p-8 cursor-pointer group relative overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 ${color}`} />

            <div className="relative z-10 flex justify-between items-center gap-4">
                <div>
                    <p className="text-gray-500 dark:text-gray-300 font-semibold">
                        {titulo}
                    </p>

                    <p className="text-4xl mt-4 font-black dark:text-white">
                        {valor}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                        {descripcion}
                    </p>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl group-hover:scale-110 transition-all">
                    {icono}
                </div>
            </div>
        </div>
    );

    return (
        <MainLayout>

            <div className="mb-10">
                <div className="relative overflow-hidden rounded-[2.2rem] p-8 md:p-10 bg-[linear-gradient(rgba(6,78,59,.78),rgba(20,83,45,.86)),url('/procopio-bg.png')] bg-cover bg-center shadow-2xl">

                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_28%)]" />

                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                        <div>
                            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-5">
                                🌱 Panel administrativo
                            </span>

                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                Dashboard Procopio
                            </h1>

                            <p className="text-green-50/90 mt-4 max-w-2xl text-lg">
                                Monitorea ventas, inventario crítico, plagas y desempeño general del invernadero en tiempo real.
                            </p>
                        </div>

                        <div className="bg-white/15 border border-white/20 backdrop-blur-xl rounded-[2rem] p-6 min-w-[260px]">
                            <p className="text-white/70 text-sm">
                                Sesión activa
                            </p>

                            <p className="font-black text-white text-xl mt-1">
                                Administrador
                            </p>

                            <p className="text-green-100 text-sm mt-1">
                                admin@procopio.com
                            </p>

                            <div className="flex items-center gap-2 mt-4">
                                <span className="w-2 h-2 rounded-full bg-lime-300 shadow-[0_0_14px_rgba(190,242,100,.9)]" />
                                <span className="text-green-100 text-sm">
                                    Sistema operativo
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="card-pro card-hover p-8 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>
                    <span className="inline-flex bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300 px-4 py-1.5 rounded-full text-sm font-bold mb-3">
                        Gestión administrativa
                    </span>

                    <h2 className="text-2xl font-black text-green-800 dark:text-white">
                        Cierre mensual
                    </h2>

                    <p className="text-gray-500 dark:text-gray-300 mt-1">
                        Guarda el resumen del mes actual en el historial administrativo sin eliminar los datos.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => navigate('/historial')}
                        className="btn-primary"
                    >
                        📚 Ver historial
                    </button>

                    <button
                        onClick={cerrarMes}
                        className="btn-danger"
                    >
                        🔒 Cerrar mes
                    </button>
                </div>

            </div>

            <div className="card-pro card-hover p-8 mb-10">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    <div>
                        <span className="inline-flex bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300 px-4 py-1.5 rounded-full text-sm font-bold mb-3">
                            Resumen operativo
                        </span>

                        <h2 className="text-3xl font-black text-green-900 dark:text-white">
                            Resumen por periodo
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300 mt-1">
                            Consulta ventas, productos vendidos y operaciones registradas.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {botonPeriodo('hoy', 'Hoy')}
                        {botonPeriodo('semana', 'Semana')}
                        {botonPeriodo('mes', 'Mes')}
                        {botonPeriodo('anio', 'Año')}
                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

                    {tarjetaPeriodo(
                        'Operaciones registradas',
                        resumenPeriodo.ventas_encontradas,
                        <FaCalendarCheck />,
                        'bg-gradient-to-br from-green-700 to-emerald-500'
                    )}

                    {tarjetaPeriodo(
                        'Productos vendidos',
                        resumenPeriodo.productos_vendidos,
                        <FaBoxOpen />,
                        'bg-gradient-to-br from-blue-700 to-cyan-500'
                    )}

                    {tarjetaPeriodo(
                        'Ingresos del periodo',
                        `$${Number(resumenPeriodo.total_ventas).toFixed(2)}`,
                        <FaDollarSign />,
                        'bg-gradient-to-br from-yellow-600 to-orange-500'
                    )}

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">

                {tarjetaResumen(
                    'Ingresos a cumulados',
                    `$${Number(resumen.total_ventas).toFixed(2)}`,
                    'Clic para consultar ventas',
                    <FaShoppingCart className="text-green-500" />,
                    'bg-green-500',
                    '/ventas'
                )}

                {tarjetaResumen(
                    'Inventario en alerta',
                    resumen.inventario_critico,
                    'Clic para ver inventario',
                    <FaLeaf className="text-yellow-500" />,
                    'bg-yellow-400',
                    '/especies'
                )}

                {tarjetaResumen(
                    'Incidencias críticas',
                    resumen.plagas_altas,
                    'Clic para ver incidencias',
                    <FaBug className="text-red-500" />,
                    'bg-red-500',
                    '/plagas'
                )}

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

                <div className="card-pro card-hover p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-green-800 dark:text-white">
                                Últimas ventas
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Movimientos recientes
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/ventas')}
                            className="text-green-600 font-bold hover:underline"
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
                                        className="flex items-center justify-between gap-4 bg-green-50/70 dark:bg-slate-800 p-4 rounded-2xl"
                                    >
                                        <div>
                                            <p className="font-black dark:text-white">
                                                {venta.especie}
                                            </p>

                                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                                Cantidad: {venta.cantidad}
                                            </p>
                                        </div>

                                        <p className="text-green-600 font-black">
                                            ${venta.total}
                                        </p>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>

                <div className="card-pro card-hover p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
                                Stock crítico
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Inventario bajo
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/especies')}
                            className="text-yellow-600 font-bold hover:underline"
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
                                        className="bg-yellow-50/80 dark:bg-slate-800 p-4 rounded-2xl"
                                    >
                                        <p className="font-black dark:text-white">
                                            {especie.nombre}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                                            Stock: {especie.stock} / Mínimo: {especie.stock_minimo}
                                        </p>
                                    </div>
                                ))
                            )
                        }
                    </div>
                </div>

                <div className="card-pro card-hover p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-red-600 dark:text-red-400">
                                Plagas recientes
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Incidencias registradas
                            </p>
                        </div>

                        <button
                            onClick={() => navigate('/plagas')}
                            className="text-red-600 font-bold hover:underline"
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
                                        className="bg-red-50/80 dark:bg-slate-800 p-4 rounded-2xl"
                                    >
                                        <p className="font-black dark:text-white">
                                            {plaga.tipo_plaga}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-300">
                                            {plaga.seccion}
                                        </p>

                                        <span
                                            className={
                                                plaga.severidad === 'Alta'
                                                    ? 'inline-block mt-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold'
                                                    : plaga.severidad === 'Media'
                                                    ? 'inline-block mt-2 bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold'
                                                    : 'inline-block mt-2 bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-bold'
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
                className="card-pro card-hover p-8 cursor-pointer hover:scale-[1.01] transition-all"
            >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-3xl font-black text-green-800 dark:text-white">
                            Ventas por mes
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300">
                            Comparativa mensual de ingresos registrados.
                        </p>
                    </div>

                    <p className="text-green-600 font-bold">
                        Clic para generar reportes →
                    </p>
                </div>

                <div className="w-full min-w-0 h-[350px] min-h-[350px]">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={ventasData}>
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <defs>
                                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={1}/>
                                    <stop offset="95%" stopColor="#166534" stopOpacity={1}/>
                                </linearGradient>
                            </defs>
                            <Bar
                                dataKey="ventas"
                                fill="url(#colorVentas)"
                                radius={[16,16,0,0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </MainLayout>
    );
}

export default Dashboard;