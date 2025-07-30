import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown,
  FileText,
  Eye,
  Download,
  Send,
  Zap,
  Check,
  Users,
  Building2,
  Plus
} from 'lucide-react';

const TemplateSelector = ({ 
  mode = 'individual', // 'individual' or 'bulk'
  selectedConsignments = [],
  companyName = '',
  onGenerateBill,
  onSendBill,
  onCancel,
  onAddNewTemplate // Add this prop for creating new templates
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [billGenerated, setBillGenerated] = useState(false);

  const templates = [
    { id: 'standard', name: 'Standard Invoice Template', description: 'Basic invoice with standard fields', icon: FileText },
    { id: 'detailed', name: 'Detailed Invoice Template', description: 'Comprehensive invoice with detailed breakdown', icon: FileText },
    { id: 'express', name: 'Express Delivery Template', description: 'Fast track delivery invoice format', icon: Zap },
    { id: 'bulk', name: 'Bulk Shipment Template', description: 'Template for multiple shipments', icon: Users },
    { id: 'international', name: 'International Template', description: 'Cross-border shipping invoice', icon: Building2 }
  ];

  const handleGenerateBill = () => {
    if (selectedTemplate) {
      setBillGenerated(true);
      if (onGenerateBill) {
        onGenerateBill(selectedTemplate);
      }
    }
  };

  const handleSendBill = () => {
    if (onSendBill) {
      onSendBill(selectedTemplate);
    }
  };

  const handleAddNewTemplate = () => {
    if (onAddNewTemplate) {
      onAddNewTemplate();
    }
  };

  const getBillTypeText = () => {
    if (mode === 'bulk') {
      return `${selectedConsignments.length} Bills for ${companyName}`;
    }
    return 'Individual Bill';
  };

  const getGenerateButtonText = () => {
    if (mode === 'bulk') {
      return `Generate ${selectedConsignments.length} Bills`;
    }
    return 'Generate Bill';
  };

  const getSendButtonText = () => {
    if (mode === 'bulk') {
      return `Send ${selectedConsignments.length} Bills`;
    }
    return 'Send Bill';
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
          {mode === 'bulk' ? 'Generate Bulk Invoice Bills' : 'Generate Invoice Bill'}
        </h2>
        <p className="text-white/60 text-lg">
          {mode === 'bulk' 
            ? `Select a template and generate ${selectedConsignments.length} bills for ${companyName}`
            : 'Select a template and generate your invoice bill'
          }
        </p>
        
        {mode === 'bulk' && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/30 rounded-xl px-4 py-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm">
              {getBillTypeText()}
            </span>
          </div>
        )}
      </motion.div>

      {/* Template Selection */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <label className="block text-white font-semibold mb-3 text-lg">
          Choose Template
        </label>
        
        <div className="relative">
          <motion.button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4 text-left text-white flex items-center justify-between hover:bg-white/15 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div>
              {selectedTemplate ? (
                <div>
                  <div className="font-medium flex items-center space-x-2">
                    {React.createElement(templates.find(t => t.id === selectedTemplate)?.icon || FileText, { className: "w-4 h-4" })}
                    <span>{templates.find(t => t.id === selectedTemplate)?.name}</span>
                  </div>
                  <div className="text-sm text-white/60 mt-1">
                    {templates.find(t => t.id === selectedTemplate)?.description}
                  </div>
                </div>
              ) : (
                <span className="text-white/60">Select a template...</span>
              )}
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50 max-h-64 overflow-y-auto"
              >
                {templates.map((template) => (
                  <motion.button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-white/10 transition-all duration-200 border-b border-white/10 last:border-b-0"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="font-medium text-white flex items-center space-x-2">
                      <template.icon className="w-4 h-4" />
                      <span>{template.name}</span>
                    </div>
                    <div className="text-sm text-white/60 mt-1">{template.description}</div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add New Template Button - Always visible with better positioning */}
        {onAddNewTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <motion.button
              onClick={handleAddNewTemplate}
              className="w-full bg-gradient-to-r from-green-600/80 to-emerald-600/80 hover:from-green-500/80 hover:to-emerald-500/80 backdrop-blur-lg border border-green-400/30 rounded-2xl px-6 py-4 text-white font-semibold transition-all duration-300 shadow-lg"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold">Create Custom Template</div>
                  <div className="text-green-100/80 text-sm">Design your own billing template</div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Generate Bill Button */}
      {selectedTemplate && !billGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-8"
        >
          <motion.button
            onClick={handleGenerateBill}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl border border-blue-400/30 backdrop-blur-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6" />
              <span>{getGenerateButtonText()}</span>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* Action Buttons - Appear after bill is generated */}
      {billGenerated && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* View Button */}
          <motion.button
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">View</h3>
            <p className="text-white/60 text-sm">
              {mode === 'bulk' ? 'Preview all generated bills' : 'Preview the generated bill'}
            </p>
          </motion.button>

          {/* Download Button */}
          <motion.button
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Download</h3>
            <p className="text-white/60 text-sm">
              {mode === 'bulk' ? 'Download all bills as ZIP' : 'Save bill to your device'}
            </p>
          </motion.button>

          {/* Send Button */}
          <motion.button
            onClick={handleSendBill}
            className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-lg border border-purple-400/30 rounded-2xl p-6 text-center hover:from-purple-500/80 hover:to-pink-500/80 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0 25px 50px rgba(147, 51, 234, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Send</h3>
            <p className="text-white/60 text-sm">
              {mode === 'bulk' ? 'Send all bills to clients' : 'Send bill to client'}
            </p>
          </motion.button>
        </motion.div>
      )}

      {/* Cancel/Back Button */}
      {onCancel && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            onClick={onCancel}
            className="text-white/60 hover:text-white px-6 py-2 rounded-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            ← Back to {mode === 'bulk' ? 'Bulk Billing' : 'Dashboard'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default TemplateSelector;