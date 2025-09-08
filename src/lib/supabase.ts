import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid environment variables (not placeholders)
const hasValidConfig = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('http');

// Create a null client for landing page (no Supabase needed)
export const supabase = hasValidConfig 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is available
export const isSupabaseEnabled = () => supabase !== null;