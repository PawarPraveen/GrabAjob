import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import JobUploader from '../components/JobUploader'
import ProfileSummary from '../components/ProfileSummary'
import MatchScoreCard from '../components/MatchScoreCard'
import { matchJobToProfile } from '../utils/aiMatcher'
import Navbar from '../components/Navbar'

export default function AiMatch() {
  const navigate = useNavigate()
  const [jobData, setJobData] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Optionally fetch profile on mount
  }, [])

  const handleAnalyze = async (jobObject) => {
    if (!profileData) {
      alert('Please load your profile first.')
      return
    }
    setJobData(jobObject)
    setLoading(true)
    try {
      const res = await matchJobToProfile(jobObject, profileData)
      setResult(res)
    } catch (err) {
      console.error('Match error', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-lg">AI Match Engine</h1>
          <div className="flex items-center gap-3">
            <button
              className="btn-outline"
              onClick={() => navigate(-1)}
            >
              Back to Profile
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="card-premium p-6">
              <h2 className="heading-md mb-4">Analyze Job Description</h2>
              <JobUploader onAnalyze={handleAnalyze} loading={loading} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="card-premium p-6">
              <h2 className="heading-md mb-4">Your Profile Intelligence</h2>
              <ProfileSummary onLoadProfile={setProfileData} />
            </div>

            <div className="card-premium p-6">
              <h2 className="heading-md mb-4">Match Result</h2>
              <MatchScoreCard result={result} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
