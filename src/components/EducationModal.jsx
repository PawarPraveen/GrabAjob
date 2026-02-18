import React, { useState, useEffect } from 'react'

const DEGREE_OPTIONS = ['B.E/B.Tech','B.Sc','BCA','Diploma','PUC','Other']
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({length: 60}).map((_,i)=>CURRENT_YEAR - i)

export default function EducationModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    institute_name: '',
    degree: '',
    branch: '',
    cgpa: '',
    percentage: '',
    passing_year: '',
    optional: false,
    optional_type: '',
    optional_percentage: '',
    optional_board: '',
    optional_passing_year: ''
  })

  useEffect(()=>{
    if (initial) setForm(prev=>({ ...prev, ...initial }))
  },[initial])

  if (!isOpen) return null

  const handleChange = (k,v)=> setForm(prev=>({ ...prev, [k]: v }))

  const submit = ()=>{
    // basic validation
    if (!form.institute_name || !form.degree) {
      alert('Please fill institute and degree')
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4">Add / Edit Education</h3>
        <div className="space-y-3">
          <input className="input-field" placeholder="Institute Name" value={form.institute_name} onChange={e=>handleChange('institute_name', e.target.value)} />
          <select className="input-field" value={form.degree} onChange={e=>handleChange('degree', e.target.value)}>
            <option value="">Select degree</option>
            {DEGREE_OPTIONS.map(d=> <option key={d} value={d}>{d}</option>)}
          </select>
          <input className="input-field" placeholder="Branch / Specialization" value={form.branch} onChange={e=>handleChange('branch', e.target.value)} />

          <div className="grid grid-cols-3 gap-3">
            <input className="input-field" placeholder="CGPA (0-10)" value={form.cgpa} onChange={e=>handleChange('cgpa', e.target.value)} />
            <input className="input-field" placeholder="Percentage (optional)" value={form.percentage} onChange={e=>handleChange('percentage', e.target.value)} />
            <select className="input-field" value={form.passing_year} onChange={e=>handleChange('passing_year', e.target.value)}>
              <option value="">Passing year</option>
              {YEARS.map(y=> <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.optional} onChange={e=>handleChange('optional', e.target.checked)} /> Add PUC/Diploma</label>
          </div>

          {form.optional && (
            <div className="space-y-2">
              <input className="input-field" placeholder="Qualification Type" value={form.optional_type} onChange={e=>handleChange('optional_type', e.target.value)} />
              <input className="input-field" placeholder="Percentage" value={form.optional_percentage} onChange={e=>handleChange('optional_percentage', e.target.value)} />
              <input className="input-field" placeholder="Board / University" value={form.optional_board} onChange={e=>handleChange('optional_board', e.target.value)} />
              <select className="input-field" value={form.optional_passing_year} onChange={e=>handleChange('optional_passing_year', e.target.value)}>
                <option value="">Passing year</option>
                {YEARS.map(y=> <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onClose} className="btn-ghost">Cancel</button>
            <button onClick={submit} className="btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
