'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  
  return (
    <header className="bg-green-600 text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 relative mr-2">
            <Image 
              src="/logo.svg" 
              alt="Logo Organograma Militar" 
              fill 
              className="object-contain"
            />
          </div>
          <h1 className="text-xl font-bold">ORGANOGRAMA MILITAR DINÂMICO</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            href="/perfil" 
            className="flex items-center hover:underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Perfil
          </Link>
          
          <button className="flex items-center hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sair
          </button>
        </div>
      </div>
      
      <nav className="bg-green-50 text-green-900">
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
          </ul>
        </div>
      </nav>
    </header>
  );
}