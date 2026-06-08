import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Especies() {

    const [especies, setEspecies] = useState([]);

    const [nombre, setNombre] = useState('');
    const [nombreCientifico, setNombreCientifico] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [stockMinimo, setStockMinimo] = useState('');
    const [editando, setEditando] = useState(false);
    const [idEditar, setIdEditar] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const obtenerEspecies = async () => {
        const respuesta = await API.get('/especies');
        setEspecies(respuesta.data);
    };

    useEffect(() => {
        const cargarEspecies = async () => {
            await obtenerEspecies();
        };

        cargarEspecies();

        const intervalo = setInterval(() => {
            cargarEspecies();
        }, 5000);

        return () => clearInterval(intervalo);
    }, []);

    const limpiarFormulario = () => {
        setNombre('');
        setNombreCientifico('');
        setPrecio('');
        setStock('');
        setStockMinimo('');
        setEditando(false);
        setIdEditar(null);
    };

    const validarFormulario = () => {
        if (
            !nombre.trim() ||
            !nombreCientifico.trim() ||
            !precio ||
            !stock ||
            !stockMinimo
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Todos los campos son obligatorios'
            });

            return false;
        }

        if (Number(precio) <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Precio inválido',
                text: 'El precio debe ser mayor a cero'
            });

            return false;
        }

        if (Number(stock) < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Stock inválido',
                text: 'El stock no puede ser negativo'
            });

            return false;
        }

        if (Number(stockMinimo) < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Stock mínimo inválido',
                text: 'El stock mínimo no puede ser negativo'
            });

            return false;
        }

        return true;
    };

    const agregarEspecie = async () => {
        try {
            if (!validarFormulario()) return;

            const respuesta = await API.post('/especies', {
                nombre,
                nombre_cientifico: nombreCientifico,
                precio,
                stock,
                stock_minimo: stockMinimo
            });

            if (respuesta.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Correcto',
                    text: respuesta.data.mensaje
                });

                await obtenerEspecies();
                limpiarFormulario();
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.mensaje || 'No se pudo agregar'
            });
        }
    };

    const eliminarEspecie = async (id) => {
        const confirmacion = await Swal.fire({
            icon: 'warning',
            title: '¿Eliminar especie?',
            text: 'Esta acción no se puede deshacer',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacion.isConfirmed) return;

        await API.delete(`/especies/${id}`);

        Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'Especie eliminada'
        });

        obtenerEspecies();
    };

    const cargarDatosEditar = (especie) => {
        setEditando(true);
        setIdEditar(especie.id_especie);
        setNombre(especie.nombre);
        setNombreCientifico(especie.nombre_cientifico);
        setPrecio(especie.precio);
        setStock(especie.stock);
        setStockMinimo(especie.stock_minimo);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const actualizarEspecie = async () => {
        if (!validarFormulario()) return;

        await API.put(`/especies/${idEditar}`, {
            nombre,
            nombre_cientifico: nombreCientifico,
            precio,
            stock,
            stock_minimo: stockMinimo
        });

        Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Especie actualizada'
        });

        limpiarFormulario();
        obtenerEspecies();
    };

    const especiesFiltradas = especies.filter((especie) =>
        especie.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        especie.nombre_cientifico.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <MainLayout>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-white">
                        Especies 🌱
                    </h1>

                    <p className="text-gray-500 dark:text-gray-300 mt-2">
                        Gestión de inventario vegetal
                    </p>

                    <input
                        type="text"
                        placeholder="Buscar especie..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="
                            mt-6
                            border
                            p-3
                            rounded-2xl
                            w-full
                            md:w-[350px]
                            shadow-sm
                        "
                    />
                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl mb-10">

                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                    {editando ? 'Editar especie' : 'Nueva especie'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="border p-3 rounded-xl"
                    />

                    <input
                        type="text"
                        placeholder="Nombre científico"
                        value={nombreCientifico}
                        onChange={(e) => setNombreCientifico(e.target.value)}
                        className="border p-3 rounded-xl"
                    />

                    <input
                        type="number"
                        placeholder="Precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="border p-3 rounded-xl"
                    />

                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="border p-3 rounded-xl"
                    />

                    <input
                        type="number"
                        placeholder="Stock mínimo"
                        value={stockMinimo}
                        onChange={(e) => setStockMinimo(e.target.value)}
                        className="border p-3 rounded-xl"
                    />

                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">

                    <button
                        onClick={editando ? actualizarEspecie : agregarEspecie}
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
                        {editando ? 'Actualizar especie' : 'Agregar especie'}
                    </button>

                    {
                        editando && (
                            <button
                                onClick={limpiarFormulario}
                                className="
                                    bg-gray-500
                                    hover:bg-gray-600
                                    text-white
                                    px-6
                                    py-3
                                    rounded-2xl
                                    font-semibold
                                "
                            >
                                Cancelar edición
                            </button>
                        )
                    }

                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-3xl shadow-xl overflow-hidden">

                <h2 className="text-2xl font-bold mb-6 dark:text-white">
                    Lista de especies
                </h2>

                <div className="grid grid-cols-1 gap-4 lg:hidden">
                    {
                        especiesFiltradas.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-300">
                                No hay especies registradas
                            </p>
                        ) : (
                            especiesFiltradas.map((especie) => (
                                <div
                                    key={especie.id_especie}
                                    className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm"
                                >
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold dark:text-white">
                                                {especie.nombre}
                                            </h3>

                                            <p className="text-gray-500 dark:text-gray-300">
                                                {especie.nombre_cientifico}
                                            </p>
                                        </div>

                                        {
                                            especie.stock <= especie.stock_minimo ? (
                                                <span className="h-fit bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                                                    {especie.stock} ⚠️
                                                </span>
                                            ) : (
                                                <span className="h-fit bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                                    {especie.stock}
                                                </span>
                                            )
                                        }
                                    </div>

                                    <p className="mt-4 dark:text-gray-200">
                                        <span className="font-semibold">Precio:</span> ${especie.precio}
                                    </p>

                                    <p className="dark:text-gray-200">
                                        <span className="font-semibold">Stock mínimo:</span> {especie.stock_minimo}
                                    </p>

                                    <div className="flex gap-2 mt-5">
                                        <button
                                            onClick={() => cargarDatosEditar(especie)}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => eliminarEspecie(especie.id_especie)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>

                <div className="hidden lg:block overflow-x-auto w-full">
                    <table className="w-full min-w-[900px]">

                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="p-4 text-left dark:text-white">Nombre</th>
                                <th className="p-4 text-left dark:text-white">Nombre científico</th>
                                <th className="p-4 text-left dark:text-white">Precio</th>
                                <th className="p-4 text-left dark:text-white">Stock</th>
                                <th className="p-4 text-left dark:text-white">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                especiesFiltradas.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="p-6 text-center text-gray-500 dark:text-gray-300"
                                        >
                                            No hay especies registradas
                                        </td>
                                    </tr>
                                ) : (
                                    especiesFiltradas.map((especie) => (
                                        <tr
                                            key={especie.id_especie}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <td className="p-4 dark:text-gray-200">
                                                {especie.nombre}
                                            </td>

                                            <td className="p-4 dark:text-gray-200">
                                                {especie.nombre_cientifico}
                                            </td>

                                            <td className="p-4 dark:text-gray-200">
                                                ${especie.precio}
                                            </td>

                                            <td className="p-4">
                                                {
                                                    especie.stock <= especie.stock_minimo ? (
                                                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-semibold">
                                                            {especie.stock} ⚠️
                                                        </span>
                                                    ) : (
                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                                                            {especie.stock}
                                                        </span>
                                                    )
                                                }
                                            </td>

                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => cargarDatosEditar(especie)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                                                    >
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() => eliminarEspecie(especie.id_especie)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
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

export default Especies;