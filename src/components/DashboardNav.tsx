'use client';

import { useState, useRef, useEffect } from 'react';
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
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
    }
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Fechar outros menus quando abrir o menu mobile
    if (!mobileMenuOpen) {
      setProfileMenuOpen(false);
      setAdminMenuOpen(false);
    }
  };
  
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    // Fechar outros menus quando abrir o menu de perfil
    if (!profileMenuOpen) {
      setAdminMenuOpen(false);
    }
  };
  
  const toggleAdminMenu = () => {
    setAdminMenuOpen(!adminMenuOpen);
    // Fechar outros menus quando abrir o menu admin
    if (!adminMenuOpen) {
      setProfileMenuOpen(false);
    }
  };
  
  // Fechar menus quando clicar fora deles
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-green-700 dark:bg-green-800 text-white shadow-md transition-colors duration-300">
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
            <Link href="/dashboard" className="flex items-center hover:text-green-200 dark:hover:text-green-200 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link href="/organograma" className="flex items-center hover:text-green-200 dark:hover:text-green-200 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Organograma
            </Link>
            
            {/* Menu Admin */}
            {(isAdmin && isAdmin() || isComandante && isComandante()) && (
              <div className="relative" ref={adminMenuRef}>
                <button 
                onClick={toggleAdminMenu}
                className="flex items-center px-3 py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                aria-expanded={adminMenuOpen}
                aria-haspopup="true"
              >
                  <span>Cadastros</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1 transition-transform duration-200 ${adminMenuOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {adminMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-green-900 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-green-700">
                    <Link 
                      href="/cadastro/militares" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition duration-150"
                      onClick={() => setAdminMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Militares
                    </Link>
                    {isAdmin && isAdmin() && (
                      <>
                        <Link 
                          href="/cadastro/setores" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition duration-150"
                          onClick={() => setAdminMenuOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Setores
                        </Link>
                        <Link 
                          href="/cadastro/oms" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition duration-150"
                          onClick={() => setAdminMenuOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          Organizações Militares
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Perfil e Tema */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-3 text-white hover:bg-green-600 dark:hover:bg-green-700 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                aria-label="Alternar tema"
              >
                <div className="flex items-center">
                  {theme === 'dark' ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Tema Claro</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      <span>Tema Escuro</span>
                    </>
                  )}
                </div>
                <div className="relative">
                  <div className="w-10 h-5 bg-gray-300 dark:bg-green-600 rounded-full shadow-inner transition duration-300"></div>
                  <div className={`absolute top-0 left-0 w-5 h-5 bg-white dark:bg-white rounded-full shadow transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </button>

              <div className="relative" ref={profileMenuRef}>
                <button 
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                  <span className="font-medium">{profile?.nome || user?.email}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-200 ${profileMenuOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-green-900 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-green-700">
                  <Link 
                    href="/perfil/editar" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition duration-150"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar Perfil
                  </Link>
                  <button 
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-green-100 dark:hover:bg-green-700 transition duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                    Sair
                  </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botão Menu Mobile */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-green-600 dark:hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400" 
            onClick={toggleMobileMenu}
            aria-label="Menu principal"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-green-600 dark:border-green-700 absolute top-full left-0 right-0 z-50 shadow-lg transition-all duration-200 transform opacity-100 bg-green-700 dark:bg-green-800" aria-label="Menu mobile">
            <div className="flex flex-col space-y-1 px-2">
              <Link 
                href="/dashboard" 
                className="flex items-center px-4 py-3 text-white hover:bg-green-600 dark:hover:bg-green-700 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <Link 
                href="/organograma" 
                className="flex items-center px-4 py-3 text-white hover:bg-green-600 dark:hover:bg-green-700 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Organograma</span>
              </Link>
              <Link 
                href="/plano-chamada" 
                className="flex items-center px-4 py-3 text-white hover:bg-green-600 dark:hover:bg-green-700 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Plano de Chamada</span>
              </Link>
              
              {/* Menu Admin Mobile */}
              {(isAdmin && isAdmin() || isComandante && isComandante()) && (
                <div className="border-t border-green-600 dark:border-green-700 pt-3 mt-2">
                  <div className="px-4 py-2 text-white font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Cadastros</span>
                  </div>
                  <div className="flex flex-col space-y-1 px-2">
                    <Link 
                      href="/cadastro/militares" 
                      className="flex items-center px-4 py-3 text-white hover:bg-green-600 dark:hover:bg-gray-700 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-gray-400"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Militares</span>
                    </Link>
                    {isAdmin && isAdmin() && (
                      <>
                        <Link 
                          href="/cadastro/setores" 
                          className="flex items-center px-4 py-3 text-white hover:bg-green-600 dark:hover:bg-gray-700 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-gray-400"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span>Setores</span>
                        </Link>
                        <Link 
                          href="/cadastro/oms" 
                          className="flex items-center px-4 py-3 text-white hover:bg-green-600 dark:hover:bg-gray-700 rounded-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-gray-400"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          <span>Organizações Militares</span>
                        </Link>
                      </>
                    )}
                  </div>
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
              type="submit"
              onClick={handleSignOut}
              className="text-left hover:bg-green-600 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-gray-400"
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