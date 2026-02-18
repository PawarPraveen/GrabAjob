import React, { useState } from 'react'

export default function JobUploader({ onAnalyze, loading }) {
  const [text, setText] = useState('')
  const [extractedPreview, setExtractedPreview] = useState('')

  const handlePasteAnalyze = () => {
    if (!text.trim()) {
      alert('Paste or enter job description text first')
      return
    }
    const jobObject = extractJobFromText(text)
    setExtractedPreview(jobObject)
    onAnalyze(jobObject)
  }

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Basic text extraction for txt and docx not fully implemented. For now, try reading text/plain
    const reader = new FileReader()
    reader.onload = (ev) => {
      const content = ev.target.result
      // For images/PDFs you'd normally call OCR or server extraction. We'll set a placeholder.
      const jobObject = extractJobFromText(String(content || file.name))
      setExtractedPreview(jobObject)
      onAnalyze(jobObject)
    }
    if (file.type.startsWith('text') || file.type === 'application/json') {
      reader.readAsText(file)
    } else {
      // fallback: use filename as content placeholder
      reader.readAsText(file)
    }
  }

  const extractJobFromText = (raw) => {
    // Very lightweight parsing: split sentences and heuristics
    const lower = raw.replace(/\n+/g, ' ').trim()
    const skills = []
    const responsibilities = []
    const techStack = []
    let experience = ''
    let domain = ''
    let relocation = false
    const certifications = []

    // simple heuristics: extract words after 'skills:' or 'requirements:'
    const skillsMatch = lower.match(/skills?:\s*([\w\s,\-+/.]+)/i)
    if (skillsMatch) {
      skills.push(...skillsMatch[1].split(/[,;]+/).map(s => s.trim()).filter(Boolean))
    }

    const expMatch = lower.match(/(\d\+?\s?(years|yrs)?) experience|experience:\s*([\w\s]+)/i)
    if (expMatch) {
      experience = (expMatch[3] || expMatch[1] || '').trim()
    }

    if (/relocat/i.test(lower)) relocation = true

    // fallback: top nouns as skills (very rough)
    const tokens = lower.split(/[^a-zA-Z0-9+#+.]+/).filter(Boolean)
    tokens.slice(0, 20).forEach(t => {
      if (t.length > 2 && /[A-Za-z]/.test(t)) {
        if (t.length <= 12 && skills.length < 8) skills.push(t)
        if (t.toLowerCase().includes('react') || t.toLowerCase().includes('node')) techStack.push(t)
      }
    })

    return {
      skills: Array.from(new Set(skills)).slice(0, 40),
      experience: experience,
      responsibilities: responsibilities,
      techStack: Array.from(new Set(techStack)).slice(0, 40),
      relocation,
      certifications,
      domain,
      raw: raw.slice(0, 5000),
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-2">Upload File (PDF / DOC / Image)</label>
          <input type="file" onChange={handleFile} className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Or Paste Text</label>
          <textarea
            rows={6}
            className="input-field w-full"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste job description here..."
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handlePasteAnalyze} disabled={loading} className="btn-primary">
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>
      </div>

      {extractedPreview && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border">
          <h4 className="font-semibold">Extracted Preview</h4>
          <pre className="text-xs">{JSON.stringify(extractedPreview, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
