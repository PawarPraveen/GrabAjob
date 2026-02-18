import React, { useEffect, useState } from 'react'
import { getProfileByUserId, upsertProfile, uploadAvatar } from '../lib/profileClient'
import { auth } from '../lib/supabaseClient'

export default function ProfileHeader({ onProfileChange }) {
  const [sessionUser, setSessionUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')

  const computeCompleteness = (p) => {
    if (!p) return 10
    let score = 0
    const checks = [
      'full_name', 'education', 'skills', 'projects', 'experiences', 'resume_urls', 'linkedin', 'current_location'
    ]
    checks.forEach(k => {
      const v = p[k]
      if (Array.isArray(v) && v.length > 0) score += 1
      else if (typeof v === 'string' && v.trim()) score += 1
    })
    // convert to percent (max 100)
    return Math.min(100, Math.round((score / checks.length) * 100))
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { session } = await auth.getSession()
      if (!mounted) return
      setSessionUser(session?.user || null)
      if (session?.user) {
        const p = await getProfileByUserId(session.user.id)
        setProfile(p)
        setName(p?.full_name || session.user.user_metadata?.full_name || '')
        if (onProfileChange) onProfileChange(p)
      }
    })()
    return () => { mounted = false }
  }, [])

  const save = async () => {
    if (!sessionUser) return
    const up = {
      user_id: sessionUser.id,
      full_name: name,
      email: sessionUser.email
    }
    const updated = await upsertProfile(up)
    setProfile(updated)
    setEditingName(false)
    if (onProfileChange) onProfileChange(updated)
  }

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !sessionUser) return
    const url = await uploadAvatar(file, sessionUser.id)
    if (url) {
      const updated = await upsertProfile({ user_id: sessionUser.id, avatar_url: url })
      setProfile(updated)
      if (onProfileChange) onProfileChange(updated)
    }
  }
  const percent = computeCompleteness(profile)
  const circumference = Math.round(2 * Math.PI * 14)
  const dash = Math.round((percent / 100) * circumference)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <div className="flex items-center gap-4 md:col-span-2">
        <div className="relative">
          <svg className="w-28 h-28 progress-ring" viewBox="0 0 36 36">
            <path className="text-gray-200" strokeWidth="2" stroke="#e6eefb" fill="none" d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32" />
            <circle className="text-blue-600" stroke="#3b82f6" strokeWidth="2" strokeDasharray={`${dash} ${circumference}`} r="14" cx="18" cy="18" fill="none" transform="rotate(-90 18 18)" />
            <text x="18" y="20" textAnchor="middle" className="text-sm font-semibold" fill="#1f2937">{percent}%</text>
          </svg>

          <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow" title="Change photo">
            <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </label>
        </div>

        <div className="flex-1">
          {editingName ? (
            <div className="flex gap-2">
              <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your name" className="input-field text-sm" />
              <button onClick={save} className="btn-primary text-sm py-1 px-3">Save</button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile?.full_name || sessionUser?.user_metadata?.full_name || sessionUser?.email}</h2>
              <p className="text-sm text-gray-500">{sessionUser?.email}</p>
              <div className="mt-3 text-sm text-gray-600 flex gap-4 flex-wrap">
                <div className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" fill="#d1d5db"/></svg>{profile?.current_location || 'Location not set'}</div>
                <div className="flex items-center gap-2"><svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M3 8l7-5 7 5v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" fill="#d1d5db"/></svg>{profile?.education ? profile.education[0]?.degree : ''}</div>
              </div>
              <button onClick={() => setEditingName(true)} className="mt-3 text-xs text-blue-600 hover:underline">Edit profile</button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-amber-50 p-4 rounded-lg shadow-sm md:col-span-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Profile actions</div>
            <div className="text-xs text-gray-600">Complete your profile to get more views</div>
          </div>
          <div className="text-sm text-green-600">+{Math.max(1, Math.round((100 - computeCompleteness(profile)) / 10))}%</div>
        </div>
        <div className="mt-3 space-y-2">
          <button className="w-full text-left p-2 rounded hover:bg-amber-100">Add education</button>
          <button className="w-full text-left p-2 rounded hover:bg-amber-100">Add internship</button>
          <button className="w-full text-left p-2 rounded hover:bg-amber-100">Add resume</button>
        </div>
      </div>
    </div>
  )
}
