import { createClient } from '@supabase/supabase-js'
import { mockSignUp, mockSignIn, mockSignOut, mockGetSession, mockSignInWithOAuth } from './mockAuth'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null
let isUsingMockAuth = false

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase configured - using real authentication')
} else {
  console.warn('⚠️ Supabase not configured. Using MOCK authentication for testing.')
  console.log('📝 Test credentials:')
  console.log('  Job Seeker: demo@grabajob.com / DemoPass123')
  console.log('  Recruiter: recruiter@grabajob.com / RecruiterPass123')
  console.log('')
  console.log('📌 To configure real Supabase:')
  console.log('  1. Create project at supabase.com')
  console.log('  2. Copy API credentials from Settings > API')
  console.log('  3. Add to .env.local:')
  console.log('     VITE_SUPABASE_URL=your-url')
  console.log('     VITE_SUPABASE_ANON_KEY=your-key')
  
  isUsingMockAuth = true
  
  // Use mock auth client
  supabase = {
    auth: {
      signUp: async ({ email, password }) => mockSignUp({ email, password }),
      signInWithPassword: async ({ email, password }) => mockSignIn({ email, password }),
      signOut: async () => mockSignOut(),
      getSession: async () => mockGetSession(),
      signInWithOAuth: async () => mockSignInWithOAuth(),
    }
  }
}

export { supabase, isUsingMockAuth }

// Auth functions
export const auth = {
  signup: async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  signin: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  signout: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error: error.message }
    }
  },

  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      return { session: null, error: error.message }
    }
  },

  signInWithOAuth: async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      const message = error.message.includes('not configured') 
        ? 'Demo Mode: Add Supabase credentials to .env to enable OAuth' 
        : error.message
      return { data: null, error: message }
    }
  }
}
