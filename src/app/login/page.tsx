'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const signIn = auth?.signIn;
  if (!signIn) throw new Error('Auth context not initialized');
  useTheme(); // Mantém o contexto do tema ativo

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        setError('Credenciais inválidas. Por favor, tente novamente.');
      } else {
        router.push('/organograma');
      }
    } catch (err: unknown) {
      setError('Ocorreu um erro ao fazer login. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-600 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 dark:bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <Link href="/" className="flex items-center space-x-2 w-fit">
            <Image 
              src="/logo.svg" 
              alt="Logo Caderneta Cmt" 
              width={40} 
              height={40} 
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">Caderneta Cmt</h1>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500 dark:disabled:bg-blue-300"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-green-600 dark:text-blue-400 hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 dark:bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>© 2023 Caderneta Cmt. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}