'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/auth-helpers';
import DashboardNav from '@/components/DashboardNav';
import { Militar } from '@/types/database.types';

export default function Dashboard() {
  const auth = useAuth();
  const { user, profile, loading } = auth || {};
  const router = useRouter();
  useTheme(); // Mantém o contexto do tema
  interface MilitarWithRelations extends Militar {
    setor?: {
      id: string;
      nome: string;
    };
    superior?: {
      id: string;
      nome_guerra: string;
      posto_grad: string;
    };
  }

  const [militarData, setMilitarData] = useState<MilitarWithRelations | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const fetchMilitarData = useCallback(async (militarId: string) => {
    try {
      const { data, error } = await supabase
        .from('militares')
        .select(`
          *,
          setor:setores(id, nome),
          superior:militares(id, nome_guerra, posto_grad)
        `)
        .eq('id', militarId)
        .single();

      if (error) throw error;
      setMilitarData(data);
    } catch (error: unknown) {
      console.error('Erro ao buscar dados do militar:', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!loading && !user) {
      router.push('/login');
    } else if (profile?.militar_id) {
      // Carregar dados do militar se estiver autenticado
      fetchMilitarData(profile.militar_id);
    } else {
      setLoadingData(false);
    }
  }, [user, loading, profile, router, fetchMilitarData]);

  // Função de logout removida pois está sendo usada no componente DashboardNav

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-green-600 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-600 dark:bg-gray-900 flex flex-col">
      {/* Header com Navegação */}
      <DashboardNav />

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* User Profile Header */}
          <div className="bg-green-800 dark:bg-gray-700 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image 
                  src={militarData?.foto_url || "/placeholder-profile.svg"} 
                  alt="Foto do Perfil" 
                  width={100} 
                  height={100} 
                  className="rounded-full border-4 border-white"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{militarData?.nome_guerra || 'Usuário'}</h2>
                <p className="text-green-200 dark:text-gray-300">{militarData?.posto_grad || 'Posto não definido'}</p>
                <p className="text-green-200 dark:text-gray-300">{militarData?.funcao || 'Função não definida'}</p>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-white">Informações Pessoais</h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-200">
                  <p><span className="font-medium">Nome Completo:</span> {militarData?.nome_completo || 'Não definido'}</p>
                  <p><span className="font-medium">Nome de Guerra:</span> {militarData?.nome_guerra || 'Não definido'}</p>
                  <p><span className="font-medium">Email:</span> {user?.email || 'Não definido'}</p>
                  <p><span className="font-medium">Telefone:</span> {militarData?.telefone || 'Não definido'}</p>
                  <p><span className="font-medium">Endereço:</span> {militarData?.endereco || 'Não definido'}</p>
                </div>
                <div className="mt-4">
                  <Link 
                    href="/perfil/editar" 
                    className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    Editar Perfil
                  </Link>
                </div>
              </div>

              {/* Informações Militares */}
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg shadow">
                <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-white">Informações Militares</h3>
                <div className="space-y-3 text-gray-700 dark:text-gray-200">
                  <p><span className="font-medium">Posto/Graduação:</span> {militarData?.posto_grad || 'Não definido'}</p>
                  <p><span className="font-medium">Função:</span> {militarData?.funcao || 'Não definido'}</p>
                  <p><span className="font-medium">Setor:</span> {militarData?.setor?.nome || 'Não definido'}</p>
                  <p><span className="font-medium">Superior:</span> {militarData?.superior ? `${militarData.superior.posto_grad} ${militarData.superior.nome_guerra}` : 'Não definido'}</p>
                  <p><span className="font-medium">Perfil no Sistema:</span> {profile?.perfil || 'Militar'}</p>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-white">Ações Rápidas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link 
                  href="/organograma" 
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex flex-col items-center justify-center text-center transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Ver Organograma</span>
                </Link>
                <Link 
                  href="/plano-chamada" 
                  className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex flex-col items-center justify-center text-center transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Plano de Chamada</span>
                </Link>
                {(profile?.perfil === 'admin' || profile?.perfil === 'comandante') && (
                  <Link 
                    href="/gestao" 
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg flex flex-col items-center justify-center text-center transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Gestão</span>
                  </Link>
                )}
              </div>
            </div>
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