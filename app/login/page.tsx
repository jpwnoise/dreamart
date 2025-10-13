'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // mensaje de éxito/error
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || 'Ocurrió un error');
            } else {
                setMessage(`¡Bienvenido ${data.user.name}! Rol: ${data.user.role}`);
                router.push('/admin/dashboard')
            }
        } catch (error) {
            setMessage('Error al conectar con el servidor');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800 p-10 rounded-xl shadow-xl w-full max-w-md space-y-6"
            >
                <h1 className="text-3xl font-bold text-center">Iniciar Sesión</h1>

                <div className="flex flex-col">
                    <label htmlFor="email" className="mb-2 text-sm">
                        Correo electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="password" className="mb-2 text-sm">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Validando...' : 'Acceder'}
                </button>

                {message && <p className="text-center text-yellow-300 mt-2">{message}</p>}

                <p className="text-sm text-gray-400 text-center">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="text-blue-400 hover:underline">
                        Regístrate
                    </Link>
                </p>
            </form>
        </div>
    );
}
