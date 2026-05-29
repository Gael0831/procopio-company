import MainLayout from '../layouts/MainLayout';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

function Ventas() {

    const [especies, setEspecies] = useState([]);
    const [ventas, setVentas] = useState([]);

    const [mostrarTicket, setMostrarTicket] = useState(false);
    const [ticketData, setTicketData] = useState(null);

    const [idEspecie, setIdEspecie] = useState('');
    const [cantidad, setCantidad] = useState('');

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
        const respuesta = await API.get('/ventas');
        setVentas(respuesta.data);
    };

    useEffect(() => {
        const cargarDatos = async () => {
            await obtenerEspecies();
            await obtenerVentas();
        };

        cargarDatos();
    }, []);
    const registrarVenta = async () => {
        if (!idEspecie || !cantidad) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Selecciona una especie y escribe la cantidad'
            });
            return;
        }

        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!idEspecie) {

            Swal.fire({
                icon: 'warning',
                title: 'Especie requerida',
                text: 'Selecciona una especie'
            });

            return;
        }
        if (!cantidad) {

            Swal.fire({
                icon: 'warning',
                title: 'Cantidad requerida',
                text: 'Ingresa una cantidad'
            });

            return;
        }
        if (Number(cantidad) <= 0) {

            Swal.fire({
                icon: 'warning',
                title: 'Cantidad inválida',
                text: 'Debe ser mayor a cero'
            });

            return;
        }

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
                fecha: new Date().toLocaleString()
            });

            setMostrarTicket(true);

            setIdEspecie('');
            setCantidad('');

            obtenerEspecies();
            obtenerVentas();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: respuesta.data.mensaje
            });
        }
    };

    return (
        <MainLayout>

            <div className="mb-8">
                <h1 className="text-5xl font-bold text-green-800">
                    Ventas 🛒
                </h1>

                <p className="text-gray-500 mt-2">
                    Registro de ventas y control automático de inventario
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                <div className="col-span-1 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-6">
                        Nueva venta
                    </h2>

                    <div className="space-y-4">

                        <select
                            value={idEspecie}
                            onChange={(e) => setIdEspecie(e.target.value)}
                            className="w-full border p-3 rounded-xl"
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
                            className="w-full border p-3 rounded-xl"
                        />

                        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl">
                            <p>
                                Precio unitario:
                                <span className="font-bold text-green-700">
                                    {' '}${precio}
                                </span>
                            </p>

                            <p className="mt-2">
                                Subtotal:
                                <span className="font-bold text-green-700">
                                    {' '}${subtotal}
                                </span>
                            </p>
                        </div>

                        <button
                            onClick={registrarVenta}
                            className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-2xl font-semibold"
                        >
                            Registrar venta
                        </button>

                    </div>
                </div>

                <div className="col-span-2 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl">
                    <h2 className="text-2xl font-bold mb-6">
                        Historial de ventas
                    </h2>

                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3 text-left">Folio</th>
                                <th className="p-3 text-left">Especie</th>
                                <th className="p-3 text-left">Cantidad</th>
                                <th className="p-3 text-left">Total</th>
                                <th className="p-3 text-left">Fecha</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                ventas.map((venta) => (
                                    <tr
                                        key={venta.id_venta}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3">
                                            #{venta.id_venta}
                                        </td>

                                        <td className="p-3">
                                            {venta.especie}
                                        </td>

                                        <td className="p-3">
                                            {venta.cantidad}
                                        </td>

                                        <td className="p-3 font-bold text-green-700">
                                            ${venta.total}
                                        </td>

                                        <td className="p-3">
                                            {new Date(venta.fecha).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>

            </div>
            {
                mostrarTicket && ticketData && (

                    <div className="
                        fixed
                        inset-0
                        bg-black/50
                        flex
                        items-center
                        justify-center
                        z-50
                    ">

                        <div className="
                            bg-white
                            dark:bg-gray-800
                            p-10
                            rounded-3xl
                            shadow-2xl
                            w-[450px]
                        ">

                            <div className="text-center mb-8">

                                <h2 className="
                                    text-4xl
                                    font-bold
                                    text-green-700
                                ">
                                    🌱 Procopio Company
                                </h2>

                                <p className="
                                    text-gray-500
                                    dark:text-gray-300
                                    mt-2
                                ">
                                    Ticket de venta
                                </p>

                            </div>

                            <div className="
                                space-y-4
                                text-lg
                            ">

                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        Folio:
                                    </span>

                                    <span>
                                        #{ticketData.folio}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        Especie:
                                    </span>

                                    <span>
                                        {ticketData.especie}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        Cantidad:
                                    </span>

                                    <span>
                                        {ticketData.cantidad}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        Precio:
                                    </span>

                                    <span>
                                        ${ticketData.precio}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        Total:
                                    </span>

                                    <span className="
                                        text-green-600
                                        font-bold
                                        text-2xl
                                    ">
                                        ${ticketData.subtotal}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        Fecha:
                                    </span>

                                    <span>
                                        {ticketData.fecha}
                                    </span>
                                </div>

                            </div>

                            <div className="
                                flex
                                gap-4
                                mt-10
                            ">

                                <button
                                    onClick={() => window.print()}
                                    className="
                                        flex-1
                                        bg-green-600
                                        hover:bg-green-700
                                        text-white
                                        py-3
                                        rounded-2xl
                                        font-semibold
                                    "
                                >
                                    Imprimir
                                </button>

                                <button
                                    onClick={() =>
                                        setMostrarTicket(false)
                                    }
                                    className="
                                        flex-1
                                        bg-gray-500
                                        hover:bg-gray-600
                                        text-white
                                        py-3
                                        rounded-2xl
                                        font-semibold
                                    "
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