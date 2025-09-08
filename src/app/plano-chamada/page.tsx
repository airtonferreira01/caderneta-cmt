'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/auth-helpers';
import DashboardNav from '@/components/DashboardNav';
import { Militar } from '@/types/database.types';

interface MilitarWithSetor extends Militar {
  setor_nome?: string;
  setores?: {
    nome: string;
  };
}

export default function PlanoChamada() {
  const auth = useAuth();
  const user = auth?.user;
  const loading = auth?.loading ?? false;
  const router = useRouter();
  const [militares, setMilitares] = useState<MilitarWithSetor[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [selectedSetor, setSelectedSetor] = useState<string>('todos');
  const [setores, setSetores] = useState<{id: string, nome: string}[]>([]);

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      // Carregar dados necessários
      fetchMilitaresESetores();
    }
  }, [user, loading, router]);

  const fetchMilitaresESetores = async () => {
    try {
      setLoadingData(true);
      
      // Buscar setores
      const { data: setoresData, error: setoresError } = await supabase
        .from('setores')
        .select('id, nome')
        .order('nome');

      if (setoresError) throw setoresError;
      setSetores(setoresData || []);

      // Buscar militares com seus setores
      const { data: militaresData, error: militaresError } = await supabase
        .from('militares')
        .select(`
          id, 
          nome, 
          nome_guerra, 
          posto, 
          telefone, 
          endereco,
          setor_id,
          setores(nome)
        `)
        .order('posto');

      if (militaresError) throw militaresError;
      
      // Formatar dados dos militares
      const formattedMilitares = militaresData?.map((militar) => ({
        ...militar,
        setor_nome: militar.setores ? militar.setores.nome : 'Sem setor'
      })) || [];

      setMilitares(formattedMilitares as MilitarWithSetor[]);
    } catch (error: unknown) {
      console.error('Erro ao buscar dados:', error instanceof Error ? error.message : 'Erro desconhecido');
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoadingData(false);
    }
  };

  // Filtrar militares por termo de busca e setor selecionado
  const filteredMilitares = militares.filter(militar => {
    const matchesSearch = 
      militar.nome_guerra.toLowerCase().includes(searchTerm.toLowerCase()) ||
      militar.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (militar.posto_grad || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (militar.telefone && militar.telefone.includes(searchTerm));
    
    const matchesSetor = selectedSetor === 'todos' || militar.setor_id === selectedSetor;
    
    return matchesSearch && matchesSetor;
  });

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
          {/* Header */}
          <div className="bg-green-800 dark:bg-gray-700 p-6 text-white">
            <h2 className="text-2xl font-bold">Plano de Chamada</h2>
            <p className="text-green-200 dark:text-gray-300">Visualize e gerencie os contatos para o plano de chamada</p>
          </div>

          {/* Filtros e Busca */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Buscar militar..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <select
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={selectedSetor}
                  onChange={(e) => setSelectedSetor(e.target.value)}
                >
                  <option value="todos">Todos os Setores</option>
                  {setores.map(setor => (
                    <option key={setor.id} value={setor.id}>{setor.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {filteredMilitares.length} {filteredMilitares.length === 1 ? 'militar encontrado' : 'militares encontrados'}
            </div>
          </div>

          {/* Lista de Militares */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
                <button 
                  onClick={fetchMilitaresESetores}
                  className="ml-2 underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {filteredMilitares.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Nenhum militar encontrado com os filtros atuais.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMilitares.map(militar => (
                  <div 
                    key={militar.id} 
                    className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-green-800 dark:text-white">{militar.posto_grad || ''} {militar.nome_guerra}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{militar.setor_nome}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{militar.telefone || 'Não informado'}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-blue-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{militar.endereco || 'Não informado'}</span>
                      </div>
                      
                      {militar.email && (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{militar.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <a 
                        href={`tel:${militar.telefone}`} 
                        className={`text-sm px-3 py-1 rounded-md ${militar.telefone ? 'bg-green-600 hover:bg-green-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        onClick={(e) => !militar.telefone && e.preventDefault()}
                      >
                        Ligar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
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