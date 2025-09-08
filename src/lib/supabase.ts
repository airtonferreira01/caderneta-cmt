import { createClient } from '@supabase/supabase-js';

// Essas variáveis de ambiente precisam ser configuradas no arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cliente Supabase para uso em componentes cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Função para criar cliente Supabase no navegador
export const createBrowserClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey);
};