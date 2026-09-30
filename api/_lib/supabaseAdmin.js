import { createClient } from '@supabase/supabase-js'

// Server-side client with the service role key: bypasses RLS. Never expose to the browser.
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase admin not configured')
  return createClient(url, key, { auth: { persistSession: false } })
}
