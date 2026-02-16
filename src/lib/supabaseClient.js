import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('⚠️ Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env for full functionality.')
  // Create a mock client that won't error
  supabase = {
    auth: {
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured')),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
    }
  }
}

export { supabase }

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
      const message = error.message.includes('not configured') 
        ? 'Demo Mode: Add Supabase credentials to .env to enable authentication' 
        : error.message
      return { data: null, error: message }
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
      const message = error.message.includes('not configured') 
        ? 'Demo Mode: Add Supabase credentials to .env to enable authentication' 
        : error.message
      return { data: null, error: message }
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
