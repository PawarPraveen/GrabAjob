import React, { useState } from 'react'

export default function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState('')
  const [items, setItems] = useState(tags || [])

  const add = () => {
    const v = input.trim()
    if (!v) return
    const next = Array.from(new Set([...items, v]))
    setItems(next)
    setInput('')
    if (onChange) onChange(next)
  }

  const remove = (t) => {
    const next = items.filter(i => i !== t)
    setItems(next)
    if (onChange) onChange(next)
  }

  const onKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {items.map(i => (
          <div key={i} className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 flex items-center gap-2">
            <span>{i}</span>
            <button onClick={() => remove(i)} className="text-sm text-blue-400">×</button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKey} placeholder="Add skill and press Enter" className="input-field" />
        <button onClick={add} className="btn-outline">Add</button>
      </div>
    </div>
  )
}
