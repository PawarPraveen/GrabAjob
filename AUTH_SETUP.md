# GrabAjob Authentication Setup Guide

## ✅ Quick Start - Testing Mode (No Supabase Required)

Your app now has **mock authentication** built in for testing! You can test the entire form flow without setting up Supabase first.

### Test Credentials

Use these credentials to test the application:

**Job Seeker Account:**
```
Email: demo@grabajob.com
Password: DemoPass123
Role: Job Seeker
```

**Recruiter Account:**
```
Email: recruiter@grabajob.com
Password: RecruiterPass123
Role: Recruiter
```

### Testing the Flow

1. **Navigate to Sign Up:**
   - Go to `http://localhost:5173/auth?tab=signup`

2. **Select Role:**
   - Click "I'm Looking for a Job" or "I'm Hiring Talent"

3. **Create Account:**
   - Email: `demo@grabajob.com` (or any new email)
   - Password: `DemoPass123` (or any 8+ character password)
   - Confirm Password: (must match)

4. **Complete Profile:**
   - Add experience level, location, skills (for job seeker)
   - Or company info (for recruiter)

5. **Submit:**
   - You'll be redirected to your dashboard

✅ **The mock auth will instantly "register" new accounts for testing!**

---

## 🔧 Setup Real Supabase (Optional - for Production)

When you're ready to use real authentication:

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up (free tier available)
3. Create new project
4. Wait for project to initialize (~1 minute)

### Step 2: Get API Credentials

1. In Supabase dashboard, go to **Settings > API** (left sidebar)
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **Anon Public key** (long alphanumeric string)

### Step 3: Update `.env.local`

Edit `d:\GrabAjob\.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (your anon key)
```

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

✅ Your app will now use real Supabase!

---

## 📋 Current Architecture

### How It Works

The authentication layer automatically detects your setup:

```
┌─────────────────────────────┐
│   Auth.jsx / Components     │
│     (useSupabase hook)      │
└──────────────┬──────────────┘
               │
       ┌───────▼────────┐
       │ supabaseClient │
       │   .js          │
       └────┬──────┬────┘
            │      │
     ┌──────▼──┐   └──────────────┐
     │ Supabase│ env vars present? │
     │ Real    │◄──────────────────┘
     │ Service │
     └─────────┘         OR
                    ┌──────────────┐
                    │ Mock Auth    │
                    │ for Testing  │
                    └──────────────┘
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/supabaseClient.js` | Main auth configuration |
| `src/lib/mockAuth.js` | Mock authentication for testing |
| `.env.local` | API credentials (gitignored) |

---

## 🚀 Testing Checklist

- [ ] Start dev server: `npm run dev`
- [ ] Navigate to `http://localhost:5173/auth`
- [ ] Click "Create Account"
- [ ] Select "Looking for a Job"
- [ ] Enter test email & password
- [ ] Complete profile with skills & location
- [ ] Click submit button
- [ ] Verify redirect to job seeker dashboard
- [ ] Test login with same credentials
- [ ] Try invalid email format (should show error)
- [ ] Try password < 8 characters (should show error)
- [ ] Try mismatched passwords (should show error)

---

## 🔄 Switching Between Mock and Real

### To Use Mock Auth (Current)

**No action needed!** If `VITE_SUPABASE_URL` is not set or invalid, mock auth activates automatically.

### To Use Real Supabase

1. Fill in `.env.local` with real credentials
2. Restart dev server
3. Real auth will be used automatically

### To Switch Back to Mock

```env
# Comment out or delete these lines in .env.local:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
```

---

## ✨ Mock Auth Features

✅ **Simulated Database** - Test user registration/login
✅ **Session Management** - Mimics real sessions
✅ **Error Handling** - Shows realistic error messages
✅ **Network Delay** - 500-1000ms delay simulates real API
✅ **Duplicate Prevention** - Can't sign up with existing email
✅ **Auto Test Credentials** - Pre-populated test accounts

---

## 🐛 Troubleshooting

### "Supabase not configured" warning in console

This is normal! It means mock auth is active. The app will work perfectly.

**To remove warning:** Configure real Supabase in `.env.local`

### Form doesn't submit

1. Check browser console for errors (F12)
2. Verify all required fields are filled
3. Ensure passwords match
4. Wait 1-2 seconds (network delay simulation)

### Need to reset mock auth

Mock users are stored in memory. They reset when you refresh the page or restart the dev server.

---

## 📚 Next Steps

1. **Now:** Test form UI/UX with mock auth
2. **Soon:** Configure real Supabase when ready
3. **Later:** Add email verification and password reset

---

## 💡 Production Notes

- **Never commit `.env.local`** - Already in `.gitignore`
- **Use environment variables** for sensitive data
- **Supabase is free** for up to 500MB data (more than enough for testing)
- **RLS (Row Level Security)** enabled by default (good for security)

---

**Status:** ✅ Ready to Test
**Auth Mode:** 🧪 Mock (Testing) / 🔒 Real Supabase (when configured)
**Documentation:** Complete
