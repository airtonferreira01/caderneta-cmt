'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/lib/auth-helpers';

export default function CadastroOMs() {
  const auth = useAuth();
  const { user, loading, isAdmin } = auth || {};
  const router = useRouter();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nome: '',
    sigla: '',
    endereco: '',
    telefone: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Redirecionar se não estiver autenticado ou não tiver permissão
    if (!loading && !user) {
      router.push('/login');
    } else if (!loading && user && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, loading, router, isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      // Validar dados
      if (!formData.nome || !formData.sigla) {
        throw new Error('Preencha todos os campos obrigatórios.');
      }

      // Criar nova OM
      const { data, error: insertError } = await supabase
        .from('oms')
        .insert([
          {
            nome: formData.nome,
            sigla: formData.sigla,
            endereco: formData.endereco || null,
            telefone: formData.telefone || null,
            created_by: user?.id || null
          }
        ])
        .select();

      if (insertError) throw insertError;

      setMessage('Organização Militar cadastrada com sucesso!');
      
      // Limpar formulário
      setFormData({
        nome: '',
        sigla: '',
        endereco: '',
        telefone: ''
      });
    } catch (err) {
      console.error('Erro ao cadastrar OM:', err instanceof Error ? err.message : 'Unknown error');
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao cadastrar a Organização Militar.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
            <h2 className="text-2xl font-bold">Cadastro de Organização Militar</h2>
            <p className="text-green-200 dark:text-gray-300">Preencha os dados para cadastrar uma nova OM</p>
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
                  Nome da Organização Militar *
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

              <div>
                <label htmlFor="sigla" className="block text-gray-700 dark:text-gray-300 mb-2">
                  Sigla *
                </label>
                <input
                  id="sigla"
                  name="sigla"
                  type="text"
                  value={formData.sigla}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
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

              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300 disabled:bg-green-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-300"
                >
                  {saving ? 'Salvando...' : 'Cadastrar OM'}
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