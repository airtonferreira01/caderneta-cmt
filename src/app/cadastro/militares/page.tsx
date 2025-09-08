'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/auth-helpers';
import { Setor, OM } from '@/types/database.types';

export default function CadastroMilitares() {
  const auth = useAuth();
  const { user, profile, loading, isAdmin, isComandante } = auth || {};
  const router = useRouter();
  const { theme } = useTheme();
  interface MilitarFormData {
    nome: string;
    posto: string;
    nome_guerra: string;
    telefone: string;
    endereco: string;
    setor_id: string;
    om_id: string;
  }

  const [formData, setFormData] = useState<MilitarFormData>({
    nome: '',
    posto: '',
    nome_guerra: '',
    telefone: '',
    endereco: '',
    setor_id: '',
    om_id: ''
  });
  const [setores, setSetores] = useState<Setor[]>([]);
  const [oms, setOms] = useState<OM[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Redirecionar se não estiver autenticado ou não tiver permissão
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isAdmin && !isComandante) {
      router.push('/dashboard');
    } else if (user) {
      // Carregar dados necessários
      fetchSetoresAndOMs();
    }
  }, [user, loading, router, isAdmin, isComandante]);

  const fetchSetoresAndOMs = async () => {
    try {
      setLoadingData(true);
      
      // Buscar setores
      const { data: setoresData, error: setoresError } = await supabase
        .from('setores')
        .select('*')
        .order('nome');

      if (setoresError) throw setoresError;
      setSetores(setoresData || []);

      // Buscar OMs
      const { data: omsData, error: omsError } = await supabase
        .from('oms')
        .select('*')
        .order('nome');

      if (omsError) throw omsError;
      setOms(omsData || []);

      // Se o usuário for comandante, pré-selecionar sua OM
      if (profile && 'om_id' in profile && profile.om_id !== null && isComandante && isComandante()) {
        setFormData(prev => ({
          ...prev,
          om_id: profile.om_id as string
        }));
      }
    } catch (error: unknown) {
      console.error('Erro ao buscar dados:', error instanceof Error ? error.message : 'Erro desconhecido');
      setError('Erro ao carregar dados necessários.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      // Validar dados
      if (!formData.nome || !formData.posto || !formData.nome_guerra) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      // Criar novo militar
      const { data, error: insertError } = await supabase
        .from('militares')
        .insert([
          {
            nome: formData.nome,
            posto: formData.posto,
            nome_guerra: formData.nome_guerra,
            telefone: formData.telefone || null,
            endereco: formData.endereco || null,
            setor_id: formData.setor_id || null,
            om_id: formData.om_id || null,
            created_by: user?.id || null
          }
        ])
        .select();

      if (insertError) throw insertError;

      setMessage('Militar cadastrado com sucesso!');
      
      // Limpar formulário
      setFormData({
        nome: '',
        posto: '',
        nome_guerra: '',
        telefone: '',
        endereco: '',
        setor_id: '',
        om_id: formData.om_id // Manter a OM selecionada para facilitar múltiplos cadastros
      });
    } catch (err: unknown) {
      console.error('Erro ao cadastrar militar:', err instanceof Error ? err.message : 'Erro desconhecido');
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao cadastrar o militar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-green-600 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-600 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 dark:bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-2xl mx-auto">
          <div className="bg-green-800 dark:bg-gray-700 p-6 text-white">
            <h2 className="text-2xl font-bold">Cadastro de Militar</h2>
            <p className="text-green-200 dark:text-gray-300">Preencha os dados para cadastrar um novo militar</p>
          </div>

          <div className="p-6">
            {message && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {message}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="posto" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Posto/Graduação *
                  </label>
                  <input
                    id="posto"
                    name="posto"
                    type="text"
                    value={formData.posto}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="nome_guerra" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Nome de Guerra *
                  </label>
                  <input
                    id="nome_guerra"
                    name="nome_guerra"
                    type="text"
                    value={formData.nome_guerra}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefone" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label htmlFor="endereco" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Endereço
                </label>
                <textarea
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="om_id" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Organização Militar
                  </label>
                  <select
                    id="om_id"
                    name="om_id"
                    value={formData.om_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isComandante ? (isComandante() && profile && 'om_id' in profile) || false : false}
                  >
                    <option value="">Selecione uma OM</option>
                    {oms.map(om => (
                      <option key={om.id} value={om.id}>{om.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="setor_id" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Setor
                  </label>
                  <select
                    id="setor_id"
                    name="setor_id"
                    value={formData.setor_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Selecione um setor</option>
                    {setores.map(setor => (
                      <option key={setor.id} value={setor.id}>{setor.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300 disabled:bg-green-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-300"
                >
                  {saving ? 'Salvando...' : 'Cadastrar Militar'}
                </button>
                <Link 
                  href="/dashboard" 
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition duration-300"
                >
                  Cancelar
                </Link>
              </div>
            </form>
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