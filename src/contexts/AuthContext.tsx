'use client';

import { createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  militar_id?: string;
  perfil: string;
  created_at: string;
  updated_at: string;
}

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

// Criar o contexto de autenticação
const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;