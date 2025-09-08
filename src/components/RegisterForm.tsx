'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase, createUserProfile } from '@/lib/auth-helpers';

/**
 * Componente de formulário para registro de novos usuários
 */
export default function RegisterForm() {
  interface FormData {
    email: string;
    password: string;
    nome: string;
    posto: string;
    perfil: string;
    militar_id: string;
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    nome: '',
    posto: '',
    perfil: 'militar', // Perfil padrão
    militar_id: '', // Opcional, pode ser preenchido se já existir um registro de militar
  });

  // Manipular mudanças no formulário
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar formulário de registro
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // 1. Registrar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      // 2. Criar perfil do usuário na tabela perfis_usuarios
      if (authData?.user) {
        const profileData = {
          nome: formData.nome,
          posto: formData.posto,
          perfil: formData.perfil,
          militar_id: formData.militar_id || null,
        };

        const result = await createUserProfile(
          authData.user.id,
          profileData
        );

        if ('error' in result && result.error) throw result.error;

        setMessage(
          'Registro realizado com sucesso! Verifique seu email para confirmar a conta.'
        );
        
        // Limpar formulário
        setFormData({
          email: '',
          password: '',
          nome: '',
          posto: '',
          perfil: 'militar',
          militar_id: '',
        });
      }
    } catch (err) {
      console.error('Erro no registro:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro durante o registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Registrar Novo Usuário</h2>

      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={6}
          />
        </div>

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

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="perfil">
            Perfil
          </label>
          <select
            id="perfil"
            name="perfil"
            value={formData.perfil}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="militar">Militar</option>
            <option value="comandante">Comandante</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="militar_id">
            ID do Militar (opcional)
          </label>
          <input
            type="text"
            id="militar_id"
            name="militar_id"
            value={formData.militar_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="UUID do militar, se já existir"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </form>
    </div>
  );
}