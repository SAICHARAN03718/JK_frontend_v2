import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Features from '../components/Features'
import Footer from '../components/Footer'

const LandingPage = ({ onNavigateToHome, onNavigateToDashboard }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200">
  <Navbar onNavigateToHome={onNavigateToHome} onNavigateToDashboard={onNavigateToDashboard} />
      {/* Quick bypass to dashboard */}
      <motion.button
        onClick={onNavigateToDashboard}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-orange-600 text-white shadow-lg hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
        aria-label="Bypass and go to Dashboard"
      >
        Bypass → Dashboard
      </motion.button>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
        <HowItWorks />
        <Features />
      </motion.main>
      <Footer />
    </div>
  )
}

export default LandingPage