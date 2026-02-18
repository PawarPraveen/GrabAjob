import React, { useState } from 'react'
import EducationModal from './EducationModal'
import ConfirmModal from './ConfirmModal'

export default function EducationCard({ education = [], onChange }){
  const [open, setOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)

  const handleAdd = () => { setEditingIndex(null); setOpen(true) }
  const handleEdit = (idx) => { setEditingIndex(idx); setOpen(true) }
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDeleteIndex, setToDeleteIndex] = useState(null)

  const handleDelete = (idx) => {
    setToDeleteIndex(idx)
    setConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (toDeleteIndex == null) return setConfirmOpen(false)
    const next = education.filter((_,i)=>i!==toDeleteIndex)
    onChange(next)
    setToDeleteIndex(null)
    setConfirmOpen(false)
  }

  const save = (entry) => {
    const copy = [...education]
    if (editingIndex == null) copy.push(entry)
    else copy[editingIndex] = entry
    onChange(copy)
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Education</h3>
        <button onClick={handleAdd} className="text-sm text-blue-600">+ Add Education</button>
      </div>

      <div className="space-y-3">
        {education.length === 0 && <div className="text-gray-500">No education added yet.</div>}
        {education.map((e, idx) => (
          <div key={idx} className="p-4 rounded shadow-sm border flex justify-between items-start">
            <div>
              <div className="font-semibold">{e.institute_name} — {e.degree}{e.branch ? `, ${e.branch}` : ''}</div>
              <div className="text-sm text-gray-600">{e.passing_year} • CGPA: {e.cgpa || '-'} {e.percentage ? `• ${e.percentage}%` : ''}</div>
              {e.optional && <div className="mt-1 text-sm text-gray-600">{e.optional_type} • {e.optional_board} • {e.optional_passing_year}</div>}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={()=>handleEdit(idx)} className="btn-ghost">Edit</button>
              <button onClick={()=>handleDelete(idx)} className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <EducationModal isOpen={open} onClose={()=>setOpen(false)} onSave={save} initial={editingIndex!=null?education[editingIndex]:null} />
      <ConfirmModal open={confirmOpen} title="Delete education" message="Are you sure you want to delete this education entry?" onCancel={()=>setConfirmOpen(false)} onConfirm={confirmDelete} />
    </div>
  )
}
