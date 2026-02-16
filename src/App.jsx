import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import { supabase } from './lib/supabaseClient'
import './index.css'

// Placeholder dashboard page
function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user)
    }
    getSession()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="glass-effect rounded-2xl p-12 border border-white/10 text-center">
          <h1 className="text-4xl font-bold mb-4 gradient-text">Welcome to Dashboard</h1>
          {user && (
            <p className="text-lg text-gray-300 mb-8">
              Hello, {user.email}! 👋
            </p>
          )}
          <p className="text-gray-400 mb-8">
            Dashboard functionality coming soon. This is a placeholder page to demonstrate successful authentication.
          </p>
          <button
            onClick={handleLogout}
            className="btn-primary"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
