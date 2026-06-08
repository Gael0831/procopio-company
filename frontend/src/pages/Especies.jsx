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

        const respuesta = await API.get(
            '/especies'
        );

        setEspecies(respuesta.data);

    };

    useEffect(() => {
        const cargarEspecies = async () => {
            await obtenerEspecies();
        };

        cargarEspecies();
    }, []);

    const agregarEspecie = async () => {

    try {
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

            return;
        }
        if (Number(precio) <= 0) {

            Swal.fire({
                icon: 'warning',
                title: 'Precio inválido',
                text: 'El precio debe ser mayor a cero'
            });

            return;
        }
        if (Number(stock) < 0) {

            Swal.fire({
                icon: 'warning',
                title: 'Stock inválido',
                text: 'No puede ser negativo'
            });

            return;
        }
        if (Number(stockMinimo) < 0) {

            Swal.fire({
                icon: 'warning',
                title: 'Stock mínimo inválido',
                text: 'No puede ser negativo'
            });

            return;
        }

        const respuesta = await API.post(
            '/especies',
            {
                nombre,
                nombre_cientifico: nombreCientifico,
                precio,
                stock,
                stock_minimo: stockMinimo
            }
        );

        if(respuesta.data.success){

            Swal.fire({
                icon: 'success',
                title: 'Correcto',
                text: respuesta.data.mensaje
            });

            obtenerEspecies();

            setNombre('');
            setNombreCientifico('');
            setPrecio('');
            setStock('');
            setStockMinimo('');

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

        await API.delete(
            `/especies/${id}`
        );

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

    };
    const actualizarEspecie = async () => {

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

            return;
        }

        if (Number(precio) <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Precio inválido',
                text: 'El precio debe ser mayor a cero'
            });

            return;
        }

        if (Number(stock) < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Stock inválido',
                text: 'El stock no puede ser negativo'
            });

            return;
        }

        if (Number(stockMinimo) < 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Stock mínimo inválido',
                text: 'El stock mínimo no puede ser negativo'
            });

            return;
        }

        await API.put(
            `/especies/${idEditar}`,
            {
                nombre,
                nombre_cientifico: nombreCientifico,
                precio,
                stock,
                stock_minimo: stockMinimo
            }
        );

        Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: 'Especie actualizada'
        });

        setEditando(false);

        setIdEditar(null);

        setNombre('');
        setNombreCientifico('');
        setPrecio('');
        setStock('');
        setStockMinimo('');

        obtenerEspecies();

    };
    return (

        <MainLayout>

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-5xl font-bold text-green-800">
                        Especies 🌱
                    </h1>

                    <p className="text-gray-500 mt-2">
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
                            w-[350px]
                            shadow-sm
                        "
                    />

                </div>

            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl mb-10">

                <h2 className="text-2xl font-bold mb-6">
                    Nueva especie
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

                <button
                    onClick={
                        editando
                        ? actualizarEspecie
                        : agregarEspecie
                    }
                    className="
                        mt-6
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        px-6
                        py-3
                        rounded-2xl
                    "
                >
                    {
                        editando
                        ? 'Actualizar especie'
                        : 'Agregar especie'
                    }
                </button>

            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">

                <h2 className="text-2xl font-bold mb-6">
                    Lista de especies
                </h2>

                <table className="w-full min-w-[800px]">

                    <thead>

                        <tr className="border-b">

                            <th className="p-4 text-left">Nombre</th>
                            <th className="p-4 text-left">Nombre científico</th>
                            <th className="p-4 text-left">Precio</th>
                            <th className="p-4 text-left">Stock</th>
                            <th className="p-4 text-left">Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            especies
                            .filter((especie) =>
                                especie.nombre
                                .toLowerCase()
                                .includes(busqueda.toLowerCase()))
                            .map((especie) => (

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

                                        {
                                            especie.stock <= especie.stock_minimo
                                            ? (
                                                <span className="
                                                    bg-red-100
                                                    text-red-600
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    font-semibold
                                                ">
                                                    {especie.stock} ⚠️
                                                </span>
                                            )
                                            : (
                                                <span className="
                                                    bg-green-100
                                                    text-green-700
                                                    px-3
                                                    py-1
                                                    rounded-full
                                                    font-semibold
                                                ">
                                                    {especie.stock}
                                                </span>
                                            )
                                        }

                                    </td>

                                    <td className="p-4">

                                        <button
                                            onClick={() =>
                                                eliminarEspecie(
                                                    especie.id_especie
                                                )
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            onClick={() => cargarDatosEditar(especie)}
                                            className="
                                                bg-blue-500
                                                hover:bg-blue-600
                                                text-white
                                                px-4
                                                py-2
                                                rounded-xl
                                                mr-2
                                            "
                                        >
                                            Editar
                                        </button>

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

export default Especies