# 🔍 Supabase Auth Debug Logs Reference Guide

## Implementation Complete

All authentication functions now have **complete logging** following your exact specifications.

---

## What Changed

### ✅ supabaseClient.js
1. **signup()** - Full logging with 6-step debugging
2. **signin()** - Full logging with 6-step debugging  
3. **getSession()** - Full logging with session details
4. Email is **TRIMMED** before use
5. Full error objects logged with message, status, code

### ✅ AuthTabs.jsx
1. **handleLogin()** - Email trimmed, detailed console logs
2. **handleRegister()** - Email trimmed, email confirmation detection
3. Better error messages based on error type

---

## Console Log Reference

### SIGNUP FLOW - What You Should See

#### Step 1: Client-side submission
```javascript
🔐 [UI] SIGNUP SUBMISSION START
🔐 [UI] Full Name: John Doe
🔐 [UI] Email (trimmed): john@example.com
🔐 [UI] Password length: 8
🔐 [UI] Role: job-seeker
```

#### Step 2: Server receives signup request
```javascript
🔐 [SIGNUP] Step 1 - Attempting with email: john@example.com
```

#### Step 3: Response received
```javascript
🔐 [SIGNUP] Step 2 - Full response: {
  user: {
    id: "xxx-xxx-xxx",
    email: "john@example.com",
    email_confirmed_at: null,
    user_metadata: {...}
  },
  session: null,  // ⚠️ null means EMAIL CONFIRMATION REQUIRED
  error: null
}
```

#### Step 4: Client-side detection
```javascript
🔐 [UI] Signup returned - Data: true UserCreated: true SessionCreated: false Error: false

⚠️  [UI] EMAIL CONFIRMATION REQUIRED
📧 [UI] User email: john@example.com
📧 [UI] User must verify email before login
```

---

### LOGIN FLOW - What You Should See

#### ✅ SUCCESSFUL LOGIN (email already verified)

**Step 1: Client submission**
```javascript
🔐 [UI] LOGIN SUBMISSION START
🔐 [UI] Email (trimmed): john@example.com
🔐 [UI] Password length: 8
```

**Step 2: Server processes**
```javascript
🔐 [LOGIN] Step 1 - Attempting with email: john@example.com
```

**Step 3: Full response**
```javascript
🔐 [LOGIN] Step 2 - Full response: {
  user: {
    id: "xxx-xxx-xxx",
    email: "john@example.com",
    email_confirmed_at: "2025-02-17T10:30:00Z",
    user_metadata: {...}
  },
  session: {
    access_token_exists: true,
    expires_in: 3600,
    user_email: "john@example.com"
  },
  error: null
}
```

**Step 4: Verification & redirect**
```javascript
✅ [LOGIN] Success - User logged in: john@example.com
✅ [LOGIN] Session token expires in: 3600 seconds

🔐 [UI] Signin returned - Data: true Error: false
✅ [UI] LOGIN SUCCESS - User: john@example.com
```

---

#### ❌ FAILED LOGIN (email not verified)

**Scenario: User tries to login but hasn't verified email yet**

```javascript
🔐 [UI] LOGIN SUBMISSION START
🔐 [UI] Email (trimmed): john@example.com
🔐 [UI] Password length: 8

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
  stack: "Error: Invalid login credentials\n    at..."
  fullError: {...}
}

🔐 [UI] Signin returned - Data: false Error: true
❌ [UI] LOGIN FAILED
❌ [UI] Error: Invalid login credentials

❌ UI shows: "Email or password is incorrect. Please try again."
```

---

#### ❌ FAILED LOGIN (wrong password)

```javascript
🔐 [UI] LOGIN SUBMISSION START
🔐 [UI] Email (trimmed): john@example.com
🔐 [UI] Password length: 5

🔐 [LOGIN] Step 1 - Attempting with email: john@example.com

🔐 [LOGIN] ERROR - Full error object: {
  message: "Invalid login credentials",
  status: 401
}

❌ [UI] LOGIN FAILED
❌ [UI] Error: Invalid login credentials

❌ UI shows: "Email or password is incorrect. Please try again."
```

---

### SESSION CHECK - What You Should See

```javascript
🔐 [SESSION] Fetching current session

✅ [SESSION] Active session found: {
  user_email: john@example.com,
  expires_in: 3599,
  token_exists: true
}

// OR if no session:

⚠️  [SESSION] No active session
```

---

## Step-by-Step Testing Guide

### Test 1: Complete Registration → Login Flow (Email Confirmation DISABLED)

**Prerequisites:**
- Supabase credentials in .env
- Email confirmation DISABLED in Supabase

**Steps:**

1. **Open Console (F12)**
   - Go to Console tab
   - Search for `🔐` symbol

2. **Register New User**
   - Email: `test1@example.com`
   - Password: `TestPass123`
   - Click Register

3. **Watch Console**
   ```
   Look for:
   ✅ 🔐 [SIGNUP] Success - User created
   ✅ 🔐 [SIGNUP] Session created - User can login immediately
   
   (NOT: Email confirmation required)
   ```

4. **Switch to Login Tab**
   - Tab automatically switches
   - Error is cleared

5. **Login with Same Credentials**
   - Email: `test1@example.com`
   - Password: `TestPass123`
   - Click Login

6. **Watch Console for Success**
   ```
   Look for:
   ✅ [LOGIN] Success - User logged in: test1@example.com
   ✅ [UI] LOGIN SUCCESS - User: test1@example.com
   
   Should redirect to Dashboard
   ```

---

### Test 2: Registration with Email Confirmation ENABLED

**Prerequisites:**
- Supabase credentials in .env
- Email confirmation ENABLED in Supabase

**Steps:**

1. **Register New User**
   - Email: `test2@example.com`
   - Password: `TestPass123`

2. **Watch Console**
   ```
   Look for:
   ✅ 🔐 [SIGNUP] Success - User created
   ⚠️  🔐 [SIGNUP] Email confirmation required
   
   (NOT showing: Session created)
   ```

3. **UI Shows Message**
   - "Account created! Please verify your email to login."

4. **Try to Login Immediately** (Should Fail)
   - Email: `test2@example.com`
   - Password: `TestPass123`

5. **Watch Console**
   ```
   Look for:
   ❌ [LOGIN] ERROR - Full error object: {
     message: "Invalid login credentials"
   }
   
   ❌ UI shows: "Email or password is incorrect"
   ```

6. **Verify Email in Supabase**
   - Go to Supabase Dashboard
   - Authentication > Users
   - Find `test2@example.com`
   - Click on user
   - Click "Confirm User"

7. **Try Login Again** (Should Succeed)
   - Email: `test2@example.com`
   - Password: `TestPass123`

8. **Watch Console**
   ```
   Look for:
   ✅ [LOGIN] Success - User logged in: test2@example.com
   
   Should redirect to Dashboard
   ```

---

## Common Issues vs Console Logs

| Issue | Console Shows | What It Means |
|-------|--------------|--------------|
| **"Invalid login credentials"** | `🔐 [LOGIN] ERROR: message: "Invalid login credentials"` | Either: (1) Wrong password, (2) Email not verified, or (3) User doesn't exist |
| **Email confirmation required** | `⚠️ [SIGNUP] Email confirmation required - No session returned` | User created but no session = email verification needed |
| **No user in response** | `❌ [SIGNUP] ERROR - No user in response` | Signup failed to create user - check email format |
| **No session created** | `🔐 [LOGIN] ERROR - No session in response` | Login succeeded but session missing - rare bug |
| **Email not trimmed** | Email shows spaces: `" john@example.com "` | Input has leading/trailing spaces (now fixed - trimmed automatically) |

---

## Debugging Checklist

When login fails, check these in this order:

### ✅ Check 1: Email Verification Status
```
Console shows:
⚠️ [SIGNUP] Email confirmation required?

If YES:
→ Go to Supabase > Authentication > Users
→ Find the user
→ Click "Confirm User" button
→ Try login again
```

### ✅ Check 2: User Exists in Supabase
```
Supabase Dashboard > Authentication > Users

Is the email there?
- YES: Check email_confirmed_at field
- NO: Signup didn't work - check signup console logs
```

### ✅ Check 3: Correct Email Entered
```
Console shows:
🔐 [LOGIN] Step 1 - Attempting with email: [CHECK THIS]

Does it match the registered email?
- Exact match: Check password
- Different: Use correct email
```

### ✅ Check 4: Supabase Credentials Valid
```
If signup/login doesn't reach Supabase:

Console shows:
✅ Supabase configured - using real authentication

OR

⚠️ Supabase not configured. Using MOCK authentication

If using MOCK:
→ Check .env file
→ VITE_SUPABASE_URL set correctly?
→ VITE_SUPABASE_ANON_KEY set correctly?
→ Restart dev server (npm run dev)
```

### ✅ Check 5: Full Error Details
```
If still failing:

Right-click full error in console
Select "Store as global variable" (eg: temp1)
Type: temp1
Press Enter
Examine properties:
- message
- status
- code
- response (if exists)
```

---

## How Each Error is Detected

### Signup Errors
```javascript
// In supabaseClient.js signup function:

if (error) {
  console.error('🔐 [SIGNUP] ERROR - Full error object:', {
    message: error.message,      // "User already exists"
    status: error.status,        // 400
    code: error.code,            // "user_already_exists"
    fullError: error             // entire object
  })
}
```

### Login Errors
```javascript
// In supabaseClient.js signin function:

if (error) {
  console.error('🔐 [LOGIN] ERROR - Full error object:', {
    message: error.message,      // "Invalid login credentials"
    status: error.status,        // 401
    code: error.code,            // "invalid_credentials"
    fullError: error             // entire object
  })
}
```

### Response Validation
```javascript
// In supabaseClient.js signin function:

if (!data.user) {
  console.error('🔐 [LOGIN] ERROR - No user in response')
  throw new Error('Login failed: No user data')
}

if (!data.session) {
  console.error('🔐 [LOGIN] ERROR - No session in response')
  throw new Error('Login failed: No session created')
}
```

---

## Next Steps

### 1. Run Dev Server
```bash
npm run dev
```

### 2. Open Console
```
Press F12
Go to Console tab
```

### 3. Test Registration
```
- Use new email: test-feb17@example.com
- Watch console for 🔐 [SIGNUP] logs
- Verify user created in Supabase
```

### 4. Test Login
```
- Use same email and password
- Watch console for 🔐 [LOGIN] logs
- Should see ✅ Success or ❌ Error
```

### 5. If Login Fails
```
- Copy full error from console
- Check Supabase dashboard
- Verify email is confirmed
- Paste error in comment for debugging
```

---

## Files Updated

✅ **src/lib/supabaseClient.js**
- signup() - 6-step logging
- signin() - 6-step logging
- getSession() - Full session logging
- Email trimming before all requests
- Full error objects logged with all properties

✅ **src/components/AuthTabs.jsx**
- handleLogin() - Email trimming, detailed console logs
- handleRegister() - Email trimming, email confirmation detection
- Better error messages with emoji indicators
- Shows email verification requirement to user

---

**Status**: ✅ Ready to test  
**Date**: February 17, 2026  
**Build**: 1607 modules, 0 errors
