import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, X, AlertCircle, CheckCircle, Clock, Trash2 } from 'lucide-react'
import { uploadLrPdf, deriveLrNumber } from '../lib/lrService'

/**
 * Lightweight LR Upload component (frontend-only placeholder)
 * Responsibilities now:
 *  - Capture single PDF upload + minimal metadata (client, branch, optional LR number)
 *  - Basic validation (type / size) and in-memory list display
 *  - Emits onUpload callback with File + metadata so parent can persist / queue job
 * Future (server integration):
 *  - Direct upload to storage bucket (signed URL)
 *  - Show processing states streamed from backend (OCR, Pairing, Extracted)
 */
const MAX_SIZE_MB = 12

const statusStyles = {
  UPLOADED: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  PENDING: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  VALIDATED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
  ERROR: 'text-red-400 bg-red-400/10 border-red-400/30'
}

export default function LrUpload({ clients = [], onUpload = () => {}, uploads = [], onRemove = () => {}, onRefresh = () => {} }) {
  const [file, setFile] = useState(null)
  const [clientId, setClientId] = useState('')
  const [branchId, setBranchId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const selectedClient = useMemo(() => clients.find(c => c.client_id === Number(clientId)), [clients, clientId])
  const branches = useMemo(() => selectedClient?.client_branches || [], [selectedClient])

  const reset = () => { setFile(null); setError('') }

  const handleFileChange = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.type !== 'application/pdf') {
      setError('Only PDF files are allowed')
      return
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_SIZE_MB}MB limit`)
      return
    }
    setError('')
    setFile(f)
  }

  const disabled = !file || !clientId || uploading

  const submit = async () => {
    if (disabled) return
    setUploading(true)
    const result = await uploadLrPdf({ file, clientId: Number(clientId), branchId: branchId ? Number(branchId) : null })
    if (!result.success) {
      setError(result.error)
      setUploading(false)
      return
    }
    onUpload({
      id: result.data.lr_id,
      originalName: file.name,
      size: file.size,
      clientId: Number(clientId),
      branchId: branchId ? Number(branchId) : null,
      clientName: clients.find(c => c.client_id === Number(clientId))?.client_name || 'Unknown',
      branchName: (clients.find(c => c.client_id === Number(clientId))?.client_branches || []).find(b => b.branch_id === Number(branchId))?.branch_name,
      lrNumber: result.data.lr_number,
      status: 'Pending_Validation',
      createdAt: result.data.created_at,
      filePath: result.data.file_path
    })
    reset()
    setUploading(false)
    onRefresh()
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Upload className="w-6 h-6" />
          Upload Lorry Receipt PDF
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Client <span className="text-red-400">*</span></label>
            <select value={clientId} onChange={e => { setClientId(e.target.value); setBranchId('') }} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" className="bg-slate-800">Select client</option>
              {clients.map(c => <option key={c.client_id} value={c.client_id} className="bg-slate-800">{c.client_name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Branch (optional)</label>
            <select value={branchId} disabled={!branches.length} onChange={e => setBranchId(e.target.value)} className="w-full disabled:opacity-40 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" className="bg-slate-800">{branches.length ? 'All / Base' : 'No branches'}</option>
              {branches.map(b => <option key={b.branch_id} value={b.branch_id} className="bg-slate-800">{b.branch_name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Derived LR Number</label>
            <input disabled value={file ? deriveLrNumber(file.name) : ''} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white/70 placeholder-white/30 focus:outline-none" placeholder="Will appear after choosing file" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">PDF File <span className="text-red-400">*</span></label>
            <div className="relative">
              <input type="file" accept="application/pdf" onChange={handleFileChange} className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer" />
            </div>
            {file && (
              <div className="flex items-center justify-between text-xs text-white/60 bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                <span>{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</span>
                <button onClick={() => setFile(null)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
        {error && <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl mb-4"><AlertCircle className="w-4 h-4" />{error}</div>}
  <motion.button whileHover={{ scale: disabled ? 1 : 1.05 }} whileTap={{ scale: disabled ? 1 : 0.95 }} disabled={disabled} onClick={submit} className={`px-6 py-4 rounded-2xl font-semibold flex items-center gap-2 text-white transition-all ${disabled ? 'bg-white/10 text-white/40 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg'}`}>{uploading ? 'Uploading...' : 'Submit Upload'}</motion.button>
        <p className="mt-3 text-xs text-white/40">File stays local for now; backend extraction pipeline not yet wired.</p>
  <p className="mt-3 text-xs text-white/40">Uploaded & queued. Proceed to start extraction in the section below.</p>
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 lg:p-8 shadow-lg">
        <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5" /> Pending & Recent Uploads</h4>
        {!uploads.length && <div className="text-white/50 text-sm">No uploads yet.</div>}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {uploads.map(u => (
            <div key={u.id} className="flex items-start justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-white font-medium text-sm">{u.originalName}</span>
                  <span className={`text-[10px] tracking-wide px-2 py-1 rounded-lg border ${statusStyles[u.status] || statusStyles.PENDING}`}>{u.status}</span>
                </div>
                <div className="text-white/50 text-xs flex flex-wrap gap-2">
                  <span>Client: {u.clientName}</span>
                  {u.branchName && <span>• Branch: {u.branchName}</span>}
                  {u.lrNumber && <span>• LR: {u.lrNumber}</span>}
                  <span>• Size: {(u.size/1024/1024).toFixed(2)}MB</span>
                  <span>• Added: {new Date(u.createdAt).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {u.status === 'UPLOADED' && <Clock className="w-4 h-4 text-white/40" />}
                {u.status === 'VALIDATED' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                <button onClick={() => onRemove(u.id)} className="text-white/40 hover:text-red-400 transition" title="Remove"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
