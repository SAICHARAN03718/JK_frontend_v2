import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Bell, 
  Settings, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Package,
  Receipt,
  CheckCircle,
  AlertCircle,
  Save,
  Plus,
  X
} from 'lucide-react';

const ClientRegistration = ({ onNavigateToDashboard }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    whatsappNo: '',
    email: '',
    invoice1Fields: [],
    invoice2Fields: [],
    podFields: [],
    billFields: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field, value, section = null) => {
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
  };

  // Add new field to a configuration section
  const addField = (section) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], { fieldName: '' }]
    }));
  };

  // Remove field from a configuration section
  const removeField = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Update field in a configuration section
  const updateField = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          clientName: '',
          whatsappNo: '',
          email: '',
          invoice1Fields: [],
          invoice2Fields: [],
          podFields: [],
          billFields: []
        });
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ 
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
  );

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

  // Dynamic Field Component
  const DynamicField = ({ fieldData, onUpdateFieldName, onRemove }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10"
    >
      <div className="flex-1">
        <input
          type="text"
          value={fieldData.fieldName}
          onChange={(e) => onUpdateFieldName(e.target.value)}
          placeholder="Field Name (e.g., GST Number, Consignee Name, Payment Terms)"
          className="w-full px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
        />
      </div>
      <motion.button
        type="button"
        onClick={onRemove}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg transition-all duration-300"
      >
        <X className="w-4 h-4 text-red-400" />
      </motion.button>
    </motion.div>
  );

  // Configuration Section Component
  const ConfigurationSection = ({ title, icon, sectionKey, fields }) => (
    <FormSection title={title} icon={icon}>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <DynamicField
            key={index}
            fieldData={field}
            onUpdateFieldName={(value) => updateField(sectionKey, index, 'fieldName', value)}
            onRemove={() => removeField(sectionKey, index)}
          />
        ))}
        
        <motion.button
          type="button"
          onClick={() => addField(sectionKey)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl transition-all duration-300 text-blue-300 hover:text-blue-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add Field</span>
        </motion.button>
      </div>
    </FormSection>
  );

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
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
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
      <div className="pt-20 px-6 pb-10">
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
                  label="WhatsApp Number"
                  value={formData.whatsappNo}
                  onChange={(value) => handleInputChange('whatsappNo', value)}
                  placeholder="+91 XXXXX XXXXX"
                  icon={Phone}
                  required
                />
              </div>
              <InputField
                label="Email Address"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                type="email"
                placeholder="client@example.com"
                icon={Mail}
                required
              />
            </FormSection>

            {/* Invoice 1 Configuration */}
            <ConfigurationSection
              title="Invoice 1 Configuration"
              icon={FileText}
              sectionKey="invoice1Fields"
              fields={formData.invoice1Fields}
            />

            {/* Invoice 2 Configuration */}
            <ConfigurationSection
              title="Invoice 2 Configuration"
              icon={Receipt}
              sectionKey="invoice2Fields"
              fields={formData.invoice2Fields}
            />

            {/* POD Configuration */}
            <ConfigurationSection
              title="POD Configuration"
              icon={Package}
              sectionKey="podFields"
              fields={formData.podFields}
            />

            {/* Bill Configuration */}
            <ConfigurationSection
              title="Bill Configuration"
              icon={Receipt}
              sectionKey="billFields"
              fields={formData.billFields}
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
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-3 px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-300 ${
                  isSubmitting || submitSuccess
                    ? 'bg-gray-500/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Registering Client...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Client Registered!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Register Client</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ClientRegistration;
