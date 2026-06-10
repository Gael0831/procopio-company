import { useContext } from 'react';
import { DarkModeContext } from '../context/DarkModeContext';

import {
    FaLeaf,
    FaBug,
    FaShoppingCart,
    FaChartBar,
    FaHistory,
    FaSignOutAlt
} from 'react-icons/fa';

import { MdDashboard } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        darkMode,
        toggleDarkMode
    } = useContext(DarkModeContext);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/');
    };

    const menu = [
        {
            ruta: '/dashboard',
            texto: 'Dashboard',
            icono: <MdDashboard size={22} />
        },
        {
            ruta: '/especies',
            texto: 'Especies',
            icono: <FaLeaf size={20} />
        },
        {
            ruta: '/ventas',
            texto: 'Ventas',
            icono: <FaShoppingCart size={20} />
        },
        {
            ruta: '/plagas',
            texto: 'Plagas',
            icono: <FaBug size={20} />
        },
        {
            ruta: '/reportes',
            texto: 'Reportes',
            icono: <FaChartBar size={20} />
        },
        {
            ruta: '/historial',
            texto: 'Historial',
            icono: <FaHistory size={20} />
        }
    ];

    const itemMenu = (item) => {
        const activo = location.pathname === item.ruta;

        return (
            <Link
                key={item.ruta}
                to={item.ruta}
                className={`
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    p-4
                    rounded-2xl
                    font-semibold
                    transition-all
                    duration-300
                    overflow-hidden
                    ${
                        activo
                            ? 'bg-white text-green-800 shadow-xl shadow-black/20'
                            : 'text-green-50 hover:bg-white/15 hover:translate-x-1'
                    }
                `}
            >
                <span
                    className={`
                        flex
                        items-center
                        justify-center
                        w-10
                        h-10
                        rounded-xl
                        transition-all
                        duration-300
                        ${
                            activo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-white/10 text-white group-hover:bg-white/20'
                        }
                    `}
                >
                    {item.icono}
                </span>

                <span className="truncate">
                    {item.texto}
                </span>

                {
                    activo && (
                        <span className="
                            absolute
                            right-3
                            w-2
                            h-2
                            rounded-full
                            bg-green-500
                            shadow-[0_0_18px_rgba(34,197,94,0.9)]
                        " />
                    )
                }
            </Link>
        );
    };

    return (
        <aside className="
            w-full
            lg:w-[290px]
            lg:min-h-screen
            relative
            overflow-hidden
            text-white
            p-4
            lg:p-6
            bg-gradient-to-br
            from-emerald-950
            via-green-900
            to-lime-800
            shadow-[0_25px_80px_rgba(0,0,0,0.35)]
        ">

            <div className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(132,204,22,0.25),transparent_32%)]
                pointer-events-none
            " />

            <div className="
                absolute
                inset-0
                opacity-20
                bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)]
                bg-[size:38px_38px]
                pointer-events-none
            " />

            <div className="relative z-10">

                <div className="
                    mb-8
                    lg:mb-10
                    bg-white/10
                    border
                    border-white/15
                    rounded-[2rem]
                    p-5
                    backdrop-blur-xl
                    shadow-xl
                ">
                    <div className="flex items-center gap-4">

                        <div className="
                        w-14 h-14
                        rounded-2xl
                        bg-gradient-to-br
                        from-green-400
                        to-emerald-600
                        flex
                        items-center
                        justify-center
                        text-3xl
                        shadow-lg
                        ">
                        🌱
                        </div>

                        <div>
                            <h1 className="text-2xl lg:text-3xl font-extrabold leading-tight">
                                Procopio
                            </h1>

                            <p className="text-green-100 text-sm">
                                Company
                            </p>
                        </div>

                    </div>

                    <div className="
                        mt-5
                        pt-4
                        border-t
                        border-white/15
                    ">
                        <p className="text-sm text-green-100">
                            Sistema Integral de Gestión Agrícola
                        </p>

                        <div className="flex items-center gap-2 mt-3">
                            <span className="w-2 h-2 rounded-full bg-lime-300 shadow-[0_0_12px_rgba(190,242,100,0.9)]" />
                            <span className="text-xs text-green-100">
                                Sistema activo
                            </span>
                        </div>
                    </div>
                </div>

                <nav className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-1
                    gap-3
                ">
                    {
                        menu.map((item) => itemMenu(item))
                    }
                </nav>

                <div className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-1
                    gap-4
                    mt-8
                ">

                    <button
                        onClick={toggleDarkMode}
                        className="
                            w-full
                            bg-white/12
                            hover:bg-white/20
                            border
                            border-white/15
                            backdrop-blur-xl
                            text-white
                            p-4
                            rounded-2xl
                            font-bold
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            shadow-lg
                        "
                    >
                        {darkMode ? '☀️ Modo claro' : '🌙 Modo oscuro'}
                    </button>

                    <button
                        onClick={cerrarSesion}
                        className="
                            w-full
                            bg-gradient-to-r
                            from-red-500
                            to-rose-500
                            hover:from-red-600
                            hover:to-rose-600
                            p-4
                            rounded-2xl
                            font-bold
                            shadow-lg
                            transition-all
                            duration-300
                            hover:-translate-y-0.5
                            flex
                            items-center
                            justify-center
                            gap-3
                        "
                    >
                        <FaSignOutAlt />
                        Cerrar sesión
                    </button>

                </div>

                <div className="
                    hidden
                    lg:block
                    mt-10
                    text-xs
                    text-green-100/80
                    text-center
                ">
                    Versión 1.0 · Procopio Company
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;