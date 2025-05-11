import { create } from 'zustand';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'manager' | 'tenant' | null;

interface UserOrganization {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  organizations: UserOrganization[];
  currentOrganization: UserOrganization | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setCurrentOrganization: (org: UserOrganization) => void;
  loadUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  organizations: [],
  currentOrganization: null,
  isLoading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      // Load user data after successful sign in
      await get().loadUserData();
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      set({ 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      set({ 
        user: null,
        organizations: [],
        currentOrganization: null,
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setCurrentOrganization: (org: UserOrganization) => {
    set({ currentOrganization: org });
  },

  loadUserData: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) {
        set({ 
          user: null, 
          organizations: [], 
          currentOrganization: null, 
          isLoading: false 
        });
        return;
      }

      // Get user's organizations and roles
      const { data: userOrgs, error: orgsError } = await supabase
        .from('user_organizations')
        .select(`
          id,
          role,
          organizations (
            id,
            name
          )
        `)
        .eq('user_id', user.id);

      if (orgsError) throw orgsError;

      const organizations: UserOrganization[] = userOrgs.map(item => ({
        id: item.organizations.id,
        name: item.organizations.name,
        role: item.role as UserRole
      }));

      // Set current organization to the first one if none is selected
      const currentOrg = organizations.length > 0 ? organizations[0] : null;

      set({ 
        user, 
        organizations, 
        currentOrganization: currentOrg, 
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
