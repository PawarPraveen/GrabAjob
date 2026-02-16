import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'
import InputField from './InputField'
import SocialLoginButtons from './SocialLoginButtons'
import { auth } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const navigate = useNavigate()

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'job-seeker',
    agreedToTerms: false
  })

  const [passwordStrength, setPasswordStrength] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowToast(false), 3000)
    return () => clearTimeout(timer)
  }, [showToast])

  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'weak'
    if (password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) return 'medium'
    return 'strong'
  }

  const handleRegisterPasswordChange = (value) => {
    setRegisterForm(prev => ({ ...prev, password: value }))
    setPasswordStrength(getPasswordStrength(value))
  }

  const showNotification = (message) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const { data, error: signInError } = await auth.signin(loginForm.email, loginForm.password)

    if (signInError) {
      setError(signInError)
      setLoading(false)
      return
    }

    showNotification('Login successful! Redirecting...')
    setTimeout(() => {
      navigate('/dashboard')
    }, 1500)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!registerForm.fullName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!registerForm.agreedToTerms) {
      setError('Please agree to the terms and conditions')
      setLoading(false)
      return
    }

    const { data, error: signUpError } = await auth.signup(
      registerForm.email,
      registerForm.password,
      {
        fullName: registerForm.fullName,
        role: registerForm.role
      }
    )

    if (signUpError) {
      setError(signUpError)
      setLoading(false)
      return
    }

    showNotification('Registration successful! Please check your email to verify your account.')
    setRegisterForm({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'job-seeker',
      agreedToTerms: false
    })
    setActiveTab('login')
  }

  return (
    <div className="w-full max-w-md">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 flex items-center gap-2"
          >
            ✓ {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Headers */}
      <div className="flex gap-4 mb-8 relative">
        {['login', 'register'].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setError(null)
            }}
            className={`flex-1 py-3 text-center font-semibold capitalize transition-smooth relative ${
              activeTab === tab ? 'text-white' : 'text-gray-400'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-6 flex items-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'login' ? (
          <motion.form
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleLogin}
            className="space-y-4"
          >
            <InputField
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={loginForm.email}
              onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              showPasswordToggle
              value={loginForm.password}
              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
            />

            <div className="flex justify-end">
              <motion.a
                whileHover={{ color: '#EC4899' }}
                href="#"
                className="text-sm text-indigo-400 hover:text-pink-500 transition-smooth"
              >
                Forgot password?
              </motion.a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(79, 70, 229, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-lg font-semibold transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>

            <SocialLoginButtons />
          </motion.form>
        ) : (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <InputField
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={registerForm.fullName}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
            />

            <InputField
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={registerForm.email}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
            />

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                I am a
              </label>
              <select
                value={registerForm.role}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-4 py-3 bg-white/5 border-2 border-white/10 rounded-lg focus:border-indigo-500 focus:outline-none text-white"
              >
                <option value="job-seeker" className="bg-slate-900">Job Seeker</option>
                <option value="experienced" className="bg-slate-900">Experienced Professional</option>
              </select>
            </div>

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              showPasswordToggle
              strength={passwordStrength}
              value={registerForm.password}
              onChange={(e) => handleRegisterPasswordChange(e.target.value)}
            />

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              showPasswordToggle
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword ? 'Passwords do not match' : null}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <input
                type="checkbox"
                id="terms"
                checked={registerForm.agreedToTerms}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                className="mt-1 w-4 h-4 rounded border-white/20 accent-indigo-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                I agree to the{' '}
                <motion.a whileHover={{ color: '#EC4899' }} href="#" className="text-indigo-400 hover:text-pink-500 transition-smooth">
                  Terms of Service
                </motion.a>{' '}
                and{' '}
                <motion.a whileHover={{ color: '#EC4899' }} href="#" className="text-indigo-400 hover:text-pink-500 transition-smooth">
                  Privacy Policy
                </motion.a>
              </label>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(79, 70, 229, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-lg font-semibold transition-smooth disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>

            <SocialLoginButtons />
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
