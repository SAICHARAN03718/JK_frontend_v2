import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, Save, CheckCircle, AlertTriangle } from 'lucide-react'
import { fetchInvoicesByLr, saveInvoiceCustomData, validateLr } from '../lib/extractionService'
import { resolveFields } from '../lib/fieldResolver'

export default function LrValidationModal({ lr, clientId, branchId, open, onClose, onValidated }) {
  const [loading, setLoading] = useState(false)
  const [invoices, setInvoices] = useState([])
  const [fields, setFields] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [edited, setEdited] = useState({})

  useEffect(() => {
    if (open && lr?.id) {
      (async () => {
        setLoading(true)
        try {
          const [inv, flds] = await Promise.all([
            fetchInvoicesByLr(lr.id),
            resolveFields(clientId, branchId)
          ])
          setInvoices(inv)
          setFields(flds)
          const initial = {}
            inv.forEach(i => { initial[i.invoice_id] = { ...(i.custom_data || {}) } })
          setEdited(initial)
        } catch (e) { setError(e.message) } finally { setLoading(false) }
      })()
    }
  }, [open, lr?.id, clientId, branchId])

  const allSaved = useMemo(() => invoices.length>0 && invoices.every(i => edited[i.invoice_id] && Object.keys(edited[i.invoice_id]).length>0), [invoices, edited])

  const handleFieldChange = (invoiceId, fieldKey, value) => {
    setEdited(prev => ({ ...prev, [invoiceId]: { ...(prev[invoiceId]||{}), [fieldKey]: value } }))
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      for (const inv of invoices) {
        await saveInvoiceCustomData(inv.invoice_id, edited[inv.invoice_id] || {})
      }
      if (allSaved) {
        await validateLr(lr.id)
        onValidated?.(lr.id)
      }
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }} className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Validate LR: {lr.lrNumber}</h3>
              <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-6 h-6"/></button>
            </div>
            {error && <div className="mb-4 text-sm text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl">{error}</div>}
            {loading ? (
              <div className="flex items-center justify-center py-20 text-white/60"><Loader2 className="w-6 h-6 mr-2 animate-spin"/> Loading invoices...</div>
            ) : (
              <div className="space-y-8 overflow-y-auto pr-2 max-h-[60vh]">
                {invoices.map(inv => (
                  <div key={inv.invoice_id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">Invoice: {inv.invoice_number}</h4>
                      {edited[inv.invoice_id] && Object.keys(edited[inv.invoice_id]).length>0 && <CheckCircle className="w-5 h-5 text-emerald-400"/>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {fields.map(f => (
                        <div key={f.field_key} className="space-y-1">
                          <label className="text-xs uppercase tracking-wide text-white/50 font-medium">{f.field_name}</label>
                          <input
                            value={edited[inv.invoice_id]?.[f.field_key] || ''}
                            onChange={e => handleFieldChange(inv.invoice_id, f.field_key, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/30 text-sm"
                            placeholder={`Enter ${f.field_name}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-white/40">OCR Data: {JSON.stringify(inv.raw_ocr_data?.fields?.slice(0,3) || [])}...</div>
                  </div>
                ))}
                {invoices.length === 0 && <div className="text-center py-20 text-white/50">No invoices extracted yet <AlertTriangle className="w-5 h-5 inline ml-2"/></div>}
              </div>
            )}
            <div className="mt-6 flex items-center justify-end gap-4">
              <button onClick={onClose} className="px-5 py-3 rounded-xl text-white/60 hover:text-white">Close</button>
              <button disabled={saving || invoices.length===0} onClick={saveAll} className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 text-white ${saving?'bg-white/10 cursor-not-allowed':'bg-blue-600 hover:bg-blue-500'} `}>
                {saving && <Loader2 className="w-4 h-4 animate-spin"/>}
                <Save className="w-4 h-4"/> {allSaved? 'Save & Mark Validated':'Save Draft'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
