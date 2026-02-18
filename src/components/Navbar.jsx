import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ProfileAvatarDropdown from './ProfileAvatarDropdown'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">
            CB
          </div>
          <span className="text-xl font-bold text-gray-900">CareerBridge</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-smooth">
            For Candidates
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-smooth">
            For Companies
          </a>
          <a href="#" className="text-gray-600 hover:text-gray-900 transition-smooth">
            Blog
          </a>
        </div>

        {/* Profile / Auth area */}
        <div className="hidden md:flex items-center gap-4">
          {/* ProfileAvatarDropdown will handle logged in state and menu */}
          <div>
            <ProfileAvatarDropdown />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-smooth"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <a href="#" className="block text-gray-600 hover:text-gray-900 transition-smooth">
              For Candidates
            </a>
            <a href="#" className="block text-gray-600 hover:text-gray-900 transition-smooth">
              For Companies
            </a>
            <a href="#" className="block text-gray-600 hover:text-gray-900 transition-smooth">
              Blog
            </a>
            <button
              onClick={() => navigate('/auth')}
              className="w-full px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-smooth font-semibold"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
