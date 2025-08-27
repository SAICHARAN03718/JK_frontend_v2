import { supabase } from './supabaseClient'

// Utility: derive LR number from filename (strip extension + sanitize spaces -> underscores)
export function deriveLrNumber(filename) {
  if (!filename) return null
  const base = filename.replace(/\.[^.]+$/, '')
  return base.trim().replace(/[^A-Za-z0-9-_]+/g, '_').slice(0, 100)
}

/**
 * Upload LR PDF to storage bucket and create lorry_receipts row.
 * NOTE: trip_date is temporarily current date until extraction replaces it.
 */
export async function uploadLrPdf({ file, clientId, branchId }) {
  const lr_number = deriveLrNumber(file.name)
  const path = `lr/${clientId}/${Date.now()}_${file.name}`
  // Upload file to bucket (assumes 'source_documents' bucket exists & policy allows write)
  const { error: uploadError } = await supabase.storage.from('source_documents').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'application/pdf'
  })
  if (uploadError) {
    return { success: false, error: `Upload failed: ${uploadError.message}` }
  }

  // Insert lorry_receipts row
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase.from('lorry_receipts').insert([{
    client_id: clientId,
    branch_id: branchId || null,
    lr_number,
    trip_date: today,
    source_document_path: path
  }]).select('*').single()

  if (error) {
    return { success: false, error: `DB insert failed: ${error.message}` }
  }

  return { success: true, data: { ...data, file_path: path } }
}

export async function fetchLorryReceipts({ clientId = null, branchId = null, limit = 100 }) {
  let query = supabase.from('lorry_receipts').select('*').order('created_at', { ascending: false }).limit(limit)
  if (clientId) query = query.eq('client_id', clientId)
  if (branchId) query = query.eq('branch_id', branchId)
  const { data, error } = await query
  if (error) return { success: false, error: error.message }
  return { success: true, data }
}
