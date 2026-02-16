import { motion } from 'framer-motion'
import { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function InputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  showPasswordToggle = false,
  strength = null,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 'weak': return 'from-red-500 to-red-400'
      case 'medium': return 'from-yellow-500 to-yellow-400'
      case 'strong': return 'from-green-500 to-green-400'
      default: return 'from-gray-600 to-gray-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-200">
          {label}
        </label>
      )}

      <div className="relative">
        <div className="absolute left-4 top-3.5 text-indigo-400 pointer-events-none">
          {Icon && <Icon size={20} />}
        </div>

        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-4 py-3 bg-white/5 border-2 rounded-lg transition-smooth focus:outline-none ${
            error
              ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
              : 'border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          } text-white placeholder-gray-400`}
          {...props}
        />

        {showPasswordToggle && type === 'password' && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-indigo-400 transition-smooth"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </motion.button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-2 text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {strength && type === 'password' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2"
        >
          <div className="flex gap-1">
            {['weak', 'medium', 'strong'].map((level) => (
              <div
                key={level}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  ['weak', 'medium', 'strong'].indexOf(level) <= ['weak', 'medium', 'strong'].indexOf(strength)
                    ? `bg-gradient-to-r ${getStrengthColor(strength)}`
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1 capitalize">
            Password strength: {strength}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
