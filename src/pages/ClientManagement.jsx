import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Bell, 
  Settings, 
  Plus,
  Users,
  Building2,
  FileText,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import ClientRegistrationModal from '../components/ClientRegistrationModal';
import TemplateSetupModal from '../components/TemplateSetupModal';
import BranchManagementModal from '../components/BranchManagementModal';
import { clientRegistrationService } from '../lib/clientRegistrationService';

const ClientManagement = ({ onNavigateToDashboard, onNavigateToSearch, onNavigateToBulkBilling }) => {
  // State management
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [openMenuClientId, setOpenMenuClientId] = useState(null);
  const [confirmDeleteClient, setConfirmDeleteClient] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Load clients on component mount and when refresh is triggered
  useEffect(() => {
    loadClients();
  }, [refreshTrigger]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const result = await clientRegistrationService.getAllClients();
      if (result.success) {
        setClients(result.data);
      } else {
        console.error('Failed to load clients:', result.error);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle successful client registration
  const handleClientRegistered = () => {
    setShowRegistrationModal(false);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  // Handle template setup
  const handleSetupTemplate = (client) => {
    setSelectedClient(client);
    setShowTemplateModal(true);
  };

  // Handle branch management
  const handleManageBranches = (client) => {
    setSelectedClient(client);
    setShowBranchModal(true);
  };

  // Handle successful branch management
  const handleBranchManaged = () => {
    setShowBranchModal(false);
    setSelectedClient(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  const handleDeleteClient = async () => {
    if (!confirmDeleteClient) return;
    setDeleting(true);
    setDeleteError('');
    try {
      const res = await clientRegistrationService.deleteClient(confirmDeleteClient.client_id);
      if (!res.success) throw new Error(res.error);
      setConfirmDeleteClient(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (e) {
      setDeleteError(e.message || 'Failed to delete client');
    } finally {
      setDeleting(false);
    }
  };

  // Filter clients based on search
  const filteredClients = clients.filter(client =>
    client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.gstin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                <p className="text-white/60 text-xs">Client Management</p>
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
            activeRoute={'client-management'}
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
              className="max-w-7xl mx-auto"
            >
              {/* Page Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    Client Management
                  </h2>
                  <p className="text-white/70 text-lg">
                    Manage clients, branches, and document templates
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <motion.button
                    onClick={() => setShowRegistrationModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-4 py-3 rounded-xl transition-all duration-300 backdrop-blur-lg border border-blue-400/30"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Register New Client</span>
                  </motion.button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Clients Grid/List */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full"
                  />
                </div>
              ) : filteredClients.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchTerm ? 'No clients found' : 'No clients registered yet'}
                  </h3>
                  <p className="text-white/60 mb-6">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Get started by registering your first client'}
                  </p>
                  {!searchTerm && (
                    <motion.button
                      onClick={() => setShowRegistrationModal(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-lg border border-blue-400/30 mx-auto"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Register First Client</span>
                    </motion.button>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClients.map((client) => (
                    <motion.div
                      key={client.client_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                    >
                      {/* Client Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/80 to-blue-600/80 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">{client.client_name}</h3>
                            <p className="text-white/60 text-sm">
                              {client.client_branches?.length || 0} branch(es)
                            </p>
                          </div>
                        </div>
                        <div className="relative">
                          <motion.button
                            onClick={() => setOpenMenuClientId(prev => prev === client.client_id ? null : client.client_id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-white/50 hover:text-white bg-white/5 rounded-lg transition-all duration-300"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                          {openMenuClientId === client.client_id && (
                            <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-white/10 rounded-lg shadow-xl z-10">
                              <button
                                onClick={() => { setOpenMenuClientId(null); handleManageBranches(client); }}
                                className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10 rounded-t-lg"
                              >
                                Manage Branches
                              </button>
                              <button
                                onClick={() => { setOpenMenuClientId(null); handleSetupTemplate(client); }}
                                className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                              >
                                Setup Template
                              </button>
                              <button
                                onClick={() => { setOpenMenuClientId(null); setConfirmDeleteClient(client); }}
                                className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                              >
                                Delete Client
                              </button>
                              <button
                                onClick={() => { setOpenMenuClientId(null); }}
                                className="w-full text-left px-3 py-2 text-sm text-white/60 hover:bg-white/10 rounded-b-lg"
                                disabled
                              >
                                View (coming soon)
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Client Details */}
                      <div className="space-y-2 mb-4">
                        {client.gstin && (
                          <div className="flex items-center space-x-2 text-white/70 text-sm">
                            <FileText className="w-4 h-4" />
                            <span>GST: {client.gstin}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-white/70 text-sm">
                          <span>Created: {formatDate(client.created_at)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => handleManageBranches(client)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg transition-all duration-300 border border-blue-400/30"
                        >
                          <Building2 className="w-4 h-4" />
                          <span className="text-sm">Manage Branches</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleSetupTemplate(client)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded-lg transition-all duration-300 border border-green-400/30"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">Setup Template</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center justify-center bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 p-2 rounded-lg transition-all duration-300 border border-gray-400/30"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showRegistrationModal && (
          <ClientRegistrationModal
            onClose={() => setShowRegistrationModal(false)}
            onSuccess={handleClientRegistered}
          />
        )}
        
        {showTemplateModal && selectedClient && (
          <TemplateSetupModal
            client={selectedClient}
            onClose={() => {
              setShowTemplateModal(false);
              setSelectedClient(null);
            }}
          />
        )}

        {showBranchModal && selectedClient && (
          <BranchManagementModal
            client={selectedClient}
            onClose={() => {
              setShowBranchModal(false);
              setSelectedClient(null);
            }}
            onSuccess={handleBranchManaged}
          />
        )}

        {confirmDeleteClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => !deleting && setConfirmDeleteClient(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold text-white">Delete Client?</h3>
                <p className="text-white/70 text-sm">
                  This will permanently delete "{confirmDeleteClient.client_name}" and all related branches, templates, and future-linked data via database cascade. This action cannot be undone.
                </p>
                {deleteError && (
                  <div className="text-red-300 text-sm">{deleteError}</div>
                )}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setConfirmDeleteClient(null)}
                    disabled={deleting}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteClient}
                    disabled={deleting}
                    className={`px-4 py-2 rounded-xl ${deleting ? 'bg-red-500/40 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'} text-white border border-red-400/40`}
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientManagement;
