import { BACKEND_BASE_URL } from './config'
import { supabase } from './supabaseClient'

export async function startExtractionJob(lrId) {
  const res = await fetch(`${BACKEND_BASE_URL}/jobs/lr/${lrId}`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start job')
  return res.json()
}

export async function getJob(jobId) {
  const res = await fetch(`${BACKEND_BASE_URL}/jobs/${jobId}`)
  if (!res.ok) throw new Error('Job not found')
  return res.json()
}

export async function fetchInvoicesByLr(lrId) {
  const res = await fetch(`${BACKEND_BASE_URL}/lr/${lrId}/invoices`)
  if (!res.ok) throw new Error('Failed to fetch invoices')
  const json = await res.json()
  return json.data || []
}

export async function saveInvoiceCustomData(invoiceId, customData) {
  const res = await fetch(`${BACKEND_BASE_URL}/invoice/${invoiceId}/validate`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ custom_data: customData }) })
  if (!res.ok) throw new Error('Save failed')
  return res.json()
}

export async function validateLr(lrId) {
  const res = await fetch(`${BACKEND_BASE_URL}/lr/${lrId}/validate`, { method:'POST' })
  if (!res.ok) throw new Error('LR validation failed')
  return res.json()
}

export async function refreshLrRecord(lrId) {
  const { data, error } = await supabase.from('lorry_receipts').select('*').eq('lr_id', lrId).single()
  if (error) throw error
  return data
}
