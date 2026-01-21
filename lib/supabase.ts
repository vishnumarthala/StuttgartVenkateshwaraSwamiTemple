import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client (for public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with cookie support (for authenticated operations)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component - cookies are read-only
        }
      },
    },
  });
}

// Browser Supabase client for client components
export function createBrowserSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Check if user is an admin
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  return !error && !!data;
}

// Get current admin user info
export async function getAdminUser(userId: string) {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) return null;
  return data;
}
