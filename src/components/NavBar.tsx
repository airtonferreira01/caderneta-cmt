'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function NavBar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const auth = useAuth();
  const router = useRouter();
  const { signOut } = auth || {};
  
  // Estados para menus dropdown
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Referências para detectar cliques fora dos menus
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLLIElement>(null);
  
  const handleSignOut = async () => {
    if (signOut) {
      await signOut();
      router.push('/login');
    }
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
    <header className="bg-green-700 dark:bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center">
            <div className="w-10 h-10 relative mr-2">
              <Image 
                src="/logo.svg" 
                alt="Logo Caderneta Cmt" 
                fill 
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold hidden sm:block">Caderneta Cmt</h1>
          </Link>
        </div>
        
        {/* Botão de menu mobile */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center p-2 rounded-md hover:bg-green-600 dark:hover:bg-gray-700 transition duration-300"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-green-600 dark:hover:bg-gray-700 transition duration-300"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span>Modo Escuro</span>
              </>
            )}
          </button>
          
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={toggleProfileMenu}
              className="flex items-center hover:bg-green-600 dark:hover:bg-gray-700 p-2 rounded-md transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Perfil</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                <Link 
                  href="/perfil" 
                  className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Editar Perfil
                  </div>
                </Link>
                
                <button 
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600"
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Sair
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-600 dark:bg-gray-700 text-white">
          <div className="container mx-auto px-4 py-2">
            <ul className="flex flex-col space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/organograma" 
                  className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Organograma
                </Link>
              </li>
              <li>
                <Link 
                  href="/militares" 
                  className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Militares
                </Link>
              </li>
              <li>
                <Link 
                  href="/gestao" 
                  className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gestão de Estrutura
                </Link>
              </li>
              <li>
                <Link 
                  href="/plano-chamada" 
                  className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Plano de Chamada
                </Link>
              </li>
              {auth?.isAdmin && auth.isAdmin() && (
                <li>
                  <button 
                    onClick={toggleAdminMenu}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                  >
                    <span>Cadastros</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-4 w-4 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {adminMenuOpen && (
                    <div className="pl-4 mt-1 space-y-1">
                      <Link 
                        href="/cadastro/militares" 
                        className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Militares
                      </Link>
                      <Link 
                        href="/cadastro/setores" 
                        className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Setores
                      </Link>
                      <Link 
                        href="/cadastro/oms" 
                        className="block px-3 py-2 rounded-md hover:bg-green-700 dark:hover:bg-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Organizações Militares
                      </Link>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
      
      <nav className="hidden md:block bg-green-50 dark:bg-gray-800 text-green-900 dark:text-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/organograma" 
                className={`flex items-center py-3 border-b-2 ${pathname === '/organograma' ? 'border-green-600 font-medium' : 'border-transparent hover:border-green-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2V7h-6v5H5V5z" clipRule="evenodd" />
                </svg>
                Organograma
              </Link>
            </li>
            <li>
              <Link 
                href="/militares" 
                className={`flex items-center py-3 border-b-2 ${pathname === '/militares' ? 'border-green-600 font-medium' : 'border-transparent hover:border-green-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Militares
              </Link>
            </li>
            <li>
              <Link 
                href="/gestao" 
                className={`flex items-center py-3 border-b-2 ${pathname === '/gestao' ? 'border-green-600 font-medium' : 'border-transparent hover:border-green-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Gestão de Estrutura
              </Link>
            </li>
            <li>
              <Link 
                href="/plano-chamada" 
                className={`flex items-center py-3 border-b-2 ${pathname === '/plano-chamada' ? 'border-green-600 font-medium' : 'border-transparent hover:border-green-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Plano de Chamada
              </Link>
            </li>
            {auth?.isAdmin && auth.isAdmin() && (
              <li className="relative" ref={adminMenuRef}>
                <button 
                  onClick={toggleAdminMenu}
                  className="flex items-center py-3 px-2 border-b-2 border-transparent hover:border-green-300 dark:hover:border-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden sm:inline">Cadastros</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`absolute left-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10 ${adminMenuOpen ? 'block' : 'hidden'}`}>
                  <Link href="/cadastro/militares" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600">
                    Militares
                  </Link>
                  <Link href="/cadastro/setores" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600">
                    Setores
                  </Link>
                  <Link href="/cadastro/oms" className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-green-100 dark:hover:bg-gray-600">
                    Organizações Militares
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}