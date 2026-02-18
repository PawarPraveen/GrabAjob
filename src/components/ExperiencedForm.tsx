import React, { useEffect, useState } from 'react'
import TagInput from './TagInput'
import { upsertProfile, getProfileByUserId, uploadResume } from '../lib/profileClient'
import { auth } from '../lib/supabaseClient'

export default function ExperiencedForm() {
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(false)
  const [sessionUser, setSessionUser] = useState(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { session } = await auth.getSession()
      if (!mounted) return
      setSessionUser(session?.user || null)
      if (session?.user) {
        const p = await getProfileByUserId(session.user.id)
        setProfile(p || { user_id: session.user.id })
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleChange = (k, v) => setProfile(prev => ({ ...prev, [k]: v }))

  const save = async () => {
    setLoading(true)
    await upsertProfile(profile)
    setLoading(false)
    alert('Profile saved')
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !profile?.user_id) return
    const url = await uploadResume(file, profile.user_id)
    if (url) {
      setProfile(prev => ({ ...prev, resume_url: url }))
      await upsertProfile({ user_id: profile.user_id, resume_url: url })
      alert('Resume uploaded')
    }
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Work Experience */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
        <div className="space-y-3">
          <input placeholder="Company" value={profile?.company||''} onChange={e=>handleChange('company', e.target.value)} className="input-field" />
          <input placeholder="Job Title" value={profile?.job_title||''} onChange={e=>handleChange('job_title', e.target.value)} className="input-field" />
          <input placeholder="Years of Experience" value={profile?.experience_years||''} onChange={e=>handleChange('experience_years', e.target.value)} className="input-field" />
          <textarea placeholder="Responsibilities" value={profile?.responsibilities||''} onChange={e=>handleChange('responsibilities', e.target.value)} className="input-field" rows={3} />
        </div>
      </div>

      {/* Salary Details */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Salary Details</h3>
        <div className="space-y-3">
          <input placeholder="Current CTC" value={profile?.current_ctc||''} onChange={e=>handleChange('current_ctc', e.target.value)} className="input-field" />
          <input placeholder="Expected CTC" value={profile?.expected_ctc||''} onChange={e=>handleChange('expected_ctc', e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Career Preferences */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Career Preferences</h3>
        <div className="space-y-3">
          <select value={profile?.wants_to_switch? 'yes':'no'} onChange={e=>handleChange('wants_to_switch', e.target.value === 'yes')} className="input-field">
            <option value="no">Want to switch jobs? - No</option>
            <option value="yes">Want to switch jobs? - Yes</option>
          </select>
          <input placeholder="Domain" value={profile?.domain_preference||''} onChange={e=>handleChange('domain_preference', e.target.value)} className="input-field" />
          <select value={profile?.relocation? 'yes':'no'} onChange={e=>handleChange('relocation', e.target.value === 'yes')} className="input-field">
            <option value="no">Relocation: No</option>
            <option value="yes">Relocation: Yes</option>
          </select>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Skills</h3>
        <TagInput tags={profile?.skills || []} onChange={(arr)=>handleChange('skills', arr)} />
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <textarea placeholder="Key Achievements" value={profile?.achievements||''} onChange={e=>handleChange('achievements', e.target.value)} className="input-field" rows={3} />
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Certifications</h3>
        <textarea placeholder="Certifications" value={(profile?.certifications && profile.certifications.join(', ')) || ''} onChange={e=>handleChange('certifications', e.target.value.split(/,\s*/))} className="input-field" rows={3} />
      </div>

      {/* Resume */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Resume</h3>
        <div className="flex items-center gap-3">
          <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="text-sm" />
          {profile?.resume_url && <span className="text-xs text-green-600">✓ Resume uploaded</span>}
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={save} disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Save Profile'}</button>
        </div>
      </div>
    </div>
  )
}
