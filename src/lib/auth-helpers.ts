/**
 * Funções auxiliares para autenticação e gerenciamento de perfis de usuários
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? ''
);

/**
 * Criar cliente Supabase no navegador
 * @returns {SupabaseClient} Cliente Supabase
 */
export const createBrowserClient = (): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key must be defined');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Exportar como default para compatibilidade com importações de '@/lib/supabase'
export default { createBrowserClient, supabase } as { createBrowserClient: () => SupabaseClient, supabase: SupabaseClient };

/**
 * Obter o perfil do usuário atual
 * @returns {Promise<any>} Dados do perfil do usuário
 */
export async function getUserProfile() {
  try {
    // Obter usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }
    
    // Obter perfil do usuário
    const { data: profile, error: profileError } = await supabase
      .from('perfis_usuarios')
      .select(`
        id,
        nome,
        posto,
        perfil,
        militar_id,
        om_id,
        setor_id,
        militares(nome_completo, nome_guerra, posto_grad, funcao, foto_url),
        om(nome, tipo),
        setores(nome)
      `)
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError);
      return null;
    }
    
    return profile;
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
    return null;
  }
}

/**
 * Criar ou atualizar perfil de usuário
 * @param {Record<string, any>} profileData Dados do perfil a serem atualizados
 * @returns {Promise<{data: any, error: Error | null}>} Resultado da operação
 */
export async function updateUserProfile(profileData: Record<string, any>) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }
    
    const { data, error } = await supabase
      .from('perfis_usuarios')
      .upsert({
        id: user.id,
        ...profileData,
        updated_at: new Date()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error instanceof Error ? error.message : 'Erro desconhecido');
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido') };
  }
}

/**
 * Verificar se o usuário atual é administrador
 * @returns {Promise<boolean>} True se o usuário for administrador
 */
export async function isAdmin() {
  try {
    const profile = await getUserProfile();
    return profile?.perfil === 'admin';
  } catch (error) {
    console.error('Erro ao verificar permissões:', error instanceof Error ? error.message : 'Erro desconhecido');
    return false;
  }
}

/**
 * Verificar se o usuário atual é comandante
 * @returns {Promise<boolean>} True se o usuário for comandante
 */
export async function isComandante() {
  try {
    const profile = await getUserProfile();
    return profile?.perfil === 'comandante';
  } catch (error) {
    console.error('Erro ao verificar permissões:', error instanceof Error ? error.message : 'Erro desconhecido');
    return false;
  }
}

/**
 * Criar perfil para um novo usuário após registro
 * @param {string} userId ID do usuário recém-criado
 * @param {Object} profileData Dados iniciais do perfil
 * @returns {Promise<Object>} Resultado da operação
 */
export async function createUserProfile(userId: string, profileData: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('perfis_usuarios')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date(),
        updated_at: new Date()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar perfil de usuário:', error instanceof Error ? error.message : 'Erro desconhecido');
    return { data: null, error };
  }
}