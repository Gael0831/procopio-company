import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import {
    FaLeaf,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaBoxOpen,
    FaDollarSign,
    FaExclamationTriangle
} from 'react-icons/fa';

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

    const especiesCriticas = especies.filter((especie) =>
        Number(especie.stock) <= Number(especie.stock_minimo)
    ).length;

    const valorInventario = especies.reduce(
        (total, especie) => total + (Number(especie.precio) * Number(especie.stock)),
        0
    );

    const stockBadge = (especie) => {
        if (Number(especie.stock) <= Number(especie.stock_minimo)) {
            return (
                <span className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full font-black">
                    <FaExclamationTriangle />
                    Stock bajo: {especie.stock}
                </span>
            );
        }

        return (
            <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full font-black">
                Disponible: {especie.stock}
            </span>
        );
    };

    return (
        <MainLayout>

            <div className="mb-10">
                <div className="relative overflow-hidden rounded-[2.2rem] p-8 md:p-10 bg-gradient-to-r from-green-900 via-emerald-800 to-lime-700 shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_28%)]" />

                    <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-bold mb-5">
                                🌱 Inventario vegetal
                            </span>

                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                Especies
                            </h1>

                            <p className="text-green-50/90 mt-4 max-w-2xl text-lg">
                                Administra plantas, precios, existencias y alertas de stock mínimo del invernadero.
                            </p>
                        </div>

                        <div className="relative w-full xl:w-[380px]">
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type="text"
                                placeholder="Buscar especie..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full bg-white text-green-900 pl-14 pr-5 py-4 rounded-2xl font-semibold outline-none shadow-xl focus:ring-4 focus:ring-white/30"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-green-700 to-emerald-500 text-white shadow-xl">
                    <FaLeaf className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">
                        Especies registradas
                    </p>
                    <p className="text-4xl font-black mt-2">
                        {especies.length}
                    </p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-yellow-600 to-orange-500 text-white shadow-xl">
                    <FaExclamationTriangle className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">
                        Stock crítico
                    </p>
                    <p className="text-4xl font-black mt-2">
                        {especiesCriticas}
                    </p>
                </div>

                <div className="rounded-[2rem] p-7 bg-gradient-to-br from-blue-700 to-cyan-500 text-white shadow-xl">
                    <FaDollarSign className="text-3xl mb-4 text-white/90" />
                    <p className="text-white/80 font-semibold">
                        Valor estimado
                    </p>
                    <p className="text-4xl font-black mt-2">
                        ${valorInventario.toFixed(2)}
                    </p>
                </div>

            </div>

            <div className="card-pro card-hover p-8 mb-10">

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center text-2xl">
                        {editando ? <FaEdit /> : <FaPlus />}
                    </div>

                    <div>
                        <h2 className="text-3xl font-black dark:text-white">
                            {editando ? 'Editar especie' : 'Nueva especie'}
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300">
                            {editando
                                ? 'Actualiza la información seleccionada del inventario.'
                                : 'Registra una nueva planta dentro del sistema.'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="input-pro"
                    />

                    <input
                        type="text"
                        placeholder="Nombre científico"
                        value={nombreCientifico}
                        onChange={(e) => setNombreCientifico(e.target.value)}
                        className="input-pro"
                    />

                    <input
                        type="number"
                        placeholder="Precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        className="input-pro"
                    />

                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="input-pro"
                    />

                    <input
                        type="number"
                        placeholder="Stock mínimo"
                        value={stockMinimo}
                        onChange={(e) => setStockMinimo(e.target.value)}
                        className="input-pro"
                    />

                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">

                    <button
                        onClick={editando ? actualizarEspecie : agregarEspecie}
                        className="btn-primary flex items-center justify-center gap-3"
                    >
                        {editando ? <FaEdit /> : <FaPlus />}
                        {editando ? 'Actualizar especie' : 'Agregar especie'}
                    </button>

                    {
                        editando && (
                            <button
                                onClick={limpiarFormulario}
                                className="bg-slate-500 hover:bg-slate-600 text-white px-6 py-3 rounded-2xl font-bold transition-all"
                            >
                                Cancelar edición
                            </button>
                        )
                    }

                </div>

            </div>

            <div className="card-pro card-hover p-8 overflow-hidden">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-green-900 dark:text-white">
                            Lista de especies
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300">
                            Consulta, edita o elimina registros del inventario.
                        </p>
                    </div>

                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-black">
                        {especiesFiltradas.length} resultados
                    </span>
                </div>

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
                                    className="bg-white/80 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] p-5 shadow-lg"
                                >
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-black dark:text-white">
                                                {especie.nombre}
                                            </h3>

                                            <p className="text-gray-500 dark:text-gray-300 italic">
                                                {especie.nombre_cientifico}
                                            </p>
                                        </div>

                                        {stockBadge(especie)}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-5">
                                        <div className="bg-green-50 dark:bg-slate-700 p-4 rounded-2xl">
                                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                                Precio
                                            </p>

                                            <p className="font-black text-green-700 dark:text-green-300">
                                                ${especie.precio}
                                            </p>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-slate-700 p-4 rounded-2xl">
                                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                                Stock mínimo
                                            </p>

                                            <p className="font-black text-yellow-600">
                                                {especie.stock_minimo}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-5">
                                        <button
                                            onClick={() => cargarDatosEditar(especie)}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                                        >
                                            <FaEdit />
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => eliminarEspecie(especie.id_especie)}
                                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                                        >
                                            <FaTrash />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>

                <div className="hidden lg:block overflow-x-auto w-full rounded-[1.5rem] border border-slate-100 dark:border-slate-700">
                    <table className="w-full min-w-[900px]">

                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="p-4 text-left">Nombre</th>
                                <th className="p-4 text-left">Nombre científico</th>
                                <th className="p-4 text-left">Precio</th>
                                <th className="p-4 text-left">Stock</th>
                                <th className="p-4 text-left">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white/70 dark:bg-slate-900/70">
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
                                            className="border-b border-slate-100 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-slate-800 transition-all"
                                        >
                                            <td className="p-4 dark:text-gray-200 font-black">
                                                {especie.nombre}
                                            </td>

                                            <td className="p-4 dark:text-gray-200 italic">
                                                {especie.nombre_cientifico}
                                            </td>

                                            <td className="p-4 dark:text-gray-200 font-bold">
                                                ${especie.precio}
                                            </td>

                                            <td className="p-4">
                                                {stockBadge(especie)}
                                            </td>

                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => cargarDatosEditar(especie)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                                    >
                                                        <FaEdit />
                                                        Editar
                                                    </button>

                                                    <button
                                                        onClick={() => eliminarEspecie(especie.id_especie)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
                                                    >
                                                        <FaTrash />
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