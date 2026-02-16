import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Menu, X, Home, Briefcase, Star, FileText, Calendar, Settings, Bell, Search, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

export default function JobSeekerDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/auth?tab=login')
        return
      }
      setUser(session.user)
      const saved = localStorage.getItem('userData')
      if (saved) {
        setUserData(JSON.parse(saved))
      }
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
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'saved', label: 'Saved', icon: Star },
    { id: 'resume', label: 'Resume', icon: FileText },
    { id: 'interviews', label: 'Interviews', icon: Calendar },
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
          <h1 className="text-2xl font-bold text-brand-primary hidden md:block">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
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
          {activeTab === 'home' && (
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
                <h2 className="heading-md mb-2">👋 Welcome back, {user?.email?.split('@')[0]}!</h2>
                <p className="text-gray-600">Let's find your next great opportunity</p>
              </motion.div>

              {/* Profile Completion Card */}
              <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
                <div className="card-premium bg-white p-6">
                  <h3 className="font-bold mb-4">Profile Completeness</h3>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                    <div
                      className="bg-gradient-brand h-3 rounded-full transition-all"
                      style={{ width: '70%' }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">70% Complete</p>
                  <p className="text-xs text-gray-500">Complete your profile to get better job matches</p>
                </div>

                <div className="card-premium bg-white p-6">
                  <h3 className="font-bold mb-4">Applications Sent</h3>
                  <p className="text-4xl font-bold text-brand-primary mb-2">12</p>
                  <p className="text-xs text-gray-500">5 in the last week</p>
                </div>

                <div className="card-premium bg-white p-6">
                  <h3 className="font-bold mb-4">Interviews Scheduled</h3>
                  <p className="text-4xl font-bold text-brand-primary mb-2">2</p>
                  <p className="text-xs text-gray-500">Upcoming this week</p>
                </div>
              </motion.div>

              {/* Recommended Jobs */}
              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="heading-sm">🎯 Recommended Jobs</h3>
                  <Link to="/dashboard/seeker/jobs" className="text-brand-accent font-semibold hover:underline flex items-center gap-1">
                    View All <ArrowRight size={18} />
                  </Link>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Senior React Developer',
                      company: 'TechCorp',
                      location: 'San Francisco, CA',
                      salary: '$140k - $180k',
                      match: 95,
                    },
                    {
                      title: 'Full Stack Engineer',
                      company: 'StartupXYZ',
                      location: 'Remote',
                      salary: '$120k - $160k',
                      match: 88,
                    },
                    {
                      title: 'Product Manager',
                      company: 'InnovateCo',
                      location: 'New York, NY',
                      salary: '$130k - $170k',
                      match: 82,
                    },
                  ].map((job, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="card-premium bg-white p-6 hover:border-brand-accent group cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2">{job.title}</h4>
                          <p className="text-sm text-gray-600 mb-3">{job.company} • {job.location}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-brand-primary">{job.salary}</span>
                            <span className="badge-accent">{job.match}% Match</span>
                          </div>
                        </div>
                        <button className="btn-primary ml-4">Apply</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'jobs' && (
            <div className="text-center py-12">
              <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="heading-md">All Jobs</h2>
              <p className="text-gray-600">Browse and apply to available positions</p>
              <Link to="/dashboard/seeker/jobs" className="btn-primary mt-6">
                View Jobs
              </Link>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="text-center py-12">
              <Star size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="heading-md">Saved Jobs</h2>
              <p className="text-gray-600">Your saved jobs will appear here</p>
            </div>
          )}

          {activeTab === 'resume' && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
              <div className="card-premium bg-white p-8 rounded-2xl border border-gray-200">
                <h2 className="heading-md mb-6">My Resume</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-4">Current Resume</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600 font-semibold mb-2">No resume uploaded</p>
                      <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload</p>
                      <button className="btn-primary">Upload Resume</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'interviews' && (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="heading-md">Interview Schedule</h2>
              <p className="text-gray-600">Your scheduled interviews will appear here</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="heading-md">Settings</h2>
              <p className="text-gray-600">Manage your account preferences</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
