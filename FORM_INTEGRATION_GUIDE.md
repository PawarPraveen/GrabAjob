# Form Component Integration Guide

A step-by-step guide to integrate the CreateAccountForm component into your existing authentication flow.

## 🎯 Integration Scenarios

### Scenario 1: Replace Auth.jsx Step 3 (Recommended)

The CreateAccountForm is designed to fit perfectly into the existing 3-step auth flow.

#### Step 1: Update Auth.jsx

Replace the form in Step 3 of the signup process with CreateAccountForm:

```jsx
import CreateAccountForm from '@/components/CreateAccountForm'

export default function Auth() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState(null)
  const [formData, setFormData] = useState({})
  const [serverError, setServerError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // ... existing code ...

  // Handle form submission from CreateAccountForm
  const handleCreateAccount = async (data) => {
    setIsLoading(true)
    setServerError(null)

    try {
      // Combine with previous form data
      const fullData = {
        ...formData,
        email: data.email,
        password: data.password,
        role: role,
      }

      // Sign up with Supabase
      const { data: signUpData, error: signUpError } = 
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { role: role },
          },
        })

      if (signUpError) {
        setServerError(signUpError.message)
        return
      }

      // Store user data
      localStorage.setItem('userData', JSON.stringify({
        userId: signUpData.user?.id,
        email: data.email,
        role: role,
      }))

      // Redirect based on role
      navigate(role === 'job-seeker' 
        ? '/dashboard/seeker' 
        : '/dashboard/recruiter')

    } catch (err) {
      setServerError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto">
      {/* ... existing steps 1-2 ... */}

      {/* Step 3: Account Creation */}
      {step === 3 && isSignup && (
        <CreateAccountForm
          onSubmit={handleCreateAccount}
          isLoading={isLoading}
          serverError={serverError}
        />
      )}
    </div>
  )
}
```

### Scenario 2: Standalone Sign-Up Page

Create a dedicated sign-up page using the form:

#### Step 1: Create Sign-Up Page

```jsx
// src/pages/SignUp.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateAccountForm from '@/components/CreateAccountForm'
import { supabase } from '@/lib/supabaseClient'

export default function SignUp() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const userRole = localStorage.getItem('userRole')

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { role: userRole },
        },
      })

      if (signUpError) throw signUpError

      // Success - redirect
      navigate(userRole === 'job-seeker' 
        ? '/dashboard/seeker' 
        : '/dashboard/recruiter')

    } catch (err) {
      setServerError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="heading-lg text-center mb-2">Create Your Account</h1>
        <p className="text-muted text-center mb-8">
          Join {userRole === 'job-seeker' ? 'job seekers' : 'recruiters'} on GrabAjob
        </p>
        
        <CreateAccountForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          serverError={serverError}
        />

        <p className="text-center text-muted text-sm mt-6">
          Already have an account?{' '}
          <a href="/auth" className="text-brand-primary font-medium hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  )
}
```

#### Step 2: Add Route to App.jsx

```jsx
import SignUp from './pages/SignUp'

// In your Routes:
<Route path="/signup" element={<SignUp />} />
```

### Scenario 3: Multi-Step with Form Integration

Create a role-based flow that uses the form:

```jsx
// src/pages/OnboardingFlow.jsx
import { useState } from 'react'
import CreateAccountForm from '@/components/CreateAccountForm'

export default function OnboardingFlow() {
  const [step, setStep] = useState('role') // role | profile | account
  const [role, setRole] = useState(null)
  const [profile, setProfile] = useState({})
  const [errors, setErrors] = useState(null)

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setStep('profile')
  }

  const handleProfileSubmit = (e) => {
    e.preventDefault()
    // Validate and save profile data
    setStep('account')
  }

  const handleAccountCreate = async (data) => {
    // Submit everything
    console.log({ role, profile, account: data })
  }

  return (
    <div className="min-h-screen bg-brand-light">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-brand-primary transition-all"
          style={{ width: `${(1 + (step === 'profile' ? 1 : step === 'account' ? 2 : 0)) / 3 * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          
          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div>
              <h1 className="heading-lg mb-8">What brings you here?</h1>
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelect('job-seeker')}
                  className="btn-primary w-full py-4 text-left flex items-center gap-3"
                >
                  <span>👤 I'm looking for a job</span>
                </button>
                <button
                  onClick={() => handleRoleSelect('recruiter')}
                  className="btn-primary w-full py-4 text-left flex items-center gap-3"
                >
                  <span>🏢 I'm hiring talent</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Profile Info */}
          {step === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <h1 className="heading-lg mb-6">Tell us about yourself</h1>
              
              {role === 'job-seeker' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Your Location</label>
                    <input 
                      type="text"
                      className="input-field w-full"
                      placeholder="City, Country"
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Experience Level</label>
                    <select className="input-field w-full">
                      <option>Fresher</option>
                      <option>Mid-level</option>
                      <option>Senior</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input 
                      type="text"
                      className="input-field w-full"
                      placeholder="Your company"
                      onChange={(e) => setProfile({...profile, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Industry</label>
                    <select className="input-field w-full">
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep('role')}
                  className="btn-outline flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Account Creation */}
          {step === 'account' && (
            <div>
              <h1 className="heading-lg mb-2">Create your account</h1>
              <p className="text-muted mb-8">Secure your account with a password</p>
              <CreateAccountForm onSubmit={handleAccountCreate} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

## 🔌 API Integration Pattern

### Basic Supabase Integration

```jsx
import { supabase } from '@/lib/supabaseClient'

const handleCreateAccount = async (data) => {
  try {
    // Sign up the user
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          // Store additional info in user metadata
          role: userRole,
          createdAt: new Date().toISOString(),
        }
      }
    })

    if (error) throw error

    // Create user profile in database
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: signUpData.user.id,
        email: data.email,
        role: userRole,
      })

    if (profileError) throw profileError

    // Success!
    navigate('/verify-email')

  } catch (err) {
    setServerError(err.message)
  }
}
```

### Express Backend Integration

```jsx
const handleCreateAccount = async (data) => {
  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        role: userRole,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Signup failed')
    }

    // Store token
    localStorage.setItem('authToken', result.token)
    navigate('/dashboard')

  } catch (err) {
    setServerError(err.message)
  }
}
```

## 📋 Integration Checklist

- [ ] CreateAccountForm component imported
- [ ] Submission handler created and tested
- [ ] Supabase/API connection configured
- [ ] Error handling implemented
- [ ] Loading states managed
- [ ] Post-signup redirect configured
- [ ] Form validation working
- [ ] Success message displays
- [ ] User data stored correctly
- [ ] Tested with real data
- [ ] Mobile responsive verified
- [ ] Accessibility tested

## 🧪 Testing Integration

### Unit Test Example

```jsx
import { render, screen, user } from '@testing-library/react'
import CreateAccountForm from '@/components/CreateAccountForm'

describe('CreateAccountForm', () => {
  it('submits valid form data', async () => {
    const mockSubmit = jest.fn()
    render(<CreateAccountForm onSubmit={mockSubmit} />)

    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'SecurePass123')
    await user.type(screen.getByLabelText(/confirm/i), 'SecurePass123')

    // Submit
    await user.click(screen.getByRole('button', { name: /create/i }))

    // Verify
    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'SecurePass123',
      confirmPassword: 'SecurePass123',
    })
  })

  it('shows error for mismatched passwords', async () => {
    render(<CreateAccountForm />)

    await user.type(screen.getByLabelText(/^password/i), 'SecurePass123')
    await user.type(screen.getByLabelText(/confirm/i), 'DifferentPass456')

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
  })
})
```

### E2E Test Example

```jsx
describe('Sign-Up Flow', () => {
  it('completes full signup process', () => {
    cy.visit('/')
    cy.contains('Create Account').click()
    cy.url().should('include', '/signup')

    // Fill form
    cy.get('input[type="email"]').type('newuser@example.com')
    cy.get('input[name="password"]').type('SecurePass123')
    cy.get('input[name="confirmPassword"]').type('SecurePass123')

    // Submit
    cy.contains('button', 'Create Account').click()

    // Verify redirect
    cy.url().should('include', '/dashboard')
    cy.contains('Welcome').should('be.visible')
  })
})
```

## 🐛 Common Issues & Solutions

### Issue: Form doesn't submit
**Solution:** Ensure `onSubmit` prop is passed as a function that handles the form data.

### Issue: Validation not working
**Solution:** Check that all input fields have correct `name` attributes that match the Zod schema.

### Issue: "Email already exists" error not showing
**Solution:** Pass the error via the `serverError` prop:
```jsx
<CreateAccountForm serverError={error} />
```

### Issue: Form not styling correctly
**Solution:** Verify Tailwind CSS is properly configured and all color tokens exist in `tailwind.config.js`.

## 📊 Comparison: Integration Approaches

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **Replace Step 3** | Native flow, less code | Requires Auth.jsx refactor | Existing 3-step flow |
| **Standalone Page** | Independent, reusable | Additional route needed | New signup feature |
| **Multi-step Flow** | Full control, custom UX | More complex code | Advanced onboarding |

## 🚀 Next Steps

1. **Install Dependencies**
   ```bash
   npm install react-hook-form zod @hookform/resolvers
   ```

2. **Test the Form**
   - Visit `http://localhost:5173/demo/create-account`
   - Test all validation scenarios

3. **Choose Integration Scenario**
   - Option 1: Replace Step 3 in Auth.jsx
   - Option 2: Create standalone signup page
   - Option 3: Build custom onboarding flow

4. **Implement and Test**
   - Add the form to your chosen location
   - Connect to API/Supabase
   - Test with real data

5. **Validate UX**
   - Test on mobile devices
   - Check accessibility with screen reader
   - Get feedback from users

---

**Document Version:** 1.0.0
**Last Updated:** February 16, 2026
**Status:** Ready for Integration ✅
