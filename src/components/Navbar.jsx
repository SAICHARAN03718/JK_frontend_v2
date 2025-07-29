import React from 'react'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

const Navbar = ({ onNavigateToHome }) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-stone-100/80 backdrop-blur-lg border-b border-stone-200/50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={onNavigateToHome}
          >
            <div className="w-10 h-10 bg-amber-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-stone-800 tracking-tight">FlowBill</span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Home Button */}
            <motion.button
              onClick={onNavigateToHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors duration-300 px-4 py-2 rounded-2xl hover:bg-stone-200/50"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </motion.button>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
            >
              Access Dashboard
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar