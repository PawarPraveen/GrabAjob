import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Where talent meets <span className="text-blue-600">opportunity</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create your profile, showcase your skills, and connect with companies hiring now.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/auth')}
              className="btn-primary bg-black hover:bg-gray-900"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="btn-secondary"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>

      {/* Platform Highlights Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Platform Highlights</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students & Freshers */}
            <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">For Students & Freshers</h3>
              <p className="text-gray-600">Showcase your skills and land your first opportunity.</p>
            </div>

            {/* For Experienced Professionals */}
            <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">For Experienced Professionals</h3>
              <p className="text-gray-600">Connect with companies looking for proven talent.</p>
            </div>

            {/* For Recruiters */}
            <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">For Recruiters</h3>
              <p className="text-gray-600">Discover candidates filtered by skills, domain, and relocation preference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose CareerBridge?</h2>
            <p className="text-xl text-gray-600">A platform built for genuine connections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Verified Profiles</h3>
              <p className="text-gray-600">All users are verified to ensure quality and authenticity.</p>
            </div>
            <div className="p-8 rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Smart Matching</h3>
              <p className="text-gray-600">Get matched with opportunities that fit your skills and goals.</p>
            </div>
            <div className="p-8 rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">Fast & Simple</h3>
              <p className="text-gray-600">From signup to application, everything is streamlined.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to find your next opportunity?</h2>
          <p className="text-xl mb-10 opacity-90">Join our community of professionals and recruiters today.</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-smooth"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  )
}
