import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Clock, BarChart3, Zap, CheckCircle, Globe } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Error Reduction",
      description: "Minimize human error with 99.9% data accuracy and intelligent validation.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "24/7 Operation",
      description: "Your billing process never sleeps, even when you do. Continuous automation.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track every invoice and payment from a single, beautiful dashboard.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process thousands of invoices in seconds, not hours or days.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      icon: CheckCircle,
      title: "Seamless Integration",
      description: "Works with your existing accounting and logistics software seamlessly.",
      color: "from-teal-500 to-teal-600"
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "Built-in compliance for international shipping and billing regulations.",
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 bg-clip-text text-transparent">
              Modern Logistics
            </span>
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to transform your billing process into a competitive advantage.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group relative"
              >
                {/* Feature Card */}
                <div className="relative bg-stone-200/40 backdrop-blur-lg border border-stone-300/30 rounded-3xl p-8 h-full hover:bg-stone-200/60 transition-all duration-500 overflow-hidden">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-stone-800 mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 -z-10`} />
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`absolute w-1.5 h-1.5 bg-gradient-to-br ${feature.color} rounded-full opacity-0 group-hover:opacity-60`}
                        style={{
                          left: `${20 + i * 25}%`,
                          top: `${30 + i * 15}%`,
                        }}
                        animate={{
                          y: [0, -15, 0],
                          x: [0, 10, 0],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 2 + i * 0.3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <div className="bg-gradient-to-r from-amber-500/20 via-stone-400/20 to-amber-500/20 rounded-3xl p-12 lg:p-16 border border-stone-300/30 backdrop-blur-lg">
            <h3 className="text-3xl md:text-4xl font-bold text-stone-800 mb-6 tracking-tight">
              Ready to Transform Your Billing Process?
            </h3>
            <p className="text-xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join leading logistics companies who have already automated their billing and saved thousands of hours.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-3xl text-lg font-semibold transition-all duration-300 shadow-2xl hover:shadow-amber-500/30"
            >
              Start Free Trial
            </motion.button>
          </div>
        </motion.div>

        {/* Background Decoration */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-500/5 rounded-full blur-3xl -z-10" />
      </div>
    </section>
  )
}

export default Features