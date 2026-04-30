import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// For Client Components
export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// For standard browser usage where we don't need SSR auth parsing
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

