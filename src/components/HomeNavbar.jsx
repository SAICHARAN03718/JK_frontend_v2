import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, User, UserPlus, Menu, X, ChevronDown } from 'lucide-react'

const HomeNavbar = ({ onNavigateToLanding, onNavigateToLogin, onNavigateToDashboard }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Logistics Manager' },
    { value: 'operator', label: 'Operations Specialist' },
    { value: 'analyst', label: 'Data Analyst' },
    { value: 'coordinator', label: 'Shipping Coordinator' }
  ]

  const [selectedRole, setSelectedRole] = useState('')
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    setShowLoginModal(false)
    // Navigate to dashboard or another route
    if (onNavigateToDashboard) {
      onNavigateToDashboard()
    }
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setShowRegisterModal(false)
    setShowLoginModal(true)
    // Reset form
    setSelectedRole('')
  }

  return (
    <>
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
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors duration-300 px-4 py-2 rounded-2xl hover:bg-stone-200/50"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </motion.button>

              <motion.button
                onClick={onNavigateToLanding}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-stone-600 hover:text-stone-800 transition-colors duration-300 px-4 py-2 rounded-2xl hover:bg-stone-200/50 font-medium"
              >
                Platform
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLoginModal(true)}
                className="flex items-center space-x-2 bg-stone-200/60 backdrop-blur-lg border border-stone-300/50 hover:bg-stone-200/80 text-stone-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-300"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRegisterModal(true)}
                className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-stone-600 hover:text-stone-800 transition-colors duration-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-4 border-t border-stone-200/50"
            >
              <div className="flex flex-col space-y-4">
                <button className="flex items-center space-x-2 text-stone-600 hover:text-stone-800 transition-colors duration-300 w-full text-left px-4 py-2 rounded-2xl hover:bg-stone-200/50">
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </button>

                <button
                  onClick={() => {
                    onNavigateToLanding()
                    setIsMenuOpen(false)
                  }}
                  className="text-stone-600 hover:text-stone-800 transition-colors duration-300 w-full text-left px-4 py-2 rounded-2xl hover:bg-stone-200/50"
                >
                  Platform
                </button>

                <button
                  onClick={() => {
                    setShowLoginModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 bg-stone-200/60 text-stone-700 px-4 py-3 rounded-2xl font-semibold w-full"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => {
                    setShowRegisterModal(true)
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center space-x-2 bg-amber-600 text-white px-4 py-3 rounded-2xl font-semibold w-full"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Register</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Login Modal */}
      {showLoginModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
          onClick={() => setShowLoginModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-stone-50/95 backdrop-blur-lg border border-stone-200/50 rounded-3xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-stone-800 mb-6 text-center">Welcome Back</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-stone-600 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-stone-100/70 border border-stone-200/50 rounded-2xl text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-stone-600 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-stone-100/70 border border-stone-200/50 rounded-2xl text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your password"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
              >
                Sign In
              </motion.button>
            </form>
            <p className="text-center text-stone-500 mt-6">
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false)
                  setShowRegisterModal(true)
                }}
                className="text-amber-600 hover:text-amber-500 transition-colors duration-300"
              >
                Sign up
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm"
          onClick={() => setShowRegisterModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-stone-50/95 backdrop-blur-lg border border-stone-200/50 rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-stone-800 mb-6 text-center">Join FlowBill</h2>
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <label className="block text-stone-600 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-stone-100/70 border border-stone-200/50 rounded-2xl text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-stone-600 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-stone-100/70 border border-stone-200/50 rounded-2xl text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-stone-600 text-sm font-medium mb-2">Role</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="w-full px-4 py-3 bg-stone-100/70 border border-stone-200/50 rounded-2xl text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 flex items-center justify-between"
                  >
                    <span className={selectedRole ? 'text-stone-800' : 'text-stone-500'}>
                      {selectedRole ? roles.find(role => role.value === selectedRole)?.label : 'Select your role'}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-stone-500 transition-transform duration-300 ${
                        isRoleDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isRoleDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-stone-100/95 backdrop-blur-lg border border-stone-200/50 rounded-2xl shadow-2xl z-50 max-h-48 overflow-y-auto"
                    >
                      {roles.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => {
                            setSelectedRole(role.value)
                            setIsRoleDropdownOpen(false)
                          }}
                          className="w-full px-4 py-3 text-left text-stone-700 hover:text-stone-800 hover:bg-stone-200/50 transition-all duration-300 first:rounded-t-2xl last:rounded-b-2xl"
                        >
                          {role.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-stone-600 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-stone-100/70 border border-stone-200/50 rounded-2xl text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="block text-stone-600 text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-stone-100/70 border border-stone-200/50 rounded-2xl text-stone-800 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  placeholder="Confirm your password"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!selectedRole}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-stone-400 disabled:cursor-not-allowed text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-amber-500/25"
              >
                Create Account
              </motion.button>
            </form>
            <p className="text-center text-stone-500 mt-6">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setShowRegisterModal(false)
                  setShowLoginModal(true)
                  setSelectedRole('') // Reset role selection
                }}
                className="text-amber-600 hover:text-amber-500 transition-colors duration-300"
              >
                Sign in
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default HomeNavbar