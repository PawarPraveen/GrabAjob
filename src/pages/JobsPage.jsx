import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, DollarSign, Briefcase, FilterX, CheckCircle } from 'lucide-react'

const mockJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$140k - $180k',
    level: 'Senior',
    remote: 'Remote',
    skills: ['React', 'Node.js', 'TypeScript'],
    description: 'We\'re looking for an experienced React developer to join our team.',
    match: 95,
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$120k - $160k',
    level: 'Mid-level',
    remote: 'Hybrid',
    skills: ['JavaScript', 'Python', 'AWS'],
    description: 'Build scalable web applications with our growing team.',
    match: 88,
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    company: 'DesignStudio',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    salary: '$100k - $140k',
    level: 'Mid-level',
    remote: 'Remote',
    skills: ['Figma', 'UI Design', 'Prototyping'],
    description: 'Design beautiful and intuitive user experiences.',
    match: 82,
  },
  {
    id: 4,
    title: 'Backend Engineer',
    company: 'CloudServices',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$130k - $170k',
    level: 'Senior',
    remote: 'Hybrid',
    skills: ['Python', 'PostgreSQL', 'Docker'],
    description: 'Build robust backend systems for enterprise clients.',
    match: 91,
  },
  {
    id: 5,
    title: 'Junior Developer',
    company: 'TechStart',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$70k - $100k',
    level: 'Fresher',
    remote: 'On-site',
    skills: ['JavaScript', 'React', 'CSS'],
    description: 'Start your career with us and grow with the team.',
    match: 79,
  },
]

export default function JobsPage() {
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    salaryMin: 0,
    salaryMax: 200,
    level: [],
    remote: [],
  })

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    applyFilters(term, filters)
  }

  const handleFilterChange = (type, value) => {
    let newFilters = { ...filters }
    if (type === 'location') {
      newFilters.location = value
    } else if (type === 'salary') {
      newFilters.salaryMax = value
    } else if (type === 'level' || type === 'remote') {
      if (newFilters[type].includes(value)) {
        newFilters[type] = newFilters[type].filter(v => v !== value)
      } else {
        newFilters[type] = [...newFilters[type], value]
      }
    }
    setFilters(newFilters)
    applyFilters(searchTerm, newFilters)
  }

  const applyFilters = (search, activeFilters) => {
    let result = mockJobs

    // Search filter
    if (search) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.skills.some(s => s.toLowerCase().includes(search))
      )
    }

    // Location filter
    if (activeFilters.location) {
      result = result.filter(job =>
        job.location.toLowerCase().includes(activeFilters.location.toLowerCase())
      )
    }

    // Level filter
    if (activeFilters.level.length > 0) {
      result = result.filter(job => activeFilters.level.includes(job.level))
    }

    // Remote filter
    if (activeFilters.remote.length > 0) {
      result = result.filter(job => activeFilters.remote.includes(job.remote))
    }

    // Salary filter
    result = result.filter(job => {
      const salary = parseInt(job.salary.match(/\d+/)[0])
      return salary <= activeFilters.salaryMax
    })

    setFilteredJobs(result)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      location: '',
      salaryMin: 0,
      salaryMax: 200,
      level: [],
      remote: [],
    })
    setFilteredJobs(mockJobs)
  }

  return (
    <div className="min-h-screen bg-brand-light pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="heading-lg mb-2">Browse Jobs</h1>
          <p className="text-gray-600">Find your next opportunity</p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="glass-effect rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                {(searchTerm || filters.location || filters.level.length > 0 || filters.remote.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-brand-accent hover:text-brand-primary text-sm font-semibold flex items-center gap-1"
                  >
                    <FilterX size={16} /> Clear
                  </button>
                )}
              </div>

              {/* Search Inside Filters */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Search</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title, company, skill..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  placeholder="City or State"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Salary Slider */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Max Salary</label>
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-400" />
                  <span className="text-sm font-semibold">${filters.salaryMax}k</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={filters.salaryMax}
                  onChange={(e) => handleFilterChange('salary', parseInt(e.target.value))}
                  className="w-full mt-3 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">Experience Level</label>
                <div className="space-y-2">
                  {['Fresher', 'Mid-level', 'Senior'].map((level) => (
                    <label key={level} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.level.includes(level)}
                        onChange={() => handleFilterChange('level', level)}
                        className="w-4 h-4 rounded accent-brand-primary"
                      />
                      <span className="text-sm text-gray-700">{level}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Remote Filter */}
              <div>
                <label className="block text-sm font-semibold mb-3">Work Type</label>
                <div className="space-y-2">
                  {['Remote', 'Hybrid', 'On-site'].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.remote.includes(type)}
                        onChange={() => handleFilterChange('remote', type)}
                        className="w-4 h-4 rounded accent-brand-primary"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Jobs Listing */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-4"
          >
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12 glass-effect rounded-2xl border border-gray-200">
                <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
                <h2 className="heading-md mb-2">No jobs found</h2>
                <p className="text-gray-600">Try adjusting your filters to find more opportunities</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Found <span className="font-bold">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
                </p>
                {filteredJobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="card-premium bg-white p-6 rounded-2xl border border-gray-200 hover:border-brand-accent group cursor-pointer"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="heading-sm mb-1">{job.title}</h3>
                            <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                          </div>
                          <span className="badge-accent">{job.match}% Match</span>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={16} />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={16} />
                            {job.salary}
                          </div>
                          <span className="text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full">
                            {job.level}
                          </span>
                          <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                            {job.remote}
                          </span>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span key={skill} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="btn-primary whitespace-nowrap">
                        Apply Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
