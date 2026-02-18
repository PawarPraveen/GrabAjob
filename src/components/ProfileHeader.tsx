import React, { useEffect, useState } from 'react'
import { getProfileByUserId, upsertProfile, uploadAvatar } from '../lib/profileClient'
import { auth } from '../lib/supabaseClient'

export default function ProfileHeader({ onProfileChange }) {
  const [sessionUser, setSessionUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [name, setName] = useState('')

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

  return (
    <div className="bg-white rounded-lg p-6 flex items-center gap-4">
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            (sessionUser?.user_metadata?.full_name ? sessionUser.user_metadata.full_name.split(' ').map(n=>n[0]).slice(0,2).join('') : (profile?.full_name || sessionUser?.email || 'GJ').slice(0,2).toUpperCase())
          )}
        </div>
        <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow-md hover:shadow-lg transition-shadow">
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
            <h2 className="text-lg font-bold text-gray-900">{profile?.full_name || sessionUser?.user_metadata?.full_name || sessionUser?.email}</h2>
            <p className="text-sm text-gray-500">{sessionUser?.email}</p>
            <button onClick={() => setEditingName(true)} className="mt-2 text-xs text-blue-600 hover:underline">Edit name</button>
          </div>
        )}
      </div>
    </div>
  )
}
