# 🔧 Supabase Dashboard Diagnostic Guide

## What to Check When Login Fails

### Step 1: User Exists in Supabase?

**Path**: Supabase Dashboard → Select Project → Authentication → Users

**What to look for**:
```
Email: test@example.com
Status: Should show user created
Last sign in: Will update after first login
```

**If user NOT there**:
- ❌ Signup failed silently
- Check console: `❌ [UI] SIGNUP FAILED` or `❌ [SIGNUP] ERROR`
- Read error message carefully

**If user IS there**:
- ✅ User was created
- Continue to Step 2

---

### Step 2: Is Email Confirmed?

**Path**: Supabase Dashboard → Authentication → Users → Click user

**Look at**: `email_confirmed_at` field

**If empty (null)**:
- ⚠️ Email confirmation is REQUIRED
- User must verify email before login
- **Solution**: 
  1. Check your email for verification link (may be in spam)
  2. Click verification link in email
  3. OR in Supabase dashboard, click "Confirm User" button
  4. Try login again

**If has date/time**:
- ✅ Email is confirmed
- Login should work
- If still fails, check Step 3

---

### Step 3: Supabase Credentials Correct?

**Path**: Supabase Dashboard → Project Settings → API → Project URL & Keys

**Check these in your .env file**:

```env
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc[very long string]...
```

**To verify they match**:

1. Copy Project URL from Dashboard
2. Paste in .env as VITE_SUPABASE_URL
3. Copy anon public key (not service_role)
4. Paste in .env as VITE_SUPABASE_ANON_KEY
5. Save .env
6. Restart dev server: `npm run dev`

**If these are wrong**:
- Dev server shows: `⚠️ Supabase not configured. Using MOCK authentication`
- Users can only login with MOCK credentials
- Real signup/login won't reach Supabase

---

### Step 4: Check Email Confirmation Setting

**Path**: Supabase Dashboard → Authentication → Providers → Email

**Look for**: Config settings

**Check**: Is "Confirm email" ENABLED or DISABLED?

**To DISABLE (for testing)**:
1. Click "Email" provider
2. Look for toggle/checkbox "Confirm email"
3. If ENABLED, click to DISABLE
4. Save changes
5. New signups won't require email verification

**Expected behavior after disabling**:
```javascript
// New user signup console output:
✅ [SIGNUP] Session created - User can login immediately
(NOT: Email confirmation required)

// User can login immediately after signup
```

---

## When Login Fails: Diagnostic Flow

### Scenario: User gets "Invalid login credentials"

**Step 1a**: Check console logs
```
Press F12 → Console tab
Look for: 🔐 [LOGIN] ERROR

Read the message exactly
```

**Step 1b**: Check Supabase Dashboard
```
Authentication → Users
Is the email there?
```

**Decision Tree**:

```
Is email in Supabase? 
  ├─ NO
  │  └─ Signup didn't work
  │     → Check: 🔐 [SIGNUP] ERROR in console
  │     → Read error message
  │
  └─ YES
     ├─ Is email confirmed?
     │  ├─ NO (email_confirmed_at is empty)
     │  │  └─ Email verification required
     │  │     → Click "Confirm User" in Supabase
     │  │     → OR check email for verification link
     │  │     → Try login again
     │  │
     │  └─ YES (has date/time)
     │     ├─ Is password correct?
     │     │  ├─ NO
     │     │  │  └─ Tell user correct password
     │     │  │
     │     │  └─ YES
     │     │     └─ Supabase misconfigured
     │     │        → Check credentials in .env
     │     │        → Verify API keys match
     │     │        → Restart dev server
     │     │        → Try again
```

---

## Quick Diagnostic Checklist

### 📋 When Nothing Works

**☐ Check 1: Can you see Console?**
```
Press F12
Should open DevTools with Console tab
If not: Try F12 on different part of screen
```

**☐ Check 2: Do you see Supabase logs?**
```
Look for: 🔐 [SIGNUP] or 🔐 [LOGIN]
If no:
  → Maybe Mock auth is enabled
  → Check console shows: ✅ Supabase configured
  → If shows: ⚠️ Using MOCK authentication
    → Your .env is wrong or missing
```

**☐ Check 3: User in Supabase?**
```
Go to: Supabase Dashboard > Authentication > Users
Can you see the email there?
- YES: Go to Check 4
- NO: Signup failed - read 🔐 [SIGNUP] ERROR
```

