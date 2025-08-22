import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Settings, 
  LogOut,
  FileText,
  CheckCircle,
  Package,
  Zap,
  ArrowLeft,
  Calendar,
  Truck,
  MapPin,
  User,
  Weight,
  DollarSign,
  Clock,
  AlertCircle
} from 'lucide-react';

// Mock data removed; results are expected to be provided via props.

const SearchResults = ({ onNavigateToDashboard, onNavigateToGenerateBill, searchTerm, searchResults }) => {
  const [selectedLR, setSelectedLR] = useState(null);
  const [consignmentData, setConsignmentData] = useState(null);
  const [nodeStates, setNodeStates] = useState({});

  // Load consignment data when component mounts or search results change
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      // If there's only one result, auto-select it
      if (searchResults.length === 1) {
        const lr = searchResults[0].lrNumber;
        setSelectedLR(lr);
        loadConsignmentData(lr);
      }
    } else {
      // Reset when no results
      setSelectedLR(null);
      setConsignmentData(null);
      setNodeStates({});
    }
  }, [searchResults]);

  const loadConsignmentData = (lrNumber) => {
    // Since mock data is removed, we try to find the item within provided searchResults
    const data = Array.isArray(searchResults)
      ? searchResults.find((item) => item.lrNumber === lrNumber)
      : null;
    if (data) {
      setConsignmentData(data);
      setNodeStates(data.workflowStatus || {});
    }
  };

  const handleLRSelection = (lrNumber) => {
    setSelectedLR(lrNumber);
    loadConsignmentData(lrNumber);
  };

  const toggleNode = (nodeId) => {
    setNodeStates(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const completedCount = Object.values(nodeStates).filter(Boolean).length;
  const totalNodes = Object.keys(nodeStates).length;
  const progressPercentage = totalNodes > 0 ? (completedCount / totalNodes) * 100 : 0;

  // Custom Node Component with enhanced glassmorphism
  const FlowNode = ({ 
    id, 
    label, 
    shape, 
    position, 
    nodeType, 
    size = 'medium'
  }) => {
    const isCompleted = nodeStates[id];
    
    const handleNodeClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (id === 'generate-bill') {
        if (onNavigateToGenerateBill && typeof onNavigateToGenerateBill === 'function') {
          try {
            // Pass the selected LR data to the generate bill page
            onNavigateToGenerateBill(consignmentData);
          } catch (error) {
            console.error('Error calling onNavigateToGenerateBill:', error);
          }
        } else {
          alert('Navigation function is not available. Check console for details.');
        }
      } else {
        toggleNode(id);
      }
    };

    const getShapeClasses = () => {
      const baseClasses = "relative flex items-center justify-center text-white font-semibold cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl border border-white/30 backdrop-blur-xl";
      
      switch (shape) {
        case 'hexagon':
          return `${baseClasses} bg-white/20 hover:bg-white/30`;
        case 'oval':
          return `${baseClasses} bg-white/15 hover:bg-white/25 rounded-full`;
        case 'circle':
          return `${baseClasses} bg-white/15 hover:bg-white/25 rounded-full`;
        case 'rectangle':
          return `${baseClasses} bg-white/15 hover:bg-white/25 rounded-xl`;
        default:
          return `${baseClasses} bg-white/15 hover:bg-white/25 rounded-xl`;
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'large':
          return 'w-32 h-20';
        case 'medium':
          return 'w-24 h-16';
        case 'small':
          return 'w-20 h-14';
        default:
          return 'w-24 h-16';
      }
    };

    const getIcon = () => {
      const iconClass = 'w-4 h-4';
      switch (nodeType) {
        case 'generate': return <Zap className={iconClass} />;
        case 'validation': return <CheckCircle className={iconClass} />;
        case 'excel': return <FileText className={iconClass} />;
        case 'invoice': return <Package className={iconClass} />;
        default: return <FileText className={iconClass} />;
      }
    };

    const hexagonStyle = shape === 'hexagon' ? {
      clipPath: 'polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)'
    } : {};

    return (
      <motion.div
        className="absolute"
        style={{ 
          left: position.x, 
          top: position.y,
          transform: 'translate(-50%, -50%)'
        }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div
          className={`${getShapeClasses()} ${getSizeClasses()}`}
          style={hexagonStyle}
          onClick={handleNodeClick}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 25px 50px rgba(255, 255, 255, 0.1)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex flex-col items-center justify-center space-y-1 p-2">
            {getIcon()}
            <span className="text-center leading-tight text-xs font-medium">
              {label}
            </span>
          </div>
          
          {/* Enhanced completion indicator */}
          {isCompleted && (
            <motion.div
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center border border-white/50 shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <CheckCircle className="w-3 h-3 text-white" />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  // Enhanced Curved Arrow Component
  const CurvedArrow = ({ path, delay = 0, color = "#3b82f6" }) => {
    return (
      <motion.svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1.5, delay, ease: "easeInOut" }}
      >
        <defs>
          <marker
            id={`arrowhead-${delay}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
            fill={color}
          >
            <polygon points="0 0, 10 3.5, 0 7" />
          </marker>
        </defs>
        <motion.path
          d={path}
          stroke={color}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          markerEnd={`url(#arrowhead-${delay})`}
          className="drop-shadow-lg"
          animate={{
            strokeDasharray: [0, 20],
            strokeDashoffset: [0, -20]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.svg>
    );
  };

  // LR Selection Component
  const LRSelector = () => {
  if (!searchResults || searchResults.length <= 1) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4"
      >
        <h3 className="text-white font-semibold mb-3">Select LR Number ({searchResults.length} results)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {searchResults.map((result) => (
            <motion.button
              key={result.lrNumber}
              onClick={() => handleLRSelection(result.lrNumber)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                selectedLR === result.lrNumber
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {result.lrNumber}
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  // Consignment Details Panel
  const ConsignmentDetails = () => {
    if (!consignmentData) return null;

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed': return 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30';
        case 'Loaded': return 'text-amber-400 bg-amber-400/20 border-amber-400/30';
        case 'Unloaded': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
        default: return 'text-white/70 bg-white/10 border-white/20';
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{consignmentData.lrNumber}</h2>
          <span className={`px-3 py-1 rounded-xl text-sm font-semibold border ${getStatusColor(consignmentData.status)}`}>
            {consignmentData.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white/70">
              <User className="w-4 h-4" />
              <span>Client: {consignmentData.client}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <MapPin className="w-4 h-4" />
              <span>Route: {consignmentData.route}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <Package className="w-4 h-4" />
              <span>Goods: {consignmentData.goodsType}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white/70">
              <Weight className="w-4 h-4" />
              <span>Weight: {consignmentData.weight}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <DollarSign className="w-4 h-4" />
              <span>Value: {consignmentData.value}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70">
              <Truck className="w-4 h-4" />
              <span>Vehicle: {consignmentData.vehicleNumber}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-white/70">
              <Calendar className="w-4 h-4" />
              <span>Loaded: {formatDate(consignmentData.loadedDate)}</span>
            </div>
            {consignmentData.deliveredDate && (
              <div className="flex items-center space-x-2 text-white/70">
                <CheckCircle className="w-4 h-4" />
                <span>Delivered: {formatDate(consignmentData.deliveredDate)}</span>
              </div>
            )}
            {consignmentData.billAmount && (
              <div className="flex items-center space-x-2 text-green-400">
                <DollarSign className="w-4 h-4" />
                <span>Bill Amount: {consignmentData.billAmount}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // Animated Progress Journey Component - Fixed Version
  const ProgressJourney = ({ status, loadedDate, deliveredDate, billGeneratedDate }) => {
    const getStatusIndex = (status) => {
      switch (status) {
        case 'Loaded': return 0;
        case 'Unloaded': return 1;
        case 'Completed': return 2;
        default: return 0;
      }
    };

    const currentStep = getStatusIndex(status);
    const progressPercentage = (currentStep / 2) * 100;

    const steps = [
      {
        id: 'loaded',
        label: 'Loaded',
        icon: '🚛',
        description: 'Goods loaded & in transit',
        date: loadedDate,
        color: 'from-amber-400 to-amber-500',
        glowColor: 'shadow-amber-400/50'
      },
      {
        id: 'unloaded',
        label: 'Unloaded',
        icon: '📦',
        description: 'Delivered to destination',
        date: deliveredDate,
        color: 'from-blue-400 to-blue-500',
        glowColor: 'shadow-blue-400/50'
      },
      {
        id: 'completed',
        label: 'Completed',
        icon: '✅',
        description: 'Bill generated & sent',
        date: billGeneratedDate,
        color: 'from-emerald-400 to-emerald-500',
        glowColor: 'shadow-emerald-400/50'
      }
    ];

    const formatProgressDate = (dateString) => {
      if (!dateString) return 'Pending';
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      });
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-6 overflow-hidden relative"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10"></div>
          <div className="absolute top-4 left-4 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 right-4 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Shipment Journey</h3>
              <p className="text-white/60">Track your consignment progress</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Current Status</div>
              <div className={`inline-flex px-4 py-2 rounded-xl text-sm font-semibold border ${
                status === 'Completed' ? 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30' :
                status === 'Unloaded' ? 'text-blue-400 bg-blue-400/20 border-blue-400/30' :
                'text-amber-400 bg-amber-400/20 border-amber-400/30'
              }`}>
                {status}
              </div>
            </div>
          </div>

          {/* Progress Bar Container */}
          <div className="relative">
            {/* Premium 3D Lorry Animation - Above Progress Bar - SIMPLIFIED */}
            <div className="relative mb-8 h-24">
              <motion.div
                className="absolute top-0 transform -translate-x-1/2"
                initial={{ left: '8%' }}
                animate={{ 
                  left: currentStep === 0 ? '8%' : currentStep === 1 ? '50%' : '92%'
                }}
                transition={{ 
                  duration: 3, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: 1
                }}
              >
                {/* Simplified Lorry Container */}
                <motion.div
                  className="relative"
                  animate={{ 
                    y: [0, -8, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {/* Main Lorry Body - Simplified */}
                  <div className="relative">
                    {/* Lorry Shadow */}
                    <motion.div
                      className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-md"
                      animate={{
                        scaleX: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Modern Lorry SVG - Now facing left (original direction) */}
                    <div className="relative w-16 h-12 transform scale-150">
                      <svg 
                        viewBox="0 0 100 60" 
                        className="w-full h-full"
                        style={{ 
                          filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))'
                        }}
                      >
                        {/* ...existing SVG content... */}
                        <rect 
                          x="20" 
                          y="15" 
                          width="60" 
                          height="25" 
                          rx="3" 
                          fill="url(#lorryGradient)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                        
                        {/* Lorry Cab */}
                        <rect 
                          x="70" 
                          y="10" 
                          width="25" 
                          height="30" 
                          rx="2" 
                          fill="url(#cabGradient)"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1"
                        />
                        
                        {/* Windshield */}
                        <rect 
                          x="72" 
                          y="12" 
                          width="18" 
                          height="12" 
                          rx="1" 
                          fill="rgba(135, 206, 235, 0.6)"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="0.5"
                        />
                        
                        {/* Front Lights */}
                        <circle 
                          cx="92" 
                          cy="20" 
                          r="2" 
                          fill="#FFE135"
                          opacity="0.9"
                        />
                        <circle 
                          cx="92" 
                          cy="28" 
                          r="2" 
                          fill="#FFE135"
                          opacity="0.9"
                        />
                        
                        {/* Wheels */}
                        <circle 
                          cx="30" 
                          cy="45" 
                          r="7" 
                          fill="url(#wheelGradient)"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="1"
                        />
                        <circle 
                          cx="30" 
                          cy="45" 
                          r="4" 
                          fill="#1e293b"
                        />
                        
                        <circle 
                          cx="70" 
                          cy="45" 
                          r="7" 
                          fill="url(#wheelGradient)"
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="1"
                        />
                        <circle 
                          cx="70" 
                          cy="45" 
                          r="4" 
                          fill="#1e293b"
                        />
                        
                        {/* Side Details */}
                        <rect 
                          x="25" 
                          y="20" 
                          width="50" 
                          height="15" 
                          rx="2" 
                          fill="rgba(255,255,255,0.1)"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="0.5"
                        />
                        
                        {/* Gradients Definition */}
                        <defs>
                          <linearGradient id="lorryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#1d4ed8" />
                            <stop offset="100%" stopColor="#1e40af" />
                          </linearGradient>
                          
                          <linearGradient id="cabGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#2563eb" />
                          </linearGradient>
                          
                          <radialGradient id="wheelGradient" cx="50%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#64748b" />
                            <stop offset="100%" stopColor="#334155" />
                          </radialGradient>
                        </defs>
                      </svg>
                      
                      {/* ...existing premium glow effect... */}
                      <div 
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
                          filter: 'blur(8px)',
                          zIndex: -1
                        }}
                      />
                    </div>

                    {/* Status Badge Above Lorry */}
                    <motion.div
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2, duration: 0.8 }}
                    >
                      <div className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-lg ${
                        status === 'Completed' ? 'text-emerald-300 bg-emerald-400/20 border-emerald-400/30' :
                        status === 'Unloaded' ? 'text-blue-300 bg-blue-400/20 border-blue-400/30' :
                        'text-amber-300 bg-amber-400/20 border-amber-400/30'
                      }`}>
                        {status}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Background Track - Simplified */}
            <div className="w-full h-3 bg-white/10 rounded-full mb-12 relative overflow-hidden shadow-inner">
              {/* Animated Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-blue-400/30 to-emerald-400/30 rounded-full"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Progress Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-blue-400 to-emerald-400 rounded-full relative overflow-hidden shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 2.5, ease: "easeOut", delay: 0.5 }}
              >
                {/* Shimmering Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2.5
                  }}
                />

                {/* Simplified Particle Effects */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      animate={{
                        x: ['0%', '100%'],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 1,
                        ease: "linear"
                      }}
                      style={{
                        top: `${30 + i * 20}%`
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Track Enhancement Lines */}
              <div className="absolute inset-0 flex items-center justify-between px-2">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-1 bg-white/20 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Progress Steps - Clean Layout Without Lines */}
            <div className="flex justify-center items-start relative -mt-6">
              <div className="flex justify-between items-start space-x-64 max-w-4xl">
                {steps.map((step, index) => {
                  const isActive = index <= currentStep;
                  const isCurrent = index === currentStep;
                  
                  return (
                    <motion.div
                      key={step.id}
                      className="flex flex-col items-center text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.2 }}
                    >
                      {/* Step Circle */}
                      <motion.div
                        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                          isActive 
                            ? `bg-gradient-to-br ${step.color} border-white/30 ${step.glowColor} shadow-2xl` 
                            : 'bg-white/10 border-white/20'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        animate={isCurrent ? {
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-2xl">{step.icon}</span>
                        
                        {/* Pulse Effect for Current Step */}
                        {isCurrent && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl border-2 border-white/50"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                        )}
                        
                        {/* Check Mark for Completed Steps */}
                        {isActive && !isCurrent && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.5 + index * 0.2, type: "spring" }}
                          >
                            <CheckCircle className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Step Details */}
                      <motion.div
                        className="mt-4 space-y-1 w-24"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 + index * 0.2 }}
                      >
                        <h4 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-white/50'}`}>
                          {step.label}
                        </h4>
                        <p className={`text-xs ${isActive ? 'text-white/70' : 'text-white/40'}`}>
                          {step.description}
                        </p>
                        <div className={`text-xs font-medium ${isActive ? 'text-blue-300' : 'text-white/30'}`}>
                          {formatProgressDate(step.date)}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Status Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-amber-400 text-sm font-medium">Transit Time</div>
              <div className="text-white font-bold">
                {deliveredDate && loadedDate 
                  ? `${Math.ceil((new Date(deliveredDate) - new Date(loadedDate)) / (1000 * 60 * 60 * 24))} days`
                  : 'In Progress'
                }
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-blue-400 text-sm font-medium">Delivery Status</div>
              <div className="text-white font-bold">
                {status === 'Completed' ? 'Delivered' : status === 'Unloaded' ? 'Delivered' : 'In Transit'}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-emerald-400 text-sm font-medium">Billing Status</div>
              <div className="text-white font-bold">
                {status === 'Completed' ? 'Generated' : 'Pending'}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

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
                <p className="text-white/60 text-xs">Invoice Flow Management</p>
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
      <div className="pt-20 px-6">
        {/* Search Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Search Results for "{searchTerm}"
          </h2>
          <p className="text-white/70">
            {searchResults ? `${searchResults.length} consignment(s) found` : 'No results'}
          </p>
        </motion.div>

        {/* LR Selector */}
        <LRSelector />

        {/* Consignment Details */}
        {consignmentData && (
          <div className="mb-6">
            <ConsignmentDetails />
          </div>
        )}

        {/* Amazing Animated Progress Journey */}
        {consignmentData && (
          <ProgressJourney 
            status={consignmentData.status}
            loadedDate={consignmentData.loadedDate}
            deliveredDate={consignmentData.deliveredDate}
            billGeneratedDate={consignmentData.billGeneratedDate}
          />
        )}

        {/* Enhanced Side Panels */}
        {selectedLR && (
          <>
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="fixed top-20 right-4 z-40 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-40"
            >
              <h3 className="font-semibold text-base mb-2 text-white">Progress</h3>
              <div className="space-y-2 text-sm text-white">
                <div className="flex justify-between text-xs">
                  <span>Completed:</span>
                  <span className="text-green-400 font-medium">{completedCount}/{totalNodes}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <motion.div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Flow Diagram - Only show when LR is selected */}
        {selectedLR && consignmentData && (
          <div className="min-h-screen relative">
            <div className="w-full h-[900px] relative mx-auto" style={{ maxWidth: '1200px' }}>
              
              {/* Flow Nodes */}
              <FlowNode
                id="generate-bill"
                label="GENERATE BILL"
                shape="hexagon"
                position={{ x: 540, y: 50 }}
                nodeType="generate"
                size="large"
              />

              <FlowNode
                id="pod-validation"
                label="POD AND FINAL VALIDATION"
                shape="oval"
                position={{ x: 540, y: 200 }}
                nodeType="validation"
                size="large"
              />

              <FlowNode
                id="final-excel"
                label="FINAL EXCEL"
                shape="circle"
                position={{ x: 540, y: 340 }}
                nodeType="excel"
                size="large"
              />

              {/* Left branch */}
              <FlowNode
                id="excel-1"
                label="EXCEL 1"
                shape="circle"
                position={{ x: 300, y: 480 }}
                nodeType="excel"
                size="medium"
              />

              <FlowNode
                id="validation-1"
                label="VALIDATION 1"
                shape="oval"
                position={{ x: 300, y: 600 }}
                nodeType="validation"
                size="medium"
              />

              <FlowNode
                id="invoice-1"
                label="INVOICE 1"
                shape="rectangle"
                position={{ x: 180, y: 750 }}
                nodeType="invoice"
                size="small"
              />

              {/* Right branch */}
              <FlowNode
                id="excel-2"
                label="EXCEL 2"
                shape="circle"
                position={{ x: 850, y: 480 }}
                nodeType="excel"
                size="medium"
              />

              <FlowNode
                id="validation-2"
                label="VALIDATION 2"
                shape="oval"
                position={{ x: 850, y: 600 }}
                nodeType="validation"
                size="medium"
              />

              <FlowNode
                id="invoice-2"
                label="INVOICE 2"
                shape="rectangle"
                position={{ x: 980, y: 750 }}
                nodeType="invoice"
                size="small"
              />

              {/* Curved arrows */}
              <CurvedArrow 
                path="M 600 200 L 600 120"
                delay={0.2}
                color="#3b82f6"
              />
              
              <CurvedArrow 
                path="M 600 340 L 600 280"
                delay={0.4}
                color="#3b82f6"
              />
              
              <CurvedArrow 
                path="M 390 490 Q 520 380 568 380"
                delay={0.6}
                color="#10b981"
              />
              
              <CurvedArrow 
                path="M 850 500 Q 720 380 632 380"
                delay={0.7}
                color="#10b981"
              />

              <CurvedArrow 
                path="M 350 520 L 350 600"
                delay={0.8}
                color="#8b5cf6"
              />

              <CurvedArrow 
                path="M 900 530 L 900 600"
                delay={0.9}
                color="#8b5cf6"
              />

              <CurvedArrow 
                path="M 200 750 Q 200 640 296 620"
                delay={1.0}
                color="#f59e0b"
              />

              <CurvedArrow 
                path="M 1040 750 Q 1040 640 944 620"
                delay={1.0}
                color="#f59e0b"
              />

            </div>
          </div>
        )}

        {/* No LR Selected State */}
        {!selectedLR && searchResults && searchResults.length > 1 && (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto"
            >
              <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select an LR Number</h3>
              <p className="text-white/70">Choose an LR number from the list above to view its workflow status.</p>
            </motion.div>
          </div>
        )}

  {/* No Results State */}
  {(!searchResults || searchResults.length === 0) && (
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-md mx-auto"
            >
              <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white/60 mb-2">No Results Found</h3>
              <p className="text-white/40">No consignments found for "{searchTerm}". Try searching with a different LR number or client name.</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;