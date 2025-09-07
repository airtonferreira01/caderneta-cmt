'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, getUserProfile } from '../lib/auth-helpers';

// Criar contexto de autenticação
const AuthContext = createContext();

/**
 * Provedor de autenticação para a aplicação
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

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
          setProfile(userProfile);
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
          setProfile(userProfile);
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
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      return { data: null, error };
    }
  };

  /**
   * Fazer logout
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
      return { error };
    }
  };

  /**
   * Verificar se o usuário tem um determinado perfil
   */
  const hasRole = (role) => {
    if (!profile) return false;
    
    if (Array.isArray(role)) {
      return role.includes(profile.perfil);
    }
    
    return profile.perfil === role;
  };

  // Valores expostos pelo contexto
  const value = {
    user,
    profile,
    loading,
    signIn,
    signOut,
    hasRole,
    isAdmin: () => hasRole('admin'),
    isComandante: () => hasRole(['admin', 'comandante']),
    isMilitar: () => !!profile,
    refreshProfile: async () => {
      const userProfile = await getUserProfile();
      setProfile(userProfile);
      return userProfile;
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