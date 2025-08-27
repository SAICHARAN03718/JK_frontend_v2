// duplicate safeguard (if file already existed this will overwrite) - ensure single export
import { supabase } from './supabaseClient'
export async function resolveFields(clientId, branchId) {
  let query = supabase.from('client_field_templates').select('*').eq('client_id', clientId)
  if (branchId) {
    query = query.or(`branch_id.is.null,branch_id.eq.${branchId}`)
  } else {
    query = query.is('branch_id', null)
  }
  const { data, error } = await query.order('display_order')
  if (error) throw error
  const map = new Map()
  for (const f of data) {
    if (!map.has(f.field_key) || f.branch_id) map.set(f.field_key, f)
  }
  return Array.from(map.values()).sort((a,b)=>(a.display_order??0)-(b.display_order??0))
}
