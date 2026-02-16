import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Lock, Target, User, Briefcase, Building2 } from 'lucide-react'
import AuthTabs from '../components/AuthTabs'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState('student')

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        navigate('/dashboard')
      }
    }
    checkSession()
  }, [navigate])

  const roleDescriptions = {
    student: 'Build your first professional profile and land your first opportunity.',
    professional: 'Showcase your experience and connect with companies looking for talent.',
    recruiter: 'Find the right candidates and build your dream team.'
  }

  const features = [
    {
      icon: Zap,
      title: 'Fast Onboarding',
      description: 'Create your profile and start applying instantly.'
    },
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security.'
    },
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'Get opportunities aligned with your skills and goals.'
    }
  ]

  const roleOptions = [
    { id: 'student', label: 'Student', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'recruiter', label: 'Recruiter', icon: Building2 }
  ]

  return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20 pb-20 px-6">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Interactive & Modern */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          {/* Animated Gradient Background */}
          <div className="relative rounded-2xl overflow-hidden p-12 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 min-h-96">
            {/* Animated floating elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"
            />

            <div className="relative z-10 space-y-8">
              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-white text-4xl font-bold mb-2">
                  Welcome to
                </h2>
                <h1 className="text-5xl font-bold mb-4">
                  <span className="text-white">CareerBridge</span>
                </h1>
                <p className="text-white/90 text-lg">
                  Where talent meets opportunity
                </p>
              </motion.div>

              {/* Role Selector */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
              >
                <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">I am a:</p>
                <div className="flex gap-3">
                  {roleOptions.map((role) => {
                    const Icon = role.icon
                    return (
                      <motion.button
                        key={role.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedRole(role.id)}
                        className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                          selectedRole === role.id
                            ? 'bg-white text-blue-600 shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                      >
                        <Icon size={16} className="inline mr-1" />
                        {role.label}
                      </motion.button>
                    )
                  })}
                </div>
                <motion.p
                  key={selectedRole}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/80 text-sm mt-3 italic"
                >
                  "{roleDescriptions[selectedRole]}"
                </motion.p>
              </motion.div>

              {/* Feature Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 pt-4"
              >
                {features.map((feature, i) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={i}
                      whileHover={{ x: 8, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-pointer group transition-all hover:bg-white/15"
                    >
                      <div className="flex gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:bg-white/30 transition-all"
                        >
                          <Icon size={24} className="text-white" />
                        </motion.div>
                        <div>
                          <h4 className="text-white font-semibold text-sm">{feature.title}</h4>
                          <p className="text-white/70 text-xs mt-1">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* Floating Mock Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -5 }}
                className="mt-8 bg-white/95 rounded-xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"
                  />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Alex Johnson</p>
                    <p className="text-gray-600 text-xs">Senior Developer</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['React', 'Node.js', 'SQL'].map((skill) => (
                    <motion.span
                      key={skill}
                      whileHover={{ scale: 1.05 }}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium cursor-pointer"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-md shadow-lg">
            <AuthTabs />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

