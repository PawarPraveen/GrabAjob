import React, { useEffect, useState } from 'react'
import TagInput from './TagInput'
import EducationCard from './EducationCard'
import { upsertProfile, getProfileByUserId, uploadResume } from '../lib/profileClient'
import { auth } from '../lib/supabaseClient'
import useDebouncedEffect from '../hooks/useDebouncedEffect'

export default function ExperiencedForm() {
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(false)
  const [sessionUser, setSessionUser] = useState(null)
  const [experiences, setExperiences] = useState([{ company: '', role: '', from: '', to: '', responsibilities: '' }])
  const [certifications, setCertifications] = useState([{ title: '', issuing_org: '', year: '' }])
  const [achievements, setAchievements] = useState([{ title: '', description: '' }])
  const [domains, setDomains] = useState([])
  const [resumes, setResumes] = useState([])
  const [education, setEducation] = useState([])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { session } = await auth.getSession()
      if (!mounted) return
      setSessionUser(session?.user || null)
      if (session?.user) {
        const p = await getProfileByUserId(session.user.id)
        const initial = p || { user_id: session.user.id }
        setProfile(initial)
        if (initial.experiences) setExperiences(initial.experiences)
        if (initial.certifications) setCertifications(initial.certifications)
        if (initial.achievements) setAchievements(initial.achievements)
        if (initial.domains) setDomains(initial.domains)
        if (initial.resumes) setResumes(initial.resumes)
        if (initial.education) setEducation(initial.education)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleChange = (k, v) => setProfile(prev => ({ ...prev, [k]: v }))

  const handleExperienceChange = (idx, field, value) => {
    const copy = [...experiences]
    copy[idx] = { ...copy[idx], [field]: value }
    setExperiences(copy)
  }
  const addExperience = () => setExperiences(prev => [...prev, { company: '', role: '', from: '', to: '', responsibilities: '' }])
  const removeExperience = (idx) => setExperiences(prev => prev.filter((_, i) => i !== idx))

  const handleCertificationChange = (idx, field, value) => {
    const copy = [...certifications]
    copy[idx] = { ...copy[idx], [field]: value }
    setCertifications(copy)
  }
  const addCertification = () => setCertifications(prev => [...prev, { title: '', issuing_org: '', year: '' }])
  const removeCertification = (idx) => setCertifications(prev => prev.filter((_, i) => i !== idx))

  const handleAchievementChange = (idx, field, value) => {
    const copy = [...achievements]
    copy[idx] = { ...copy[idx], [field]: value }
    setAchievements(copy)
  }
  const addAchievement = () => setAchievements(prev => [...prev, { title: '', description: '' }])
  const removeAchievement = (idx) => setAchievements(prev => prev.filter((_, i) => i !== idx))

  const setDomainTags = (arr) => setDomains(arr)

  const handleResumeUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0 || !profile?.user_id) return
    setLoading(true)
    try {
      for (const f of Array.from(files)) {
        const url = await uploadResume(f, profile.user_id)
        if (url) setResumes(prev => [...prev, url])
      }
      alert('Resumes uploaded')
    } catch (err) {
      console.error('resume upload error', err)
      alert('Resume upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        ...profile,
        education,
        experiences,
        certifications,
        achievements,
        domains,
        domain_preferences: domains,
        resumes,
        resume_urls: resumes,
        current_location: profile.current_location || ''
      }
      await upsertProfile(payload)
      alert('Profile saved')
    } catch (err) {
      console.error('save error', err)
      alert('Save failed')
    } finally {
      setLoading(false)
    }
  }

  const saveSection = async (section) => {
    const userId = profile?.user_id || sessionUser?.id
    if (!userId) return
    setLoading(true)
    try {
      const payload = { user_id: userId, ...section }
      await upsertProfile(payload)
    } catch (err) {
      console.error('section save error', err)
    } finally {
      setLoading(false)
    }
  }

  useDebouncedEffect(() => { if (education) saveSection({ education }) }, [education], 1000)
  useDebouncedEffect(() => { if (experiences) saveSection({ experiences }) }, [experiences], 1000)
  useDebouncedEffect(() => { if (certifications) saveSection({ certifications }) }, [certifications], 1000)
  useDebouncedEffect(() => { if (achievements) saveSection({ achievements }) }, [achievements], 1000)
  useDebouncedEffect(() => { if (domains) saveSection({ domain_preferences: domains }) }, [domains], 1000)
  useDebouncedEffect(() => { if (resumes) saveSection({ resume_urls: resumes }) }, [resumes], 1000)

  return (
    <div className="space-y-6 pb-24">
      <EducationCard education={education} onChange={setEducation} />
      {/* Work Experience */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Work Experience</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ experiences })}>Save</button>
        </div>
        <div className="space-y-3">
          {experiences.map((exp, idx) => (
            <div key={idx} className="space-y-2 border p-3 rounded">
              <div className="flex gap-2">
                <input placeholder="Company" value={exp.company} onChange={e=>handleExperienceChange(idx, 'company', e.target.value)} className="input-field flex-1" />
                <button className="btn-ghost" onClick={()=>removeExperience(idx)}>Remove</button>
              </div>
              <input placeholder="Role" value={exp.role} onChange={e=>handleExperienceChange(idx, 'role', e.target.value)} className="input-field" />
              <div className="flex gap-2">
                <input placeholder="From" value={exp.from} onChange={e=>handleExperienceChange(idx, 'from', e.target.value)} className="input-field" />
                <input placeholder="To" value={exp.to} onChange={e=>handleExperienceChange(idx, 'to', e.target.value)} className="input-field" />
              </div>
              <textarea placeholder="Responsibilities" value={exp.responsibilities} onChange={e=>handleExperienceChange(idx, 'responsibilities', e.target.value)} className="input-field" rows={3} />
            </div>
          ))}
          <button onClick={addExperience} className="btn-outline">+ Add Experience</button>
        </div>
      </div>

      {/* Salary Details */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Salary Details</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ current_ctc: profile?.current_ctc, expected_ctc: profile?.expected_ctc, notice_period: profile?.notice_period })}>Save</button>
        </div>
        <div className="space-y-3">
          <input placeholder="Current CTC" value={profile?.current_ctc||''} onChange={e=>handleChange('current_ctc', e.target.value)} className="input-field" />
          <input placeholder="Expected CTC" value={profile?.expected_ctc||''} onChange={e=>handleChange('expected_ctc', e.target.value)} className="input-field" />
        </div>
      </div>

      {/* Career Preferences */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Career Preferences</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ domain_preferences: domains, relocation: profile?.relocation, current_location: profile?.current_location, work_mode: profile?.work_mode })}>Save</button>
        </div>
        <div className="space-y-3">
          <select value={profile?.wants_to_switch? 'yes':'no'} onChange={e=>handleChange('wants_to_switch', e.target.value === 'yes')} className="input-field">
            <option value="no">Want to switch jobs? - No</option>
            <option value="yes">Want to switch jobs? - Yes</option>
          </select>
          <TagInput tags={domains} onChange={setDomainTags} />
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
        <div className="space-y-3">
          {achievements.map((a, idx) => (
            <div key={idx} className="space-y-2 border p-3 rounded">
              <div className="flex gap-2">
                <input placeholder="Title" value={a.title} onChange={e=>handleAchievementChange(idx, 'title', e.target.value)} className="input-field flex-1" />
                <button className="btn-ghost" onClick={()=>removeAchievement(idx)}>Remove</button>
              </div>
              <textarea placeholder="Description" value={a.description} onChange={e=>handleAchievementChange(idx, 'description', e.target.value)} className="input-field" rows={2} />
            </div>
          ))}
          <button onClick={addAchievement} className="btn-outline">+ Add Achievement</button>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Certifications</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ certifications })}>Save</button>
        </div>
        <div className="space-y-3">
          {certifications.map((c, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input placeholder="Title" value={c.title} onChange={e=>handleCertificationChange(idx, 'title', e.target.value)} className="input-field flex-1" />
              <input placeholder="Org" value={c.issuing_org} onChange={e=>handleCertificationChange(idx, 'issuing_org', e.target.value)} className="input-field w-40" />
              <input placeholder="Year" value={c.year} onChange={e=>handleCertificationChange(idx, 'year', e.target.value)} className="input-field w-24" />
              <button className="btn-ghost" onClick={()=>removeCertification(idx)}>Remove</button>
            </div>
          ))}
          <button onClick={addCertification} className="btn-outline">+ Add Certification</button>
        </div>
      </div>

      {/* Resume */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Resume(s)</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ resume_urls: resumes })}>Save</button>
        </div>
        <div className="flex items-center gap-3">
          <input type="file" accept="application/pdf" multiple onChange={handleResumeUpload} className="text-sm" />
        </div>
        <div className="mt-3 space-y-2">
          {resumes.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <a href={r} target="_blank" rel="noreferrer" className="text-sm text-blue-600">Resume {i+1}</a>
              <button className="btn-ghost" onClick={()=>setResumes(prev=>prev.filter((_, idx)=>idx!==i))}>Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={handleSave} disabled={loading} className="btn-primary w-full">{loading ? 'Saving...' : 'Save Profile'}</button>
        </div>
      </div>
    </div>
  )
}
