'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { getUserProfile, updateUserProfile } from '../lib/auth-helpers';

interface UserProfile {
  id: string;
  user_id: string;
  nome?: string;
  posto?: string;
  perfil: string;
  militar_id?: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  nome: string;
  posto: string;
}

/**
 * Componente de formulário para exibir e editar o perfil do usuário
 */
export default function UserProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    posto: '',
  });
  const [message, setMessage] = useState<string>('');

  // Carregar perfil do usuário ao montar o componente
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const userProfile = await getUserProfile();
        
        if (userProfile) {
          setProfile(userProfile as UserProfile);
          setFormData({
            nome: (userProfile as UserProfile).nome || '',
            posto: (userProfile as UserProfile).posto || '',
          });
        }
      } catch (err) {
        setError('Erro ao carregar perfil do usuário');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Manipular mudanças no formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar formulário
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await updateUserProfile(formData);
      const { data, error } = response as { data: UserProfile | null; error: Error | null };
      
      if (error) {
        throw error;
      }
      
      setProfile(data);
      setMessage('Perfil atualizado com sucesso!');
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar perfil: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="p-4">Carregando perfil...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Seu Perfil</h2>
      
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="nome">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="posto">
            Posto/Graduação
          </label>
          <input
            type="text"
            id="posto"
            name="posto"
            value={formData.posto}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {profile?.militar_id && (
          <div className="mb-4 p-4 bg-gray-50 rounded">
            <h3 className="font-semibold mb-2">Dados do Militar</h3>
            <p><strong>Nome Completo:</strong> {(profile as any).militares?.nome_completo}</p>
            <p><strong>Nome de Guerra:</strong> {(profile as any).militares?.nome_guerra}</p>
            <p><strong>Função:</strong> {(profile as any).militares?.funcao}</p>
            <p><strong>Setor:</strong> {(profile as any).setor?.nome}</p>
          </div>
        )}
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}