import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  X,
  User, 
  FileText, 
  Building2,
  MapPin,
  CheckCircle,
  AlertCircle,
  Save,
  Plus
} from 'lucide-react';

import { clientRegistrationService } from '../lib/clientRegistrationService';

// Template Field Component (moved from original)
const TemplateField = ({ fieldData, onUpdateField, onRemove, fieldIndex }) => {
  const handleFieldNameChange = useCallback((e) => {
    onUpdateField(fieldIndex, 'fieldName', e.target.value);
  }, [onUpdateField, fieldIndex]);

  const handlePodRequirementChange = useCallback((e) => {
    onUpdateField(fieldIndex, 'podRequirement', e.target.value);
  }, [onUpdateField, fieldIndex]);

  const handleBranchSpecificChange = useCallback((e) => {
    onUpdateField(fieldIndex, 'branchSpecific', e.target.checked);
  }, [onUpdateField, fieldIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-1">
          <input
            type="text"
            value={fieldData.fieldName || ''}
            onChange={handleFieldNameChange}
            placeholder="Field Name (e.g., Vehicle Number, Invoice Date, GST Number)"
            className="w-full px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
            autoComplete="off"
          />
        </div>
        <motion.button
          type="button"
          onClick={() => onRemove(fieldIndex)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-300"
        >
          <X className="w-4 h-4 text-red-400" />
        </motion.button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <select
            value={fieldData.podRequirement || 'NOT_APPLICABLE'}
            onChange={handlePodRequirementChange}
            className="w-full px-3 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
          >
            <option value="NOT_APPLICABLE" className="bg-slate-800">Not Applicable for POD</option>
            <option value="MANDATORY" className="bg-slate-800">Mandatory for POD</option>
          </select>
        </div>
        <label className="flex items-center space-x-2 text-white/70">
          <input
            type="checkbox"
            checked={fieldData.branchSpecific || false}
            onChange={handleBranchSpecificChange}
            className="rounded text-blue-500 focus:ring-blue-500 focus:ring-opacity-50"
          />
          <span className="text-sm">Branch Specific</span>
        </label>
      </div>
    </motion.div>
  );
};

// Form Section Component
const FormSection = ({ title, icon: Icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4"
  >
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/80 to-blue-600/80 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    {children}
  </motion.div>
);

// Template Fields Section Component
const TemplateFieldsSection = ({ title, icon, fields, onUpdateField, onRemoveField, onAddField }) => {
  return (
    <FormSection title={title} icon={icon}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <TemplateField
            key={`template-field-${field.id || index}`}
            fieldData={field}
            onUpdateField={onUpdateField}
            onRemove={onRemoveField}
            fieldIndex={index}
          />
        ))}
        
        <motion.button
          type="button"
          onClick={onAddField}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl transition-all duration-300 text-blue-300 hover:text-blue-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Template Field</span>
        </motion.button>
      </div>
    </FormSection>
  );
};

