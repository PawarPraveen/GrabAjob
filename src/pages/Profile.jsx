import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProfileHeader from '../components/ProfileHeader'
import FresherForm from '../components/FresherForm'
import ExperiencedForm from '../components/ExperiencedForm'
import { auth } from '../lib/supabaseClient'
import { getProfileByUserId, upsertProfile } from '../lib/profileClient'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { session } = await auth.getSession()
      console.log('[PROFILE] session fetched:', session)
      if (!mounted) return
      if (session?.user) {
        console.log('[PROFILE] session.user.id:', session.user.id)
        let p = null
        try {
          p = await getProfileByUserId(session.user.id)
        } catch (err) {
          console.error('getProfileByUserId threw:', err)
        }
        if (!p) {
          // Create initial local profile object if it doesn't exist on server
          p = { user_id: session.user.id }
        }
        console.log('[PROFILE] setting profile:', p)
        setProfile(p)
      } else {
        console.warn('[PROFILE] No session.user found')
      }
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  const handleSelectUserType = async (type) => {
    try {
      // Immediately update UI so form renders even if backend call fails
      setProfile(prev => ({ ...(prev || {}), user_type: type }))
      console.log('handleSelectUserType: locally set type ->', type)

      if (!profile?.user_id) {
        console.warn('No profile.user_id; will attempt to upsert with session id')
      }

      // Attempt to persist server-side but don't block UI
      const userId = (profile && profile.user_id) || (await (async () => {
        const { session } = await auth.getSession()
        return session?.user?.id
      })())

      if (!userId) {
        console.error('No user id available to upsert profile')
        return
      }

      const upsertPayload = { user_id: userId, user_type: type }
      console.log('handleSelectUserType: upserting payload', upsertPayload)
      const updated = await upsertProfile(upsertPayload)
      console.log('upsertProfile returned:', updated)
      if (updated) setProfile(updated)
    } catch (err) {
      console.error('handleSelectUserType error:', err)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <ProfileHeader onProfileChange={(p)=>setProfile(p)} />

        {/* Step 1: Select User Type */}
        {!profile?.user_type ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="bg-white rounded-lg p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-2">Select Your Profile Type</h2>
              <p className="text-gray-600 mb-6">Are you a Fresher or Experienced Candidate?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fresher Card */}
                <button
                  onClick={() => handleSelectUserType('fresher')}
                  className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="text-4xl mb-3">🎓</div>
                  <h3 className="text-2xl font-bold">Fresher</h3>
                  <p className="text-gray-600 mt-2">Recently graduated or no professional experience</p>
                </button>

                {/* Experienced Card */}
                <button
                  onClick={() => handleSelectUserType('experienced')}
                  className="p-8 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all text-left"
                >
                  <div className="text-4xl mb-3">💼</div>
                  <h3 className="text-2xl font-bold">Experienced</h3>
                  <p className="text-gray-600 mt-2">Have professional work experience</p>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{profile.user_type === 'fresher' ? 'Fresher Profile' : 'Experienced Profile'}</h2>
              <button
                onClick={() => setProfile(prev => ({ ...prev, user_type: null }))}
                className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Change Type
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <aside className="md:col-span-1">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <h4 className="font-semibold mb-3">Quick links</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="cursor-pointer hover:text-blue-600">Preference</li>
                    <li className="cursor-pointer hover:text-blue-600">Education</li>
                    <li className="cursor-pointer hover:text-blue-600">Key skills</li>
                    <li className="cursor-pointer hover:text-blue-600">Internships</li>
                    <li className="cursor-pointer hover:text-blue-600">Projects</li>
                    <li className="cursor-pointer hover:text-blue-600">Profile summary</li>
                    <li className="cursor-pointer hover:text-blue-600">Accomplishments</li>
                    <li className="cursor-pointer hover:text-blue-600">Resume</li>
                  </ul>
                </div>
              </aside>

              <main className="md:col-span-3 space-y-6">
                {profile.user_type === 'fresher' ? (
                  <FresherForm />
                ) : (
                  <ExperiencedForm />
                )}
              </main>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
