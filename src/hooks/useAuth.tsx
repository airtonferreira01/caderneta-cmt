'use client';

import { useState, useEffect, useContext, ReactNode } from 'react';
import { supabase, getUserProfile } from '@/lib/auth-helpers';
import AuthContext from '@/contexts/AuthContext';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  militar_id?: string;
  perfil: string;
  created_at: string;
  updated_at: string;
}

/**
 * Provedor de autenticação para a aplicação
 */
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar usuário e perfil ao iniciar
  useEffect(() => {
    // Função para carregar usuário atual
    async function loadUserAndProfile() {
      try {
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Carregar perfil do usuário
          const userProfile = await getUserProfile();
          setProfile(userProfile as UserProfile | null);
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    }

    // Carregar usuário inicial
    loadUserAndProfile();

    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const userProfile = await getUserProfile();
          setProfile(userProfile as UserProfile | null);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    // Limpar listener ao desmontar
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  /**
   * Fazer login com email e senha
   */
  const signIn = async (email: string, password: string): Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao fazer login:', (error as Error).message);
      return { data: null, error: error as Error };
    }
  };

  /**
   * Fazer logout
   */
  const signOut = async (): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao fazer logout:', (error as Error).message);
      return { error: error as Error };
    }
  };

  /**
   * Verificar se o usuário tem um determinado perfil
   */
  const hasRole = (role: string | string[]) => {
    if (!profile) return false;
    
    if (Array.isArray(role)) {
      return role.includes(profile.perfil);
    }
    
    return profile.perfil === role;
  };

  interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ data: { user: User | null; session: Session | null } | null; error: Error | null }>;
    signOut: () => Promise<{ error: Error | null }>;
    hasRole: (role: string | string[]) => boolean;
    isAdmin: () => boolean;
    isComandante: () => boolean;
    isMilitar: () => boolean;
    refreshProfile: () => Promise<UserProfile | null>;
  }

  // Valores expostos pelo contexto
  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    hasRole,
    isAdmin: () => hasRole('admin'),
    isComandante: () => hasRole(['admin', 'comandante']),
    isMilitar: () => !!profile,
    refreshProfile: async (): Promise<UserProfile | null> => {
      const userProfile = await getUserProfile();
      setProfile(userProfile as UserProfile | null);
      return userProfile as UserProfile | null;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}