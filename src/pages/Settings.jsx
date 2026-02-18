import React from 'react'
import { auth } from '../lib/supabaseClient'

export default function SettingsPage() {
  const handleChangePassword = () => {
    alert('Password change flow should integrate with Supabase auth reset email.')
  }

  const handleDelete = async () => {
    if (!confirm('Delete your account? This is irreversible.')) return
    alert('Account deletion must be performed from Supabase admin or via secure API.');
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <div className="card">
        <h4 className="font-semibold mb-2">Profile Picture</h4>
        <p className="text-sm text-gray-600">Update your avatar from the Profile page.</p>
      </div>

      <div className="card">
        <h4 className="font-semibold mb-2">Security</h4>
        <button onClick={handleChangePassword} className="btn-primary">Change Password (send reset)</button>
      </div>

      <div className="card">
        <h4 className="font-semibold mb-2 text-red-600">Danger Zone</h4>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete Account</button>
      </div>
    </div>
  )
}
