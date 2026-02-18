import React, { useEffect, useState } from 'react'
import TagInput from './TagInput'
import EducationCard from './EducationCard'
import { upsertProfile, getProfileByUserId, uploadResume } from '../lib/profileClient'
import { auth } from '../lib/supabaseClient'
import useDebouncedEffect from '../hooks/useDebouncedEffect'

export default function FresherForm() {
  const [profile, setProfile] = useState({})
  const [loading, setLoading] = useState(false)
  const [sessionUser, setSessionUser] = useState(null)

  // Multi-entry state
  const [projects, setProjects] = useState([
    { title: '', description: '', tech_stack: '', github_link: '' }
  ])
  const [education, setEducation] = useState([])
  const [internships, setInternships] = useState([{ company: '', role: '', duration: '' }])
  const [certifications, setCertifications] = useState([{ title: '', issuing_org: '', year: '' }])
  const [achievements, setAchievements] = useState([{ title: '', description: '' }])
  const [domains, setDomains] = useState([])
  const [resumes, setResumes] = useState([])

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

        // hydrate multi-entry fields
        if (initial.projects) setProjects(initial.projects)
        if (initial.internships) setInternships(initial.internships)
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

  // Dynamic array handlers
  const handleProjectChange = (idx, field, value) => {
    const copy = [...projects]
    copy[idx] = { ...copy[idx], [field]: value }
    setProjects(copy)
  }
  const addProject = () => setProjects(prev => [...prev, { title: '', description: '', tech_stack: '', github_link: '' }])
  const removeProject = (idx) => setProjects(prev => prev.filter((_, i) => i !== idx))

  const handleInternshipChange = (idx, field, value) => {
    const copy = [...internships]
    copy[idx] = { ...copy[idx], [field]: value }
    setInternships(copy)
  }
  const addInternship = () => setInternships(prev => [...prev, { company: '', role: '', duration: '' }])
  const removeInternship = (idx) => setInternships(prev => prev.filter((_, i) => i !== idx))

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

  const addDomain = (arr) => setDomains(arr)
  const removeDomain = (idx) => setDomains(prev => prev.filter((_, i) => i !== idx))

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
        projects,
        internships,
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

  // Autosave when arrays change (debounced)
  useDebouncedEffect(() => { if (education) saveSection({ education }) }, [education], 1000)
  useDebouncedEffect(() => { if (projects) saveSection({ projects }) }, [projects], 1000)
  useDebouncedEffect(() => { if (internships) saveSection({ internships }) }, [internships], 1000)
  useDebouncedEffect(() => { if (certifications) saveSection({ certifications }) }, [certifications], 1000)
  useDebouncedEffect(() => { if (achievements) saveSection({ achievements }) }, [achievements], 1000)
  useDebouncedEffect(() => { if (domains) saveSection({ domain_preferences: domains }) }, [domains], 1000)
  useDebouncedEffect(() => { if (resumes) saveSection({ resume_urls: resumes }) }, [resumes], 1000)

  return (
    <div className="space-y-6 pb-24">
          <EducationCard education={education} onChange={setEducation} />

      {/* Projects */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Projects</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({projects})}>Save</button>
        </div>
        <div className="space-y-3">
          {projects.map((proj, idx) => (
            <div key={idx} className="space-y-2 border p-3 rounded">
              <div className="flex gap-2">
                <input placeholder="Title" value={proj.title} onChange={e=>handleProjectChange(idx, 'title', e.target.value)} className="input-field flex-1" />
                <button className="btn-ghost" onClick={()=>removeProject(idx)}>Remove</button>
              </div>
              <textarea placeholder="Description" value={proj.description} onChange={e=>handleProjectChange(idx, 'description', e.target.value)} className="input-field" rows={3} />
              <input placeholder="Tech Stack" value={proj.tech_stack} onChange={e=>handleProjectChange(idx, 'tech_stack', e.target.value)} className="input-field" />
              <input placeholder="GitHub Link" value={proj.github_link} onChange={e=>handleProjectChange(idx, 'github_link', e.target.value)} className="input-field" />
            </div>
          ))}
          <button onClick={addProject} className="btn-outline">+ Add Project</button>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Skills</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ skills: profile?.skills || [] })}>Save</button>
        </div>
        <TagInput tags={profile?.skills || []} onChange={(arr)=>handleChange('skills', arr)} />
      </div>

      {/* Internships */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Internships</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ internships })}>Save</button>
        </div>
        <div className="space-y-3">
          {internships.map((it, idx) => (
            <div key={idx} className="space-y-2 border p-3 rounded">
              <div className="flex gap-2">
                <input placeholder="Company" value={it.company} onChange={e=>handleInternshipChange(idx, 'company', e.target.value)} className="input-field flex-1" />
                <button className="btn-ghost" onClick={()=>removeInternship(idx)}>Remove</button>
              </div>
              <input placeholder="Role" value={it.role} onChange={e=>handleInternshipChange(idx, 'role', e.target.value)} className="input-field" />
              <input placeholder="Duration" value={it.duration} onChange={e=>handleInternshipChange(idx, 'duration', e.target.value)} className="input-field" />
            </div>
          ))}
          <button onClick={addInternship} className="btn-outline">+ Add Internship</button>
        </div>
      </div>

      {/* Career Preferences */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Career Preferences</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ domain_preferences: domains, relocation: profile?.relocation, linkedin: profile?.linkedin, current_location: profile?.current_location })}>Save</button>
        </div>
        <div className="space-y-3">
          <TagInput tags={domains} onChange={addDomain} />
          <input placeholder="Domain Preference (text)" value={profile?.domain_preference||''} onChange={e=>handleChange('domain_preference', e.target.value)} className="input-field" />
          <select value={profile?.relocation? 'yes':'no'} onChange={e=>handleChange('relocation', e.target.value === 'yes')} className="input-field">
            <option value="no">Relocation: No</option>
            <option value="yes">Relocation: Yes</option>
          </select>
          <input placeholder="LinkedIn Link" value={profile?.linkedin||''} onChange={e=>handleChange('linkedin', e.target.value)} className="input-field" />
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

      {/* Achievements */}
      <div className="bg-white rounded-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Achievements</h3>
          <button className="text-sm text-blue-600" onClick={()=>saveSection({ achievements })}>Save</button>
        </div>
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
