import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, X, Plus, Award, Briefcase, GraduationCap, Share2, Edit } from 'lucide-react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: 'Praveen',
    lastName: 'Kumar',
    title: 'Full Stack Developer',
    bio: 'Passionate about building scalable web applications with modern technologies.',
    location: 'San Francisco, CA',
    profileStrength: 85,
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    experience: [
      {
        id: 1,
        title: 'Senior Developer',
        company: 'TechCorp',
        duration: '2021 - Present',
        description: 'Led a team of 5 developers in building microservices',
      },
      {
        id: 2,
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        duration: '2019 - 2021',
        description: 'Developed full stack applications using React and Node.js',
      },
    ],
    education: [
      {
        id: 1,
        school: 'UC Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        year: '2019',
      },
    ],
  })

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' },
    { id: 'resume', label: 'Resume' },
  ]

  return (
    <div className="min-h-screen bg-brand-light pt-8 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header with Profile Strength */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 border border-gray-200 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-brand flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </div>
                <div>
                  <h1 className="heading-md">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-gray-600">{profileData.title}</p>
                  <p className="text-sm text-gray-500">{profileData.location}</p>
                </div>
              </div>
            </div>

            {/* Profile Strength Card */}
            <div className="flex-shrink-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 w-full md:w-64">
              <p className="text-sm font-semibold text-gray-600 mb-3">Profile Strength</p>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      strokeDasharray={`${profileData.profileStrength * 2.83} 283`}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-brand-primary">
                    {profileData.profileStrength}%
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{profileData.profileStrength}% Complete</p>
                  <p className="text-xs text-gray-600">Add a resume to boost</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 btn-primary"
            >
              <Edit2 size={18} />
              {editMode ? 'Done Editing' : 'Edit Profile'}
            </button>
            <button className="flex items-center gap-2 btn-outline">
              <Share2 size={18} />
              Share Profile
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold whitespace-nowrap rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white'
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeTab}
          className="space-y-6"
        >
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="card-premium bg-white p-8 rounded-2xl border border-gray-200">
              <h2 className="heading-sm mb-4">About</h2>
              {editMode ? (
                <textarea
                  className="input-field min-h-32"
                  defaultValue={profileData.bio}
                  onBlur={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              )}
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {profileData.experience.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-premium bg-white p-6 rounded-2xl border border-gray-200"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={24} className="text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{exp.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                      <p className="text-xs text-gray-500 mb-3">{exp.duration}</p>
                      <p className="text-sm text-gray-700">{exp.description}</p>
                    </div>
                    {editMode && (
                      <button className="text-gray-400 hover:text-red-500">
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {editMode && (
                <button className="card-premium bg-white p-6 rounded-2xl border border-dashed border-gray-300 hover:border-brand-accent transition-smooth flex items-center justify-center gap-2 text-brand-accent font-semibold">
                  <Plus size={20} />
                  Add Experience
                </button>
              )}
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              {profileData.education.map((edu) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-premium bg-white p-6 rounded-2xl border border-gray-200"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap size={24} className="text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{edu.school}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="text-xs text-gray-500">{edu.year}</p>
                    </div>
                    {editMode && (
                      <button className="text-gray-400 hover:text-red-500">
                        <X size={20} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {editMode && (
                <button className="card-premium bg-white p-6 rounded-2xl border border-dashed border-gray-300 hover:border-brand-accent transition-smooth flex items-center justify-center gap-2 text-brand-accent font-semibold">
                  <Plus size={20} />
                  Add Education
                </button>
              )}
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="card-premium bg-white p-8 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-sm">Skills ({profileData.skills.length})</h2>
                {editMode && (
                  <button className="btn-accent text-sm py-2 px-4 flex items-center gap-2">
                    <Plus size={16} />
                    Add Skill
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {profileData.skills.map((skill, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="badge-accent text-base px-6 py-2 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    {editMode && (
                      <button className="hover:text-red-500 ml-2">
                        <X size={16} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Resume Tab */}
          {activeTab === 'resume' && (
            <div className="card-premium bg-white p-8 rounded-2xl border border-gray-200">
              <h2 className="heading-sm mb-6">Resume</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <div className="mb-4 text-gray-300">
                  <Award size={48} className="mx-auto" />
                </div>
                <p className="font-semibold text-gray-700 mb-2">No resume uploaded</p>
                <p className="text-sm text-gray-600 mb-6">
                  Upload your resume to improve your job matching score
                </p>
                <button className="btn-primary">Upload Resume</button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
