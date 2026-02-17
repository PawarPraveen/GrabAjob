import { createClient } from '@supabase/supabase-js'
import { mockSignUp, mockSignIn, mockSignOut, mockGetSession, mockSignInWithOAuth } from './mockAuth'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// DEBUG: print both Vite import.meta.env and Node process.env for troubleshooting
console.log('ENV DEBUG - import.meta.env.VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('ENV DEBUG - import.meta.env.VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)
try {
  console.log('ENV DEBUG - process.env.NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('ENV DEBUG - process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
} catch (e) {
  // process may be undefined in some runtimes; ignore
}

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
      // Step 1: Trim email and validate
      const trimmedEmail = email.trim()
      console.log('🔐 [SIGNUP] Step 1 - Attempting with email:', trimmedEmail)
      
      // Step 2: Call signup with ONLY signUp method
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: metadata
        }
      })
      
      // Step 3: Log complete response
      console.log('🔐 [SIGNUP] Step 2 - Full response:', {
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          user_metadata: data.user.user_metadata
        } : null,
        session: data?.session ? {
          access_token_exists: !!data.session.access_token,
          expires_in: data.session.expires_in
        } : null,
        error: error
      })
      
      // Step 4: Check for error first
      if (error) {
        console.error('🔐 [SIGNUP] ERROR - Full error object:', {
          message: error.message,
          status: error.status,
          code: error.code,
          fullError: error
        })
        throw error
      }
      
      // Step 5: Check if user was created
      if (!data.user) {
        console.error('🔐 [SIGNUP] ERROR - No user in response')
        throw new Error('Signup failed: No user created')
      }
      
      console.log('✅ [SIGNUP] Success - User created:', data.user.email)
      
      // Step 6: Check if email confirmation is required
      if (data.user && !data.session) {
        console.warn('⚠️  [SIGNUP] Email confirmation required - No session returned')
        console.log('📧 User will need to verify email before login')
      } else if (data.session) {
        console.log('✅ [SIGNUP] Session created - User can login immediately')
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('🔐 [SIGNUP] EXCEPTION - Full error object:', {
        message: error.message,
        stack: error.stack,
        fullError: error
      })
      return { data: null, error: error.message }
    }
  },

  signin: async (email, password) => {
    try {
      // Step 1: Trim email and validate
      const trimmedEmail = email.trim()
      console.log('🔐 [LOGIN] Step 1 - Attempting with email:', trimmedEmail)
      
      // Step 2: Call login with ONLY signInWithPassword method
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password
      })
      
      // Step 3: Log complete response
      console.log('🔐 [LOGIN] Step 2 - Full response:', {
        user: data?.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          user_metadata: data.user.user_metadata
        } : null,
        session: data?.session ? {
          access_token_exists: !!data.session.access_token,
          expires_in: data.session.expires_in,
          user_email: data.session.user?.email
        } : null,
        error: error
      })
      
      // Step 4: Check for error first
      if (error) {
        console.error('🔐 [LOGIN] ERROR - Full error object:', {
          message: error.message,
          status: error.status,
          code: error.code,
          fullError: error
        })
        throw error
      }
      
      // Step 5: Verify user exists
      if (!data.user) {
        console.error('🔐 [LOGIN] ERROR - No user in response')
        throw new Error('Login failed: No user data')
      }
      
      // Step 6: Verify session exists
      if (!data.session) {
        console.error('🔐 [LOGIN] ERROR - No session in response')
        throw new Error('Login failed: No session created')
      }
      
      console.log('✅ [LOGIN] Success - User logged in:', data.user.email)
      console.log('✅ [LOGIN] Session token expires in:', data.session.expires_in, 'seconds')
      
      return { data, error: null }
    } catch (error) {
      console.error('🔐 [LOGIN] EXCEPTION - Full error object:', {
        message: error.message,
        stack: error.stack,
        fullError: error
      })
      return { data: null, error: error.message }
    }
  },

  signout: async () => {
    try {
      console.log('🔐 [AUTH] Signout attempt')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      console.log('🔐 [AUTH] Signout success')
      return { error: null }
    } catch (error) {
      console.error('🔐 [AUTH] Signout error:', error)
      return { error: error.message }
    }
  },

  getSession: async () => {
    try {
      console.log('🔐 [SESSION] Fetching current session')
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('🔐 [SESSION] ERROR - Full error object:', {
          message: error.message,
          fullError: error
        })
        throw error
      }
      
      if (session) {
        console.log('✅ [SESSION] Active session found:', {
          user_email: session.user?.email,
          expires_in: session.expires_in,
          token_exists: !!session.access_token
        })
      } else {
        console.log('⚠️  [SESSION] No active session')
      }
      
      return { session, error: null }
    } catch (error) {
      console.error('🔐 [SESSION] EXCEPTION:', error)
      return { session: null, error: error.message }
    }
  },

  signInWithOAuth: async (provider) => {
    try {
      console.log('🔐 [AUTH] OAuth attempt:', provider)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      })
      if (error) throw error
      console.log('🔐 [AUTH] OAuth success:', provider)
      return { data, error: null }
    } catch (error) {
      const message = error.message.includes('not configured') 
        ? 'Demo Mode: Add Supabase credentials to .env to enable OAuth' 
        : error.message
      console.error('🔐 [AUTH] OAuth error:', error)
      return { data: null, error: message }
    }
  }
}