**☐ Check 4: Email confirmed?**
```
Click the user
Look at: email_confirmed_at
- Empty: Click "Confirm User" button
- Has date: Email confirmed ✅
```

**☐ Check 5: Password correct?**
```
In console, look for password length:
🔐 [UI] Password length: [NUMBER]

Is this the password you entered?
- Different number: You entered different password on retry?
- Same number: Password is correct
```

**☐ Check 6: Full error details?**
```
In console, look for:
🔐 [LOGIN] ERROR - Full error object: {...}

Expand the error object in console
Read every field:
- message
- status  
- code
- fullError (nested object)
```

---

## Email Verification Troubleshooting

### Test User Not Receiving Verification Email?

**In Supabase Dashboard**:

1. Go to: Authentication → Providers → Email
2. Look for: Email Templates
3. Click: "Confirm email" template
4. Check: Is template enabled?

**To manually confirm in Supabase**:
```
1. Go to: Authentication → Users
2. Find the user
3. Click on user
4. Look for: "Confirm User" button
5. Click it
6. User is now confirmed
7. They can login
```

**In your Supabase project (beginner setup)**:
- Email sending might not be configured
- You need to set up email provider (SendGrid, Resend, etc.)
- For testing: Just use "Confirm User" button in dashboard

---

## Console Log Interpretation Examples

### Example 1: Successful Signup (Email Confirmation Disabled)

```javascript
🔐 [UI] SIGNUP SUBMISSION START
🔐 [UI] Full Name: John Doe
🔐 [UI] Email (trimmed): john@example.com
🔐 [UI] Password length: 8
🔐 [UI] Role: job-seeker

🔐 [SIGNUP] Step 1 - Attempting with email: john@example.com

🔐 [SIGNUP] Step 2 - Full response: {
  user: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "john@example.com",
    email_confirmed_at: null,
    user_metadata: {...}
  },
  session: {                    // ← THIS EXISTS = no email confirmation required
    access_token_exists: true,
    expires_in: 3600
  },
  error: null
}

✅ [SIGNUP] Success - User created: john@example.com
✅ [SIGNUP] Session created - User can login immediately

🔐 [UI] Signup returned - Data: true SessionCreated: true Error: false
✅ [UI] SIGNUP SUCCESS - User: john@example.com
```

**Analysis**: ✅ Everything OK - user created and can login immediately

---

### Example 2: Signup with Email Confirmation Required

```javascript
🔐 [SIGNUP] Step 2 - Full response: {
  user: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "test@example.com",
    email_confirmed_at: null,
    user_metadata: {...}
  },
  session: null,                // ← NULL = email confirmation required
  error: null
}

✅ [SIGNUP] Success - User created: test@example.com
⚠️ [SIGNUP] Email confirmation required - No session returned
📧 User will need to verify email before login

🔐 [UI] Signup returned - Data: true SessionCreated: false Error: false
⚠️ [UI] EMAIL CONFIRMATION REQUIRED
📧 [UI] User email: test@example.com
```

**Analysis**: ⚠️ User created BUT needs to verify email before login

---

### Example 3: Login Failure - Wrong Password

```javascript
🔐 [UI] LOGIN SUBMISSION START
🔐 [UI] Email (trimmed): john@example.com
🔐 [UI] Password length: 5

🔐 [LOGIN] Step 1 - Attempting with email: john@example.com

🔐 [LOGIN] Step 2 - Full response: {
  user: null,
  session: null,
  error: {
    message: "Invalid login credentials",
    status: 401,
    code: "invalid_credentials"
  }
}

🔐 [LOGIN] ERROR - Full error object: {
  message: "Invalid login credentials",
  status: 401,
  code: "invalid_credentials",
  fullError: {...}
}

❌ [LOGIN] EXCEPTION - Full error object: {
  message: "Invalid login credentials",
  stack: "Error: Invalid login credentials\n    at [...]"
}

🔐 [UI] Signin returned - Data: false Error: true

❌ [UI] LOGIN FAILED
❌ [UI] Error: Invalid login credentials
```

**Analysis**: ❌ Wrong email or password

**What to do**:
1. User entered wrong password
2. User typed different email
3. Check spelled correctly
4. Try again

---

### Example 4: Supabase Not Configured (Using Mock Auth)

