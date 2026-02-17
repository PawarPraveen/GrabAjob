import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function ProfileSetup() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    phone: '',
    profilePicture: null,

    // Education
    collegeName: '',
    degree: 'B.Tech',
    cgpa: '',
    
    // Optional Education Details
    showDiplomaDetails: false,
    diplomaInstitute: '',
    diplomaPercentage: '',
    
    showPucDetails: false,
    pucBoard: '',
    pucPercentage: '',

    // Career Preferences
    domain: '',
    skills: [],
    skillInput: '',
    relocation: 'No',
    preferredLocation: '',

    // Professional Details
    resumeUrl: '',
    certifications: [],
    certificationInput: '',
    projects: [],
    projectName: '',
    projectGithub: '',
    linkedinUrl: '',
    portfolioUrl: '',

    // Additional Information
    extracurricular: '',
    interests: [],
    interestInput: ''
  })

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const requiredFields = [
      formData.fullName,
      formData.phone,
      formData.collegeName,
      formData.degree,
      formData.cgpa,
      formData.domain,
      formData.skills.length > 0,
      formData.resumeUrl
    ]
    const completed = requiredFields.filter(Boolean).length
    return Math.round((completed / requiredFields.length) * 100)
  }

  const completion = calculateCompletion()

  // Validation
  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits'
    
    if (!formData.collegeName.trim()) newErrors.collegeName = 'College/Institute name is required'
    if (!formData.cgpa.trim()) newErrors.cgpa = 'CGPA/Percentage is required'
    
    if (!formData.domain.trim()) newErrors.domain = 'Domain is required'
    if (formData.skills.length === 0) newErrors.skills = 'Add at least one skill'
    if (!formData.resumeUrl) newErrors.resume = 'Resume upload is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add skill
  const addSkill = () => {
    if (formData.skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, formData.skillInput.trim()],
        skillInput: ''
      }))
    }
  }

  // Remove skill
  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  // Add certification
  const addCertification = () => {
    if (formData.certificationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, formData.certificationInput.trim()],
        certificationInput: ''
      }))
    }
  }

  // Remove certification
  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  // Add project
  const addProject = () => {
    if (formData.projectName.trim() && formData.projectGithub.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, { 
          name: formData.projectName.trim(),
          github: formData.projectGithub.trim()
        }],
        projectName: '',
        projectGithub: ''
      }))
    }
  }

  // Remove project
  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  // Add interest
  const addInterest = () => {
    if (formData.interestInput.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, formData.interestInput.trim()],
        interestInput: ''
      }))
    }
  }

  // Remove interest
  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }))
  }

  // Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file
    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, resume: 'Only PDF files are allowed' }))
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }))
      return
    }

    setUploadingResume(true)
    try {
      const session = await supabase.auth?.getSession?.()
      const userId = session?.data?.session?.user?.id

      if (!userId) {
        setErrors(prev => ({ ...prev, resume: 'User not authenticated' }))
        return
      }

      // Upload to Supabase Storage
      const fileName = `resumes/${userId}/${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file)

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName)

      setFormData(prev => ({
        ...prev,
        resumeUrl: publicUrl
      }))

      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.resume
        return newErrors
      })
    } catch (error) {
      console.error('Resume upload error:', error)
      setErrors(prev => ({ ...prev, resume: 'Failed to upload resume' }))
    } finally {
      setUploadingResume(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      const session = await supabase.auth?.getSession?.()
      const userId = session?.data?.session?.user?.id

      if (!userId) {
        setErrors(prev => ({ ...prev, submit: 'User not authenticated' }))
        return
      }

      // Prepare profile data
      const profileData = {
        id: userId,
        full_name: formData.fullName,
        phone: formData.phone,
        college_name: formData.collegeName,
        degree: formData.degree,
        cgpa: formData.cgpa,
        diploma_details: formData.showDiplomaDetails 
          ? { institute: formData.diplomaInstitute, percentage: formData.diplomaPercentage }
          : null,
        puc_details: formData.showPucDetails
          ? { board: formData.pucBoard, percentage: formData.pucPercentage }
          : null,
        domain: formData.domain,
        skills: formData.skills,
        relocation: formData.relocation === 'Yes',
        preferred_location: formData.preferredLocation,
        resume_url: formData.resumeUrl,
        certifications: formData.certifications,
        projects: formData.projects,
        linkedin_url: formData.linkedinUrl,
        portfolio_url: formData.portfolioUrl,
        extracurricular: formData.extracurricular,
        interests: formData.interests
      }

      // Insert or update profile
      const { error } = await supabase
        .from('profiles')
        .upsert([profileData], { onConflict: 'id' })

      if (error) throw error

      setSuccessMessage('Profile completed successfully!')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error) {
      console.error('Profile save error:', error)
      setErrors(prev => ({ ...prev, submit: 'Failed to save profile. Please try again.' }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">Step 3 of 3 – Let's get to know you better</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Profile Completion</span>
            <span className="text-sm font-bold text-blue-600">{completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">{successMessage}</p>
          </motion.div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{errors.submit}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Basic Information</h2>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border rounded-lg transition ${
                    errors.fullName
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  className={`w-full px-4 py-3 border rounded-lg transition ${
                    errors.phone
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Picture <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Education</h2>

            <div className="space-y-5">
              {/* College Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  College / Institute Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="collegeName"
                  value={formData.collegeName}
                  onChange={handleInputChange}
                  placeholder="e.g., IIT Delhi, NIT Bangalore"
                  className={`w-full px-4 py-3 border rounded-lg transition ${
                    errors.collegeName
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                />
                {errors.collegeName && <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>}
              </div>

              {/* Degree */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Degree / Program <span className="text-red-500">*</span>
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="B.Tech">B.Tech</option>
                  <option value="BCA">BCA</option>
                  <option value="BE">BE</option>
                  <option value="MCA">MCA</option>
                  <option value="MBA">MBA</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* CGPA */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CGPA / Percentage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 8.5 or 85%"
                  className={`w-full px-4 py-3 border rounded-lg transition ${
                    errors.cgpa
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                />
                {errors.cgpa && <p className="mt-1 text-sm text-red-600">{errors.cgpa}</p>}
              </div>

              {/* Optional Education Details Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showDiplomaDetails: !prev.showDiplomaDetails }))}
                  className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {formData.showDiplomaDetails ? 'Hide' : 'Add'} Diploma Details
                </button>
              </div>

              {/* Diploma Details (Collapsible) */}
              {formData.showDiplomaDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-5 border-t border-gray-200 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Diploma Institute <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="diplomaInstitute"
                      value={formData.diplomaInstitute}
                      onChange={handleInputChange}
                      placeholder="Institute name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Diploma Percentage
                    </label>
                    <input
                      type="text"
                      name="diplomaPercentage"
                      value={formData.diplomaPercentage}
                      onChange={handleInputChange}
                      placeholder="e.g., 85%"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </motion.div>
              )}

              {/* PUC Details Toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, showPucDetails: !prev.showPucDetails }))}
                  className="text-sm text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {formData.showPucDetails ? 'Hide' : 'Add'} PUC/12th Details
                </button>
              </div>

              {/* PUC Details (Collapsible) */}
              {formData.showPucDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-5 border-t border-gray-200 space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Board / School <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="pucBoard"
                      value={formData.pucBoard}
                      onChange={handleInputChange}
                      placeholder="e.g., CBSE, State Board"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Percentage
                    </label>
                    <input
                      type="text"
                      name="pucPercentage"
                      value={formData.pucPercentage}
                      onChange={handleInputChange}
                      placeholder="e.g., 90%"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* SECTION 3: Career Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Career Preferences</h2>

            <div className="space-y-5">
              {/* Domain */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interested Domain <span className="text-red-500">*</span>
                </label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg transition ${
                    errors.domain
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                  }`}
                >
                  <option value="">Select a domain</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Cloud Engineering">Cloud Engineering</option>
                  <option value="QA Testing">QA Testing</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Other">Other</option>
                </select>
                {errors.domain && <p className="mt-1 text-sm text-red-600">{errors.domain}</p>}
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skills <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.skillInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, skillInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., React, Python)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="hover:text-blue-600"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
                {errors.skills && <p className="mt-2 text-sm text-red-600">{errors.skills}</p>}
              </div>

              {/* Relocation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Open to Relocation?
                </label>
                <select
                  name="relocation"
                  value={formData.relocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Preferred Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Location <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleInputChange}
                  placeholder="e.g., Bangalore, Delhi, Remote"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>
          </motion.div>

          {/* SECTION 4: Professional Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Professional Details</h2>

            <div className="space-y-5">
              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Resume (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleResumeUpload}
                    disabled={uploadingResume}
                    className={`w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                      errors.resume
                        ? 'border-red-400 bg-red-50'
                        : 'border-blue-400 bg-blue-50 hover:border-blue-600'
                    }`}
                  />
                  {uploadingResume && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
                      <div className="animate-spin">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>
                {formData.resumeUrl && (
                  <p className="mt-2 text-sm text-green-600 font-semibold">✓ Resume uploaded successfully</p>
                )}
                {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn Profile URL <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/your-username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Portfolio URL <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Certifications <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.certificationInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, certificationInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    placeholder="e.g., AWS Solutions Architect"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {formData.certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-2"
                  >
                    <span className="text-sm text-gray-700">{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Projects */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Projects <span className="text-gray-500 text-xs">(Optional - Include GitHub Link)</span>
                </label>
                <div className="space-y-3 mb-3">
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                    placeholder="Project name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.projectGithub}
                      onChange={(e) => setFormData(prev => ({ ...prev, projectGithub: e.target.value }))}
                      placeholder="GitHub repository link"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={addProject}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {formData.projects.map((project, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-gray-50 rounded-lg mb-2"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{project.name}</p>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate block"
                        >
                          {project.github}
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* SECTION 5: Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>

            <div className="space-y-5">
              {/* Extracurricular */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Extracurricular Activities <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <textarea
                  name="extracurricular"
                  value={formData.extracurricular}
                  onChange={handleInputChange}
                  placeholder="e.g., Sports captain, Cultural fest organizer, Hackathon participant..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none"
                />
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interests <span className="text-gray-500 text-xs">(Optional)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={formData.interestInput}
                    onChange={(e) => setFormData(prev => ({ ...prev, interestInput: e.target.value }))}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    placeholder="Add an interest (e.g., AI, Web Development)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(index)}
                        className="hover:text-indigo-600"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4"
          >
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              disabled={loading || completion < 60}
              className={`flex-1 px-6 py-3 font-semibold rounded-lg transition ${
                loading || completion < 60
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
              }`}
            >
              {loading ? 'Saving Profile...' : 'Complete Profile & Continue'}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  )
}
