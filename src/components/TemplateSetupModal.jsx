import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X,
  FileText, 
  Upload,
  Eye,
  Settings,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { clientRegistrationService } from '../lib/clientRegistrationService';

const TemplateSetupModal = ({ client, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [manualFields, setManualFields] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const addManualField = () => {
    setManualFields(prev => ([...prev, { fieldName: '', podRequirement: 'NOT_APPLICABLE' }]));
  };
  const updateManualField = (index, patch) => {
    setManualFields(prev => prev.map((f, i) => i === index ? { ...f, ...patch } : f));
  };
  const removeManualField = (index) => {
    setManualFields(prev => prev.filter((_, i) => i !== index));
  };
  const saveManualFields = async () => {
    setSaving(true);
    setMessage('');
    try {
      const fields = manualFields
        .filter(f => (f.fieldName || '').trim())
        .map((f, i) => ({
          clientId: client.client_id,
          fieldName: f.fieldName,
          fieldKey: f.fieldName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
          displayOrder: i,
          podRequirement: f.podRequirement
        }));
      if (fields.length === 0) {
        setMessage('Add at least one field to save.');
        setSaving(false);
        return;
      }
      const res = await clientRegistrationService.createTemplateFields(fields);
      if (!res.success) throw new Error(res.error);
      setMessage('Fields saved. You can refine later via annotation tool.');
      setManualFields([]);
    } catch (e) {
      setMessage(e.message || 'Failed to save fields.');
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { id: 1, title: 'Upload Document', icon: Upload },
    { id: 2, title: 'Annotate Fields', icon: Settings },
    { id: 3, title: 'Review & Save', icon: CheckCircle }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Template Setup</h2>
              <p className="text-white/70">Configure document templates for {client.client_name}</p>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 text-white/50 hover:text-white bg-white/5 rounded-xl transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Step Progress */}
          <div className="flex items-center space-x-4 mt-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                    : 'bg-white/5 text-white/50 border border-white/10'
                }`}>
                  <step.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-px mx-2 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-blue-400' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">Template Annotation Tool</h3>
            <p className="text-yellow-200/80 text-lg mb-6">
              This feature is currently under development. The template annotation tool will allow you to:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <Upload className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="text-white font-semibold mb-2">Upload Sample Documents</h4>
                <p className="text-white/70 text-sm">Upload PDF invoices, PODs, and LRs from {client.client_name}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <Settings className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="text-white font-semibold mb-2">Visual Field Mapping</h4>
                <p className="text-white/70 text-sm">Click on document fields to map them to extraction rules</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <FileText className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="text-white font-semibold mb-2">OCR Integration</h4>
                <p className="text-white/70 text-sm">Automatic text recognition with coordinate-based extraction</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <Eye className="w-8 h-8 text-orange-400 mb-2" />
                <h4 className="text-white font-semibold mb-2">Preview & Test</h4>
                <p className="text-white/70 text-sm">Test extraction accuracy before going live</p>
              </div>
            </div>

            <div className="bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-xl p-4">
              <p className="text-blue-200 font-medium">
                Coming in Phase 2 of development (OCR Engine Integration)
              </p>
              <p className="text-blue-200/70 text-sm mt-1">
                For now, template fields have been saved and can be manually configured later.
              </p>
            </div>
          </motion.div>

          {/* Manual Fields (stopgap until annotation tool) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">Quick Add Base Fields</h4>
              <motion.button
                onClick={addManualField}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-3 py-2 rounded-xl border border-blue-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Field</span>
              </motion.button>
            </div>
            <div className="space-y-3">
              {manualFields.map((f, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={f.fieldName}
                    onChange={(e) => updateManualField(i, { fieldName: e.target.value })}
                    placeholder="Field Name"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  />
                  <select
                    value={f.podRequirement}
                    onChange={(e) => updateManualField(i, { podRequirement: e.target.value })}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option className="bg-slate-800" value="NOT_APPLICABLE">Not for POD</option>
                    <option className="bg-slate-800" value="MANDATORY">Mandatory for POD</option>
                  </select>
                  <button onClick={() => removeManualField(i)} className="px-3 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300">Remove</button>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-white/70">Adds base fields for all branches.</div>
              <motion.button
                onClick={saveManualFields}
                disabled={saving || manualFields.every(f => !f.fieldName.trim())}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-xl text-white ${saving || manualFields.every(f => !f.fieldName.trim()) ? 'bg-gray-500/50 cursor-not-allowed' : 'bg-green-600/80 hover:bg-green-500/80 border border-green-400/30'}`}
              >
                {saving ? 'Saving...' : 'Save Fields'}
              </motion.button>
            </div>
            {message && <div className="mt-3 text-sm text-white/80">{message}</div>}
          </motion.div>

          {/* Client Info Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
          >
            <h4 className="text-lg font-bold text-white mb-4">Client Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Client Name:</span>
                <span className="text-white ml-2 font-medium">{client.client_name}</span>
              </div>
              <div>
                <span className="text-white/60">Branches:</span>
                <span className="text-white ml-2 font-medium">{client.client_branches?.length || 0}</span>
              </div>
              {client.gstin && (
                <div>
                  <span className="text-white/60">GST Number:</span>
                  <span className="text-white ml-2 font-medium">{client.gstin}</span>
                </div>
              )}
              <div>
                <span className="text-white/60">Registration Date:</span>
                <span className="text-white ml-2 font-medium">
                  {new Date(client.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Close Button */}
          <div className="flex justify-end pt-6 border-t border-white/10 mt-6">
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-lg border border-blue-400/30"
            >
              <span>Close</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TemplateSetupModal;
