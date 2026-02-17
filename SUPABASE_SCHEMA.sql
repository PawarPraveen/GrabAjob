-- Supabase Database Schema for CareerBridge Job Seeker Profiles

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture_url TEXT,
  
  -- Education
  college_name VARCHAR(255),
  degree VARCHAR(100),
  cgpa DECIMAL(5,2),
  
  -- Optional Education Details (JSON)
  diploma_details JSONB,
  puc_details JSONB,
  
  -- Career Preferences
  domain VARCHAR(100),
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  relocation BOOLEAN DEFAULT FALSE,
  preferred_location VARCHAR(255),
  
  -- Professional Details
  resume_url TEXT,
  certifications TEXT[] DEFAULT ARRAY[]::TEXT[],
  projects JSONB[] DEFAULT ARRAY[]::JSONB[],
  linkedin_url TEXT,
  portfolio_url TEXT,
  
  -- Additional Information
  extracurricular TEXT,
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_profiles_id ON profiles(id);

-- Enable RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own profile
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- RLS Policy: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create storage bucket for resumes
-- Run in Supabase dashboard: Storage > Create New Bucket > "profiles"

-- RLS Policy for resume storage: Users can upload to their own folder
CREATE POLICY "Users can upload resumes to their folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::TEXT);

-- RLS Policy for resume storage: Users can view their own resumes
CREATE POLICY "Users can view their own resumes"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'profiles' AND (storage.foldername(name))[1] = auth.uid()::TEXT);
