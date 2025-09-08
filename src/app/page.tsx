'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme(); // Obtém o tema e a função toggleTheme do contexto

  return (
    <div className="min-h-screen bg-green-600 dark:bg-gray-900 flex flex-col">
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
            <ul className="flex space-x-6 items-center">
              <li><a href="#" className="hover:text-green-200 dark:hover:text-blue-200">Recursos</a></li>
              <li><a href="#" className="hover:text-green-200 dark:hover:text-blue-200">Sobre</a></li>
              <li><a href="#" className="hover:text-green-200 dark:hover:text-blue-200">Contato</a></li>
              <li>
                <button 
                  onClick={toggleTheme} 
                  className="flex items-center hover:text-green-200 dark:hover:text-blue-200"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    </>
                  )}
                </button>
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
