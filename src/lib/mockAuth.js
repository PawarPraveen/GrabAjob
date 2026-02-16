/**
 * Mock Authentication Service
 * Use this for testing the form UI/UX without Supabase
 * Replace with real Supabase when configured
 */

// Simulated user database
const mockUsers = [
  {
    id: 'user-1',
    email: 'demo@grabajob.com',
    password: 'DemoPass123',
    role: 'job-seeker',
  },
  {
    id: 'recruiter-1',
    email: 'recruiter@grabajob.com',
    password: 'RecruiterPass123',
    role: 'recruiter',
  },
]

// Mock session storage
let mockSession = null

/**
 * Mock SignUp function
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - User data or error
 */
export async function mockSignUp({ email, password }) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if email already exists
      if (mockUsers.some(u => u.email === email)) {
        resolve({
          data: null,
          error: { message: 'Email already registered. Try logging in instead.' }
        })
        return
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        password,
        role: 'job-seeker',
      }

      mockUsers.push(newUser)

      // Set mock session
      mockSession = {
        user: {
          id: newUser.id,
          email: newUser.email,
          user_metadata: { role: newUser.role }
        },
        access_token: `mock-token-${Date.now()}`,
      }

      resolve({
        data: { user: mockSession.user },
        error: null
      })
    }, 1000)
  })
}

/**
 * Mock SignIn function
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - User data or error
 */
export async function mockSignIn({ email, password }) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password)

      if (!user) {
        resolve({
          data: null,
          error: { message: 'Invalid email or password.' }
        })
        return
      }

      // Set mock session
      mockSession = {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: { role: user.role }
        },
        access_token: `mock-token-${Date.now()}`,
      }

      resolve({
        data: { user: mockSession.user },
        error: null
      })
    }, 1000)
  })
}

/**
 * Mock SignOut function
 * @returns {Promise}
 */
export async function mockSignOut() {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockSession = null
      resolve({ error: null })
    }, 500)
  })
}

/**
 * Mock GetSession function
 * @returns {Promise} - Current session or null
 */
export function mockGetSession() {
  return Promise.resolve({
    data: { session: mockSession },
    error: null
  })
}

/**
 * Mock OAuth function (not implemented)
 * @returns {Promise}
 */
export function mockSignInWithOAuth() {
  return Promise.reject(new Error('OAuth not available in mock mode'))
}

/**
 * Get test credentials for demo
 */
export const TEST_CREDENTIALS = {
  jobSeeker: {
    email: 'demo@grabajob.com',
    password: 'DemoPass123',
    role: 'job-seeker',
  },
  recruiter: {
    email: 'recruiter@grabajob.com',
    password: 'RecruiterPass123',
    role: 'recruiter',
  },
}
