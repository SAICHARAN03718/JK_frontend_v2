import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Package,
  CheckCircle,
  FileStack,
  UserPlus,
  BarChart3,
} from 'lucide-react'

const Sidebar = ({
  activeRoute = 'dashboard',
  counts = { lrCount: 0, completedCount: 0 },
  onRouteChange = () => {},
  onSearch = () => {},
}) => {
  const [term, setTerm] = useState('')

  const items = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      count: null,
      description: 'Overview',
    },
    {
      id: 'lr-section',
      label: 'LR Section',
      icon: Package,
      count: counts.lrCount ?? 0,
      description: 'Loaded & Unloaded',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: counts.completedCount ?? 0,
      description: 'Billed',
    },
    {
      id: 'bulk-billing',
      label: 'Bulk Billing',
      icon: FileStack,
      count: null,
      description: 'Generate Multiple Bills',
    },
    {
      id: 'client-management',
      label: 'Client Management',
      icon: UserPlus,
      count: null,
      description: 'Manage Clients & Templates',
    },
  ]

  const triggerSearch = () => {
    onSearch(term)
  }

  return (
    <aside className="w-80 min-h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-xl">
      <div className="p-6 space-y-6">
        {/* Search Bar */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Search LR Number</h3>
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter LR number..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && triggerSearch()}
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 pl-12 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={triggerSearch}
              className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Navigation</h3>
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.02, x: 4 }}
              onClick={() => onRouteChange(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                activeRoute === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-6 h-6" />
                <div className="text-left">
                  <span className="font-medium block">{item.label}</span>
                  <span className="text-xs opacity-80">{item.description}</span>
                </div>
              </div>
              {item.count !== null && (
                <span className={`px-3 py-1 rounded-xl text-sm font-bold ${
                  activeRoute === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-white/20 text-white/80'
                }`}>
                  {item.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
