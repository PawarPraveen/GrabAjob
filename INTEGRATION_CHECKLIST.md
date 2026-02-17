# Quick Integration Checklist

## Phase 1: Database Setup (5 minutes)

- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Create new Query
- [ ] Copy and paste contents of `SUPABASE_SCHEMA.sql`
- [ ] Click "Run"
- [ ] Verify no errors appear

## Phase 2: Storage Setup (2 minutes)

- [ ] Go to Storage in dashboard
- [ ] Click "Create New Bucket"
- [ ] Name: `profiles`
- [ ] Public: OFF
- [ ] Click "Create Bucket"

## Phase 3: Update Registration Flow (10 minutes)

### Update `src/components/AuthTabs.jsx`

After successful registration, redirect to profile setup:

```javascript
// Around line 80 (after successful registration)

if (activeTab === 'register') {
  // Success feedback
  toast.success('Account created! Setting up your profile...')
  
  // Redirect after 1 second
  setTimeout(() => {
    navigate('/profile-setup')
  }, 1000)
}
```

### Update `src/pages/Auth.jsx` (Optional)

You can add a CTA in the Auth page left section directing to setup after registration.

## Phase 4: Test Everything (15 minutes)

### Test Case 1: Complete Registration Flow

1. [ ] Start at `http://localhost:5173`
2. [ ] Click "Get Started"
3. [ ] Click "Sign Up"
4. [ ] Fill registration form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "Test1234!"
   - Confirm: "Test1234!"
5. [ ] Click "Create Account"
6. [ ] Should see success message & redirect counter
7. [ ] Should land on `/profile-setup`

### Test Case 2: Fill Profile Form

1. [ ] Fill all **required** fields:
   - Full Name: "John Doe"
   - Phone: "9876543210"
   - College: "IIT Delhi"
   - CGPA: "8.5"
   - Domain: "Backend Development"
   - Skills: Add "Python", "Django", "PostgreSQL"
   - Upload Resume: Select a PDF file

2. [ ] Check progress bar reaches ~60%
3. [ ] Click "Complete Profile & Continue"
4. [ ] See "Profile completed successfully!"
5. [ ] Should redirect to `/dashboard` after 2 seconds

### Test Case 3: Verify Data Saved

1. [ ] Go to Supabase Dashboard
2. [ ] Table Editor
3. [ ] Open `profiles` table
4. [ ] Check your user's row has the data you entered
5. [ ] Check `resume_url` column has S3 link
6. [ ] Check `skills` column has array ["Python", "Django", "PostgreSQL"]

### Test Case 4: Optional Fields

1. [ ] On profile form, try:
   - Skip Profile Picture (optional) → Works ✓
   - Skip Certifications → Works ✓
   - Skip LinkedIn URL → Works ✓
   - Click "Skip Overview Optional Details" → Works ✓
2. [ ] Submit form → Should save successfully ✓

## Phase 5: Frontend Integration (10 minutes)

### Already Done ✅
- ProfileSetup component created
- Route added to App.jsx
- All validation working
- Supabase integration ready

### Optional Enhancements
- [ ] Add profile picture upload
- [ ] Add loading spinner to dashboard while data fetches
- [ ] Add edit/update profile button on dashboard
- [ ] Add profile completion % to dashboard header

## Phase 6: Error Handling

Test error scenarios:

- [ ] Leave phone empty → "Phone number is required" ✓
- [ ] Enter wrong phone format → "Phone must be 10 digits" ✓
- [ ] Upload non-PDF file → "Only PDF files are allowed" ✓
- [ ] Upload file > 5MB → "File size must be less than 5MB" ✓
- [ ] No skills added → "Add at least one skill" ✓
- [ ] 50% completion → Save button disabled ✓
- [ ] 60% completion → Save button enabled ✓

---

## Common Issues & Fixes

### Issue: "User not authenticated" error

**Fix**: 
- Make sure you registered first
- Check Supabase session is active
- Try logout and login again

### Issue: Resume upload shows spinner forever

**Fix**:
- Check Storage bucket exists and is named "profiles"
- Check RLS policies in Storage settings
- Check file is actually a PDF
- Check file size < 5MB

### Issue: Form won't submit (button stays disabled)

**Fix**:
- Fill all required fields (marked with *)
- Make sure progress bar >= 60%
- Check browser console for JS errors
- Try refreshing page

### Issue: Data not appearing in Supabase

**Fix**:
- Check RLS SELECT/UPDATE policies are enabled
- Verify user ID matches in auth.users and profiles
- Check all required fields have data
- Look at Supabase logs for errors

### Issue: "Profile completion" percentage not changing

**Fix**:
- Make sure you're filling required fields
- Progress calculates: required fields filled / total required
- Required: name, phone, college, cgpa, domain, skills, resume

---

## Database Verification

Run these queries in Supabase SQL Editor to verify setup:

### Check profiles table exists

```sql
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name='profiles'
ORDER BY ordinal_position;
```

### Check RLS policies

```sql
SELECT * FROM pg_policies 
WHERE tablename = 'profiles';
```

### Check your profile data

```sql
SELECT 
  id, 
  full_name, 
  phone, 
  domain, 
  skills, 
  created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 1;
```

### Check storage bucket

```sql
SELECT 
  name, 
  bucket_id, 
  created_at 
FROM storage.objects 
WHERE bucket_id = 'profiles'
LIMIT 10;
```

---

## Running the App

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# Should start at http://localhost:5173
```

---

## Success Metrics

After completing all phases:

✅ User can register with email/password
✅ Redirects to profile setup automatically
✅ Form validates and shows errors
✅ Resume uploads to Storage
✅ Data saves to profiles table
✅ Redirect to dashboard successful
✅ No console errors
✅ Mobile responsive works

---

## Next Steps After Success

1. **Build Dashboard** to display saved profile
2. **Add Job Listings** for users to apply
3. **Implement Applications** tracking
4. **Add Recruiter** profile setup flow
5. **Build Matching** algorithm for recommendations

---

## Timeline

| Phase | Time | Status |
|-------|------|--------|
| Database Setup | 5 min | ⏳ TODO |
| Storage Setup | 2 min | ⏳ TODO |
| Update Auth Flow | 10 min | ⏳ TODO |
| Test Complete Flow | 15 min | ⏳ TODO |
| Error Testing | 10 min | ⏳ TODO |
| **Total** | **52 min** | ⏳ TODO |

**Estimated Total Time: ~1 hour**

---

## Questions?

Check these files for details:
- `PROFILE_SETUP_GUIDE.md` - Comprehensive guide
- `SUPABASE_SCHEMA.sql` - Database schema
- `src/pages/ProfileSetup.jsx` - Component code
- `README.md` - General project info

---

**Last Updated**: February 17, 2026
**Version**: 1.0
