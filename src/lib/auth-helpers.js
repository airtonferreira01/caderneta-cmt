/**
 * Funções auxiliares para autenticação e gerenciamento de perfis de usuários
 */

import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e chave anônima são obrigatórios. Verifique se as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas no arquivo .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Criar cliente Supabase no navegador
 * @returns {Object} Cliente Supabase
 */
export const createBrowserClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL e chave anônima são obrigatórios. Verifique se as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão definidas no arquivo .env.local');
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Exportar como default para compatibilidade com importações de '@/lib/supabase'
const authHelpers = { createBrowserClient, supabase };
export default authHelpers;

/**
 * Obter o perfil do usuário atual
 * @returns {Promise<Object>} Dados do perfil do usuário
 */
export async function getUserProfile() {
  try {
    // Obter usuário atual
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.log('Usuário não autenticado:', userError);
      throw new Error('Usuário não autenticado');
    }
    
    console.log('Buscando perfil para o usuário ID:', user.id);
    
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
        created_at,
        updated_at,
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
    console.error('Erro ao obter perfil do usuário:', error.message);
    return null;
  }
}

/**
 * Criar ou atualizar perfil de usuário
 * @param {Object} profileData Dados do perfil a serem atualizados
 * @returns {Promise<Object>} Resultado da operação
 */
export async function updateUserProfile(profileData) {
  try {
    console.log('Atualizando perfil com dados:', profileData);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('Erro ao obter usuário:', userError);
      throw new Error('Usuário não autenticado');
    }
    
    console.log('Atualizando perfil para usuário ID:', user.id);
    
    // Verificar se o perfil já existe
    const { data: existingProfile, error: profileError } = await supabase
      .from('perfis_usuarios')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 é o código para 'não encontrado'
      console.error('Erro ao verificar perfil existente:', profileError);
      throw profileError;
    }
    
    // Se o perfil existir, atualize-o; caso contrário, crie um novo
    const { data, error } = await supabase
      .from('perfis_usuarios')
      .upsert({
        id: user.id,
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error.message);
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
    console.error('Erro ao verificar permissões:', error.message);
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
    console.error('Erro ao verificar permissões:', error.message);
    return false;
  }
}

/**
 * Criar perfil para um novo usuário após registro
 * @param {string} userId ID do usuário recém-criado
 * @param {Object} profileData Dados iniciais do perfil
 * @returns {Promise<Object>} Resultado da operação
 */
export async function createUserProfile(userId, profileData) {
  try {
    console.log('Iniciando criação de perfil para usuário:', userId);
    console.log('Dados do perfil:', profileData);
    
    // Verificar se já existe um perfil para este usuário
    const { data: existingProfile, error: checkError } = await supabase
      .from('perfis_usuarios')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 é o código para 'não encontrado'
      console.error('Erro ao verificar perfil existente:', checkError);
    }
    
    if (existingProfile) {
      console.log('Perfil já existe para este usuário, atualizando...');
      return updateUserProfile(profileData);
    }
    
    const { data, error } = await supabase
      .from('perfis_usuarios')
      .insert({
        id: userId,
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar perfil de usuário:', error.message);
    return { data: null, error: error instanceof Error ? error : new Error('Erro desconhecido') };
  }
}