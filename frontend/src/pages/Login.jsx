import { useState } from 'react';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

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
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">

            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-[400px]">

                <h1 className="text-4xl font-bold text-center text-green-700">
                    Procopio Company
                </h1>

                <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
                    Sistema Integral de Gestión Agrícola
                </p>

                <div className="mt-8 space-y-4">

                    <input
                        type="email"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full border p-3 rounded-xl"
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-3 rounded-xl"
                    />

                    <button
                        onClick={iniciarSesion}
                        className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl font-semibold"
                    >
                        Iniciar sesión
                    </button>

                    <button
                        onClick={recuperarPassword}
                        className="w-full text-green-700 hover:underline font-semibold"
                    >
                        ¿Olvidaste tu contraseña?
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;