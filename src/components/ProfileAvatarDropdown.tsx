import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../lib/supabaseClient'

export default function ProfileAvatarDropdown() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { session } = await auth.getSession()
      if (!mounted) return
      setUser(session?.user || null)
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    function handleOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    window.addEventListener('mousedown', handleOutside)
    return () => window.removeEventListener('mousedown', handleOutside)
  }, [])

  const initials = (nameOrEmail) => {
    if (!nameOrEmail) return 'GJ'
    const parts = String(nameOrEmail).split(/\s+|@/).filter(Boolean)
    return (parts[0]?.[0] || 'G') + (parts[1]?.[0] || '')
  }

  const handleLogout = async () => {
    await auth.signout()
    navigate('/')
  }

  const handleAuthClick = () => navigate('/auth')

  return (
    <div className="relative" ref={ref}>
      {user ? (
        <button
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-semibold shadow-sm hover:shadow-md transition-shadow"
          onClick={() => setOpen(v => !v)}
          aria-label="Profile menu"
        >
          {user?.user_metadata?.full_name ? initials(user.user_metadata.full_name) : initials(user?.email)}
        </button>
      ) : (
        <button
          onClick={handleAuthClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors"
        >
          Login
        </button>
      )}

      {user && (
        <div
          className={`origin-top-right absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-opacity duration-200 ${open ? 'opacity-100 scale-100' : 'opacity-0 pointer-events-none scale-95'}`}
          style={{ transformOrigin: 'top right' }}
        >
          <div className="py-1">
            <button onClick={() => { setOpen(false); navigate('/profile') }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</button>
            <button onClick={() => { setOpen(false); navigate('/settings') }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</button>
            <button onClick={() => { setOpen(false); navigate('/help') }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Help</button>
            <button onClick={() => { setOpen(false); navigate('/about') }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">About GrabAjob</button>
            <div className="border-t my-1" />
            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
          </div>
        </div>
      )}
    </div>
  )
}
