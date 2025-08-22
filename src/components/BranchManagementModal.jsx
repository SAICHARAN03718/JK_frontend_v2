import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Plus,
  Building2,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Save,
  Trash2
} from 'lucide-react';

import { clientRegistrationService } from '../lib/clientRegistrationService';
import BranchTemplateFieldsModal from './BranchTemplateFieldsModal';

// Shared InputField component to prevent re-creation
const InputField = ({ label, value, onChange, placeholder, icon: Icon }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-white/90">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Icon className="w-4 h-4 text-white/50" />
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300`}
      />
    </div>
  </div>
);

// Branch Item Component
const BranchItem = React.memo(({ branch, onUpdate, onRemove, canRemove = true, onOpenTemplates }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    branchName: branch.branch_name || '',
    branchAddress: branch.branch_address || '',
    branchGstin: branch.branch_gstin || ''
  });
  // For new branches, allow entering template fields inline
  const [newTemplateFields, setNewTemplateFields] = useState([
    { fieldName: '', podRequirement: 'NOT_APPLICABLE' }
  ]);

  const handleSave = () => {
    const payload = branch?.isNew
      ? { ...editData, templateFields: newTemplateFields }
      : editData;
    onUpdate(branch.branch_id, payload);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      branchName: branch.branch_name || '',
      branchAddress: branch.branch_address || '',
      branchGstin: branch.branch_gstin || ''
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4"
    >
      {/* Branch Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Building2 className="w-5 h-5" />
          <span>{branch.branch_name || 'New Branch'}</span>
        </h4>
        <div className="flex space-x-2">
          {!isEditing ? (
            <>
              <motion.button
                onClick={() => onOpenTemplates && onOpenTemplates(branch)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-all duration-300 text-sm"
              >
                Template Fields
              </motion.button>
              <motion.button
                onClick={() => setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-all duration-300 text-sm"
              >
                Edit
              </motion.button>
              {canRemove && (
                <motion.button
                  onClick={() => onRemove(branch.branch_id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all duration-300 text-sm"
                >
                  Remove
                </motion.button>
              )}
            </>
          ) : (
            <>
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-all duration-300 text-sm"
              >
                Save
              </motion.button>
              <motion.button
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-all duration-300 text-sm"
              >
                Cancel
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Branch Details */}
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Branch Name"
            value={editData.branchName}
            onChange={(value) => setEditData(prev => ({ ...prev, branchName: value }))}
            placeholder="e.g., Mumbai Branch, Main Office"
            icon={Building2}
          />
          <InputField
            label="Branch GST Number"
            value={editData.branchGstin}
            onChange={(value) => setEditData(prev => ({ ...prev, branchGstin: value }))}
            placeholder="15-digit GST Number"
            icon={FileText}
          />
          <div className="md:col-span-2">
            <InputField
              label="Branch Address"
              value={editData.branchAddress}
              onChange={(value) => setEditData(prev => ({ ...prev, branchAddress: value }))}
              placeholder="Complete branch address"
              icon={MapPin}
            />
          </div>
          {branch?.isNew && (
            <div className="md:col-span-2 mt-2">
              <div className="text-white/80 font-semibold mb-2">Branch-Specific Template Fields</div>
              <div className="space-y-2">
                {newTemplateFields.map((f, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={f.fieldName}
                      onChange={(e) => setNewTemplateFields(prev => prev.map((x, idx) => idx === i ? { ...x, fieldName: e.target.value } : x))}
                      placeholder="Field Name"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    />
                    <select
                      value={f.podRequirement}
                      onChange={(e) => setNewTemplateFields(prev => prev.map((x, idx) => idx === i ? { ...x, podRequirement: e.target.value } : x))}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      <option className="bg-slate-800" value="NOT_APPLICABLE">Not applicable for POD</option>
                      <option className="bg-slate-800" value="MANDATORY">Mandatory for POD</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setNewTemplateFields(prev => prev.filter((_, idx) => idx !== i))}
                      className="px-3 py-2 bg-red-500/20 border border-red-400/30 rounded-lg text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewTemplateFields(prev => [...prev, { fieldName: '', podRequirement: 'NOT_APPLICABLE' }])}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded-lg border border-blue-400/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Field</span>
                </button>
                <div className="text-xs text-white/50">These fields will be created for this branch after you save.</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2 text-white/70">
          {branch.branch_address && (
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{branch.branch_address}</span>
            </div>
          )}
          {branch.branch_gstin && (
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm">GST: {branch.branch_gstin}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
});

const BranchManagementModal = ({ client, onClose, onSuccess }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openBranchForTemplates, setOpenBranchForTemplates] = useState(null);

  // Load existing branches
  useEffect(() => {
    if (client && client.client_branches) {
      setBranches(client.client_branches);
      setLoading(false);
    }
  }, [client]);

  // Add new branch
  const addNewBranch = useCallback(() => {
    const newBranch = {
      branch_id: `temp_${Date.now()}`, // Temporary ID for new branches
      branch_name: '',
      branch_address: '',
      branch_gstin: '',
      isNew: true
    };
    setBranches(prev => [...prev, newBranch]);
  }, []);

  // Update branch
  const updateBranch = useCallback(async (branchId, branchData) => {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const branch = branches.find(b => b.branch_id === branchId);
      
      if (branch?.isNew) {
        // Create new branch
        const result = await clientRegistrationService.createBranch({
          clientId: client.client_id,
          branchName: branchData.branchName,
          branchAddress: branchData.branchAddress,
          branchGstin: branchData.branchGstin
        });

        if (result.success) {
          setBranches(prev => prev.map(b => 
            b.branch_id === branchId 
              ? { ...result.data, isNew: false }
              : b
          ));
          setSuccessMessage('Branch created successfully!');
          // If any inline template fields were provided for the new branch, create them now
          const tf = (branchData.templateFields || [])
            .filter(f => (f.fieldName || '').trim())
            .map((f, i) => ({
              clientId: client.client_id,
              branchId: result.data.branch_id,
              fieldName: f.fieldName,
              fieldKey: f.fieldName.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
              displayOrder: i,
              podRequirement: f.podRequirement || 'NOT_APPLICABLE'
            }));
          if (tf.length > 0) {
            await clientRegistrationService.createTemplateFields(tf);
          }
          // Optionally open modal for further edits
          setOpenBranchForTemplates(result.data);
          setTimeout(() => onSuccess(), 1500);
        } else {
          setErrorMessage(result.error);
        }
      } else {
        // Update existing branch
        const result = await clientRegistrationService.updateBranch(branchId, {
          branchName: branchData.branchName,
          branchAddress: branchData.branchAddress,
          branchGstin: branchData.branchGstin
        });

        if (result.success) {
          setBranches(prev => prev.map(b => 
            b.branch_id === branchId 
              ? { ...b, branch_name: branchData.branchName, branch_address: branchData.branchAddress, branch_gstin: branchData.branchGstin }
              : b
          ));
          setSuccessMessage('Branch updated successfully!');
        } else {
          setErrorMessage(result.error);
        }
      }
    } catch (error) {
      setErrorMessage('Failed to save branch. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [branches, client, onSuccess]);

  // Remove branch
  const removeBranch = useCallback(async (branchId) => {
    const branch = branches.find(b => b.branch_id === branchId);
    
    if (branch?.isNew) {
      // Just remove from local state for new branches
      setBranches(prev => prev.filter(b => b.branch_id !== branchId));
    } else {
      // Delete existing branch from database
      try {
        const result = await clientRegistrationService.deleteBranch(branchId);
        if (result.success) {
          setBranches(prev => prev.filter(b => b.branch_id !== branchId));
          setSuccessMessage('Branch removed successfully!');
        } else {
          setErrorMessage(result.error);
        }
      } catch (error) {
        setErrorMessage('Failed to remove branch. Please try again.');
      }
    }
  }, [branches]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
              <h2 className="text-2xl font-bold text-white">Manage Branches</h2>
              <p className="text-white/70">{client?.client_name} - Branch Management</p>
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
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Success/Error Messages */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-4 flex items-center space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
                <div>
                  <h4 className="font-semibold text-green-300">Success!</h4>
                  <p className="text-green-200/80 text-sm">{successMessage}</p>
                </div>
              </motion.div>
            )}

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mb-6 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4 flex items-center space-x-3"
              >
                <AlertCircle className="w-6 h-6 text-red-400" />
                <div>
                  <h4 className="font-semibold text-red-300">Error</h4>
                  <p className="text-red-200/80 text-sm">{errorMessage}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Branches List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Client Branches</h3>
              <motion.button
                onClick={addNewBranch}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-lg border border-blue-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>Add Branch</span>
              </motion.button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full"
                />
              </div>
            ) : branches.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Building2 className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No branches yet</h3>
                <p className="text-white/60 mb-6">Add your first branch to get started</p>
                <motion.button
                  onClick={addNewBranch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-lg border border-blue-400/30 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add First Branch</span>
                </motion.button>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {branches.map((branch) => (
                  <BranchItem
                    key={branch.branch_id}
                    branch={branch}
                    onUpdate={updateBranch}
                    onRemove={removeBranch}
                    canRemove={branches.length > 1}
                    onOpenTemplates={(b) => setOpenBranchForTemplates(b)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        {openBranchForTemplates && (
          <BranchTemplateFieldsModal
            client={client}
            branch={openBranchForTemplates}
            onClose={() => setOpenBranchForTemplates(null)}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

export default BranchManagementModal;