const ClientRegistrationModal = ({ onClose, onSuccess }) => {
  // Use a ref to generate truly unique IDs
  const idCounter = React.useRef(0);
  const generateId = useCallback(() => {
    idCounter.current += 1;
    return `field_${Date.now()}_${idCounter.current}`;
  }, []);

  const [formData, setFormData] = useState({
    // Client basic info
    clientName: '',
    address: '',
    gstin: '',
    
    // Multiple branches support
    branches: [
      {
        id: 'branch_1',
        branchName: '',
        branchAddress: '',
        branchGstin: '',
        isDefault: true
      }
    ],
    
    // Template fields (client-level base fields)
    baseTemplateFields: [],
    
    // Branch-specific template fields
    branchTemplateFields: {}
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('client'); // 'client', 'branches', 'templates'

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Branch management functions
  const addBranch = useCallback(() => {
    const newBranch = {
      id: `branch_${Date.now()}`,
      branchName: '',
      branchAddress: '',
      branchGstin: '',
      isDefault: false
    };
    setFormData(prev => ({
      ...prev,
      branches: [...prev.branches, newBranch],
      branchTemplateFields: {
        ...prev.branchTemplateFields,
        [newBranch.id]: []
      }
    }));
  }, []);

  const removeBranch = useCallback((branchId) => {
    setFormData(prev => {
      const newBranchTemplateFields = { ...prev.branchTemplateFields };
      delete newBranchTemplateFields[branchId];
      
      return {
        ...prev,
        branches: prev.branches.filter(branch => branch.id !== branchId),
        branchTemplateFields: newBranchTemplateFields
      };
    });
  }, []);

  const updateBranch = useCallback((branchId, field, value) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.map(branch => 
        branch.id === branchId ? { ...branch, [field]: value } : branch
      )
    }));
  }, []);

  // Template field management functions
  const addBaseTemplateField = useCallback(() => {
    const newField = {
      id: generateId(),
      fieldName: '',
      podRequirement: 'NOT_APPLICABLE',
      branchSpecific: false
    };
    setFormData(prev => ({
      ...prev,
      baseTemplateFields: [...prev.baseTemplateFields, newField]
    }));
  }, [generateId]);

  const removeBaseTemplateField = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      baseTemplateFields: prev.baseTemplateFields.filter((_, i) => i !== index)
    }));
  }, []);

  const updateBaseTemplateField = useCallback((index, field, value) => {
    setFormData(prev => ({
      ...prev,
      baseTemplateFields: prev.baseTemplateFields.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const addBranchTemplateField = useCallback((branchId) => {
    const newField = {
      id: generateId(),
      fieldName: '',
      podRequirement: 'NOT_APPLICABLE',
      branchSpecific: true
    };
    setFormData(prev => ({
      ...prev,
      branchTemplateFields: {
        ...prev.branchTemplateFields,
        [branchId]: [...(prev.branchTemplateFields[branchId] || []), newField]
      }
    }));
  }, [generateId]);

  const removeBranchTemplateField = useCallback((branchId, index) => {
    setFormData(prev => ({
      ...prev,
      branchTemplateFields: {
        ...prev.branchTemplateFields,
        [branchId]: prev.branchTemplateFields[branchId].filter((_, i) => i !== index)
      }
    }));
  }, []);

  const updateBranchTemplateField = useCallback((branchId, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      branchTemplateFields: {
        ...prev.branchTemplateFields,
        [branchId]: prev.branchTemplateFields[branchId].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Prepare client data
      const clientData = {
        clientName: formData.clientName,
        address: formData.address,
        gstin: formData.gstin || null
      };

      // Prepare branches data (filter out empty branches)
      const branchesData = formData.branches
        .filter(branch => branch.branchName.trim())
        .map(branch => ({
          branchName: branch.branchName,
          branchAddress: branch.branchAddress,
          branchGstin: branch.branchGstin || null
        }));

      // Prepare base template fields
      const baseTemplateFields = formData.baseTemplateFields
        .filter(field => field.fieldName.trim())
        .map((field, index) => ({
          fieldName: field.fieldName,
          fieldKey: field.fieldName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          displayOrder: index,
          podRequirement: field.podRequirement
        }));

      // For now, use the old registration format for compatibility
      const registrationData = {
        client: clientData,
        branches: branchesData.length > 0 ? branchesData : null,
        templateFields: baseTemplateFields
      };

      const result = await clientRegistrationService.registerClient(registrationData);
      
      if (result.success) {
        setSubmitSuccess(true);
        
        // Close modal and trigger parent refresh after success
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = useCallback(({ 
    label, 
    value, 
    onChange, 
    type = 'text', 
    placeholder, 
    icon: Icon,
    required = false 
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white/90">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Icon className="w-5 h-5 text-white/50" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300`}
        />
      </div>
    </div>
  ), []);

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
        className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Register New Client</h2>
              <p className="text-white/70">Add client details and configure billing preferences</p>
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
          {/* Success Message */}
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-2xl p-4 flex items-center space-x-3"
            >
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <h4 className="font-semibold text-green-300">Registration Successful!</h4>
                <p className="text-green-200/80 text-sm">Client has been registered successfully.</p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-4 flex items-center space-x-3"
            >
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <h4 className="font-semibold text-red-300">Registration Failed</h4>
                <p className="text-red-200/80 text-sm">{errorMessage}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
              {['client', 'branches', 'templates'].map((tab) => (
                <motion.button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'client' && 'Client Info'}
                  {tab === 'branches' && 'Branches'}
                  {tab === 'templates' && 'Template Fields'}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {/* Client Information Tab */}
              {activeTab === 'client' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <FormSection title="Basic Information" icon={User}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="Client Name"
                        value={formData.clientName}
                        onChange={(value) => handleInputChange('clientName', value)}
                        placeholder="Enter client name"
                        icon={User}
                        required
                      />
                      <InputField
                        label="GST Number"
                        value={formData.gstin}
                        onChange={(value) => handleInputChange('gstin', value)}
                        placeholder="15-digit GST Number"
                        icon={FileText}
                      />
                    </div>
                    <InputField
                      label="Address"
                      value={formData.address}
                      onChange={(value) => handleInputChange('address', value)}
                      placeholder="Complete address"
                      icon={MapPin}
                    />
                  </FormSection>
                </motion.div>
              )}

              {/* Branches Tab */}
              {activeTab === 'branches' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <FormSection title="Branch Management" icon={Building2}>
                    <div className="space-y-6">
                      {formData.branches.map((branch, index) => (
                        <motion.div
                          key={branch.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold text-white">
                              {branch.isDefault ? 'Default Branch' : `Branch ${index + 1}`}
                            </h4>
                            {!branch.isDefault && formData.branches.length > 1 && (
                              <motion.button
                                type="button"
                                onClick={() => removeBranch(branch.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-300"
                              >
                                <X className="w-4 h-4 text-red-400" />
                              </motion.button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField
                              label="Branch Name"
                              value={branch.branchName}
                              onChange={(value) => updateBranch(branch.id, 'branchName', value)}
                              placeholder="e.g., Main Office, Mumbai Branch"
                              icon={Building2}
                              required={branch.isDefault}
                            />
                            <InputField
                              label="Branch GST Number"
                              value={branch.branchGstin}
                              onChange={(value) => updateBranch(branch.id, 'branchGstin', value)}
                              placeholder="15-digit GST Number for this branch"
                              icon={FileText}
                            />
                          </div>
                          <InputField
                            label="Branch Address"
                            value={branch.branchAddress}
                            onChange={(value) => updateBranch(branch.id, 'branchAddress', value)}
                            placeholder="Complete branch address"
                            icon={MapPin}
                          />
                        </motion.div>
                      ))}
                      
                      <motion.button
                        type="button"
                        onClick={addBranch}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center space-x-2 p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 rounded-xl transition-all duration-300 text-green-300 hover:text-green-200"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add New Branch</span>
                      </motion.button>
                    </div>
                  </FormSection>
                </motion.div>
              )}

              {/* Template Fields Tab */}
              {activeTab === 'templates' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {/* Base Template Fields */}
                  <TemplateFieldsSection
                    title="Base Template Fields (Apply to All Branches)"
                    icon={FileText}
                    fields={formData.baseTemplateFields}
                    onUpdateField={updateBaseTemplateField}
                    onRemoveField={removeBaseTemplateField}
                    onAddField={addBaseTemplateField}
                  />

                  {/* Branch-Specific Template Fields */}
                  {formData.branches.map((branch) => (
                    branch.branchName.trim() && (
                      <motion.div
                        key={branch.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <TemplateFieldsSection
                          title={`${branch.branchName} - Specific Fields`}
                          icon={Building2}
                          fields={formData.branchTemplateFields[branch.id] || []}
                          onUpdateField={(index, field, value) => updateBranchTemplateField(branch.id, index, field, value)}
                          onRemoveField={(index) => removeBranchTemplateField(branch.id, index)}
                          onAddField={() => addBranchTemplateField(branch.id)}
                        />
                      </motion.div>
                    )
                  ))}
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-white/10">
              <motion.button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                whileHover={{ 
                  scale: isSubmitting || submitSuccess ? 1 : 1.05,
                }}
                whileTap={{ 
                  scale: isSubmitting || submitSuccess ? 1 : 0.98,
                }}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-500 ${
                  isSubmitting || submitSuccess
                    ? 'bg-gray-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 shadow-2xl border border-blue-400/30 backdrop-blur-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                    />
                    <span>Registering Client...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span>Client Registered!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    <span>Register Client</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClientRegistrationModal;
