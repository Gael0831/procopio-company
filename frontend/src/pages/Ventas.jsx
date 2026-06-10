import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { FaShoppingCart, FaSyncAlt, FaReceipt, FaBoxOpen, FaDollarSign } from 'react-icons/fa';

function Ventas() {
    const [especies, setEspecies] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [mostrarTicket, setMostrarTicket] = useState(false);
    const [ticketData, setTicketData] = useState(null);
    const [idEspecie, setIdEspecie] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [filtro, setFiltro] = useState('mes');

    const especieSeleccionada = especies.find(
        especie => especie.id_especie === Number(idEspecie)
    );

    const precio = especieSeleccionada ? Number(especieSeleccionada.precio) : 0;
    const subtotal = cantidad ? precio * Number(cantidad) : 0;

    const obtenerEspecies = async () => {
        const respuesta = await API.get('/especies');
        setEspecies(respuesta.data);
    };

    const obtenerVentas = async () => {
        try {
            const respuesta = await API.get('/ventas');
            setVentas(respuesta.data);
        } catch (error) {
            console.log(error);
            setVentas([]);
        }
    };

    const cargarDatos = async () => {
        await obtenerEspecies();
        await obtenerVentas();
    };

    useEffect(() => {
        cargarDatos();

        const intervalo = setInterval(() => {
            cargarDatos();
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

    const actualizarManual = async () => {
        await cargarDatos();

        Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'La información se actualizó correctamente',
            timer: 1200,
            showConfirmButton: false
        });
    };

    const formatearFechaVenta = (fecha) => {
        if (!fecha) return 'Sin fecha';

        const fechaNormalizada = String(fecha).replace(' ', 'T');

        return new Date(fechaNormalizada).toLocaleString('es-MX', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
    };

    const ventasFiltradas = ventas.filter((venta) => {
        if (filtro === 'todas') return true;

        const fechaVenta = new Date(String(venta.fecha).replace(' ', 'T'));
        const hoy = new Date();

        if (filtro === 'dia') return fechaVenta.toDateString() === hoy.toDateString();

        if (filtro === 'semana') {
            const inicioSemana = new Date(hoy);
            inicioSemana.setDate(hoy.getDate() - hoy.getDay());
            inicioSemana.setHours(0, 0, 0, 0);
            return fechaVenta >= inicioSemana;
        }

        if (filtro === 'mes') {
            return (
                fechaVenta.getMonth() === hoy.getMonth() &&
                fechaVenta.getFullYear() === hoy.getFullYear()
            );
        }

        if (filtro === 'seisMeses') {
            const seisMesesAtras = new Date(hoy);
            seisMesesAtras.setMonth(hoy.getMonth() - 6);
            seisMesesAtras.setHours(0, 0, 0, 0);
            return fechaVenta >= seisMesesAtras;
        }

        if (filtro === 'anio') return fechaVenta.getFullYear() === hoy.getFullYear();

        return true;
    });

    const totalFiltrado = ventasFiltradas.reduce(
        (total, venta) => total + Number(venta.total),
        0
    );

    const productosVendidos = ventasFiltradas.reduce(
        (total, venta) => total + Number(venta.cantidad),
        0
    );

    const registrarVenta = async () => {
        if (!idEspecie) {
            Swal.fire({
                icon: 'warning',
                title: 'Especie requerida',
                text: 'Selecciona una especie'
            });
            return;
        }

        if (!cantidad || Number(cantidad) <= 0 || !Number.isInteger(Number(cantidad))) {
            Swal.fire({
                icon: 'warning',
                title: 'Cantidad inválida',
                text: 'La cantidad debe ser un número entero mayor a cero'
            });
            return;
        }

        if (Number(cantidad) > Number(especieSeleccionada.stock)) {
            Swal.fire({
                icon: 'warning',
                title: 'Stock insuficiente',
                text: 'No puedes vender más productos de los disponibles'
            });
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('usuario'));

        const respuesta = await API.post('/ventas', {
            id_especie: idEspecie,
            cantidad,
            precio,
            id_usuario: usuario?.id_usuario || 1
        });

        if (respuesta.data.success) {
            Swal.fire({
                icon: 'success',
                title: 'Venta registrada',
                text: `Total: $${respuesta.data.total}`
            });

            setTicketData({
                folio: respuesta.data.id_venta,
                especie: especieSeleccionada.nombre,
                cantidad,
                precio,
                subtotal,
                fecha: respuesta.data.fecha
                    ? new Date(respuesta.data.fecha).toLocaleString('es-MX')
                    : new Date().toLocaleString('es-MX')
            });

            setMostrarTicket(true);
            setIdEspecie('');
            setCantidad('');
            cargarDatos();

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: respuesta.data.mensaje
            });
        }
    };

    const botonFiltro = (valor, texto) => (
        <button
            onClick={() => setFiltro(valor)}
            className={
                filtro === valor
                    ? 'bg-gradient-to-r from-green-700 to-emerald-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg shadow-green-700/25'
                    : 'bg-white/80 dark:bg-slate-800 text-green-700 dark:text-green-300 border border-green-100 dark:border-slate-700 hover:bg-green-50 px-4 py-2 rounded-2xl font-bold transition-all'
            }
        >
            {texto}
        </button>
    );

    return (
        <MainLayout>

            <div className="mb-10">
                <div className="relative overflow-hidden rounded-[2.2rem] p-8 md:p-10 bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_28%)]" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-5">
                                🛒 Módulo comercial
                            </span>

                            <h1 className="text-4xl md:text-6xl font-black text-white">
                                Ventas
                            </h1>

                            <p className="text-green-50/90 mt-3 max-w-2xl text-lg">
                                Registro de ventas, control automático de inventario y consulta histórica por periodo.
                            </p>
                        </div>

                        <button
                            onClick={actualizarManual}
                            className="bg-white text-green-800 hover:bg-green-50 px-6 py-4 rounded-2xl font-black shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <FaSyncAlt />
                            Actualizar datos
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                <div className="card-pro card-hover p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-2xl">
                            <FaReceipt />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black dark:text-white">
                                Nueva venta
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Captura rápida de operación
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">

                        <select
                            value={idEspecie}
                            onChange={(e) => setIdEspecie(e.target.value)}
                            className="input-pro"
                        >
                            <option value="">Seleccionar especie</option>

                            {
                                especies.map((especie) => (
                                    <option
                                        key={especie.id_especie}
                                        value={especie.id_especie}
                                    >
                                        {especie.nombre} — Stock: {especie.stock}
                                    </option>
                                ))
                            }
                        </select>

                        <input
                            type="number"
                            placeholder="Cantidad"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            className="input-pro"
                        />

                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-[1.5rem] border border-green-100 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500 dark:text-gray-300 font-semibold">
                                    Precio unitario
                                </p>

                                <p className="font-black text-green-700 dark:text-green-300 text-xl">
                                    ${precio.toFixed(2)}
                                </p>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-green-200 dark:border-slate-600">
                                <p className="text-gray-500 dark:text-gray-300 font-semibold">
                                    Subtotal
                                </p>

                                <p className="font-black text-green-700 dark:text-green-300 text-3xl">
                                    ${subtotal.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={registrarVenta}
                            className="btn-primary w-full flex items-center justify-center gap-3"
                        >
                            <FaShoppingCart />
                            Registrar venta
                        </button>

                    </div>
                </div>

                <div className="xl:col-span-2 card-pro card-hover p-8 overflow-hidden">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

                        <div>
                            <h2 className="text-3xl font-black text-green-900 dark:text-white">
                                Historial de ventas
                            </h2>

                            <p className="text-gray-500 dark:text-gray-300">
                                Consulta movimientos filtrados por periodo.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {botonFiltro('dia', 'Hoy')}
                            {botonFiltro('semana', 'Semana')}
                            {botonFiltro('mes', 'Mes')}
                            {botonFiltro('seisMeses', '6 meses')}
                            {botonFiltro('anio', 'Año')}
                            {botonFiltro('todas', 'Todo')}
                        </div>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                        <div className="rounded-[1.7rem] p-6 bg-gradient-to-br from-green-700 to-emerald-500 text-white shadow-xl">
                            <FaReceipt className="text-3xl mb-4 text-white/90" />
                            <p className="text-white/80 font-semibold">Ventas encontradas</p>
                            <p className="text-4xl font-black mt-2">{ventasFiltradas.length}</p>
                        </div>

                        <div className="rounded-[1.7rem] p-6 bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-xl">
                            <FaBoxOpen className="text-3xl mb-4 text-white/90" />
                            <p className="text-white/80 font-semibold">Productos vendidos</p>
                            <p className="text-4xl font-black mt-2">{productosVendidos}</p>
                        </div>

                        <div className="rounded-[1.7rem] p-6 bg-gradient-to-br from-yellow-600 to-orange-500 text-white shadow-xl">
                            <FaDollarSign className="text-3xl mb-4 text-white/90" />
                            <p className="text-white/80 font-semibold">Total vendido</p>
                            <p className="text-4xl font-black mt-2">${totalFiltrado.toFixed(2)}</p>
                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                        {
                            ventasFiltradas.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-300">
                                    No hay ventas para este periodo
                                </p>
                            ) : (
                                ventasFiltradas.map((venta) => (
                                    <div
                                        key={venta.id_venta}
                                        className="bg-white/80 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] p-5 shadow-lg"
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                                    Folio #{venta.id_venta}
                                                </p>

                                                <h3 className="text-xl font-black dark:text-white">
                                                    {venta.especie}
                                                </h3>
                                            </div>

                                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-black">
                                                ${venta.total}
                                            </span>
                                        </div>

                                        <p className="mt-4 dark:text-gray-200">
                                            <span className="font-bold">Cantidad:</span> {venta.cantidad}
                                        </p>

                                        <p className="dark:text-gray-200">
                                            <span className="font-bold">Fecha:</span>{' '}
                                            {formatearFechaVenta(venta.fecha)}
                                        </p>
                                    </div>
                                ))
                            )
                        }
                    </div>

                    <div className="hidden lg:block overflow-x-auto rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                        <table className="w-full min-w-[800px]">

                            <thead className="bg-green-800 text-white">
                                <tr>
                                    <th className="p-4 text-left">Folio</th>
                                    <th className="p-4 text-left">Especie</th>
                                    <th className="p-4 text-left">Cantidad</th>
                                    <th className="p-4 text-left">Total</th>
                                    <th className="p-4 text-left">Fecha</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white/70 dark:bg-slate-900/70">
                                {
                                    ventasFiltradas.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="p-6 text-center text-gray-500 dark:text-gray-300">
                                                No hay ventas para este periodo
                                            </td>
                                        </tr>
                                    ) : (
                                        ventasFiltradas.map((venta) => (
                                            <tr
                                                key={venta.id_venta}
                                                className="border-b border-slate-100 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-slate-800 transition-all"
                                            >
                                                <td className="p-4 dark:text-gray-200 font-bold">
                                                    #{venta.id_venta}
                                                </td>

                                                <td className="p-4 dark:text-gray-200 font-semibold">
                                                    {venta.especie}
                                                </td>

                                                <td className="p-4 dark:text-gray-200">
                                                    {venta.cantidad}
                                                </td>

                                                <td className="p-4 font-black text-green-700">
                                                    ${venta.total}
                                                </td>

                                                <td className="p-4 dark:text-gray-200">
                                                    {formatearFechaVenta(venta.fecha)}
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>

                        </table>
                    </div>
                </div>

            </div>

            {
                mostrarTicket && ticketData && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

                        <div className="bg-white dark:bg-slate-900 p-7 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-[460px] border border-white/20">

                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                                    🌱
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black text-green-700">
                                    Procopio Company
                                </h2>

                                <p className="text-gray-500 dark:text-gray-300 mt-2">
                                    Ticket de venta
                                </p>
                            </div>

                            <div className="space-y-4 text-base md:text-lg dark:text-gray-200 bg-green-50 dark:bg-slate-800 p-5 rounded-2xl">

                                <div className="flex justify-between">
                                    <span className="font-bold">Folio:</span>
                                    <span>#{ticketData.folio}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Especie:</span>
                                    <span>{ticketData.especie}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Cantidad:</span>
                                    <span>{ticketData.cantidad}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-bold">Precio:</span>
                                    <span>${ticketData.precio}</span>
                                </div>

                                <div className="flex justify-between border-t border-green-200 dark:border-slate-700 pt-4">
                                    <span className="font-bold">Total:</span>
                                    <span className="text-green-600 font-black text-2xl">
                                        ${ticketData.subtotal}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="font-bold">Fecha:</span>
                                    <span>{ticketData.fecha}</span>
                                </div>

                            </div>

                            <div className="flex gap-4 mt-8">

                                <button
                                    onClick={() => window.print()}
                                    className="flex-1 btn-primary"
                                >
                                    Imprimir
                                </button>

                                <button
                                    onClick={() => setMostrarTicket(false)}
                                    className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-3 rounded-2xl font-bold"
                                >
                                    Cerrar
                                </button>

                            </div>

                        </div>

                    </div>
                )
            }

        </MainLayout>
    );
}

export default Ventas;