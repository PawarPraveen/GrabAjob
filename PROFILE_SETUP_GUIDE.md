# Profile Setup Integration Guide

## Overview

This guide walks you through setting up the JobSeeker Profile Setup page after user registration.

## Architecture

```
Registration Flow:
1. User lands on Landing page
2. User clicks "Get Started" → Auth page
3. User fills registration form (Step 1 & 2 of 3)
4. User submits registration → Creates auth.users account
5. User redirected to /profile-setup (Step 3 of 3)
6. User completes profile and saves
7. Profile data saved to profiles table
8. User redirected to Dashboard
```

## Setup Steps

### 1. **Supabase Database Setup**

Run the SQL from `SUPABASE_SCHEMA.sql` in your Supabase SQL editor:

```
- Go to Supabase Dashboard
- Navigate to SQL Editor
- Create new Query
- Paste contents of SUPABASE_SCHEMA.sql
- Run the query
```

This creates:
- ✅ `profiles` table with all required columns
- ✅ Row Level Security (RLS) policies
- ✅ Storage bucket rules

### 2. **Create Storage Bucket**

```
- Go to Supabase Dashboard
- Navigate to Storage
- Click "Create New Bucket"
- Name: "profiles"
- Make Public: NO (keep private)
- Click "Create"
```

### 3. **Update AuthTabs Component**

Edit `src/components/AuthTabs.jsx` to redirect to profile setup after registration:

```javascript
// After successful registration, add this:
if (activeTab === 'register' && !error) {
  setTimeout(() => {
    navigate('/profile-setup')
  }, 1000)
}
```

### 4. **Add ProfileSetup to Routes**

Already done in `src/App.jsx` ✅

Route: `/profile-setup` (Protected - requires authentication)

---

## Component Features

### Form Sections

1. **Basic Information**
   - Full Name (required)
   - Phone Number (required - 10 digits)
   - Profile Picture (optional image upload)

2. **Education**
   - College/Institute Name (required)
   - Degree Type (dropdown)
   - CGPA/Percentage (required)
   - **Collapsible**: Diploma Details (optional)
   - **Collapsible**: PUC/12th Details (optional)

3. **Career Preferences**
   - Domain/Specialization (required - dropdown)
   - Skills (required - tag-based, minimum 1)
   - Relocation Preference (Yes/No)
   - Preferred Locations (optional)

4. **Professional Details**
   - Resume Upload (required - PDF, max 5MB)
   - LinkedIn Profile URL (optional)
   - Portfolio URL (optional)
   - Certifications (optional - multi-add)
   - Projects with GitHub Links (optional)

5. **Additional Information**
   - Extracurricular Activities (optional - textarea)
   - Interests (optional - tag-based)

### Features

✅ **Real-time Validation** - Error messages for invalid inputs
✅ **Progress Bar** - Shows profile completion percentage
✅ **Required Fields Check** - Save button disabled until 60% complete
✅ **Resume Upload** - Direct to Supabase Storage with validation
✅ **Tag Management** - Easy add/remove for skills, interests, certifications
✅ **Collapsible Sections** - Optional education details hidden by default
✅ **Responsive Design** - Mobile-friendly with Tailwind CSS
✅ **Framer Motion** - Smooth animations for sections and elements
✅ **Toast Notifications** - Success/error feedback

---

## Database Structure

### profiles table

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID | Links to auth.users(id) |
| `full_name` | VARCHAR(255) | User's legal name |
| `phone` | VARCHAR(20) | 10-digit phone number |
| `college_name` | VARCHAR(255) | University/Institute |
| `degree` | VARCHAR(100) | B.Tech, MBA, etc. |
| `cgpa` | DECIMAL(5,2) | GPA/Percentage (0-10) |
| `diploma_details` | JSONB | {institute, percentage} |
| `puc_details` | JSONB | {board, percentage} |
| `domain` | VARCHAR(100) | Career domain |
| `skills` | TEXT[] | Array of skills |
| `relocation` | BOOLEAN | Can relocate? |
| `preferred_location` | VARCHAR(255) | Preferred city/region |
| `resume_url` | TEXT | Supabase Storage path |
| `certifications` | TEXT[] | Array of cert names |
| `projects` | JSONB[] | [{name, github}, ...] |
| `linkedin_url` | TEXT | LinkedIn profile URL |
| `portfolio_url` | TEXT | Personal portfolio site |
| `extracurricular` | TEXT | Long-form text |
| `interests` | TEXT[] | Array of interests |
| `created_at` | TIMESTAMP | Profile creation time |
| `updated_at` | TIMESTAMP | Last updated time |

