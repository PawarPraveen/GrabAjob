import React from 'react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">About GrabAjob</h1>
        <p className="text-gray-600 mt-2">Bridging skills and opportunities with AI-driven matching.</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold">Our Mission</h3>
          <p className="text-sm text-gray-600 mt-2">To help candidates understand skill gaps and find the right roles faster.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold">What we do</h3>
          <ul className="list-disc ml-5 text-sm text-gray-600">
            <li>AI-driven job matching</li>
            <li>Resume analysis & suggested learning resources</li>
            <li>Career guidance for students and professionals</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
