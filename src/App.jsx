import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import JobSeekerDashboard from './pages/JobSeekerDashboard'
import JobsPage from './pages/JobsPage'
import ProfilePage from './pages/ProfilePage'
import RecruiterDashboard from './pages/RecruiterDashboard'
import CreateAccountDemo from './pages/CreateAccountDemo'
import { supabase } from './lib/supabaseClient'
import './index.css'

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const [isAuthorized, setIsAuthorized] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setIsAuthorized(false)
        return
      }

      if (requiredRole) {
        const userRole = localStorage.getItem('userRole')
        setIsAuthorized(userRole === requiredRole)
      } else {
        setIsAuthorized(true)
      }
    }

    checkAuth()
  }, [requiredRole])

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin w-12 h-12 border-4 border-brand-primary border-t-brand-accent rounded-full"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return <Navigate to="/auth?tab=login" />
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/demo/create-account" element={<CreateAccountDemo />} />

        {/* Job Seeker Routes */}
        <Route
          path="/dashboard/seeker"
          element={
            <ProtectedRoute requiredRole="job-seeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/seeker/jobs"
          element={
            <ProtectedRoute requiredRole="job-seeker">
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/seeker/profile"
          element={
            <ProtectedRoute requiredRole="job-seeker">
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Routes */}
        <Route
          path="/dashboard/recruiter"
          element={
            <ProtectedRoute requiredRole="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
