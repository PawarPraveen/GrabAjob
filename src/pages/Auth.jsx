import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { supabase, auth as supabaseAuth, isUsingMockAuth } from '../lib/supabaseClient'
import NavbarPublic from '../components/NavbarPublic'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(searchParams.get('role') || null)
  const [tab, setTab] = useState(searchParams.get('tab') || 'signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // SUPABASE CLIENT CHECK (debug) - safe access for browser
  try {
    console.log('VITE SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('VITE SUPABASE KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)
    console.log('PROCESS SUPABASE URL:', typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'undefined')
    console.log('PROCESS SUPABASE KEY:', typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : 'undefined')
  } catch (e) {
    // ignore in environments where process is not defined
  }

  // Utility: safe JSON stringify for console logging (handles circulars)
  const safeStringify = (obj) => {
    try {
      return JSON.stringify(obj, Object.getOwnPropertyNames(obj), 2)
    } catch (e) {
      try {
        return JSON.stringify(JSON.parse(JSON.stringify(obj)), null, 2)
      } catch (e2) {
        return String(obj)
      }
    }
  }

  const handleSignUp = async () => {
    try {
      setLoading(true);

      const cleanEmail = (formData.email || '').trim();
      const password = formData.password;
      const confirmPassword = formData.confirmPassword;

      if (!cleanEmail || !password) {
        alert("Email and password required");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }

      console.log("Creating user with:", cleanEmail, "(mock mode:", isUsingMockAuth, ")");

      // Use centralized auth helper to ensure consistent behavior
      const result = await supabaseAuth.signup(cleanEmail, password, { role: role || 'job-seeker' })

      console.log('Signup result:', result)

      if (result.error) {
        alert('Signup failed: ' + result.error)
        setLoading(false)
        return
      }

      if (result.data?.user) {
        alert('Signup successful')
        console.log('Created user:', result.data.user)
      } else {
        // If no session returned, likely email confirmation required
        alert('Signup created. Please check your email to confirm your account (if required).')
        console.log('Signup note: no immediate session returned; confirm-email may be required')
      }

    } catch (err) {
      console.error('Unexpected error:', err)
      alert('Signup error: ' + (err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e?.preventDefault?.()
    if (loading) return
    try {
      setLoading(true)

      const cleanEmail = (formData.email || '').trim()
      const password = formData.password

      console.log('Attempting login with:', cleanEmail, '(mock mode:', isUsingMockAuth, ')')

      const result = await supabaseAuth.signin(cleanEmail, password)

      console.log('Login result:', result)

      if (result.error) {
        alert('Login failed: ' + result.error)
        setLoading(false)
        return
      }

      if (result.data?.session) {
        console.log('Session:', result.data.session)
        // Navigate to AI Match dashboard after successful login
        navigate('/ai-match')
      } else {
        // No session -> likely email not confirmed or other configuration issue
        alert('Login created no session. Check email confirmation or Supabase settings.')
        console.warn('Login note: no session returned; check `Confirm email` and SMTP settings in Supabase')
      }

    } catch (err) {
      console.error('Unexpected login error:', err)
      alert('Login error: ' + (err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step < (role === 'job-seeker' ? 3 : 3)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleTabChange = (newTab) => {
    setTab(newTab)
    setStep(1)
    setRole(null)
    setError(null)
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <NavbarPublic />

      <div className="pt-24 pb-20 px-6 flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          {/* Tab Switcher */}
          <div className="flex gap-4 mb-8 glass-effect rounded-2xl p-2 border border-gray-200">
            <button
              onClick={() => handleTabChange('signup')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-smooth ${
                tab === 'signup'
                  ? 'bg-brand-primary text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Create Account
            </button>
            <button
              onClick={() => handleTabChange('login')}
              className={`flex-1 py-3 rounded-lg font-semibold transition-smooth ${
                tab === 'login'
                  ? 'bg-brand-primary text-white shadow-lg'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              Login
            </button>
          </div>

          {/* Sign Up Flow */}
          {tab === 'signup' && (
            <div className="glass-effect rounded-3xl border border-gray-200 p-8 md:p-12">
              <AnimatePresence mode="wait">
                {/* Step 1: Role Selection */}
                {step === 1 && !role && (
                  <motion.div
                    key="role-select"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="heading-md mb-2">Who are you?</h2>
                    <p className="text-gray-600 mb-8">Choose your role to get started</p>

                    <div className="space-y-4">
                      <button
                        onClick={() => {
                          setRole('job-seeker')
                          setStep(2)
                        }}
                        className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-accent hover:shadow-lg transition-smooth text-left group"
                      >
                        <div className="text-4xl mb-3">👤</div>
                        <h3 className="font-bold text-lg mb-1">I'm Looking for a Job</h3>
                        <p className="text-sm text-gray-600">Find your next opportunity</p>
                      </button>

                      <button
                        onClick={() => {
                          setRole('recruiter')
                          setStep(2)
                        }}
                        className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-accent hover:shadow-lg transition-smooth text-left group"
                      >
                        <div className="text-4xl mb-3">🏢</div>
                        <h3 className="font-bold text-lg mb-1">I'm Hiring Talent</h3>
                        <p className="text-sm text-gray-600">Find your next team member</p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Create Account */}
                {step === 2 && role && (
                  <motion.div
                    key="basic-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="heading-md mb-2">Create Your Account</h2>
                    <p className="text-gray-600 mb-8">Step 2 of 2</p>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Minimum 8 characters"
                        />
                        {formData.password && formData.password.length < 8 && (
                          <p className="text-red-600 text-sm mt-1">Password must be at least 8 characters</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold mb-2">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="Confirm password"
                        />
                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                          <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
                        )}
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                        >
                          {error}
                        </motion.div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            setRole(null)
                            setStep(1)
                            setError(null)
                          }}
                          className="flex-1 btn-outline flex items-center justify-center gap-2"
                        >
                          <ArrowLeft size={18} /> Back
                        </button>
                        <button
                          onClick={handleSignUp}
                          disabled={loading}
                          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            <>
                              Create Account <ArrowRight size={18} />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Login Flow */}
          {tab === 'login' && (
            <div className="glass-effect rounded-3xl border border-gray-200 p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="heading-md mb-2">Welcome Back</h2>
                <p className="text-gray-600 mb-8">Sign in to your account</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your password"
                    />
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={() => handleTabChange('signup')}
                        className="text-brand-primary font-semibold hover:underline"
                      >
                        Create one
                      </button>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

