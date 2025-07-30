import React from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Home, 
  Send, 
  Sparkles, 
  Mail, 
  Clock, 
  FileStack 
} from 'lucide-react';

const BillSent = ({ onNavigateToDashboard, billContext }) => {
  const isBulkBilling = billContext?.type === 'bulk';
  const billCount = billContext?.count || 1;
  const companyName = billContext?.company || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
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
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/80 to-green-600/80 rounded-xl flex items-center justify-center backdrop-blur-lg border border-white/20">
                <span className="text-white font-bold text-lg">JK</span>
              </div>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">JK LOGISTICS</h1>
                <p className="text-white/60 text-xs">
                  {isBulkBilling ? `${billCount} Bills Sent Successfully` : 'Bill Sent Successfully'}
                </p>
              </div>
            </div>

            {/* Header Action */}
            <motion.button 
              onClick={onNavigateToDashboard}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-green-600/80 hover:bg-green-500/80 text-white px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-lg border border-green-400/30"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-6">
          
          {/* Success Icon with Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.8, 
              type: "spring", 
              stiffness: 200, 
              damping: 20 
            }}
            className="relative mb-8"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-lg border border-green-400/30 shadow-2xl">
              {isBulkBilling ? <FileStack className="w-16 h-16 text-green-400" /> : <CheckCircle className="w-16 h-16 text-green-400" />}
            </div>
            
            {/* Sparkle effects around the icon */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3"
                style={{
                  left: '50%',
                  top: '50%',
                  marginLeft: '-6px',
                  marginTop: '-6px',
                }}
                animate={{
                  x: [0, (Math.cos(i * Math.PI / 4) * 80)],
                  y: [0, (Math.sin(i * Math.PI / 4) * 80)],
                  opacity: [1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.8 + (i * 0.1),
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            ))}
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
              {isBulkBilling ? `${billCount} Bills Sent Successfully!` : 'Bill Sent Successfully!'}
            </h1>
            <p className="text-xl text-white/70 mb-6">
              {isBulkBilling 
                ? `All ${billCount} invoices for ${companyName} have been delivered to clients`
                : 'Your invoice has been delivered to the client'
              }
            </p>
          </motion.div>

          {/* Details Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          >
            {/* Email Sent Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">
                  {isBulkBilling ? 'Bulk Emails Delivered' : 'Email Delivered'}
                </h3>
              </div>
              <p className="text-white/60 text-sm">
                {isBulkBilling 
                  ? `${billCount} invoices sent to respective client email addresses with tracking confirmation`
                  : 'Invoice sent to client\'s email address with tracking confirmation'
                }
              </p>
            </div>

            {/* Time Stamp Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold text-lg">Sent At</h3>
              </div>
              <p className="text-white/60 text-sm">
                {new Date().toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Show company info for bulk billing */}
            {isBulkBilling && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:col-span-2">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <FileStack className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">Bulk Processing Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/50">Company:</p>
                    <p className="text-white font-medium">{companyName}</p>
                  </div>
                  <div>
                    <p className="text-white/50">Bills Generated:</p>
                    <p className="text-white font-medium">{billCount} invoices</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {/* Return to Dashboard Button */}
            <motion.button
              onClick={onNavigateToDashboard}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-2xl border border-blue-400/30 backdrop-blur-lg"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" 
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3">
                <Home className="w-5 h-5" />
                <span>Return to Dashboard</span>
              </div>
            </motion.button>

            {/* Generate Another Bill Button */}
            <motion.button
              className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center space-x-3">
                {isBulkBilling ? <FileStack className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                <span>{isBulkBilling ? 'Generate More Bulk Bills' : 'Send Another Bill'}</span>
              </div>
            </motion.button>
          </motion.div>

          {/* Celebration Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12"
          >
            <p className="text-white/50 text-sm italic">
              {isBulkBilling 
                ? `"Efficiency at scale - ${billCount} bills processed seamlessly" ✨`
                : '"Excellence in logistics, delivered with precision" ✨'
              }
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default BillSent;