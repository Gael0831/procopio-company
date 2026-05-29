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

            const respuesta = await API.post(
                '/usuarios/login',
                {
                    correo,
                    password
                }
            );

            if(respuesta.data.success){

                Swal.fire({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: respuesta.data.mensaje
                });

                localStorage.setItem(
                    'token',
                    respuesta.data.token
                );

                localStorage.setItem(
                    'usuario',
                    JSON.stringify(respuesta.data.usuario)
                );

                navigate('/dashboard');

            }else{

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
                text: 'No se pudo conectar con el servidor'
            });

        }

    };

    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">

            <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl w-[400px]">

                <h1 className="text-4xl font-bold text-center text-green-700">
                    Procopio Company
                </h1>

                <p className="text-center text-gray-500 dark:text-gray-300 mt-2">
                    Sistema de Gestión de Invernadero
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

                </div>

            </div>

        </div>
    )
}

export default Login