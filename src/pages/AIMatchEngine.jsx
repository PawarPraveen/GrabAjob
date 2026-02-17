import { useState, useEffect } from 'react'
import { Upload, FileText, Zap, Target, BookOpen, CheckCircle, AlertCircle, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { matchJobWithResume, extractKeywords, getLearningResources, generateSuggestions } from '../utils/aiMatcher'
import NavbarPublic from '../components/NavbarPublic'
import '../styles/AIMatchEngine.css'

export default function AIMatchEngine() {
  const [jobDescription, setJobDescription] = useState('')
  const [uploadMethod, setUploadMethod] = useState('text') // 'text', 'file'
  const [fileName, setFileName] = useState('')
  const [resumeData, setResumeData] = useState('')
  const [matchResult, setMatchResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [resources, setResources] = useState([])

  // Mock user profile (replace with Supabase fetch)
  useEffect(() => {
    const mockProfile = {
      skills: ['javascript', 'react', 'nodejs', 'tailwind', 'git'],
      experience: '3 years',
      projects: ['ecommerce platform', 'real estate portal', 'saas dashboard'],
      techStack: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'PostgreSQL'],
      certifications: ['Google Cloud Associate', 'AWS Certified'],
      CGPA: 3.8,
      domain: 'Full Stack Development',
      relocation: 'willing',
      education: 'B.Tech Computer Science'
    }
    
    // Combine all profile data into one text string for matching
    const profileText = `
      ${mockProfile.skills.join(' ')}
      ${mockProfile.experience}
      ${mockProfile.projects.join(' ')}
      ${mockProfile.techStack.join(' ')}
      ${mockProfile.certifications.join(' ')}
      ${mockProfile.CGPA}
      ${mockProfile.domain}
      ${mockProfile.relocation}
      ${mockProfile.education}
    `
    
    setUserProfile(mockProfile)
    setResumeData(profileText)
  }, [])

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setLoading(true)

    try {
      // For demo: just read text files and paste content
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const text = await file.text()
        setJobDescription(text)
      } else {
        // For PDFs/docs, you'd use a library like pdfjs or mammoth
        alert('File type not yet supported. Please paste text or use plain text files.')
      }
    } catch (error) {
      alert('Error reading file: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Run match analysis
  const runMatch = () => {
    if (!jobDescription.trim() || !resumeData.trim()) {
      alert('Please provide both job description and profile data')
      return
    }

    setLoading(true)

    // Simulate processing delay
    setTimeout(() => {
      const result = matchJobWithResume(jobDescription, resumeData)
      setMatchResult(result)

      const sugg = generateSuggestions(result.score, result.missingKeywords, result.matchedKeywords)
      setSuggestions(sugg)

      const learningResources = getLearningResources(result.missingKeywords, userProfile?.domain)
      setResources(learningResources)

      setLoading(false)
    }, 1000)
  }

  // Clear job description
  const clearJobDescription = () => {
    setJobDescription('')
    setFileName('')
    setMatchResult(null)
    setSuggestions([])
    setResources([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <NavbarPublic />
      
      <div className="pt-24 pb-20 px-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Zap className="text-yellow-500" size={40} />
              AI Match Engine
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Upload a job description and get an instant compatibility score with your profile.
              See what skills you need to strengthen your application.
            </p>
          </div>
        </div>

        {/* Main Container */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Job Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-effect rounded-3xl border border-blue-200 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={28} className="text-blue-600" />
                Job Description
              </h2>

              {/* Upload Method Tabs */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setUploadMethod('text')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    uploadMethod === 'text'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Paste Text
                </button>
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    uploadMethod === 'file'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* Text Input */}
              {uploadMethod === 'text' && (
                <div className="mb-6">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here... Include required skills, experience, responsibilities, etc."
                    className="w-full h-80 p-4 border-2 border-blue-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 resize-none"
                  />
                </div>
              )}

              {/* File Upload */}
              {uploadMethod === 'file' && (
                <div className="mb-6">
                  <label className="block w-full p-8 border-2 border-dashed border-blue-400 rounded-xl text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition">
                    <Upload size={32} className="mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-gray-700">Click to upload</p>
                    <p className="text-sm text-gray-500">Support: TXT, PDF (paste for now)</p>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".txt,.pdf,.doc,.docx"
                      className="hidden"
                    />
                  </label>
                  {fileName && (
                    <p className="mt-3 text-sm text-green-600 flex items-center gap-2">
                      <CheckCircle size={16} /> File: {fileName}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={runMatch}
                  disabled={!jobDescription.trim() || loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {loading ? 'Analyzing...' : 'Run Match Analysis'}
                </button>
                <button
                  onClick={clearJobDescription}
                  className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
                  title="Clear job description"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>

            {/* RIGHT: Match Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-effect rounded-3xl border border-green-200 p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Target size={28} className="text-green-600" />
                Match Results
              </h2>

              <AnimatePresence mode="wait">
                {matchResult ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {/* Similarity Score Circle */}
                    <div className="text-center mb-8">
                      <div className="relative w-40 h-40 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="#e5e7eb"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke={
                              matchResult.score > 85
                                ? '#22c55e'
                                : matchResult.score > 70
                                ? '#f59e0b'
                                : '#ef4444'
                            }
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${(matchResult.score / 100) * 440} 440`}
                            className="transition-all duration-300"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl font-bold">{matchResult.score}%</div>
                            <div className="text-sm text-gray-600">Match Score</div>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-lg font-semibold text-gray-800 mb-4">
                        {matchResult.message}
                      </p>
                    </div>

                    {/* Matched Keywords */}
                    {matchResult.matchedKeywords.length > 0 && (
                      <div className="mb-6">
                        <h3 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                          <CheckCircle size={18} /> Matched Keywords ({matchResult.matchedKeywords.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.matchedKeywords.slice(0, 10).map((kw, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Keywords */}
                    {matchResult.missingKeywords.length > 0 && (
                      <div>
                        <h3 className="font-bold text-orange-700 mb-3 flex items-center gap-2">
                          <AlertCircle size={18} /> Missing Keywords ({matchResult.missingKeywords.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {matchResult.missingKeywords.slice(0, 10).map((kw, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    className="text-center py-12 text-gray-500"
                  >
                    <Target size={40} className="mx-auto mb-3 opacity-30" />
                    <p>Run analysis to see match results</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Suggestions Section */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className={`glass-effect rounded-2xl p-6 border-2 ${
                      suggestion.type === 'strengths'
                        ? 'border-green-300'
                        : suggestion.type === 'skill_gap'
                        ? 'border-red-300'
                        : 'border-yellow-300'
                    }`}
                  >
                    <h3 className="font-bold text-lg mb-3">{suggestion.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestion.keywords.slice(0, 5).map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learning Resources Section */}
          <AnimatePresence>
            {resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen size={32} className="text-purple-600" />
                  Recommended Learning Resources
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.slice(0, 10).map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass-effect rounded-xl p-4 border border-purple-200 hover:shadow-lg hover:border-purple-400 transition group"
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen size={20} className="text-purple-600 mt-1 flex-shrink-0 group-hover:text-purple-700" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition truncate">
                            {resource.title}
                          </p>
                          <p className="text-sm text-gray-600">{resource.platform}</p>
                        </div>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded whitespace-nowrap">
                          Open
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
