import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Globe, ChevronDown } from 'lucide-react'
import HomeNavbar from '../components/HomeNavbar'

const HomePage = ({ onNavigateToLanding, onNavigateToDashboard }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100">
      {/* Background Pattern with Geometric Shapes */}
      <div className="absolute inset-0">
        {/* Base warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100" />
        
        {/* Geometric overlay patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-amber-200 rounded-3xl rotate-12 blur-sm" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-stone-300 rounded-2xl -rotate-6 blur-sm" />
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-amber-300 rounded-full blur-md opacity-50" />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-stone-400 rounded-3xl rotate-45 blur-sm" />
        </div>
      </div>

      <HomeNavbar 
        onNavigateToLanding={onNavigateToLanding} 
        onNavigateToDashboard={onNavigateToDashboard}
      />

      {/* Quick bypass to dashboard */}
      <motion.button
        onClick={onNavigateToDashboard}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-amber-600 text-white shadow-lg hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label="Bypass and go to Dashboard"
      >
        Bypass → Dashboard
      </motion.button>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-stone-800 tracking-tight leading-none mb-6">
              <span className="block">Welcome to</span>
              <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-stone-700 bg-clip-text text-transparent">
                FlowBill
              </span>
            </h1>
          </motion.div>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl md:text-3xl text-stone-600 leading-relaxed mb-12 max-w-4xl mx-auto font-light"
          >
            Transform your logistics operations with intelligent automation. 
            Experience the future of billing management today.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <motion.button
              onClick={onNavigateToLanding}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(180, 83, 9, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group bg-amber-600 hover:bg-amber-500 text-white px-12 py-5 rounded-3xl text-xl font-semibold transition-all duration-300 shadow-2xl flex items-center space-x-3"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-stone-200/60 backdrop-blur-lg border border-stone-300/50 hover:bg-stone-200/80 text-stone-700 px-12 py-5 rounded-3xl text-xl font-semibold transition-all duration-300"
            >
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Process invoices in seconds" },
              { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security" },
              { icon: Globe, title: "Global Ready", desc: "Multi-currency support" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-stone-100/70 backdrop-blur-lg border border-stone-200/50 rounded-3xl p-8 hover:bg-stone-100/90 transition-all duration-300 shadow-lg"
              >
                <feature.icon className="w-12 h-12 text-amber-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-stone-800 mb-2">{feature.title}</h3>
                <p className="text-stone-600">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center space-y-2 text-stone-500"
            >
              <span className="text-sm font-medium">Scroll to explore</span>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/40 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default HomePage