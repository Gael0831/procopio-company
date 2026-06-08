import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const cargarPlagas = async () => {
            await obtenerPlagas();
        };

        cargarPlagas();

        const intervalo = setInterval(() => {
            cargarPlagas();
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

    const limpiarFormulario = () => {
        setSeccion('');
        setTipoPlaga('');
        setSeveridad('');
        setFecha('');
        setDescripcion('');
    };

    const colorSeveridad = (valor) => {
        if (valor === 'Alta') {
            return 'bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold';
        }

        if (valor === 'Media') {
            return 'bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-semibold';
        }

        return 'bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold';
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
        const fechaRegistro = new Date(fecha);

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

    return (
        <MainLayout>

            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-white">
                    Control de Plagas 🐛
                </h1>

                <p className="text-gray-500 dark:text-gray-300 mt-2">
                    Registro y seguimiento de incidencias en el invernadero
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">
                        Nueva incidencia
                    </h2>

                    <div className="space-y-4">

                        <select
                            value={seccion}
                            onChange={(e) => setSeccion(e.target.value)}
                            className="w-full border p-3 rounded-xl"
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
                            className="w-full border p-3 rounded-xl"
                        />

                        <select
                            value={severidad}
                            onChange={(e) => setSeveridad(e.target.value)}
                            className="w-full border p-3 rounded-xl"
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
                            className="w-full border p-3 rounded-xl"
                        />

                        <textarea
                            placeholder="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full border p-3 rounded-xl min-h-[120px]"
                        />

                        <p className="text-sm text-gray-500 dark:text-gray-300">
                            {descripcion.length}/500 caracteres
                        </p>

                        <button
                            onClick={guardarIncidencia}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl font-semibold"
                        >
                            Guardar incidencia
                        </button>

                    </div>
                </div>

                <div className="xl:col-span-2 bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl overflow-hidden">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">
                        Historial de incidencias
                    </h2>

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
                                        className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm"
                                    >
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-300">
                                                    {plaga.seccion}
                                                </p>

                                                <h3 className="text-xl font-bold dark:text-white">
                                                    {plaga.tipo_plaga}
                                                </h3>
                                            </div>

                                            <span className={colorSeveridad(plaga.severidad)}>
                                                {plaga.severidad}
                                            </span>
                                        </div>

                                        <p className="mt-4 dark:text-gray-200">
                                            <span className="font-semibold">Fecha:</span>{' '}
                                            {new Date(plaga.fecha).toLocaleDateString()}
                                        </p>

                                        {
                                            plaga.descripcion && (
                                                <p className="mt-2 text-gray-600 dark:text-gray-300">
                                                    {plaga.descripcion}
                                                </p>
                                            )
                                        }

                                        <button
                                            onClick={() => eliminarIncidencia(plaga.id_plaga)}
                                            className="mt-5 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                ))
                            )
                        }
                    </div>

                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full min-w-[850px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="p-3 text-left dark:text-white">Sección</th>
                                    <th className="p-3 text-left dark:text-white">Plaga</th>
                                    <th className="p-3 text-left dark:text-white">Severidad</th>
                                    <th className="p-3 text-left dark:text-white">Fecha</th>
                                    <th className="p-3 text-left dark:text-white">Acción</th>
                                </tr>
                            </thead>

                            <tbody>
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
                                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="p-3 dark:text-gray-200">
                                                    {plaga.seccion}
                                                </td>

                                                <td className="p-3 dark:text-gray-200">
                                                    {plaga.tipo_plaga}
                                                </td>

                                                <td className="p-3">
                                                    <span className={colorSeveridad(plaga.severidad)}>
                                                        {plaga.severidad}
                                                    </span>
                                                </td>

                                                <td className="p-3 dark:text-gray-200">
                                                    {new Date(plaga.fecha).toLocaleDateString()}
                                                </td>

                                                <td className="p-3">
                                                    <button
                                                        onClick={() => eliminarIncidencia(plaga.id_plaga)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                                    >
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