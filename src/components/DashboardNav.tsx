'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardNav() {
  const auth = useAuth();
  const { profile, signOut, isAdmin, isComandante } = auth || {};
  const user = auth?.user;
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
    }
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-green-700 dark:bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo e Título */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              alt="Logo Caderneta Cmt" 
              width={40} 
              height={40} 
              className="h-10 w-auto"
            />
            <h1 className="text-xl font-bold hidden sm:block">Caderneta Cmt</h1>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-green-200 dark:hover:text-blue-200 transition duration-300">
              Dashboard
            </Link>
            <Link href="/organograma" className="hover:text-green-200 dark:hover:text-blue-200 transition duration-300">
              Organograma
            </Link>
            
            {/* Menu Admin */}
            {(isAdmin && isAdmin() || isComandante && isComandante()) && (
              <div className="relative group">
                <button className="hover:text-green-200 dark:hover:text-blue-200 transition duration-300 flex items-center">
                  Cadastros
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/cadastro/militares" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600">
                    Militares
                  </Link>
                  {isAdmin && isAdmin() && (
                    <>
                      <Link href="/cadastro/setores" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600">
                        Setores
                      </Link>
                      <Link href="/cadastro/oms" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600">
                        Organizações Militares
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Perfil e Tema */}
            <div className="flex items-center space-x-4">
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

              <div className="relative group">
                <button className="flex items-center space-x-2 hover:text-green-200 dark:hover:text-blue-200 transition duration-300">
                  <span className="font-medium">{profile?.displayName || user?.email}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link href="/perfil/editar" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600">
                    Editar Perfil
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Botão Menu Mobile */}
          <button 
            className="md:hidden focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-green-600 dark:border-gray-700">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/dashboard" 
                className="hover:bg-green-600 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/organograma" 
                className="hover:bg-green-600 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Organograma
              </Link>
              
              {/* Menu Admin Mobile */}
              {(isAdmin && isAdmin() || isComandante && isComandante()) && (
                <div className="space-y-1">
                  <div className="px-3 py-2 font-medium">Cadastros:</div>
                  <Link 
                    href="/cadastro/militares" 
                    className="block hover:bg-green-600 dark:hover:bg-gray-700 px-6 py-2 rounded-md transition duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Militares
                  </Link>
                  {isAdmin && isAdmin() && (
                    <>
                      <Link 
                        href="/cadastro/setores" 
                        className="block hover:bg-green-600 dark:hover:bg-gray-700 px-6 py-2 rounded-md transition duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Setores
                      </Link>
                      <Link 
                        href="/cadastro/oms" 
                        className="block hover:bg-green-600 dark:hover:bg-gray-700 px-6 py-2 rounded-md transition duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Organizações Militares
                      </Link>
                    </>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between px-3 py-2">
                <Link 
                  href="/perfil/editar" 
                  className="hover:bg-green-600 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Editar Perfil
                </Link>
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
              </div>
              
              <button 
                onClick={handleSignOut}
                className="text-left hover:bg-green-600 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition duration-300"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}