---

## API Requests

### Save Profile

```javascript
// Called from ProfileSetup.jsx

const { data, error } = await supabaseClient
  .from('profiles')
  .upsert([profileData], { onConflict: 'id' })

// profileData object includes all form fields
```

### Upload Resume

```javascript
// Resume uploaded to: resumes/{userId}/{timestamp}-{filename}

const { data, error } = await supabaseClient.storage
  .from('profiles')
  .upload(fileName, file)

// Get public URL:
const { data: { publicUrl } } = supabaseClient.storage
  .from('profiles')
  .getPublicUrl(fileName)
```

### Fetch User Profile

```javascript
const { data, error } = await supabaseClient
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()
```

---

## Testing Checklist

- [ ] Register new user account
- [ ] Redirected to `/profile-setup`
- [ ] Fill all required fields
- [ ] Progress bar updates (should reach ~60% minimum)
- [ ] Upload PDF resume
- [ ] Add multiple skills (tag input)
- [ ] Test collapsible sections (Diploma/PUC)
- [ ] Add certifications and projects
- [ ] Submit form
- [ ] Verify data saved in Supabase
- [ ] Redirected to Dashboard after 2 seconds
- [ ] Check resume file in Storage bucket
- [ ] Test optional field skipping

---

## Troubleshooting

### Resume Upload Fails

**Problem**: "Failed to upload resume"

**Solutions**:
- ✅ Storage bucket "profiles" exists
- ✅ File is PDF format
- ✅ File size < 5MB
- ✅ RLS policies configured correctly
- ✅ User is authenticated

### Profile Not Saving

**Problem**: Form submits but profile not in database

**Solutions**:
- ✅ Check Supabase console for RLS errors
- ✅ Verify user ID in auth.users table
- ✅ Check profiles table RLS policies

### Data Not Loading in Dashboard

**Problem**: Profile data empty after redirect

**Solutions**:
- ✅ Query uses correct user ID
- ✅ RLS SELECT policy exists
- ✅ Data actually saved (check Supabase)

---

## Next Steps

After profile setup is complete, the user should:

1. **See Dashboard** with their saved profile data
2. **Browse Jobs** matching their skills/domain
3. **Apply to Jobs** using their profile
4. **View Applications** and track status
5. **Edit Profile** anytime to update info

---

## File Structure

```
src/
├── pages/
│   ├── ProfileSetup.jsx          ← New profile form
│   ├── Auth.jsx                  ← Update redirect
│   └── JobSeekerDashboard.jsx    ← Shows saved profile
├── components/
│   ├── AuthTabs.jsx              ← Update to redirect
│   └── ...
├── lib/
│   └── supabaseClient.js         ← Already configured
└── App.jsx                       ← Route added
```

---

## Environment Variables

Make sure you have in `.env`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Deployed vs Local

### During Development
- Resume uploads to local Supabase project
- Test with real PDF files
- Check Supabase dashboard for data

### Before Production
- Set up production Supabase project
- Update .env with production credentials
- Test full flow
- Monitor Storage bucket size

---

## Future Enhancements

- [ ] Profile picture upload to Supabase Storage
- [ ] LinkedIn data auto-fill
- [ ] Resume parsing (extract skills)
- [ ] Profile strength score
- [ ] Share profile link
- [ ] Profile template/presets
- [ ] Bulk import from other platforms

---

## Support

For issues, check:
1. Browser console (F12) for errors
2. Supabase dashboard logs
3. Network tab for failed requests
4. RLS policies in Supabase

Questions? Review the component code in `src/pages/ProfileSetup.jsx`
