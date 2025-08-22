import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL
const anonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in env')
  process.exit(1)
}

const supabase = createClient(url, anonKey)

async function main() {
  console.log('Checking Supabase connectivity...')
  console.log('Project URL:', url)

  // Try a lightweight head-count select on an expected table
  try {
    const { error, count, status } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Clients table check error:', error.message)
    } else {
      console.log(`Clients table reachable. HTTP ${status}. Row count (if available):`, count ?? 'n/a')
    }
  } catch (e) {
    console.error('Unexpected error hitting clients:', e.message)
  }

  // Also test a simple anon auth call (should succeed with anon key)
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Auth session check error:', error.message)
    } else {
      console.log('Auth session check OK (anon). Has session?', Boolean(data?.session))
    }
  } catch (e) {
    console.error('Unexpected error during auth check:', e.message)
  }
}

main().catch(err => {
  console.error('Health check failed:', err)
  process.exit(1)
})
