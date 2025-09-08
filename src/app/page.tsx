'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800 dark:from-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header/Navbar */}
      <header className="bg-green-700 dark:bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              alt="Logo Caderneta Cmt" 
              width={40} 
              height={40} 
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold">Caderneta Cmt</h1>
          </div>
          <nav>
            <ul className="flex space-x-4 items-center">
              <li>
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full hover:bg-green-600 dark:hover:bg-gray-700 transition duration-300"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </li>
              <li>
                <Link 
                  href="/login" 
                  className="px-4 py-2 bg-white text-green-700 dark:bg-gray-700 dark:text-white rounded-md hover:bg-green-100 dark:hover:bg-gray-600 transition duration-300 font-medium"
                >
                  Entrar
                </Link>
                </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 text-white dark:text-white">
            <h2 className="text-4xl font-bold mb-6">Gestão Militar Simplificada</h2>
            <p className="text-xl mb-8">Organize sua unidade militar com eficiência através de organogramas dinâmicos e planos de chamada georreferenciados.</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => router.push('/login')} 
                className="bg-yellow-500 hover:bg-yellow-600 text-green-900 dark:text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300"
              >
                Entrar
              </button>
              <button 
                onClick={() => router.push('/register')} 
                className="bg-white hover:bg-gray-100 text-green-700 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 border border-green-500 dark:border-blue-500"
              >
                Registrar
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image 
              src="/placeholder-profile.svg" 
              alt="Organograma Militar" 
              width={500} 
              height={400} 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 dark:bg-gray-800 text-white p-6">
        <div className="container mx-auto text-center">
          <p>© 2023 Caderneta Cmt. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
