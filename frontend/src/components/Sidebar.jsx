import {
    useContext
} from 'react';

import {
    DarkModeContext
} from '../context/DarkModeContext';

import {
    FaLeaf,
    FaBug,
    FaShoppingCart,
    FaChartBar
} from 'react-icons/fa';

import {
    MdDashboard
} from 'react-icons/md';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const {
        darkMode,
        toggleDarkMode
    } = useContext(DarkModeContext);

    const cerrarSesion = () => {

        localStorage.removeItem('token');

        localStorage.removeItem('usuario');

        navigate('/');

    };

    return (

        <div className="w-[270px] min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white p-6 shadow-2xl">

            <div className="mb-12">

                <h1 className="text-4xl font-extrabold flex items-center gap-3">
                    🌱 Procopio
                </h1>

                <p className="text-green-200 mt-2">
                    Green Management System
                </p>

            </div>

            <nav className="space-y-3">

                <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300"
                >
                    <MdDashboard size={22} />
                    Dashboard
                </Link>

                <Link
                    to="/especies"
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300"
                >
                    <FaLeaf size={20} />
                    Especies
                </Link>

                <Link
                    to="/ventas"
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300"
                >
                    <FaShoppingCart size={20} />
                    Ventas
                </Link>

                <Link
                    to="/plagas"
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300"
                >
                    <FaBug size={20} />
                    Plagas
                </Link>

                <Link
                    to="/reportes"
                    className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300"
                >
                    <FaChartBar size={20} />
                    Reportes
                </Link>

            </nav>
            <button
                onClick={toggleDarkMode}
                className="
                    mt-8
                    w-full
                    bg-gray-800
                    hover:bg-black
                    text-white
                    p-3
                    rounded-2xl
                    font-semibold
                "
            >
                {
                    darkMode
                    ? '☀️ Modo claro'
                    : '🌙 Modo oscuro'
                }
            </button>
            <button
                onClick={cerrarSesion}
                className="
                    mt-10
                    w-full
                    bg-red-500
                    hover:bg-red-600
                    p-3
                    rounded-2xl
                    font-semibold
                "
            >
                Cerrar sesión
            </button>

        </div>

    )
    
}

export default Sidebar