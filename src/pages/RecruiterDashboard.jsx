import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Menu, X, BarChart3, FileText, Users, Plus, Settings, Bell, Search, Briefcase, Eye, MessageSquare, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function RecruiterDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/auth?tab=login')
        return
      }
      setUser(session.user)
    }
    getSession()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    navigate('/')
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Posted Jobs', icon: FileText },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'post', label: 'Post New Job', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`fixed md:static top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-64'
        }`}
      >
        <div className="p-6 sticky top-0 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold">G</span>
            </div>
            <span className="font-bold text-xl text-brand-primary">GrabAjob</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-brand-primary text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-2xl font-bold text-brand-primary hidden md:block">Recruiter Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="input-field pl-10 w-64"
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={24} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Welcome Section */}
              <motion.div
                variants={itemVariants}
                className="glass-effect rounded-2xl p-8 border border-gray-200"
              >
                <h2 className="heading-md mb-2">👋 Welcome back!</h2>
                <p className="text-gray-600">Manage your job postings and find the best talent</p>
              </motion.div>

              {/* Stats Cards */}
              <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                <div className="card-premium bg-white p-6">
                  <Briefcase size={28} className="text-brand-primary mb-3" />
                  <h3 className="font-bold mb-2">Active Jobs</h3>
                  <p className="text-4xl font-bold text-brand-primary mb-2">5</p>
                  <p className="text-xs text-gray-500">+2 this month</p>
                </div>

                <div className="card-premium bg-white p-6">
                  <Users size={28} className="text-brand-primary mb-3" />
                  <h3 className="font-bold mb-2">Total Applicants</h3>
                  <p className="text-4xl font-bold text-brand-primary mb-2">47</p>
                  <p className="text-xs text-gray-500">12 new this week</p>
                </div>

                <div className="card-premium bg-white p-6">
                  <CheckCircle size={28} className="text-green-500 mb-3" />
                  <h3 className="font-bold mb-2">Hired</h3>
                  <p className="text-4xl font-bold text-green-600 mb-2">3</p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </motion.div>

              {/* Recent Applicants */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-sm">📋 Recent Applicants</h3>
                  <Link to="/recruiter-dashboard/applicants" className="text-brand-accent font-semibold hover:underline">
                    View All →
                  </Link>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: 'Sarah Johnson',
                      role: 'Senior React Developer',
                      match: 95,
                      status: 'New',
                    },
                    {
                      name: 'Mike Chen',
                      role: 'Full Stack Engineer',
                      match: 88,
                      status: 'Reviewing',
                    },
                    {
                      name: 'Emma Wilson',
                      role: 'Senior React Developer',
                      match: 92,
                      status: 'Interview',
                    },
                  ].map((applicant, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="card-premium bg-white p-6 hover:border-brand-accent group cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-1">{applicant.name}</h4>
                          <p className="text-sm text-gray-600 mb-3">{applicant.role}</p>
                          <div className="flex items-center gap-4">
                            <span className="badge-accent">{applicant.match}% Match</span>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              applicant.status === 'New'
                                ? 'bg-blue-100 text-blue-700'
                                : applicant.status === 'Reviewing'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {applicant.status}
                            </span>
                          </div>
                        </div>
                        <button className="btn-outline text-sm py-2 px-4">
                          View Profile
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-md">Posted Jobs</h2>
                <button className="btn-primary">Post New Job</button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Senior React Developer',
                    applicants: 12,
                    views: 245,
                    posted: '5 days ago',
                  },
                  {
                    title: 'Full Stack Engineer',
                    applicants: 8,
                    views: 180,
                    posted: '2 weeks ago',
                  },
                  {
                    title: 'UX/UI Designer',
                    applicants: 6,
                    views: 120,
                    posted: '3 weeks ago',
                  },
                ].map((job, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="card-premium bg-white p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-3">{job.title}</h3>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Users size={16} />
                            {job.applicants} applicants
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye size={16} />
                            {job.views} views
                          </div>
                          <div className="text-gray-500">{job.posted}</div>
                        </div>
                      </div>
                      <button className="btn-outline text-sm py-2 px-4">View Job</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'applicants' && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="heading-md">All Applicants</h2>
              <p className="text-gray-600">Manage and review all applicants here</p>
            </div>
          )}

          {activeTab === 'post' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="max-w-2xl mx-auto card-premium bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="heading-md mb-6">Post a New Job</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Job Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Senior React Developer"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Job Description</label>
                    <textarea
                      placeholder="Describe the role and responsibilities"
                      className="input-field min-h-32"
                    ></textarea>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Salary Range</label>
                      <input
                        type="text"
                        placeholder="e.g., $100k - $150k"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Location</label>
                      <input
                        type="text"
                        placeholder="e.g., San Francisco, CA"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Required Skills</label>
                    <input
                      type="text"
                      placeholder="e.g., React, Node.js, TypeScript (comma-separated)"
                      className="input-field"
                    />
                  </div>

                  <button className="btn-primary w-full">Post Job</button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="heading-md">Settings</h2>
              <p className="text-gray-600">Manage your company preferences</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
