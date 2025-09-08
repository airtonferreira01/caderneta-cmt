'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase, updateUserProfile } from '@/lib/auth-helpers';

export default function EditarPerfil() {
  const auth = useAuth();
  const { user, profile, loading, refreshProfile } = auth || {};
  const router = useRouter();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    nome: '',
    posto: '',
    telefone: '',
    endereco: '',
    foto_url: ''
  });
  const [militarData, setMilitarData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Redirecionar se não estiver autenticado
    if (!loading && !user) {
      router.push('/login');
    } else if (profile) {
      // Preencher formulário com dados do perfil
      setFormData({
        nome: (profile as any)?.nome || '',
        posto: (profile as any)?.posto || '',
        telefone: '',
        endereco: '',
        foto_url: ''
      });

      // Carregar dados do militar se existir
      if (profile.militar_id) {
        fetchMilitarData(profile.militar_id);
      } else {
        setLoadingData(false);
      }
    }
  }, [user, loading, profile, router]);

  const fetchMilitarData = async (militarId: string) => {
    try {
      const { data, error } = await supabase
        .from('militares')
        .select('*')
        .eq('id', militarId)
        .single();

      if (error) throw error;
      
      setMilitarData(data);
      setFormData(prev => ({
        ...prev,
        telefone: data.telefone || '',
        endereco: data.endereco || '',
        foto_url: data.foto_url || ''
      }));
    } catch (error) {
      console.error('Erro ao buscar dados do militar:', (error as Error).message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id || 'default'}-${Date.now()}.${fileExt}`;
      const filePath = `fotos_perfil/${fileName}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        foto_url: data.publicUrl
      }));
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', (error as Error).message);
      setError('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      // Atualizar perfil do usuário
      const result = await updateUserProfile({
        nome: formData.nome,
        posto: formData.posto
      });
      
      if ('error' in result && result) {
        const { error: profileError } = result;
        if (profileError) throw profileError;
      }

      if ('error' in result && result.error) throw result.error;

      // Atualizar dados do militar se existir
      if (profile?.militar_id) {
        const { error: militarError } = await supabase
          .from('militares')
          .update({
            telefone: formData.telefone,
            endereco: formData.endereco,
            foto_url: formData.foto_url || null,
            updated_at: new Date()
          })
          .eq('id', profile.militar_id);

        if (militarError) throw militarError;
      }

      // Atualizar perfil no contexto
      if (refreshProfile) {
        await refreshProfile();
      }

      setMessage('Perfil atualizado com sucesso!');
      
      // Redirecionar após alguns segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err instanceof Error ? err.message : 'Unknown error');
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao atualizar o perfil.');
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
            <h2 className="text-2xl font-bold">Editar Perfil</h2>
            <p className="text-green-200 dark:text-gray-300">Atualize suas informações pessoais</p>
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

            <form onSubmit={handleSubmit}>
              {/* Foto de Perfil */}
              <div className="mb-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <Image 
                    src={(formData as any).foto_url || (militarData as any)?.foto_url || "/placeholder-profile.svg"}
                    alt="Foto do Perfil" 
                    width={120} 
                    height={120} 
                    className="rounded-full border-4 border-green-500 dark:border-blue-500"
                  />
                </div>
                <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md cursor-pointer transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700">
                  {uploading ? 'Enviando...' : 'Alterar Foto'}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Dados Pessoais */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo
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
                  <label htmlFor="posto" className="block text-gray-700 dark:text-gray-300 mb-2">
                    Posto/Graduação
                  </label>
                  <input
                    id="posto"
                    name="posto"
                    type="text"
                    value={formData.posto}
                    onChange={handleChange}
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
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-300 disabled:bg-green-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:disabled:bg-blue-300"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
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