import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle, Zap, Users, Target, FileText, Search, ArrowRight, Star } from 'lucide-react'
import NavbarPublic from '../components/NavbarPublic'

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const floatingCardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen bg-brand-light">
      <NavbarPublic />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.h1 variants={itemVariants} className="heading-xl mb-6">
              Find Jobs Faster.<br />
              <span className="gradient-brand">Hire Smarter.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-body mb-8 text-gray-700">
              GrabAjob connects ambitious professionals with companies actively hiring. Smart matching, fast onboarding, and real results.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/auth?tab=signup&role=job-seeker" className="btn-primary flex items-center justify-center gap-2">
                🚀 Get Started
              </Link>
              <Link to="/auth?tab=signup&role=recruiter" className="btn-accent flex items-center justify-center gap-2">
                👔 Hire Talent
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="flex items-center gap-6 pt-8 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500">Trusted by professionals</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="h-12 w-px bg-gray-200"></div>
              <p className="text-sm text-gray-600"><span className="font-bold text-brand-primary">100%</span> Free for Job Seekers</p>
            </motion.div>
          </motion.div>

          {/* Right: Floating Job Cards */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative h-96 hidden md:block">
            {/* Card 1 */}
            <motion.div
              variants={floatingCardVariants}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-0 left-0 w-80 glass-effect rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100"></div>
                <div>
                  <p className="font-semibold text-sm">Senior Product Manager</p>
                  <p className="text-xs text-gray-500">TechCorp Inc.</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-4">San Francisco, CA • Remote</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primary">$140k - $180k</span>
                <CheckCircle size={20} className="text-green-500" />
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={floatingCardVariants}
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              className="absolute top-32 right-0 w-80 glass-effect rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100"></div>
                <div>
                  <p className="font-semibold text-sm">Full Stack Engineer</p>
                  <p className="text-xs text-gray-500">StartupXYZ</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-4">New York, NY • Hybrid</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primary">$120k - $160k</span>
                <CheckCircle size={20} className="text-green-500" />
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={floatingCardVariants}
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: 1 }}
              className="absolute bottom-0 left-16 w-80 glass-effect rounded-2xl p-6 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100"></div>
                <div>
                  <p className="font-semibold text-sm">UX/UI Designer</p>
                  <p className="text-xs text-gray-500">DesignStudio</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-4">Los Angeles, CA • Remote</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-primary">$100k - $140k</span>
                <CheckCircle size={20} className="text-green-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">Why GrabAjob?</h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              The smartest way to find jobs or hire talent. No fluff, just results.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Card 1: Smart Job Matching */}
            <motion.div variants={itemVariants} className="card-premium bg-white p-8 hover:border-brand-accent group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                <Target size={28} className="text-brand-primary" />
              </div>
              <h3 className="heading-sm mb-3">Smart Job Matching</h3>
              <p className="text-body text-gray-600">
                Our AI-powered matching finds jobs that align with your skills, experience, and career goals.
              </p>
              <div className="mt-6 flex items-center gap-2 text-brand-accent font-semibold group-hover:gap-3 transition-smooth">
                Learn more <ArrowRight size={18} />
              </div>
            </motion.div>

            {/* Card 2: One-Click Resume */}
            <motion.div variants={itemVariants} className="card-premium bg-white p-8 hover:border-brand-accent group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                <FileText size={28} className="text-brand-primary" />
              </div>
              <h3 className="heading-sm mb-3">One-Click Resume Builder</h3>
              <p className="text-body text-gray-600">
                Build a professional resume in minutes. Optimized for recruiters and ATS systems.
              </p>
              <div className="mt-6 flex items-center gap-2 text-brand-accent font-semibold group-hover:gap-3 transition-smooth">
                Learn more <ArrowRight size={18} />
              </div>
            </motion.div>

            {/* Card 3: Skill-Based Filtering */}
            <motion.div variants={itemVariants} className="card-premium bg-white p-8 hover:border-brand-accent group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-smooth">
                <Search size={28} className="text-brand-primary" />
              </div>
              <h3 className="heading-sm mb-3">Skill-Based Filtering</h3>
              <p className="text-body text-gray-600">
                Filter jobs by skills you want to learn or further develop. Grow your expertise.
              </p>
              <div className="mt-6 flex items-center gap-2 text-brand-accent font-semibold group-hover:gap-3 transition-smooth">
                Learn more <ArrowRight size={18} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who Is It For Section */}
      <section id="for-seekers" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">Built for Everyone</h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Whether you're looking for your first job or hiring a rockstar team.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Job Seekers */}
            <motion.div
              variants={itemVariants}
              className="group card-premium bg-gradient-to-br from-blue-50 to-blue-100 p-12 rounded-3xl border-2 border-brand-accent/20 hover:border-brand-accent"
            >
              <div className="text-5xl mb-6">👤</div>
              <h3 className="heading-md mb-6">For Job Seekers</h3>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Build a professional profile in minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Discover jobs matched to your skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Track applications and interviews</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Get insights to improve profiles</span>
                </li>
              </ul>

              <Link to="/auth?tab=signup&role=job-seeker" className="btn-primary w-full text-center">
                Explore Jobs →
              </Link>
            </motion.div>

            {/* Recruiters */}
            <motion.div
              variants={itemVariants}
              className="group card-premium bg-gradient-to-br from-orange-50 to-orange-100 p-12 rounded-3xl border-2 border-brand-accent/20 hover:border-brand-accent"
            >
              <div className="text-5xl mb-6">🏢</div>
              <h3 className="heading-md mb-6">For Recruiters</h3>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Post jobs in seconds</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Smart candidate filtering by skills</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Track applications and pipelines</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Hire talent faster than ever</span>
                </li>
              </ul>

              <Link to="/auth?tab=signup&role=recruiter" className="btn-primary w-full text-center">
                Start Hiring →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="heading-lg mb-4">How It Works</h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              Fast, simple, and effective.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-4 gap-6"
          >
            {[
              { number: '1', title: 'Sign Up', description: 'Choose your role and setup your account' },
              { number: '2', title: 'Complete Profile', description: 'Add your skills, experience, or company details' },
              { number: '3', title: 'Connect', description: 'Browse jobs or candidates on the platform' },
              { number: '4', title: 'Succeed', description: 'Get hired or find your next great hire' },
            ].map((step, i) => (
              <motion.div key={i} variants={itemVariants} className="relative">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-brand text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 -right-3 text-brand-accent text-2xl">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-brand">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="heading-lg text-white mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals and companies already using GrabAjob to find the perfect match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?tab=signup&role=job-seeker" className="bg-white text-brand-primary font-semibold px-8 py-4 rounded-xl hover:shadow-2xl transition-smooth">
                Find Jobs Now
              </Link>
              <Link to="/auth?tab=signup&role=recruiter" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-smooth">
                Post Jobs Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-bold text-lg mb-4">GrabAjob</p>
              <p className="text-sm text-gray-300">Find jobs faster. Hire smarter.</p>
            </div>
            <div>
              <p className="font-semibold mb-4">For Seekers</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li><a href="#" className="hover:text-white transition-smooth">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Build Resume</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">My Profile</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">For Recruiters</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li><a href="#" className="hover:text-white transition-smooth">Post Job</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Browse Talent</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Company</p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li><a href="#" className="hover:text-white transition-smooth">About</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-smooth">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 GrabAjob. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-smooth">Privacy</a>
              <a href="#" className="hover:text-white transition-smooth">Terms</a>
              <a href="#" className="hover:text-white transition-smooth">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