```javascript
⚠️ Supabase not configured. Using MOCK authentication for testing.
📝 Test credentials:
  Job Seeker: demo@grabajob.com / DemoPass123
  Recruiter: recruiter@grabajob.com / RecruiterPass123

📌 To configure real Supabase:
  1. Create project at supabase.com
  2. Copy API credentials from Settings > API
  3. Add to .env.local:
     VITE_SUPABASE_URL=your-url
     VITE_SUPABASE_ANON_KEY=your-key

// Then login attempts:
🔐 [LOGIN] Step 1 - Attempting with email: demo@grabajob.com

🔐 [LOGIN] Step 2 - Full response: {
  user: {...mock response...},
  session: {...mock session...},
  error: null
}

✅ [LOGIN] Success - User logged in: demo@grabajob.com
```

**Analysis**: 🟡 Using mock auth (for testing), not real Supabase

**To fix**:
1. Create Supabase account & project
2. Copy real API credentials
3. Add to .env in workspace root
4. Restart dev server: `npm run dev`

---

## Visual Debugging Map

```
User clicks "Login" in UI
    ↓
handleLogin() in AuthTabs.jsx
    ↓
Console: 🔐 [UI] LOGIN SUBMISSION START
Console: 🔐 [UI] Email (trimmed)
Console: 🔐 [UI] Password length
    ↓
Calls: auth.signin(email, password)
    ↓
In supabaseClient.js signin() function
    ↓
Console: 🔐 [LOGIN] Step 1
    ↓
Calls: supabase.auth.signInWithPassword()
    ↓
Supabase server processes request
    ↓
Console: 🔐 [LOGIN] Step 2 - Full response: {...}
    ↓
Check: Is error null?
  ├─ NO: Error occurred
  │  └─ Console: ❌ [LOGIN] ERROR
  │     └─ Console: ❌ [UI] LOGIN FAILED
  │
  └─ YES: Success
     └─ Console: ✅ [LOGIN] Success
```

---

## Supabase Settings to Know

### Location 1: Email Confirmation Setting
```
Supabase Dashboard
  → Authentication
     → Providers  
        → Email
           → Look for "Confirm email" toggle
           → DISABLE for testing (no email verification needed)
           → ENABLE for production (security)
```

### Location 2: Users List
```
Supabase Dashboard
  → Authentication
     → Users
        → See all registered users
        → Click user to see details
        → Can confirm email manually
        → Can see email_confirmed_at status
```

### Location 3: API Keys
```
Supabase Dashboard
  → Project Settings
     → API
        → Project URL (copy to VITE_SUPABASE_URL)
         → anon public key (copy to VITE_SUPABASE_ANON_KEY)
```

### Location 4: Email Templates
```
Supabase Dashboard
  → Authentication
     → Email Templates
        → "Confirm email" template
        → Check if enabled
        → Configure email provider if needed
```

---

## Common Issues Mapped to Solutions

| Issue | In Console | In Dashboard | Solution |
|-------|-----------|-------------|----------|
| **User can't login after signup** | `⚠️ Email confirmation required` | `email_confirmed_at: null` | Click "Confirm User" button |
| **Signup fails silently** | `❌ [SIGNUP] ERROR: user already exists` | User exists twice? | Use different email |
| **"Invalid login credentials"** | `❌ [LOGIN] ERROR: Invalid credentials` | Email confirmed ✅ | Check password spelled correctly |
| **Using mock auth** | `⚠️ Using MOCK authentication` | N/A | Add real Supabase credentials to .env |
| **User in Supabase but can't login** | `✅ User created` | `email_confirmed_at: null` | Need to confirm email or disable confirmation setting |

---

## Next Steps

1. **Before testing**:
   - Read this guide
   - Check .env has credentials
   - Check Supabase project exists

2. **While testing**:
   - Keep console open (F12)
   - Watch for 🔐 logs
   - Note exact error messages

3. **If stuck**:
   - Go to Supabase Dashboard
   - Check user exists
   - Check email_confirmed_at value
   - Use "Confirm User" if needed
   - Try login again

4. **For debugging**:
   - Read full error in console
   - Match error to table above
   - Follow solution
   - Test with test user first

---

**Status**: Ready to diagnose auth issues  
**Last Updated**: February 17, 2026  
**Created for**: GrabAjob Project
