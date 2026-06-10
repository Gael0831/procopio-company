import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

import {
    FaBug,
    FaSave,
    FaTrash,
    FaSyncAlt,
    FaExclamationTriangle,
    FaShieldAlt,
    FaCalendarAlt,
    FaMapMarkerAlt
} from 'react-icons/fa';

function Plagas() {

    const [plagas, setPlagas] = useState([]);

    const [seccion, setSeccion] = useState('');
    const [tipoPlaga, setTipoPlaga] = useState('');
    const [severidad, setSeveridad] = useState('');
    const [fecha, setFecha] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const obtenerPlagas = async () => {
        const respuesta = await API.get('/plagas');
        setPlagas(respuesta.data);
    };

    const cargarPlagas = async () => {
        await obtenerPlagas();
    };

    useEffect(() => {
        cargarPlagas();

        const intervalo = setInterval(() => {
            cargarPlagas();
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

    const actualizarManual = async () => {
        await cargarPlagas();

        Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'La información se actualizó correctamente',
            timer: 1200,
            showConfirmButton: false
        });
    };

    const limpiarFormulario = () => {
        setSeccion('');
        setTipoPlaga('');
        setSeveridad('');
        setFecha('');
        setDescripcion('');
    };

    const formatearFecha = (fechaPlaga) => {
        if (!fechaPlaga) return 'Sin fecha';

        const fechaLimpia = fechaPlaga.split('T')[0];

        return new Date(fechaLimpia + 'T00:00:00').toLocaleDateString('es-MX');
    };

    const colorSeveridad = (valor) => {
        if (valor === 'Alta') {
            return 'bg-red-100 text-red-600 px-3 py-1 rounded-full font-black';
        }

        if (valor === 'Media') {
            return 'bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-black';
        }

        return 'bg-green-100 text-green-600 px-3 py-1 rounded-full font-black';
    };

    const iconoSeveridad = (valor) => {
        if (valor === 'Alta') return <FaExclamationTriangle />;
        if (valor === 'Media') return <FaShieldAlt />;
        return <FaShieldAlt />;
    };

    const guardarIncidencia = async () => {
        if (!seccion || !tipoPlaga.trim() || !severidad || !fecha) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Completa los campos principales'
            });
            return;
        }

        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);

        const fechaRegistro = new Date(fecha + 'T00:00:00');

        if (fechaRegistro > fechaActual) {
            Swal.fire({
                icon: 'warning',
                title: 'Fecha inválida',
                text: 'La fecha no puede ser futura'
            });
            return;
        }

        if (descripcion.length > 500) {
            Swal.fire({
                icon: 'warning',
                title: 'Descripción demasiado larga',
                text: 'Máximo 500 caracteres'
            });

            return;
        }

        await API.post('/plagas', {
            seccion,
            tipo_plaga: tipoPlaga,
            severidad,
            fecha,
            descripcion
        });

        Swal.fire({
            icon: 'success',
            title: 'Guardado',
            text: 'Incidencia registrada correctamente'
        });

        limpiarFormulario();
        obtenerPlagas();
    };

    const eliminarIncidencia = async (id) => {
        const confirmacion = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar incidencia?',
            text: 'Esta acción no se puede deshacer',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        await API.delete(`/plagas/${id}`);

        Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Incidencia eliminada'
        });

        obtenerPlagas();
    };

    const totalAltas = plagas.filter((plaga) => plaga.severidad === 'Alta').length;
    const totalMedias = plagas.filter((plaga) => plaga.severidad === 'Media').length;
    const totalBajas = plagas.filter((plaga) => plaga.severidad === 'Baja').length;

    return (
        <MainLayout>

            <div className="mb-10">
                <div className="relative overflow-hidden rounded-[2.2rem] p-8 md:p-10 bg-gradient-to-r from-red-900 via-orange-800 to-yellow-700 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_28%)]" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-5">
                                🐛 Sanidad del invernadero
                            </span>

                            <h1 className="text-4xl md:text-6xl font-black text-white">
                                Control de Plagas
                            </h1>

                            <p className="text-orange-50/90 mt-3 max-w-2xl text-lg">
                                Registra, consulta y da seguimiento a incidencias fitosanitarias del invernadero.
                            </p>
                        </div>

                        <button
                            onClick={actualizarManual}
                            className="bg-white text-red-800 hover:bg-red-50 px-6 py-4 rounded-2xl font-black shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <FaSyncAlt />
                            Actualizar datos
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-red-700 to-rose-500 text-white shadow-xl">
                    <FaBug className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Incidencias</p>
                    <p className="text-4xl font-black mt-2">{plagas.length}</p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-xl">
                    <FaExclamationTriangle className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Severidad alta</p>
                    <p className="text-4xl font-black mt-2">{totalAltas}</p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-yellow-600 to-amber-400 text-white shadow-xl">
                    <FaShieldAlt className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Severidad media</p>
                    <p className="text-4xl font-black mt-2">{totalMedias}</p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-green-700 to-emerald-500 text-white shadow-xl">
                    <FaShieldAlt className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">Severidad baja</p>
                    <p className="text-4xl font-black mt-2">{totalBajas}</p>
                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                <div className="card-pro card-hover p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-2xl">
                            <FaBug />
                        </div>

                        <div>
                            <h2 className="text-2xl font-black dark:text-white">
                                Nueva incidencia
                            </h2>

                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Registro fitosanitario
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">

                        <select
                            value={seccion}
                            onChange={(e) => setSeccion(e.target.value)}
                            className="input-pro"
                        >
                            <option value="">Seleccionar sección</option>
                            <option value="Sección A">Sección A</option>
                            <option value="Sección B">Sección B</option>
                            <option value="Sección C">Sección C</option>
                            <option value="Área de Germinación">Área de Germinación</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Tipo de plaga"
                            value={tipoPlaga}
                            onChange={(e) => setTipoPlaga(e.target.value)}
                            className="input-pro"
                        />

                        <select
                            value={severidad}
                            onChange={(e) => setSeveridad(e.target.value)}
                            className="input-pro"
                        >
                            <option value="">Severidad</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>

                        <input
                            type="date"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            className="input-pro"
                        />

                        <textarea
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="input-pro min-h-[140px]"
                        />

                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-300">
                            <span>Máximo 500 caracteres</span>
                            <span className={descripcion.length > 450 ? 'text-red-500 font-bold' : 'font-semibold'}>
                                {descripcion.length}/500
                            </span>
                        </div>

                        <button
                            onClick={guardarIncidencia}
                            className="btn-primary w-full flex items-center justify-center gap-3"
                        >
                            <FaSave />
                            Guardar incidencia
                        </button>

                    </div>
                </div>

                <div className="xl:col-span-2 card-pro card-hover p-8 overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-red-800 dark:text-white">
                                Historial de incidencias
                            </h2>

                            <p className="text-gray-500 dark:text-gray-300">
                                Seguimiento de plagas registradas.
                            </p>
                        </div>

                        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-black">
                            {plagas.length} registros
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                        {
                            plagas.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-300">
                                    No hay incidencias registradas
                                </p>
                            ) : (
                                plagas.map((plaga) => (
                                    <div
                                        key={plaga.id_plaga}
                                        className="bg-white/80 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] p-5 shadow-lg"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-300 flex items-center gap-2">
                                                    <FaMapMarkerAlt />
                                                    {plaga.seccion}
                                                </p>

                                                <h3 className="text-xl font-black dark:text-white mt-1">
                                                    {plaga.tipo_plaga}
                                                </h3>
                                            </div>

                                            <span className={`${colorSeveridad(plaga.severidad)} inline-flex items-center gap-2`}>
                                                {iconoSeveridad(plaga.severidad)}
                                                {plaga.severidad}
                                            </span>
                                        </div>

                                        <p className="mt-4 dark:text-gray-200 flex items-center gap-2">
                                            <FaCalendarAlt className="text-red-500" />
                                            <span className="font-bold">Fecha:</span>{' '}
                                            {formatearFecha(plaga.fecha)}
                                        </p>

                                        {
                                            plaga.descripcion && (
                                                <p className="mt-3 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 p-4 rounded-2xl">
                                                    {plaga.descripcion}
                                                </p>
                                            )
                                        }

                                        <button
                                            onClick={() => eliminarIncidencia(plaga.id_plaga)}
                                            className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                                        >
                                            <FaTrash />
                                            Eliminar
                                        </button>
                                    </div>
                                ))
                            )
                        }
                    </div>

                    <div className="hidden lg:block overflow-x-auto rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                        <table className="w-full min-w-[850px]">
                            <thead className="bg-red-800 text-white">
                                <tr>
                                    <th className="p-4 text-left">Sección</th>
                                    <th className="p-4 text-left">Plaga</th>
                                    <th className="p-4 text-left">Severidad</th>
                                    <th className="p-4 text-left">Fecha</th>
                                    <th className="p-4 text-left">Acción</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white/70 dark:bg-slate-900/70">
                                {
                                    plagas.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="p-6 text-center text-gray-500 dark:text-gray-300"
                                            >
                                                No hay incidencias registradas
                                            </td>
                                        </tr>
                                    ) : (
                                        plagas.map((plaga) => (
                                            <tr
                                                key={plaga.id_plaga}
                                                className="border-b border-slate-100 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-slate-800 transition-all"
                                            >
                                                <td className="p-4 dark:text-gray-200 font-semibold">
                                                    {plaga.seccion}
                                                </td>

                                                <td className="p-4 dark:text-gray-200 font-black">
                                                    {plaga.tipo_plaga}
                                                </td>

                                                <td className="p-4">
                                                    <span className={`${colorSeveridad(plaga.severidad)} inline-flex items-center gap-2`}>
                                                        {iconoSeveridad(plaga.severidad)}
                                                        {plaga.severidad}
                                                    </span>
                                                </td>

                                                <td className="p-4 dark:text-gray-200">
                                                    {formatearFecha(plaga.fecha)}
                                                </td>

                                                <td className="p-4">
                                                    <button
                                                        onClick={() => eliminarIncidencia(plaga.id_plaga)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                                    >
                                                        <FaTrash />
                                                        Eliminar
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

            </div>

        </MainLayout>
    );
}

export default Plagas;