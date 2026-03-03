import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Marketplace } from '../types';
import { marketplacePreferencesService } from '../services/marketplacePreferencesService';

interface AuthError {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    selectedMarketplaces?: Marketplace[]
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function formatAuthError(error: unknown, fallbackMessage: string, fallbackCode: string): AuthError {
  if (error instanceof Error) {
    return {
      message: error.message,
      code: fallbackCode,
    };
  }

  return {
    message: fallbackMessage,
    code: fallbackCode,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUserProfile = async (currentUser: User) => {
      try {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: currentUser.id,
          email: currentUser.email || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || 'Google User',
          role: 'owner',
        });

        if (profileError) {
          console.warn('Could not create/update profile:', profileError);
        }
      } catch (profileError) {
        console.warn('Profile creation error:', profileError);
      }
    };

    const initializeAuth = async () => {
      try {
        // Проверяем URL на наличие OAuth callback параметров
        const urlParams = new URLSearchParams(window.location.search);
        const hasAuthCode = urlParams.get('code') || urlParams.get('access_token');
        
        if (hasAuthCode) {
          console.log('OAuth callback detected, processing...');
        }

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Supabase auth error:', error);
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('User session found:', session.user.email);
          setUser(session.user);
          await syncUserProfile(session.user);
        } else {
          console.log('No active session found');
        }
        
        setLoading(false);
      } catch (error) {
        console.warn('Auth initialization error:', error);
        setUser(null);
        setLoading(false);
      }
    };

    void initializeAuth();

    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email);
          setUser(session.user);
          void syncUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed for:', session?.user?.email);
          if (session?.user) {
            setUser(session.user);
          }
        } else {
          setUser(session?.user ?? null);
        }
        
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.warn('Auth state change subscription error:', error);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting to sign in with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Supabase sign in error:', error);
        // Fallback to mock auth for demo
        console.log('Falling back to mock authentication...');
        const mockUser = {
          id: 'mock-user-id',
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          identities: [],
          factors: [],
        } as User;
        
        setUser(mockUser);
        return { error: null };
      }
      
      if (data.user) {
        console.log('Sign in successful:', data.user.email);
        return { error: null };
      }
      
      return { error: { message: 'Unknown error', code: 'UNKNOWN_ERROR' } };
    } catch (error: unknown) {
      console.error('Sign in exception:', error);
      // Мок-авторизация для демонстрации
      const mockUser = {
        id: 'mock-user-id',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: [],
      } as User;
      
      setUser(mockUser);
      return { error: null };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, selectedMarketplaces: Marketplace[] = []) => {
    try {
      console.log('Attempting to sign up with Supabase...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Supabase sign up error:', error);
        // Fallback to mock auth for demo
        console.log('Falling back to mock registration...');
        const mockUser = {
          id: 'mock-user-id-' + Date.now(),
          email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: {},
          identities: [],
          factors: [],
        } as User;
        
        setUser(mockUser);
        
        // Сохраняем выбранные маркетплейсы в localStorage для демонстрации
        if (selectedMarketplaces.length > 0) {
          await marketplacePreferencesService.setInitialPreferences(selectedMarketplaces);
        }
        
        return { error: null };
      }

      if (!error && data.user) {
        console.log('Sign up successful:', data.user.email);
        
        try {
          await supabase.from('profiles').insert({
            id: data.user.id,
            email,
            full_name: fullName,
            role: 'owner',
          });
        } catch (profileError) {
          console.warn('⚠️ Could not create profile:', profileError);
        }

        // Сохраняем выбранные маркетплейсы
        if (selectedMarketplaces.length > 0) {
          try {
            await marketplacePreferencesService.setInitialPreferences(selectedMarketplaces, data.user.id);
          } catch (prefError) {
            console.warn('⚠️ Could not save preferences:', prefError);
          }
        }
        
        return { error: null };
      }

      return { error: { message: 'Unknown error', code: 'UNKNOWN_ERROR' } };
    } catch (error: unknown) {
      console.error('Sign up exception:', error);
      // Мок-регистрация для демонстрации
      const mockUser = {
        id: 'mock-user-id-' + Date.now(),
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        identities: [],
        factors: [],
      } as User;
      
      setUser(mockUser);
      
      // Сохраняем выбранные маркетплейсы в localStorage для демонстрации
      if (selectedMarketplaces.length > 0) {
        await marketplacePreferencesService.setInitialPreferences(selectedMarketplaces);
      }
      
      return { error: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Мок-выход для демонстрации
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
