import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Become the next <span className="text-blue-600">generation talent</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with opportunities that match your skills and career goals. Find your next opportunity or meet exceptional talent.
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

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why use CareerBridge?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Targeted Matching</h3>
              <p className="text-gray-600">Get matched with opportunities that align with your skills and career goals.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-3">Verified Profiles</h3>
              <p className="text-gray-600">All users are verified to ensure quality connections and legitimate opportunities.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Fast Process</h3>
              <p className="text-gray-600">From application to offer, we streamline the entire hiring and job search process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">50K+</p>
              <p className="text-gray-600">Professionals</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">5K+</p>
              <p className="text-gray-600">Companies</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">10K+</p>
              <p className="text-gray-600">Active Jobs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to grow your career?</h2>
          <p className="text-xl mb-10 opacity-90">Join thousands of professionals finding their perfect opportunity.</p>
          <button
            onClick={() => navigate('/auth')}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-smooth"
          >
            Start Now
          </button>
        </div>
      </section>
    </div>
  )
}
