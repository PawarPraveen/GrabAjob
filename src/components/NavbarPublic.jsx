import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function NavbarPublic() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="font-bold text-xl text-brand-primary hidden sm:inline">GrabAjob</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#for-seekers" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
            For Job Seekers
          </a>
          <a href="#for-recruiters" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
            For Recruiters
          </a>
          <a href="#features" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
            How It Works
          </a>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/auth?tab=login" className="text-brand-primary font-semibold hover:text-brand-accent transition-smooth">
            Login
          </Link>
          <Link to="/auth?tab=signup" className="btn-primary">
            Create Account
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-smooth"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 bg-white">
          <div className="flex flex-col gap-4">
            <a href="#for-seekers" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
              For Job Seekers
            </a>
            <a href="#for-recruiters" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
              For Recruiters
            </a>
            <a href="#features" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-brand-primary transition-smooth font-medium">
              How It Works
            </a>
            <hr className="my-2" />
            <Link to="/auth?tab=login" className="btn-secondary w-full text-center">
              Login
            </Link>
            <Link to="/auth?tab=signup" className="btn-primary w-full text-center">
              Create Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
