import React from 'react'

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Help & Support</h2>
      <div className="card">
        <h4 className="font-semibold">FAQ</h4>
        <div className="mt-2 text-sm text-gray-600">
          <p><strong>How do I apply?</strong> Use the job listings and apply via the platform.</p>
          <p className="mt-2"><strong>How do I change password?</strong> Use Settings to request a reset email.</p>
        </div>
      </div>

      <div className="card">
        <h4 className="font-semibold">Contact</h4>
        <form className="mt-3 space-y-3" onSubmit={(e)=>{ e.preventDefault(); alert('Support request submitted (placeholder)') }}>
          <input placeholder="Your email" className="input-field" />
          <textarea placeholder="How can we help?" className="input-field" />
          <button className="btn-primary" type="submit">Send</button>
        </form>
        <p className="text-sm text-gray-500 mt-2">Or email us at support@grabajob.example</p>
      </div>
    </div>
  )
}
