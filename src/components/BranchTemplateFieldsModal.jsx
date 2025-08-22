import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { clientRegistrationService } from '../lib/clientRegistrationService';

const BranchTemplateFieldsModal = ({ client, branch, onClose }) => {
  const [fields, setFields] = useState([]);
  const [newFields, setNewFields] = useState([{ fieldName: '', podRequirement: 'NOT_APPLICABLE' }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const clientId = client?.client_id;
  const branchId = branch?.branch_id;

  const load = async () => {
    if (!clientId || !branchId) return;
    setLoading(true);
    setError('');
    try {
      const res = await clientRegistrationService.getClientTemplateFields(clientId, branchId);
      if (!res.success) throw new Error(res.error);
      const branchOnly = (res.data || []).filter(f => f.branch_id === branchId);
      setFields(branchOnly);
    } catch (e) {
      setError(e.message || 'Failed to load fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [clientId, branchId]);

  const addRow = () => setNewFields(prev => [...prev, { fieldName: '', podRequirement: 'NOT_APPLICABLE' }]);
  const updateRow = (i, patch) => setNewFields(prev => prev.map((f, idx) => idx === i ? { ...f, ...patch } : f));
  const removeRow = (i) => setNewFields(prev => prev.filter((_, idx) => idx !== i));

  const save = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const toCreate = newFields
        .filter(f => (f.fieldName || '').trim())
        .map((f, i) => ({
          clientId,
          branchId,
          fieldName: f.fieldName,
          fieldKey: f.fieldName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          displayOrder: (fields?.length || 0) + i,
          podRequirement: f.podRequirement || 'NOT_APPLICABLE'
        }));
      if (toCreate.length === 0) {
        setError('Add at least one field');
        setSaving(false);
        return;
      }
      const res = await clientRegistrationService.createTemplateFields(toCreate);
      if (!res.success) throw new Error(res.error);
      setMessage('Fields added');
      setNewFields([{ fieldName: '', podRequirement: 'NOT_APPLICABLE' }]);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to save fields');
    } finally {
      setSaving(false);
    }
  };

  const deleteField = async (fieldId) => {
    try {
      const res = await clientRegistrationService.deleteTemplateField(fieldId);
      if (!res.success) throw new Error(res.error);
      await load();
    } catch (e) {
      setError(e.message || 'Failed to delete field');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-lg">Branch Template Fields</div>
            <div className="text-white/70 text-sm">{client?.client_name} — {branch?.branch_name}</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/5 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-sm rounded-xl p-3 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="bg-green-500/20 border border-green-400/30 text-green-200 text-sm rounded-xl p-3 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{message}</span>
            </div>
          )}

          <div>
            <div className="text-white/80 font-semibold mb-2">Existing Fields</div>
            {loading ? (
              <div className="text-white/60 text-sm">Loading…</div>
            ) : fields.length === 0 ? (
              <div className="text-white/60 text-sm">No branch-specific fields yet.</div>
            ) : (
              <div className="space-y-2">
                {fields.map(f => (
                  <div key={f.field_id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                    <div className="text-white text-sm flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">{f.field_name}</span>
                      <span className="text-white/60">({f.pod_requirement})</span>
                    </div>
                    <button onClick={() => deleteField(f.field_id)} className="text-red-300 hover:text-red-200 p-2 rounded-lg bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-white/80 font-semibold">Add New Fields</div>
            {newFields.map((nf, i) => (
              <div key={i} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={nf.fieldName}
                  onChange={(e) => updateRow(i, { fieldName: e.target.value })}
                  placeholder="Field Name"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
                <select
                  value={nf.podRequirement}
                  onChange={(e) => updateRow(i, { podRequirement: e.target.value })}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  <option className="bg-slate-800" value="NOT_APPLICABLE">Not applicable for POD</option>
                  <option className="bg-slate-800" value="MANDATORY">Mandatory for POD</option>
                </select>
                <button onClick={() => removeRow(i)} className="px-3 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300">Remove</button>
              </div>
            ))}
            <button onClick={() => setNewFields(prev => [...prev, { fieldName: '', podRequirement: 'NOT_APPLICABLE' }])} className="flex items-center space-x-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-lg border border-blue-400/30">
              <Plus className="w-4 h-4" />
              <span>Add Row</span>
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={save}
              disabled={saving || newFields.every(f => !f.fieldName.trim())}
              className={`px-5 py-2 rounded-xl text-white ${saving || newFields.every(f => !f.fieldName.trim()) ? 'bg-gray-500/50 cursor-not-allowed' : 'bg-green-600/80 hover:bg-green-500/80 border border-green-400/30'}`}
            >
              {saving ? 'Saving…' : 'Save Fields'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BranchTemplateFieldsModal;
