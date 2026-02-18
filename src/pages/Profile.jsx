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
      if (!mounted) return
      if (session?.user) {
        let p = await getProfileByUserId(session.user.id)
        if (!p) {
          // Create initial profile if it doesn't exist
          p = { user_id: session.user.id }
        }
        setProfile(p)
      }
      setLoading(false)
    })()
    return () => { mounted = false }
  }, [])

  const handleSelectUserType = async (type) => {
    if (!profile?.user_id) return
    const updated = await upsertProfile({ user_id: profile.user_id, user_type: type })
    setProfile(updated)
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

            {profile.user_type === 'fresher' ? (
              <FresherForm />
            ) : (
              <ExperiencedForm />
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
