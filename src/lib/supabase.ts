import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a null client if environment variables are missing (for landing page only)
export const supabase = (!supabaseUrl || !supabaseAnonKey) 
  ? null 
  : createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is available
export const isSupabaseEnabled = () => supabase !== null;