import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  FileStack,
  Building2,
  Filter,
  Calendar,
  CheckSquare,
  Square,
  Download,
  Send,
  Eye,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Search,
  SortAsc,
  SortDesc,
  MapPin,
  Truck,
  Package,
  Clock,
  DollarSign,
  Mail
} from 'lucide-react';

// Import mock data
import { allConsignments } from '../data/mockData';
import TemplateSelector from '../components/TemplateSelector';

const BulkBilling = ({ onNavigateToDashboard, onNavigateToBillSent }) => {
  // State management
  const [selectedCompany, setSelectedCompany] = useState('');
  const [filteredConsignments, setFilteredConsignments] = useState([]);
  const [selectedConsignments, setSelectedConsignments] = useState(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'lrNumber', direction: 'asc' });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false); // New state

  // Utility function to get status color classes
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'loaded':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'unloaded':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  // Utility function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get unique companies from consignments
  const companies = [...new Set(allConsignments.map(c => c.client))].sort();

  // Filter consignments based on selected company and other filters
  useEffect(() => {
    let filtered = allConsignments;

    // Filter by company
    if (selectedCompany) {
      filtered = filtered.filter(c => c.client === selectedCompany);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status.toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.lrNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.goodsType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by date range
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(c => {
        const loadedDate = new Date(c.loadedDate);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return loadedDate >= fromDate && loadedDate <= toDate;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredConsignments(filtered);
  }, [selectedCompany, statusFilter, searchTerm, dateRange, sortConfig]);

  // Handle consignment selection
  const handleConsignmentToggle = (lrNumber) => {
    const newSelected = new Set(selectedConsignments);
    if (newSelected.has(lrNumber)) {
      newSelected.delete(lrNumber);
    } else {
      newSelected.add(lrNumber);
    }
    setSelectedConsignments(newSelected);
  };

  // Select all filtered consignments
  const handleSelectAll = () => {
    if (selectedConsignments.size === filteredConsignments.length) {
      setSelectedConsignments(new Set());
    } else {
      setSelectedConsignments(new Set(filteredConsignments.map(c => c.lrNumber)));
    }
  };

  // Handle bulk bill generation - now shows template selector
  const handleGenerateBulkBills = async () => {
    if (selectedConsignments.size === 0) {
      alert('Please select at least one consignment to generate bills.');
      return;
    }
    
    // Instead of directly generating, show template selector
    setShowTemplateSelector(true);
  };

  // Handle template selection and bill generation
  const handleTemplateGenerate = (templateId) => {
    console.log('Generating bulk bills with template:', templateId);
    // Handle the actual bulk bill generation logic here
  };

  // Handle sending bills after template selection
  const handleTemplateSend = (templateId) => {
    // Navigate to bill sent page with bulk context
    onNavigateToBillSent({ 
      type: 'bulk', 
      count: selectedConsignments.size,
      company: selectedCompany,
      template: templateId
    });
  };

  // Handle back from template selector
  const handleBackFromTemplate = () => {
    setShowTemplateSelector(false);
  };

  // Handle add new template
  const handleAddNewTemplate = () => {
    console.log('Add new template clicked');
    // TODO: Navigate to template creation page or open modal
    alert('Add New Template feature coming soon!');
  };

  // If template selector is shown, render it instead of the main bulk billing interface
  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Header for Template Selection */}
        <motion.header
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10"
        >
          <div className="px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <motion.button
                  onClick={handleBackFromTemplate}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Back to Selection</span>
                </motion.button>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/80 to-blue-600/80 rounded-xl flex items-center justify-center backdrop-blur-lg border border-white/20">
                    <FileStack className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Template Selection</h1>
                    <p className="text-white/60 text-xs">Choose template for bulk billing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Template Selector */}
        <div className="relative z-10 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto py-12">
            <TemplateSelector
              mode="bulk"
              selectedConsignments={Array.from(selectedConsignments)}
              companyName={selectedCompany || 'Multiple Companies'}
              onGenerateBill={handleTemplateGenerate}
              onSendBill={handleTemplateSend}
              onCancel={handleBackFromTemplate}
              onAddNewTemplate={handleAddNewTemplate}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 bg-white/5 backdrop-blur-xl border-b border-white/10"
      >
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Title */}
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={onNavigateToDashboard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Dashboard</span>
              </motion.button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/80 to-blue-600/80 rounded-xl flex items-center justify-center backdrop-blur-lg border border-white/20">
                  <FileStack className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">Bulk Billing</h1>
                  <p className="text-white/60 text-xs">Generate multiple invoices efficiently</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => setShowPreview(true)}
                disabled={selectedConsignments.size === 0}
                whileHover={{ scale: selectedConsignments.size > 0 ? 1.05 : 1 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedConsignments.size > 0
                    ? 'bg-indigo-600/80 hover:bg-indigo-500/80 text-white border border-indigo-400/30'
                    : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm">Preview ({selectedConsignments.size})</span>
              </motion.button>

              <motion.button
                onClick={handleGenerateBulkBills}
                disabled={selectedConsignments.size === 0 || isGenerating}
                whileHover={{ scale: selectedConsignments.size > 0 && !isGenerating ? 1.05 : 1 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  selectedConsignments.size > 0 && !isGenerating
                    ? 'bg-green-600/80 hover:bg-green-500/80 text-white border border-green-400/30'
                    : 'bg-white/10 text-white/50 cursor-not-allowed border border-white/20'
                }`}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {isGenerating ? 'Generating...' : `Select Template (${selectedConsignments.size})`}
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 p-6 lg:p-8">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filters & Search</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Company Selection */}
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="bg-slate-800">All Companies</option>
                {companies.map(company => (
                  <option key={company} value={company} className="bg-slate-800">{company}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="loaded" className="bg-slate-800">Loaded</option>
                <option value="unloaded" className="bg-slate-800">Unloaded</option>
                <option value="completed" className="bg-slate-800">Completed</option>
              </select>
            </div>

            {/* Search */}
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="LR Number, Route, Goods..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Consignments Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Consignments ({filteredConsignments.length})
              </h3>
              <motion.button
                onClick={handleSelectAll}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-4 py-2 rounded-xl transition-all duration-300"
              >
                {selectedConsignments.size === filteredConsignments.length && filteredConsignments.length > 0 ? (
                  <CheckSquare className="w-4 h-4" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {selectedConsignments.size === filteredConsignments.length && filteredConsignments.length > 0
                    ? 'Deselect All'
                    : 'Select All'
                  }
                </span>
              </motion.button>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 gap-4 text-white/70 text-sm font-medium">
              <div className="col-span-1"></div>
              <div 
                className="col-span-2 flex items-center space-x-1 cursor-pointer hover:text-white"
                onClick={() => handleSort('lrNumber')}
              >
                <span>LR Number</span>
                {sortConfig.key === 'lrNumber' && (
                  sortConfig.direction === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </div>
              <div 
                className="col-span-2 flex items-center space-x-1 cursor-pointer hover:text-white"
                onClick={() => handleSort('client')}
              >
                <span>Client</span>
                {sortConfig.key === 'client' && (
                  sortConfig.direction === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </div>
              <div className="col-span-2">Route</div>
              <div className="col-span-1">Status</div>
              <div 
                className="col-span-2 flex items-center space-x-1 cursor-pointer hover:text-white"
                onClick={() => handleSort('loadedDate')}
              >
                <span>Date</span>
                {sortConfig.key === 'loadedDate' && (
                  sortConfig.direction === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                )}
              </div>
              <div className="col-span-2">Value</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="max-h-96 overflow-y-auto">
            {filteredConsignments.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white/60 mb-2">No consignments found</h4>
                <p className="text-white/40">
                  {selectedCompany 
                    ? `No consignments found for ${selectedCompany}. Try adjusting your filters.`
                    : 'Please select a company to view available consignments.'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredConsignments.map((consignment, index) => (
                  <motion.div
                    key={consignment.lrNumber}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`grid grid-cols-12 gap-4 p-4 hover:bg-white/5 transition-all duration-300 cursor-pointer ${
                      selectedConsignments.has(consignment.lrNumber) ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleConsignmentToggle(consignment.lrNumber)}
                  >
                    {/* Checkbox */}
                    <div className="col-span-1 flex items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-5 h-5 rounded border-2 border-white/30 flex items-center justify-center"
                      >
                        {selectedConsignments.has(consignment.lrNumber) && (
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        )}
                      </motion.div>
                    </div>

                    {/* LR Number */}
                    <div className="col-span-2 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mr-3">
                        {consignment.status === 'Loaded' && <Truck className="w-4 h-4 text-blue-400" />}
                        {consignment.status === 'Unloaded' && <MapPin className="w-4 h-4 text-blue-400" />}
                        {consignment.status === 'Completed' && <CheckCircle className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{consignment.lrNumber}</p>
                        <p className="text-white/50 text-xs">{consignment.vehicleNumber}</p>
                      </div>
                    </div>

                    {/* Client */}
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="text-white font-medium text-sm">{consignment.client}</p>
                        <p className="text-white/50 text-xs">{consignment.goodsType}</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="col-span-2 flex items-center">
                      <p className="text-white/80 text-sm">{consignment.route}</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1 flex items-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(consignment.status)}`}>
                        {consignment.status}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="text-white/80 text-sm">{formatDate(consignment.loadedDate)}</p>
                        <p className="text-white/50 text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {consignment.weight}
                        </p>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="col-span-2 flex items-center">
                      <div>
                        <p className="text-white font-medium text-sm flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {consignment.value}
                        </p>
                        <p className="text-white/50 text-xs">{consignment.driverName}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Generating Bills</h3>
              <p className="text-white/70 mb-4">
                Processing {selectedConsignments.size} consignments for {selectedCompany}...
              </p>
              <div className="space-y-2 text-sm text-white/60">
                <p>✓ Validating consignment data</p>
                <p>✓ Generating invoice templates</p>
                <p>⏳ Creating PDF documents</p>
                <p>⏳ Preparing email notifications</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Bill Preview ({selectedConsignments.size} items)</span>
                </h3>
                <motion.button
                  onClick={() => setShowPreview(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-white font-medium mb-2">Selected Company: {selectedCompany}</h4>
                  <p className="text-white/70 text-sm">All bills will use the same template for consistency</p>
                </div>

                {Array.from(selectedConsignments).map(lrNumber => {
                  const consignment = filteredConsignments.find(c => c.lrNumber === lrNumber);
                  return consignment && (
                    <div key={lrNumber} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{consignment.lrNumber}</p>
                          <p className="text-white/70 text-sm">{consignment.route}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{consignment.value}</p>
                          <p className="text-white/70 text-sm">{consignment.status}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-white/20">
                <motion.button
                  onClick={() => setShowPreview(false)}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300"
                >
                  Close Preview
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowPreview(false);
                    handleGenerateBulkBills();
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-green-600/80 hover:bg-green-500/80 text-white rounded-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Generate Bills</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkBilling;