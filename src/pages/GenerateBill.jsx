import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  LogOut,
  ChevronDown,
  FileText,
  Eye,
  Download,
  Send,
  Zap
} from 'lucide-react';

const GenerateBill = ({ onNavigateToDashboard, onNavigateToBillSent }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [billGenerated, setBillGenerated] = useState(false);

  const templates = [
    { id: 'standard', name: 'Standard Invoice Template', description: 'Basic invoice with standard fields' },
    { id: 'detailed', name: 'Detailed Invoice Template', description: 'Comprehensive invoice with detailed breakdown' },
    { id: 'express', name: 'Express Delivery Template', description: 'Fast track delivery invoice format' },
    { id: 'bulk', name: 'Bulk Shipment Template', description: 'Template for multiple shipments' },
    { id: 'international', name: 'International Template', description: 'Cross-border shipping invoice' }
  ];

  const handleGenerateBill = () => {
    if (selectedTemplate) {
      setBillGenerated(true);
    }
  };

  const handleSendBill = () => {
    onNavigateToBillSent();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
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
                <p className="text-white/60 text-xs">Generate Bill</p>
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
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Dashboard</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="fixed top-20 left-4 z-40 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-64"
      >
        <h3 className="font-semibold text-base mb-3 text-white">Bill Generation</h3>
        <div className="space-y-3 text-sm text-white/70">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span>Select Template</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Generate Bill</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span>Review & Send</span>
          </div>
        </div>
        
        {billGenerated && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 bg-green-500/10 border border-green-400/30 rounded-xl"
          >
            <h4 className="text-green-400 font-medium text-sm mb-1">Bill Generated!</h4>
            <p className="text-green-300/70 text-xs">Ready for review and sending</p>
          </motion.div>
        )}
      </motion.div>

      {/* Main Content */}
      <div className="pt-20 pl-72 pr-8 min-h-screen">
        <div className="max-w-4xl mx-auto py-12">
          
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
              Generate Invoice Bill
            </h2>
            <p className="text-white/60 text-lg">
              Select a template and generate your invoice bill
            </p>
          </motion.div>

          {/* Template Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
                      <div className="font-medium">
                        {templates.find(t => t.id === selectedTemplate)?.name}
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
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50"
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
                      <div className="font-medium text-white">{template.name}</div>
                      <div className="text-sm text-white/60 mt-1">{template.description}</div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Generate Bill Button */}
          {selectedTemplate && !billGenerated && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
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
                  <span>Generate Bill</span>
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
                <p className="text-white/60 text-sm">Preview the generated bill</p>
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
                <p className="text-white/60 text-sm">Save bill to your device</p>
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
                <p className="text-white/60 text-sm">Send bill to client</p>
              </motion.button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GenerateBill;