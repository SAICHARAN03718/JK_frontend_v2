import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.warn('Supabase admin env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY')
}

// Create admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(url || '', serviceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
