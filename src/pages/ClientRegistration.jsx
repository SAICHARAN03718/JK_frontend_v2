import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Bell, 
  Settings, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Building2,
  MapPin,
  CheckCircle,
  AlertCircle,
  Save,
  Plus,
  X
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import { clientRegistrationService } from '../lib/clientRegistrationService';

// Template Field Component (moved outside to prevent re-creation)
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

// Form Section Component (moved outside)
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

// Configuration Section Component (moved outside)
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

const ClientRegistration = ({ onNavigateToDashboard, onNavigateToSearch, onNavigateToBulkBilling }) => {
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
    
    // Default branch info
    branchName: '',
    branchAddress: '',
    branchGstin: '',
    
    // Template fields
    templateFields: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = useCallback((field, value, section = null) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  }, []);

  // Add new template field
  const addTemplateField = useCallback(() => {
    const newField = {
      id: generateId(),
      fieldName: '',
      podRequirement: 'NOT_APPLICABLE',
      branchSpecific: false
    };
    setFormData(prev => ({
      ...prev,
      templateFields: [...prev.templateFields, newField]
    }));
  }, [generateId]);

  // Remove template field
  const removeTemplateField = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      templateFields: prev.templateFields.filter((_, i) => i !== index)
    }));
  }, []);

  // Update template field
  const updateTemplateField = useCallback((index, field, value) => {
    setFormData(prev => ({
      ...prev,
      templateFields: prev.templateFields.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const registrationData = {
        client: {
          clientName: formData.clientName,
          address: formData.address,
          gstin: formData.gstin
        },
        branch: formData.branchName ? {
          branchName: formData.branchName,
          branchAddress: formData.branchAddress,
          branchGstin: formData.branchGstin
        } : null,
        templateFields: formData.templateFields.filter(field => field.fieldName.trim())
      };

      const result = await clientRegistrationService.registerClient(registrationData);
      
      if (result.success) {
        setSubmitSuccess(true);
        
        // Reset form after success
        setTimeout(() => {
          setSubmitSuccess(false);
          setFormData({
            clientName: '',
            address: '',
            gstin: '',
            branchName: '',
            branchAddress: '',
            branchGstin: '',
            templateFields: []
          });
        }, 3000);
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

  // Memoized sections removed - not needed anymore

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-white/2 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Header */}
      <motion.header
        initial={false}
        animate={false}
        className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10"
      >
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/80 to-blue-600/80 rounded-xl flex items-center justify-center backdrop-blur-lg border border-white/20">
                <span className="text-white font-bold text-lg">JK</span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">JK LOGISTICS</h1>
                <p className="text-white/60 text-xs">Client Registration</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-white/70 hover:text-white bg-white/5 rounded-xl transition-all duration-300 backdrop-blur-lg border border-white/10"
              >
                <Bell className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-white/70 hover:text-white bg-white/5 rounded-xl transition-all duration-300 backdrop-blur-lg border border-white/10"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button 
                onClick={onNavigateToDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-3 py-2 rounded-xl transition-all duration-300 backdrop-blur-lg border border-blue-400/30"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-20">
        <div className="flex">
          {/* Shared Sidebar */}
          <Sidebar
            activeRoute={'client-registration'}
            counts={{ lrCount: 0, completedCount: 0 }}
            onRouteChange={(routeId) => {
              if (routeId === 'dashboard') return onNavigateToDashboard('dashboard')
              if (routeId === 'bulk-billing') return onNavigateToBulkBilling()
              if (routeId === 'lr-section') return onNavigateToDashboard('lr-section')
              if (routeId === 'completed') return onNavigateToDashboard('completed')
            }}
            onSearch={(term) => onNavigateToSearch(term, [])}
          />

          <div className="flex-1 px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Page Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              Register New Client
            </h2>
            <p className="text-white/70 text-lg">
              Add client details and configure billing preferences
            </p>
          </div>

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
            {/* Basic Information */}
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

            {/* Branch Information */}
            <FormSection title="Default Branch (Optional)" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Branch Name"
                  value={formData.branchName}
                  onChange={(value) => handleInputChange('branchName', value)}
                  placeholder="e.g., Main Office, Mumbai Branch"
                  icon={Building2}
                />
                <InputField
                  label="Branch GST Number"
                  value={formData.branchGstin}
                  onChange={(value) => handleInputChange('branchGstin', value)}
                  placeholder="15-digit GST Number for this branch"
                  icon={FileText}
                />
              </div>
              <InputField
                label="Branch Address"
                value={formData.branchAddress}
                onChange={(value) => handleInputChange('branchAddress', value)}
                placeholder="Complete branch address"
                icon={MapPin}
              />
            </FormSection>

            {/* Template Fields Configuration */}
            <TemplateFieldsSection
              title="Document Template Fields"
              icon={FileText}
              fields={formData.templateFields}
              onUpdateField={updateTemplateField}
              onRemoveField={removeTemplateField}
              onAddField={addTemplateField}
            />

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center pt-6"
            >
              <motion.button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.5)",
                  y: -2
                }}
                whileTap={{ 
                  scale: 0.98,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 17 
                }}
                className={`relative overflow-hidden flex items-center space-x-3 px-10 py-5 rounded-2xl text-white font-bold text-lg transition-all duration-500 group ${
                  isSubmitting || submitSuccess
                    ? 'bg-gray-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 shadow-2xl border border-blue-400/30 backdrop-blur-xl'
                }`}
              >
                {/* Animated background shine effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full transition-transform duration-1000 ${
                  !isSubmitting && !submitSuccess ? 'group-hover:translate-x-full' : ''
                }`} />
                
                {/* Glowing border effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-blue-400/50 opacity-0 transition-opacity duration-500 blur-sm ${
                  !isSubmitting && !submitSuccess ? 'group-hover:opacity-100' : ''
                }`} />
                
                {/* Button content */}
                <div className="relative z-10 flex items-center space-x-3">
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
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        <CheckCircle className="w-6 h-6" />
                      </motion.div>
                      <span>Client Registered!</span>
                    </>
                  ) : (
                    <>
                      <motion.div
                        whileHover={{ rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Save className="w-6 h-6" />
                      </motion.div>
                      <span className="tracking-wide">Register Client</span>
                      {/* Subtle pulse indicator */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-2 bg-white rounded-full ml-2"
                      />
                    </>
                  )}
                </div>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistration;
