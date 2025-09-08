import { create } from 'zustand';
import { supabase, isSupabaseEnabled } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  signIn: async (email, password) => {
    if (!isSupabaseEnabled()) {
      set({ error: 'Authentication is not available', loading: false });
      throw new Error('Authentication is not available');
    }

    try {
      set({ loading: true, error: null });
      
      // Clear any existing session first
      await supabase!.auth.signOut();
      
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Ensure user record exists in public.users
      if (data.user) {
        const { error: userError } = await supabase!
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email,
            created_at: data.user.created_at
          });
          
        if (userError) {
          console.error('Error ensuring user record:', userError);
        }
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password, name) => {
    if (!isSupabaseEnabled()) {
      set({ error: 'Authentication is not available', loading: false });
      throw new Error('Authentication is not available');
    }

    try {
      set({ loading: true, error: null });
      
      // First check if email already exists
      const { data: existingUser } = await supabase!
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Email already registered');
      }

      const { data, error } = await supabase!.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        try {
          // Ensure user record exists with name
          const { error: upsertError } = await supabase!
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email,
              name: name,
              created_at: new Date().toISOString()
            });
            
          if (upsertError) throw upsertError;
        } catch (userError) {
          console.error('Error ensuring user record:', userError);
          // Continue since auth signup succeeded
        }
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    if (!isSupabaseEnabled()) {
      set({ user: null, loading: false, error: null });
      return;
    }

    try {
      // Publish event before signing out
      window.dispatchEvent(new Event('auth:signout'));
      set({ loading: true, error: null });
      
      const { error } = await supabase!.auth.signOut();
      if (error) throw error;
      set({ user: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

// Set up auth state listener only if Supabase is enabled
if (isSupabaseEnabled()) {
  supabase!.auth.onAuthStateChange(async (event, session) => {
    console.log('Auth state change:', event, session?.user?.email);
    
    if (event === 'SIGNED_OUT') {
      // Clear session data
      useAuthStore.setState({ 
        user: null,
        loading: false,
        initialized: true
      });
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      useAuthStore.setState({
        user: session?.user ?? null,
        loading: false,
        initialized: true
      });
    } else if (event === 'INITIAL_SESSION') {
      useAuthStore.setState({
        user: session?.user ?? null,
        loading: false,
        initialized: true
      });
    }
  });
} else {
  // If Supabase is not enabled, set the store to initialized state with no user
  useAuthStore.setState({
    user: null,
    loading: false,
    initialized: true
  });
}

// Handle token refresh errors with a global error handler - only if Supabase is enabled
if (isSupabaseEnabled()) {
  try {
    // Current version of supabase-js doesn't support error in onAuthStateChange
    // So we'll use a global error event listener instead
    window.addEventListener('supabase.error', (e: Event) => {
      const customEvent = e as CustomEvent<{ error: Error }>;
      const error = customEvent.detail?.error;
      
      if (error?.message?.includes('Invalid Refresh Token') || 
          error?.message?.includes('Refresh Token Not Found')) {
        console.warn('Refresh token error detected, signing out user');
        // Force sign out to clear invalid tokens
        useAuthStore.getState().signOut().catch(err => {
          console.error('Error during forced sign out:', err);
          // Force reset state even if signOut fails
          useAuthStore.setState({
            user: null,
            loading: false,
            initialized: true,
            error: 'Your session has expired. Please log in again.'
          });
        });
      }
    });
    
    // Patch Supabase auth to dispatch errors to our handler
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const response = await originalFetch.apply(this, args);
      
      // Check for Supabase auth endpoint and errors
      if (args[0] && typeof args[0] === 'string' && 
          args[0].includes('/auth/v1/token') && 
          !response.ok) {
        try {
          const errorData = await response.clone().json();
          if (errorData?.error_description) {
            window.dispatchEvent(new CustomEvent('supabase.error', {
              detail: { error: new Error(errorData.error_description) }
            }));
          }
        } catch (e) {
          // Ignore JSON parsing errors
        }
      }
      
      return response;
    };
  } catch (e) {
    console.error('Error setting up auth error handlers:', e);
  }

  // Initialize auth state
  supabase!.auth.getSession().then(({ data: { session }, error }) => {
    if (error && (error.message.includes('Invalid Refresh Token') || error.message.includes('Refresh Token Not Found'))) {
      console.warn('Invalid refresh token detected during initialization');
      // Force sign out
      useAuthStore.setState({
        user: null,
        loading: false,
        initialized: true,
        error: 'Your session has expired. Please log in again.'
      });
      // Clear any lingering tokens
      supabase!.auth.signOut().catch(console.error);
    } else {
      useAuthStore.setState({
        user: session?.user ?? null,
        loading: false,
        initialized: true
      });
    }
  });
}