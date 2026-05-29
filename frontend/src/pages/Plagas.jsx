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
        obtenerPlagas();
    }, []);

    const guardarIncidencia = async () => {
        if (!seccion || !tipoPlaga || !severidad || !fecha) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Completa los campos principales'
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

        setSeccion('');
        setTipoPlaga('');
        setSeveridad('');
        setFecha('');
        setDescripcion('');

        obtenerPlagas();
    };

    const eliminarIncidencia = async (id) => {
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
                <h1 className="text-5xl font-bold text-green-800">
                    Control de Plagas 🐛
                </h1>

                <p className="text-gray-500 mt-2">
                    Registro y seguimiento de incidencias en el invernadero
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-6">
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
                            className="w-full border p-3 rounded-xl"
                        />

                        <button
                            onClick={guardarIncidencia}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl font-semibold"
                        >
                            Guardar incidencia
                        </button>

                    </div>
                </div>

                <div className="col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-6">
                        Historial de incidencias
                    </h2>

                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3 text-left">Sección</th>
                                <th className="p-3 text-left">Plaga</th>
                                <th className="p-3 text-left">Severidad</th>
                                <th className="p-3 text-left">Fecha</th>
                                <th className="p-3 text-left">Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                plagas.map((plaga) => (
                                    <tr key={plaga.id_plaga} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{plaga.seccion}</td>
                                        <td className="p-3">{plaga.tipo_plaga}</td>

                                        <td className="p-3">
                                            <span className={
                                                plaga.severidad === 'Alta'
                                                    ? 'bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold'
                                                    : plaga.severidad === 'Media'
                                                    ? 'bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-semibold'
                                                    : 'bg-green-100 text-green-600 px-3 py-1 rounded-full font-semibold'
                                            }>
                                                {plaga.severidad}
                                            </span>
                                        </td>

                                        <td className="p-3">
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
                            }
                        </tbody>
                    </table>
                </div>

            </div>

        </MainLayout>
    );
}

export default Plagas;