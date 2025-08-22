import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  PackageCheck,
  BarChart3,
  Home,
  Truck,
  MapPin,
  Calendar,
  Filter,
  FileStack,
  UserPlus
} from 'lucide-react'

import Sidebar from '../components/Sidebar'

// Mock data removed. Using placeholders with empty datasets.

const Dashboard = ({ onNavigateToHome, onNavigateToSearch, onNavigateToGenerateBill, onNavigateToBulkBilling, onNavigateToClientManagement, initialRoute = 'dashboard' }) => {
  const [activeRoute, setActiveRoute] = useState(initialRoute)
  const [searchTerm, setSearchTerm] = useState('')
  const [statistics, setStatistics] = useState(null)
  const [recentShipments, setRecentShipments] = useState([])
  const [filteredConsignments, setFilteredConsignments] = useState([])

  // Load data on component mount
  useEffect(() => {
    // Initialize empty statistics and consignments
    const emptyStats = {
      totalRevenue: '₹0',
      activeShipments: '0',
      pendingRevenue: '₹0',
      netGrossRevenue: '₹0',
      lrCount: 0,
      completedCount: 0,
    }
    setStatistics(emptyStats)
    setRecentShipments([])
    setFilteredConsignments([])
  }, [])

  // If initialRoute changes (navigated from other pages), update activeRoute
  useEffect(() => {
    setActiveRoute(initialRoute)
  }, [initialRoute])

  // Handle sidebar route changes
  const handleRouteChange = (routeId) => {
    setActiveRoute(routeId)
    
  if (routeId === 'bulk-billing') {
      onNavigateToBulkBilling()
      return
    }
    
    if (routeId === 'client-management') {
      onNavigateToClientManagement()
      return
    }
    
    if (routeId === 'dashboard') {
      setFilteredConsignments(recentShipments)
    } else if (routeId === 'lr-section') {
      // Loaded + Unloaded merged section — currently no data
      setFilteredConsignments([])
    } else if (routeId === 'completed') {
      setFilteredConsignments([])
    }
  }

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Mock search removed — navigate with empty results for now
      onNavigateToSearch(searchTerm, [])
    }
  }

  // Sidebar moved to a shared component; keep data counts here

  const stats = statistics ? [
    {
      title: 'Total Revenue',
      value: statistics.totalRevenue,
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Active Shipments',
      value: statistics.activeShipments,
      change: '+8.2%',
      icon: Package,
      color: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Pending Revenue',
      value: statistics.pendingRevenue,
      change: '+24.7%',
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Net Gross Revenue',
      value: statistics.netGrossRevenue,
      change: '+18.3%',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600'
    }
  ] : []

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-emerald-700 bg-emerald-100 border-emerald-200'
      case 'Loaded': return 'text-amber-700 bg-amber-100 border-amber-200'
      case 'Unloaded': return 'text-blue-700 bg-blue-100 border-blue-200'
      default: return 'text-stone-700 bg-stone-100 border-stone-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-700 bg-red-100 border-red-200'
      case 'Medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200'
      case 'Low': return 'text-green-700 bg-green-100 border-green-200'
      default: return 'text-stone-700 bg-stone-100 border-stone-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Enhanced ConsignmentCard for different views
  const ConsignmentCard = ({ consignment, index }) => {
    const isDetailedView = activeRoute !== 'dashboard'
    
    // Handle consignment card click - navigate to search results with this specific LR
    const handleConsignmentClick = () => {
      if (consignment.lrNumber) {
        // Create a search result array with just this consignment
        const searchResultsArray = [consignment];
        // Navigate to search page with this LR as if it was searched
        onNavigateToSearch(consignment.lrNumber, searchResultsArray);
      }
    };
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.01, x: 4 }}
        onClick={handleConsignmentClick}
        className="flex items-center justify-between p-6 bg-white/5 rounded-3xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/10 group hover:border-white/20 hover:shadow-lg"
      >
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            {consignment.status === 'Loaded' && <Truck className="w-7 h-7 text-white" />}
            {consignment.status === 'Unloaded' && <MapPin className="w-7 h-7 text-white" />}
            {consignment.status === 'Completed' && <CheckCircle className="w-7 h-7 text-white" />}
            {!consignment.status && <Package className="w-7 h-7 text-white" />}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-lg group-hover:text-blue-200 transition-colors duration-300">{consignment.lrNumber || consignment.id}</h4>
            <p className="text-white/80 font-medium">{consignment.client}</p>
            <p className="text-white/60 text-sm">{consignment.route}</p>
            {isDetailedView && (
              <div className="flex items-center space-x-4 text-xs text-white/50 mt-2">
                {consignment.weight && <span>Weight: {consignment.weight}</span>}
                {consignment.driverName && <span>Driver: {consignment.driverName}</span>}
                {consignment.vehicleNumber && <span>Vehicle: {consignment.vehicleNumber}</span>}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right space-y-2">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 ${getStatusColor(consignment.status)}`}>
              {consignment.status}
            </span>
            {isDetailedView && consignment.priority && (
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border transition-all duration-300 ${getPriorityColor(consignment.priority)}`}>
                {consignment.priority}
              </span>
            )}
          </div>
          
          {isDetailedView ? (
            <div className="space-y-1 text-white/60 text-sm">
              {consignment.loadedDate && (
                <p><Calendar className="w-3 h-3 inline mr-1" />Loaded: {formatDate(consignment.loadedDate)}</p>
              )}
              {consignment.deliveredDate && (
                <p><CheckCircle className="w-3 h-3 inline mr-1" />Delivered: {formatDate(consignment.deliveredDate)}</p>
              )}
              {consignment.value && (
                <p className="font-semibold text-white/80">Value: {consignment.value}</p>
              )}
            </div>
          ) : (
            <p className="text-white/50 text-sm">{consignment.time}</p>
          )}
          
          {/* Click indicator */}
          <div className="text-white/40 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to view workflow →
          </div>
        </div>
      </motion.div>
    )
  }

  const getDisplayTitle = () => {
    switch (activeRoute) {
  case 'lr-section': return 'LR Section'
      case 'completed': return 'Completed Consignments'
      default: return 'Recent Shipments'
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
  {/* Background with Overlays (image removed) */}
      <div className="absolute inset-0">
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80" />
        
        {/* Large curved overlay shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full transform rotate-12 blur-3xl" />
          <div className="absolute top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-400/15 to-slate-600/20 rounded-full transform -rotate-12 blur-2xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-br from-slate-600/30 to-blue-500/20 rounded-full transform rotate-45 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-slate-700/40 to-slate-800/30 rounded-full transform -rotate-45 blur-3xl" />
        </div>

        {/* Subtle curved lines overlay */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <path d="M0,200 Q250,50 500,200 T1000,200 L1000,0 L0,0 Z" fill="url(#gradient1)" />
            <path d="M0,400 Q250,250 500,400 T1000,400 L1000,200 L0,200 Z" fill="url(#gradient2)" />
            <path d="M0,600 Q250,450 500,600 T1000,600 L1000,400 L0,400 Z" fill="url(#gradient3)" />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#1e293b" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#334155" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748b" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#475569" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-40 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg"
      >
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Company Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">JK</span>
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">JK LOGISTICS</h1>
                <p className="text-white/70 text-sm">Delivery Management System</p>
              </div>
            </motion.div>

            {/* Header Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-2xl transition-all duration-300 relative"
              >
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-2xl px-4 py-3 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden lg:block text-left">
                  <p className="font-semibold text-white text-sm">John Doe</p>
                  <p className="text-white/70 text-xs">Administrator</p>
                </div>
              </motion.button>

              <motion.button
                onClick={onNavigateToHome}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:block">Logout</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="flex relative z-10">
        {/* Shared Sidebar */}
        <motion.div initial={{ x: -280, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Sidebar
            activeRoute={activeRoute}
            counts={{ lrCount: statistics?.lrCount ?? 0, completedCount: statistics?.completedCount ?? 0 }}
            onRouteChange={handleRouteChange}
            onSearch={(term) => {
              setSearchTerm(term)
              handleSearch()
            }}
          />
        </motion.div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              {activeRoute === 'dashboard' ? 'Dashboard Overview' : getDisplayTitle()}
            </h2>
            <p className="text-white/70 text-lg">
              {activeRoute === 'dashboard' 
                ? 'Real-time insights into your logistics operations'
                : `Viewing ${filteredConsignments.length} ${activeRoute} consignments`
              }
            </p>
          </motion.div>

          {/* Stats Grid - Only show on dashboard */}
          {activeRoute === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 hover:bg-white/20 transition-all duration-300 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-xl border ${
                      stat.change.startsWith('+') ? 'text-emerald-400 bg-emerald-400/20 border-emerald-400/30' : 'text-red-400 bg-red-400/20 border-red-400/30'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-white/70 font-medium">{stat.title}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Enhanced Consignments List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 lg:p-8 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{getDisplayTitle()}</h3>
              <div className="flex items-center space-x-3">
                <span className="text-white/60 text-sm">
                  {filteredConsignments.length} items
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300"
                >
                  <Filter className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredConsignments.map((consignment, index) => (
                <ConsignmentCard 
                  key={consignment.lrNumber || consignment.id} 
                  consignment={consignment} 
                  index={index} 
                />
              ))}
              
              {filteredConsignments.length === 0 && (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-white/60 mb-2">No consignments found</h4>
                  <p className="text-white/40">Try selecting a different category or search for specific LR numbers.</p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard