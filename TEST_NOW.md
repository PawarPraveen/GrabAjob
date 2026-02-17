# 🧪 AUTH DEBUGGING - HOW TO TEST NOW

## Dev Server Status: ✅ RUNNING

```
Local: http://localhost:5175
Port: 5175
Status: Ready to test
```

---

## Quick Test Plan (5 minutes)

### Step 1: Open the App
```
1. Go to: http://localhost:5175
2. Should see GrabAjob landing page
3. Click "Sign In" or "Get Started"
```

### Step 2: Open Browser Console
```
1. Press: F12 (or Ctrl+Shift+I)
2. Click: "Console" tab
3. Should see startup logs
```

### Step 3: Test Registration
```
Email:    test-feb17-001@example.com
Password: TestPass123
Full Name: Test User
Role: Job Seeker
☑ Agree to terms

Click: Register
```

### Step 4: Watch Console for Logs
```
Look for these logs (in order):

🔐 [UI] SIGNUP SUBMISSION START
🔐 [UI] Full Name: Test User
🔐 [UI] Email (trimmed): test-feb17-001@example.com
🔐 [UI] Password length: 11
🔐 [UI] Role: job-seeker

🔐 [SIGNUP] Step 1 - Attempting...
🔐 [SIGNUP] Step 2 - Full response: {...}

Then either:
✅ [SIGNUP] Success - User created [email]
✅ [SIGNUP] Session created (can login immediately)
OR
✅ [SIGNUP] Success - User created [email]
⚠️ [SIGNUP] Email confirmation required
📧 User will need to verify email
```

### Step 5: Test Login
```
Once registration is done, tab switches to Login

Email:    test-feb17-001@example.com
Password: TestPass123

Click: Login
```

### Step 6: Watch Console for Login Logs
```
🔐 [UI] LOGIN SUBMISSION START
🔐 [UI] Email (trimmed): test-feb17-001@example.com
🔐 [UI] Password length: 11

🔐 [LOGIN] Step 1 - Attempting...
🔐 [LOGIN] Step 2 - Full response: {...}

If successful:
✅ [LOGIN] Success - User logged in: test-feb17-001@example.com
✅ [LOGIN] Session token expires in: 3600
🔐 [UI] Signin returned - Data: true Error: false
✅ [UI] LOGIN SUCCESS

If failed:
❌ [LOGIN] ERROR - Full error object: {...}
❌ [UI] LOGIN FAILED
❌ [UI] Error: Invalid login credentials
```

---

## Detailed Test Scenarios

### Scenario A: Email Confirmation DISABLED (Easiest)

**Expected**: User can login immediately after signup

**Steps**:
1. Open console
2. Register with new email: `test-a@example.com`
3. Watch for: `✅ Session created`
4. Login should work immediately

**If Works**: ✅ Perfect - email confirmation is disabled
**If Fails**: 
- Check console for error messages
- Go to Supabase Dashboard
- Verify user exists
- Check `email_confirmed_at` field

---

### Scenario B: Email Confirmation ENABLED (Production-like)

**Expected**: User created but can't login until email verified

**Steps**:
1. Register with new email: `test-b@example.com`
2. Watch for: `⚠️ Email confirmation required`
3. Try login immediately (should fail)
4. Go to Supabase Dashboard
5. Find user, click "Confirm User" button
6. Try login again (should work)

**If Works**: ✅ Perfect - email confirmation flow working

---

### Scenario C: Wrong Password

**Expected**: Login fails with clear error

**Steps**:
1. Register: `test-c@example.com` / `Password123`
2. Try login with wrong password: `WrongPassword`
3. Should see: `❌ Email or password is incorrect`
4. Console shows: `Invalid login credentials`

**If Works**: ✅ Perfect - error handling working

---

### Scenario D: Wrong Email

**Expected**: User to get "No account found" error

**Steps**:
1. Register: `test-d@example.com` / `Password123`
2. Try login with different email: `wrong@example.com` / `Password123`
3. Should see: `❌ No account found`

**If Works**: ✅ Perfect - validation working

---

## Full Test Grid

| Test | Email | Password | Expected | Status |
|------|-------|----------|----------|--------|
| **A1** | new@test.com | Test123 | Signup + login works | 🔲 |
| **A2** | new@test.com | Test123 | 2nd login works | 🔲 |
| **A3** | new@test.com | Wrong123 | Error: wrong password | 🔲 |
| **A4** | wrong@test.com | Test123 | Error: no account | 🔲 |
| **A5** | new@test.com | Test123 | Logout works | 🔲 |
| **A6** | new@test.com | Test123 | Profile page loads | 🔲 |

---

## What Each Console Log Means

### 🟢 GREEN LOGS (✅ Success)

```javascript
✅ [SIGNUP] Success - User created
✅ [SIGNUP] Session created
✅ [LOGIN] Success - User logged in
✅ [SESSION] Active session found
```

**Action**: Continue - everything working ✅

---

### 🔴 RED LOGS (❌ Error)

```javascript
❌ [LOGIN] ERROR - Full error object: { message: "..." }
❌ [SIGNUP] EXCEPTION - Full error
❌ [UI] LOGIN FAILED
```

**Action**: Read error message, check Supabase dashboard

---

### 🟡 YELLOW LOGS (⚠️ Warning)

```javascript
⚠️ [SIGNUP] Email confirmation required
⚠️ [SESSION] No active session
📧 User will need to verify email
```

**Action**: Normal flow - may need to confirm email or set something up

---

### 🔵 BLUE LOGS (ℹ️ Info)

```javascript
🔐 [UI] LOGIN SUBMISSION START
🔐 [LOGIN] Step 1 - Attempting
🔐 [LOGIN] Step 2 - Full response
```

**Action**: Just informational - track progress of request

---

## Troubleshooting During Testing

### Problem: Signup works but login fails

**Check console for**:
```
⚠️ Email confirmation required
```

**Solution**:
1. Go to Supabase Dashboard
2. Find user
3. Click "Confirm User"
4. Try login again

---

### Problem: No console logs at all

**Check**:
1. Is F12 console actually open? Press F12
2. Is it showing Console tab? Click "Console"
3. Filter by email you're testing? Type in search
4. Should show 🔐 logs

**If no logs**:
- Maybe using mock auth (⚠️ in console on startup)
- Check .env for Supabase credentials
- Restart dev server

---

### Problem: Getting "Invalid login credentials"

**Check these in order**:
1. Is password spelled exactly right? (Case sensitive)
2. Is email correct? Check typos
3. Did user actually sign up successfully? Check console for ✅ 
4. Is email confirmed? Check Supabase dashboard

---

### Problem: Signup shows error "already registered"

**Solution**:
- Use a different email
- Or go to Supabase and delete the test user

---

### Problem: "Using MOCK authentication"

**This means**:
- Real Supabase isn't connected
- .env is missing or wrong

**Fix**:
1. Check .env file in `d:\GrabAjob\`
2. Make sure it has:
   ```
   VITE_SUPABASE_URL=https://[project].supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. If missing: Copy from Supabase Dashboard
4. Save .env
5. Restart dev server: `npm run dev`

---

## How to Read Error Details

### In Console, When Error Occurs:

```javascript
❌ [LOGIN] ERROR - Full error object: {
  message: "Invalid login credentials",
  status: 401,
  code: "invalid_credentials",
  fullError: {...}
}
```

**How to expand**:
1. Right-click the error log line
2. Select "Store as global variable"
3. It will show as `temp1`, `temp2`, etc.
4. Type: `temp1`
5. Press Enter
6. Expand the object to see all properties

**Look for**:
- `message` - what actually went wrong
- `status` - HTTP status code
  - 401 = Unauthorized (wrong credentials)
  - 400 = Bad request (invalid input)
  - 500 = Server error (Supabase problem)
- `code` - error type identifier

---

## Console Log Cheatsheet

Copy/paste to search in console:

```
🔐 [SIGNUP]     👉 See all signup logs
🔐 [LOGIN]      👉 See all login logs
🔐 [SESSION]    👉 See all session logs
✅ [SIGNUP]     👉 See signup successes
✅ [LOGIN]      👉 See login successes
❌ [UI]         👉 See all UI errors
⚠️              👉 See all warnings
📧              👉 See email-related messages
```

---

## Logging to Report Issues

If something doesn't work, capture this info:

### Screenshot Info:
1. Full error message from UI (what user sees)
2. Full error from console (what system sees)

### Console Info:
1. Find error with ❌ or ⚠️
2. Right-click → "Copy object"
3. Paste in report/issue

### Example Report:
```
Email tested: test@example.com
Action: Click login button
Expected: Login successful
Actual: Error message appears

Console shows:
❌ [LOGIN] ERROR - Full error object: {
  message: "Invalid login credentials",
  status: 401,
  code: "invalid_credentials"
}

Supabase Dashboard:
- User exists: YES ✅
- Email confirmed: YES ✅
- Account active: YES ✅
```

---

## Quick Reference - Expected Outputs

### ✅ PERFECT - Email Confirmation DISABLED

```
Registration:
✅ [SIGNUP] Step 2 - Full response: { user: {...}, session: {...} }
✅ [SIGNUP] Success - User created: test@example.com
✅ [SIGNUP] Session created - User can login immediately

Login:
✅ [LOGIN] Step 2 - Full response: { user: {...}, session: {...} }
✅ [LOGIN] Success - User logged in: test@example.com
✅ [UI] LOGIN SUCCESS - User: test@example.com

Redirects to: /dashboard ✅
```

### ⚠️ NORMAL - Email Confirmation ENABLED

```
Registration:
✅ [SIGNUP] Success - User created: test@example.com
⚠️ [SIGNUP] Email confirmation required - No session returned
📧 User will need to verify email before login

(UI shows: "Account created! Verify email to login.")

After confirming in Supabase:
Login works fine:
✅ [LOGIN] Success - User logged in: test@example.com
```

### ❌ ERROR - Wrong Password

```
Login:
❌ [LOGIN] ERROR - Full error object: {
  message: "Invalid login credentials",
  status: 401
}

(UI shows: "Email or password is incorrect")
```

---

## Step-by-Step: First Test

**Time required**: ~3 minutes

```
1. [00:00] Point browser to http://localhost:5175
2. [00:10] Press F12 to open console
3. [00:20] Click "Get Started" button
4. [00:30] Scroll to Register tab
5. [00:40] Fill in form:
           Email: test-first@example.com
           Password: TestPass123
           Full Name: First Test
           Role: Job Seeker
           Check: Agree to terms
6. [01:00] Click Register
7. [01:15] Watch console for 🔐 logs - write down what you see
8. [01:30] Click Login tab
9. [01:40] Enter same email/password
10. [02:00] Click Login
11. [02:30] Watch console - write down what happens
12. [03:00] Report what you saw
```

---

## Files to Review Before Testing

**Read in this order**:
1. **CRITICAL_DEBUG_COMPLETE.md** - Overview of what was changed ← START HERE
2. **AUTH_QUICK_FIX.md** - Quick fixes if needed
3. **AUTH_DEBUG_LOGS_REFERENCE.md** - What each log means
4. **SUPABASE_DASHBOARD_GUIDE.md** - How to check Supabase
5. **This file** - How to test

---

## Questions to Answer After Testing

1. **Did signup work?** YES / NO
   - If YES: See ✅ [SIGNUP] Success in console?
   - If NO: See ❌ [SIGNUP] ERROR in console?

2. **Did login work?** YES / NO
   - If YES: Redirected to /dashboard?
   - If NO: See error message in UI?

3. **What email confirmation status?**
   - Email confirmation required? YES / NO
   - Check in Supabase: email_confirmed_at field

4. **Any errors?**
   - Copy full error from console
   - Note exact error message

---

**Status**: Ready to test ✅  
**Dev Server**: Running on port 5175 ✅  
**Console Logging**: Enabled with 🔐 prefixes ✅  
**Error Logging**: Full error objects captured ✅  
**Time to first test**: 5 minutes ⏱️
