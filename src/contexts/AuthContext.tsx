'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAccessToken, clearAccessToken, setAccessToken } from '@/lib/api';

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  provider?: string | null;
  providerId?: string | null;
}

interface Session {
  user: SessionUser | null;
}

interface AuthContextValue {
  data: { session: Session | null } | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signOut: () => Promise<void>;
  setSessionUser: (user: SessionUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [sessionUser, setSessionUserState] = useState<SessionUser | null>(null);

  const updateStatus = useCallback(() => {
    setStatus(getAccessToken() ? 'authenticated' : 'unauthenticated');
  }, []);

  useEffect(() => {
    updateStatus();
    const handler = () => updateStatus();
    window.addEventListener('auth-token-change', handler);
    return () => window.removeEventListener('auth-token-change', handler);
  }, [updateStatus]);

  const setSessionUser = useCallback((user: SessionUser | null) => {
    setSessionUserState(user);
  }, []);

  const signOut = useCallback(async () => {
    clearAccessToken();
    setSessionUserState(null);
    setStatus('unauthenticated');
  }, []);

  const value: AuthContextValue = {
    data: status === 'authenticated' ? { session: { user: sessionUser } } : null,
    status,
    signOut,
    setSessionUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return {
    data: ctx.data ? { user: ctx.data.session?.user ?? null } : null,
    status: ctx.status,
    signOut: ctx.signOut,
    setSessionUser: ctx.setSessionUser,
  };
}

/** useSession 호환 (next-auth 제거 후 대체) */
export function useSession() {
  const { data, status, signOut } = useAuth();
  return {
    data: data ? { user: data.user } : null,
    status,
    signOut,
  };
}
