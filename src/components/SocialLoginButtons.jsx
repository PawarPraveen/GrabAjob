import { motion } from 'framer-motion'
import { useState } from 'react'
import { auth } from '../lib/supabaseClient'
import { Chrome, Github, Linkedin } from 'lucide-react'

export default function SocialLoginButtons() {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  const providers = [
    { 
      name: 'Google', 
      id: 'google',
      icon: Chrome,
      bgColor: 'bg-white',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700',
      hoverBg: 'hover:bg-gray-50',
      iconColor: 'text-red-500'
    },
    { 
      name: 'GitHub', 
      id: 'github',
      icon: Github,
      bgColor: 'bg-gray-900',
      borderColor: 'border-gray-900',
      textColor: 'text-white',
      hoverBg: 'hover:bg-gray-800',
      iconColor: 'text-white'
    },
    { 
      name: 'LinkedIn', 
      id: 'linkedin',
      icon: Linkedin,
      bgColor: 'bg-blue-600',
      borderColor: 'border-blue-600',
      textColor: 'text-white',
      hoverBg: 'hover:bg-blue-700',
      iconColor: 'text-white'
    }
  ]

  const handleOAuth = async (provider) => {
    setLoading(provider)
    setError(null)
    try {
      const { data, error: oauthError } = await auth.signInWithOAuth(provider)
      if (oauthError) {
        setError(oauthError.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="w-full space-y-3">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => {
          const Icon = provider.icon
          return (
            <motion.button
              key={provider.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOAuth(provider.id)}
              disabled={loading === provider.id}
              className={`relative py-3 px-4 rounded-lg border-2 ${provider.bgColor} ${provider.borderColor} ${provider.textColor} ${provider.hoverBg} transition-all font-semibold flex flex-col items-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-md`}
            >
              <Icon size={20} className={provider.iconColor} />
              {loading === provider.id ? (
                <div className="w-3 h-3 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              ) : (
                <span className="text-xs">{provider.name}</span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
