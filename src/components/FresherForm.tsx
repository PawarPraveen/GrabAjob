import React, { useEffect, useState } from 'react'
import TagInput from './TagInput'
import { upsertProfile, getProfileByUserId, uploadResume } from '../lib/profileClient'
import { auth } from '../lib/supabaseClient'

export default function FresherForm() {
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
      {/* Education */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Education</h3>
        <div className="space-y-3">
          <input placeholder="Institute Name" value={profile?.institute_name||''} onChange={e=>handleChange('institute_name', e.target.value)} className="input-field" />
          <input placeholder="Degree" value={profile?.degree||''} onChange={e=>handleChange('degree', e.target.value)} className="input-field" />
          <input placeholder="CGPA" value={profile?.cgpa||''} onChange={e=>handleChange('cgpa', e.target.value)} className="input-field" />
          <input placeholder="12th Percentage" value={profile?.percentage_12||''} onChange={e=>handleChange('percentage_12', e.target.value)} className="input-field" />
          <input placeholder="Diploma (optional)" value={profile?.diploma||''} onChange={e=>handleChange('diploma', e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Projects</h3>
        <div className="space-y-3">
          <input placeholder="Project Title" value={profile?.project_title||''} onChange={e=>handleChange('project_title', e.target.value)} className="input-field" />
          <textarea placeholder="Project Description" value={profile?.project_description||''} onChange={e=>handleChange('project_description', e.target.value)} className="input-field" rows={3} />
          <input placeholder="Tech Stack" value={(profile?.projects && profile.projects[0]?.techStack) || ''} onChange={e=>handleChange('projects', [{ techStack: e.target.value }])} className="input-field" />
          <input placeholder="GitHub Link (optional)" value={profile?.projects?.[0]?.github||''} onChange={e=>handleChange('projects', [{ ...(profile?.projects?.[0]||{}), github: e.target.value }])} className="input-field" />
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Skills</h3>
        <TagInput tags={profile?.skills || []} onChange={(arr)=>handleChange('skills', arr)} />
      </div>

      {/* Internship */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Internship</h3>
        <div className="space-y-3">
          <input placeholder="Company" value={(profile?.internships && profile.internships[0]?.company) || ''} onChange={e=>handleChange('internships', [{ ...(profile?.internships?.[0]||{}), company: e.target.value }])} className="input-field" />
          <input placeholder="Role" value={(profile?.internships && profile.internships[0]?.role) || ''} onChange={e=>handleChange('internships', [{ ...(profile?.internships?.[0]||{}), role: e.target.value }])} className="input-field" />
          <input placeholder="Duration" value={(profile?.internships && profile.internships[0]?.duration) || ''} onChange={e=>handleChange('internships', [{ ...(profile?.internships?.[0]||{}), duration: e.target.value }])} className="input-field" />
        </div>
      </div>

      {/* Career Preferences */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Career Preferences</h3>
        <div className="space-y-3">
          <input placeholder="Domain Interested In" value={profile?.domain_preference||''} onChange={e=>handleChange('domain_preference', e.target.value)} className="input-field" />
          <select value={profile?.relocation? 'yes':'no'} onChange={e=>handleChange('relocation', e.target.value === 'yes')} className="input-field">
            <option value="no">Relocation: No</option>
            <option value="yes">Relocation: Yes</option>
          </select>
          <input placeholder="LinkedIn Link" value={profile?.linkedin||''} onChange={e=>handleChange('linkedin', e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <textarea placeholder="Certificates / Achievements" value={(profile?.certifications && profile.certifications.join(', ')) || ''} onChange={e=>handleChange('certifications', e.target.value.split(/,\s*/))} className="input-field" rows={3} />
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
