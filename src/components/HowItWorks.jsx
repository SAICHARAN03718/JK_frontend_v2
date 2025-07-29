import React from 'react'
import { motion } from 'framer-motion'
import { LogIn, Cpu, Send } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: LogIn,
      number: "01",
      title: "Connect Securely",
      description: "Link your invoice sources in minutes with our encrypted, secure integration."
    },
    {
      icon: Cpu,
      number: "02", 
      title: "AI-Powered Processing",
      description: "Our system intelligently reads and validates every line item, flagging discrepancies instantly."
    },
    {
      icon: Send,
      number: "03",
      title: "Instant Billing",
      description: "Once approved, bills are generated and sent to clients without a single click."
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="py-32 px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-stone-800 tracking-tight mb-6">
            Three Steps to{' '}
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Full Automation
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Transform your logistics billing process from manual chaos to seamless automation in just three simple steps.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative bg-stone-200/40 backdrop-blur-lg border border-stone-300/30 rounded-3xl p-8 lg:p-10 h-full hover:bg-stone-200/60 transition-all duration-500">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4">
                    <div className="w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-8 pt-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-amber-600" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-stone-800 mb-4 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed text-lg">
                    {step.description}
                  </p>

                  {/* Connecting Arrow (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-12 transform -translate-y-1/2">
                      <motion.div
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                        className="bg-amber-100 rounded-2xl p-3 shadow-lg border border-amber-200"
                      >
                        <div className="relative">
                          {/* Background glow */}
                          <div className="absolute inset-0 bg-amber-400/30 blur-lg rounded-full" />
                          
                          {/* Arrow icon with strong visibility */}
                          <svg 
                            className="w-10 h-10 text-amber-600 relative z-10" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              d="M4 12H20M20 12L14 6M20 12L14 18" 
                              stroke="currentColor" 
                              strokeWidth="3" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-600/10 to-stone-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom Decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center space-x-4 bg-stone-200/40 backdrop-blur-lg border border-stone-300/30 rounded-3xl px-8 py-4">
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-amber-600 rounded-full"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
            <span className="text-stone-600 font-medium">Setup takes less than 5 minutes</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks