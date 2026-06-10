import { useState } from 'react';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

import {
    FaEnvelope,
    FaLock,
    FaLeaf,
    FaSignInAlt
} from 'react-icons/fa';

function Login() {

    const navigate = useNavigate();

    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const iniciarSesion = async () => {

        if (!correo.trim() || !password.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Debes ingresar correo y contraseña'
            });

            return;
        }

        try {
            const respuesta = await API.post('/usuarios/login', {
                correo,
                password
            });

            if (respuesta.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: respuesta.data.mensaje
                });

                localStorage.setItem('token', respuesta.data.token);

                localStorage.setItem(
                    'usuario',
                    JSON.stringify(respuesta.data.usuario)
                );

                navigate('/dashboard');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: respuesta.data.mensaje
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: error.response?.data?.mensaje || 'No se pudo conectar con el servidor'
            });
        }

    };

    const recuperarPassword = async () => {
        const resultado = await Swal.fire({
            title: 'Restablecer contraseña',
            html: `
                <input id="correoReset" class="swal2-input" placeholder="Correo electrónico">
                <input id="passwordReset" type="password" class="swal2-input" placeholder="Nueva contraseña">
                <input id="passwordConfirmar" type="password" class="swal2-input" placeholder="Confirmar contraseña">
            `,
            confirmButtonText: 'Actualizar contraseña',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#15803d',
            preConfirm: () => {
                const correoReset = document.getElementById('correoReset').value;
                const passwordReset = document.getElementById('passwordReset').value;
                const passwordConfirmar = document.getElementById('passwordConfirmar').value;

                if (!correoReset || !passwordReset || !passwordConfirmar) {
                    Swal.showValidationMessage('Todos los campos son obligatorios');
                    return false;
                }

                if (passwordReset.length < 6) {
                    Swal.showValidationMessage('La contraseña debe tener al menos 6 caracteres');
                    return false;
                }

                if (passwordReset !== passwordConfirmar) {
                    Swal.showValidationMessage('Las contraseñas no coinciden');
                    return false;
                }

                return {
                    correoReset,
                    passwordReset
                };
            }
        });

        if (!resultado.isConfirmed) return;

        try {
            const respuesta = await API.put('/usuarios/restablecer-password', {
                correo: resultado.value.correoReset,
                nuevaPassword: resultado.value.passwordReset
            });

            Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: respuesta.data.mensaje
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'No se pudo actualizar',
                text: error.response?.data?.mensaje || 'Ocurrió un error'
            });
        }
    };

    return (
        <div className="
            min-h-screen
            flex
            items-center
            justify-center
            p-4
            bg-gradient-to-br
            from-green-950
            via-slate-950
            to-black
        ">

            <div className="
                w-full
                max-w-[980px]
                min-h-[560px]
                grid
                grid-cols-1
                lg:grid-cols-2
                rounded-[2rem]
                overflow-hidden
                bg-white
                dark:bg-slate-950
                shadow-[0_35px_120px_rgba(0,0,0,0.55)]
                border
                border-white/10
            ">

                <div className="
                    relative
                    hidden
                    lg:flex
                    flex-col
                    justify-between
                    p-12
                    bg-[linear-gradient(rgba(6,78,59,.88),rgba(20,83,45,.92)),url('/procopio-bg.png')]
                    bg-cover
                    bg-center
                    text-white
                ">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(6,78,59,.70),rgba(20,83,45,.82)),url('/procopio-bg.png')]" />

                    <div className="relative z-10">
                        <div className="
                            inline-flex
                            items-center
                            gap-3
                            bg-white/15
                            border
                            border-white/20
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-bold
                            mb-8
                        ">
                            Procopio Company
                        </div>

                        <h1 className="text-5xl font-black leading-tight">
                            Centro de <br />
                            Control <br />
                            Agrícola
                        </h1>

                        <p className="text-green-50/90 mt-6 text-lg leading-relaxed max-w-md">
                            Plataforma administrativa para el control de inventario,
                            ventas, reportes y seguimiento del invernadero.
                        </p>

                        <div className="mt-10 h-1 w-28 bg-white/70 rounded-full" />
                    </div>
                </div>

                <div className="
                    p-6
                    sm:p-8
                    lg:p-14
                    flex
                    flex-col
                    justify-center
                ">

                    <div className="mb-8 text-center lg:text-left">
                        <div className="
                            mx-auto
                            lg:mx-0
                            mb-5
                            w-14
                            h-14
                            sm:w-16
                            sm:h-16
                            rounded-2xl
                            bg-green-100
                            text-green-700
                            flex
                            items-center
                            justify-center
                            text-3xl
                            shadow-lg
                        ">
                            🌱
                        </div>

                        <span className="
                            inline-flex
                            bg-green-100
                            text-green-700
                            px-4
                            py-2
                            rounded-full
                            text-sm
                            font-black
                            mb-4
                        ">
                            Acceso administrativo
                        </span>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-green-900 dark:text-white">
                            Bienvenido
                        </h2>

                        <p className="text-gray-500 dark:text-gray-300 mt-3">
                            Ingresa tus credenciales para continuar.
                        </p>
                    </div>

                    <div className="space-y-5">

                        <div className="relative">
                            <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="
                                    w-full
                                    bg-gray-50
                                    dark:bg-slate-900
                                    border
                                    border-gray-200
                                    dark:border-slate-700
                                    pl-14
                                    pr-5
                                    py-4
                                    rounded-2xl
                                    outline-none
                                    focus:ring-4
                                    focus:ring-green-500/20
                                    focus:border-green-500
                                    transition-all
                                    dark:text-white
                                "
                            />
                        </div>

                        <div className="relative">
                            <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-green-700" />

                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="
                                    w-full
                                    bg-gray-50
                                    dark:bg-slate-900
                                    border
                                    border-gray-200
                                    dark:border-slate-700
                                    pl-14
                                    pr-5
                                    py-4
                                    rounded-2xl
                                    outline-none
                                    focus:ring-4
                                    focus:ring-green-500/20
                                    focus:border-green-500
                                    transition-all
                                    dark:text-white
                                "
                            />
                        </div>

                        <button
                            onClick={iniciarSesion}
                            className="
                                w-full
                                bg-gradient-to-r
                                from-green-700
                                to-emerald-500
                                hover:from-green-800
                                hover:to-emerald-600
                                text-white
                                p-4
                                rounded-2xl
                                font-black
                                shadow-xl
                                shadow-green-700/25
                                transition-all
                                hover:-translate-y-1
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                        >
                            <FaSignInAlt />
                            Acceder al sistema
                        </button>

                        <button
                            onClick={recuperarPassword}
                            className="
                                w-full
                                text-green-700
                                dark:text-green-300
                                hover:underline
                                font-bold
                                pt-2
                            "
                        >
                            ¿Olvidaste tu contraseña?
                        </button>

                    </div>

                    <p className="text-center text-xs text-gray-400 mt-10">
                        Procopio Company · Panel administrativo
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Login;