import { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

import {
    FaLeaf,
    FaBug,
    FaShoppingCart,
    FaChartBar
} from 'react-icons/fa';

import { MdDashboard } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { FaHistory } from 'react-icons/fa';

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
        <aside className="
            w-full
            lg:w-[270px]
            lg:min-h-screen
            bg-gradient-to-b
            from-green-900
            to-green-700
            text-white
            p-5
            lg:p-6
            shadow-2xl
        ">

            <div className="mb-8 lg:mb-12">
                <h1 className="text-3xl lg:text-4xl font-extrabold flex items-center gap-3">
                    🌱 Procopio
                </h1>

                <p className="text-green-200 mt-2">
                    Green Management System
                </p>
            </div>

            <nav className="
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-1
                gap-3
            ">

                <Link to="/dashboard" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300">
                    <MdDashboard size={22} />
                    Dashboard
                </Link>

                <Link to="/especies" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300">
                    <FaLeaf size={20} />
                    Especies
                </Link>

                <Link to="/ventas" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300">
                    <FaShoppingCart size={20} />
                    Ventas
                </Link>

                <Link to="/plagas" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300">
                    <FaBug size={20} />
                    Plagas
                </Link>

                <Link to="/reportes" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300">
                    <FaChartBar size={20} />
                    Reportes
                </Link>
                
                <Link to="/historial" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-green-600 transition-all duration-300">
                    <FaHistory size={20} />
                    Historial
                </Link>

            </nav>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mt-8">

                <button
                    onClick={toggleDarkMode}
                    className="
                        w-full
                        bg-gray-800
                        hover:bg-black
                        text-white
                        p-3
                        rounded-2xl
                        font-semibold
                    "
                >
                    {darkMode ? '☀️ Modo claro' : '🌙 Modo oscuro'}
                </button>

                <button
                    onClick={cerrarSesion}
                    className="
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

        </aside>
    );
}

export default Sidebar;