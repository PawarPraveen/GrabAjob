import { supabase } from './supabaseClient'

// Profiles CRUD helpers
export async function getProfileByUserId(user_id) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()

  if (error) {
    console.error('getProfileByUserId error', error)
    return null
  }
  return data
}

export async function upsertProfile(profile) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(profile, { onConflict: 'user_id' })
    .select()

  if (error) {
    console.error('upsertProfile error', error)
    return null
  }
  return data?.[0] || null
}

export async function createProfile(profile) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()

  if (error) {
    console.error('createProfile error', error)
    return null
  }
  return data?.[0] || null
}

// Storage helpers
export async function uploadFile({ bucket = 'profiles', file, path }) {
  if (!supabase) return null
  if (!file) return null

  const filename = `${path}/${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage.from(bucket).upload(filename, file, {
    cacheControl: '3600',
    upsert: true
  })

  if (error) {
    console.error('uploadFile error', error)
    return null
  }

  const { publicUrl, error: urlErr } = supabase.storage.from(bucket).getPublicUrl(data.path)
  if (urlErr) {
    console.error('getPublicUrl error', urlErr)
    return null
  }
  return publicUrl
}

export async function uploadAvatar(file, user_id) {
  return await uploadFile({ bucket: 'profiles', file, path: `avatars/${user_id}` })
}

export async function uploadResume(file, user_id) {
  return await uploadFile({ bucket: 'profiles', file, path: `resumes/${user_id}` })
}
