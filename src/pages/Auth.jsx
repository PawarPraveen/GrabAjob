import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, CheckCircle, Upload } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
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
    email: '',
    password: '',
    confirmPassword: '',
    // Job Seeker fields
    experienceLevel: 'fresher',
    skills: [],
    location: '',
    resumeUrl: '',
    // Recruiter fields
    companyName: '',
    companySize: '',
    hiringRole: '',
    workEmail: '',
  })

  const [skillInput, setSkillInput] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Store role and additional data
      localStorage.setItem('userRole', role)
      localStorage.setItem('userData', JSON.stringify({
        ...formData,
        userId: data.user.id
      }))

      // Redirect to dashboard based on role
      setTimeout(() => {
        if (role === 'job-seeker') {
          navigate('/dashboard/seeker')
        } else {
          navigate('/dashboard/recruiter')
        }
      }, 500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // Redirect to appropriate dashboard
      const savedRole = localStorage.getItem('userRole') || 'job-seeker'
      setTimeout(() => {
        if (savedRole === 'job-seeker') {
          navigate('/dashboard/seeker')
        } else {
          navigate('/dashboard/recruiter')
        }
      }, 500)
    } catch (err) {
      setError(err.message)
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
      email: '',
      password: '',
      confirmPassword: '',
      experienceLevel: 'fresher',
      skills: [],
      location: '',
      resumeUrl: '',
      companyName: '',
      companySize: '',
      hiringRole: '',
      workEmail: '',
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
                        onClick={() => setRole('job-seeker')}
                        className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-accent hover:shadow-lg transition-smooth text-left group"
                      >
                        <div className="text-4xl mb-3">👤</div>
                        <h3 className="font-bold text-lg mb-1">I'm Looking for a Job</h3>
                        <p className="text-sm text-gray-600">Find your next opportunity</p>
                      </button>

                      <button
                        onClick={() => setRole('recruiter')}
                        className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-brand-accent hover:shadow-lg transition-smooth text-left group"
                      >
                        <div className="text-4xl mb-3">🏢</div>
                        <h3 className="font-bold text-lg mb-1">I'm Hiring Talent</h3>
                        <p className="text-sm text-gray-600">Find your next team member</p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Basic Info */}
                {step === 2 && role && (
                  <motion.div
                    key="basic-info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="heading-md mb-2">Create Your Account</h2>
                    <p className="text-gray-600 mb-8">Step 2 of 3</p>

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
                          placeholder="Minimum 8 characters"
                        />
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
                          onClick={prevStep}
                          className="flex-1 btn-outline flex items-center justify-center gap-2"
                        >
                          <ArrowLeft size={18} /> Back
                        </button>
                        <button
                          onClick={nextStep}
                          className="flex-1 btn-primary flex items-center justify-center gap-2"
                        >
                          Next <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Role-Specific Info */}
                {step === 3 && role && (
                  <motion.div
                    key="role-specific"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="heading-md mb-2">Complete Your Profile</h2>
                    <p className="text-gray-600 mb-8">Step 3 of 3</p>

                    <div className="space-y-6">
                      {role === 'job-seeker' ? (
                        <>
                          <div>
                            <label className="block text-sm font-semibold mb-3">Experience Level</label>
                            <div className="space-y-2">
                              {['fresher', 'experienced'].map(level => (
                                <label key={level} className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-brand-accent transition-smooth" style={{
                                  borderColor: formData.experienceLevel === level ? 'rgb(59, 130, 246)' : 'rgb(229, 231, 235)'
                                }}>
                                  <input
                                    type="radio"
                                    name="experienceLevel"
                                    value={level}
                                    checked={formData.experienceLevel === level}
                                    onChange={handleInputChange}
                                    className="w-5 h-5"
                                  />
                                  <span className="font-medium capitalize">{level === 'fresher' ? 'Fresher (0-2 years)' : 'Experienced (2+ years)'}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2">Location</label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder="City, Country"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2">Top Skills</label>
                            <input
                              type="text"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={addSkill}
                              className="input-field"
                              placeholder="Type skill and press Enter (e.g., React, Python)"
                            />
                            <div className="flex flex-wrap gap-2 mt-4">
                              {formData.skills.map((skill, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="badge-primary flex items-center gap-2"
                                >
                                  {skill}
                                  <button
                                    onClick={() => removeSkill(idx)}
                                    className="hover:text-brand-accent"
                                  >
                                    ×
                                  </button>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-semibold mb-2">Company Name</label>
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder="Your company name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2">Company Size</label>
                            <select
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleInputChange}
                              className="input-field"
                            >
                              <option value="">Select company size</option>
                              <option value="1-10">1-10 employees</option>
                              <option value="10-50">10-50 employees</option>
                              <option value="50-200">50-200 employees</option>
                              <option value="200+">200+ employees</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2">Primary Hiring Role</label>
                            <input
                              type="text"
                              name="hiringRole"
                              value={formData.hiringRole}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder="e.g., Full Stack Engineer"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold mb-2">Work Email</label>
                            <input
                              type="email"
                              name="workEmail"
                              value={formData.workEmail}
                              onChange={handleInputChange}
                              className="input-field"
                              placeholder="company@example.com"
                            />
                          </div>
                        </>
                      )}

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
                          onClick={prevStep}
                          className="flex-1 btn-outline flex items-center justify-center gap-2"
                        >
                          <ArrowLeft size={18} /> Back
                        </button>
                        <button
                          onClick={handleSignUp}
                          disabled={loading}
                          className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? 'Creating account...' : 'Create Account'}
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

