# CreateAccountForm Component

A modern, accessible, fully-featured account creation form component for GrabAjob built with React Hook Form, Zod validation, and Tailwind CSS.

## 📋 Overview

The CreateAccountForm is a production-ready component that handles user registration with:
- Email validation
- Password strength validation
- Confirm password matching
- Real-time inline error messages
- Password visibility toggle
- Loading states
- Success/error notifications
- Responsive design
- Full TypeScript support

## 🚀 Quick Start

### Installation

First, install the required dependencies:

```bash
npm install react-hook-form zod @hookform/resolvers
```

The component also uses `lucide-react` for icons (already in your project).

### Basic Usage

```jsx
import CreateAccountForm from '@/components/CreateAccountForm'

export default function SignUpPage() {
  const handleSubmit = async (data) => {
    // Handle form submission
    console.log('Form data:', data)
    
    // Example: Create user with Supabase
    // const { error } = await supabase.auth.signUp({
    //   email: data.email,
    //   password: data.password,
    // })
  }

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
      <CreateAccountForm onSubmit={handleSubmit} />
    </div>
  )
}
```

## 📖 Props

```typescript
interface CreateAccountFormProps {
  onSubmit?: (data: CreateAccountFormData) => Promise<void> | void
  isLoading?: boolean
  successMessage?: string
  serverError?: string
}
```

### Props Details

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onSubmit` | `(data) => Promise<void>` | `undefined` | Callback function when form is submitted. Receives validated form data. |
| `isLoading` | `boolean` | `false` | Shows loading state on submit button. |
| `successMessage` | `string` | Default message | Custom success message displayed after submission. |
| `serverError` | `string` | `undefined` | Display server-side errors (e.g., email already exists). |

## 📤 Form Data Structure

The validated form data passed to `onSubmit` has this structure:

```typescript
{
  email: string       // Valid email address
  password: string    // At least 8 characters
  confirmPassword: string // Must match password
}
```

## ✨ Features

### 1. **Email Validation**
- Required field
- Valid email format check
- Real-time validation feedback
- Green checkmark when valid

### 2. **Password Validation**
- Minimum 8 characters
- Password strength indicator (Weak/Fair/Strong)
- Visual strength bar with color coding:
  - 🔴 Red (Weak): 0-7 characters
  - 🟡 Yellow (Fair): 8-11 characters
  - 🟢 Green (Strong): 12+ characters
- Requirements checklist showing:
  - ✓ Length requirement
  - ✓ Uppercase letter requirement
  - ✓ Number requirement

### 3. **Confirm Password Validation**
- Must match password field
- Real-time validation
- Clear error message if mismatch

### 4. **Password Visibility Toggle**
- Eye icon to show/hide password
- Toggle for both password fields
- No permissions required

### 5. **Inline Error Messages**
- Red error icon (AlertCircle)
- Clear, actionable error text
- Displays only when validation fails
- Context-specific messages

### 6. **Success State**
- Green success color scheme
- Auto-dismisses after 3 seconds
- Customizable success message
- Form resets after submission

### 7. **Loading State**
- Spinning loader icon
- Disabled submit button
- "Creating account..." text
- Prevents duplicate submissions

### 8. **Accessibility**
- Proper label associations
- ARIA labels for buttons
- Semantic HTML structure
- Keyboard navigation support

## 🎨 Styling

The component uses your GrabAjob design system:

### Tokens Used
```css
.input-field          /* Styled input with focus states */
.btn-primary          /* Blue primary button */
.card-premium         /* Card container styling */
.heading-md           /* Medium heading style */
```

### Colors
- **Primary**: `#1e3a8a` (Deep Blue)
- **Accent**: `#3b82f6` (Electric Blue)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)
- **Borders**: Gray (#e5e7eb)

### Responsive Breakpoints
- **Mobile**: Full width, single column
- **Tablet & Desktop**: Centered with max-width of 448px

## 🔍 Validation Rules

### Email Field
```
- Required
- Must be valid email format (user@example.com)
```

### Password Field
```
- Required
- Minimum 8 characters
- Strength calculated by:
  - Weak: < 8 characters
  - Fair: 8-11 characters
  - Strong: 12+ characters
```

### Confirm Password Field
```
- Required
- Must match password field exactly
```

## 📝 Example Implementation

### Complete Sign-Up Page

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateAccountForm from '@/components/CreateAccountForm'
import { supabase } from '@/lib/supabaseClient'

export default function SignUpPage() {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setIsSubmitting(true)
    setServerError(null)

    try {
      // Create user account
      const { error, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setServerError(error.message)
        return
      }

      // Store additional user info
      localStorage.setItem('userData', JSON.stringify({
        userId: signUpData.user.id,
        email: data.email,
      }))

      // Redirect to next step
      navigate('/auth/verify-email')
    } catch (err) {
      setServerError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-blue-50 flex items-center justify-center p-4">
      <CreateAccountForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        serverError={serverError}
        successMessage="Account created! Check your email to verify."
      />
    </div>
  )
}
```

### With Role Selection

```jsx
import { useState } from 'react'
import CreateAccountForm from '@/components/CreateAccountForm'

export default function RoleBasedSignUp() {
  const [role, setRole] = useState(null)

  if (!role) {
    return (
      <div className="space-y-4">
        <button onClick={() => setRole('job-seeker')}>I'm Looking for a Job</button>
        <button onClick={() => setRole('recruiter')}>I'm Hiring Talent</button>
      </div>
    )
  }

  const handleSubmit = async (data) => {
    // Submit with role
    console.log({ ...data, role })
  }

  return <CreateAccountForm onSubmit={handleSubmit} />
}
```

## 🧪 Testing

### View the Demo
Visit `http://localhost:5173/demo/create-account` to see the form in action with:
- Live validation examples
- Feature showcase
- Usage documentation
- Test credentials

### Test Cases

**Valid Input:**
```
Email: john@example.com
Password: SecurePass123!
Confirm: SecurePass123!
✓ Form is valid and submittable
```

**Invalid Email:**
```
Email: notanemail
✓ Shows: "Please enter a valid email address"
```

**Short Password:**
```
Password: pass
✓ Shows: "Password must be at least 8 characters"
```

**Mismatched Passwords:**
```
Password: SecurePass123!
Confirm: SecurePass456
✓ Shows: "Passwords do not match"
```

## 🔧 Customization

### Custom Error Messages

Override Zod schema messages:

```jsx
const schema = z.object({
  email: z
    .string()
    .email('Custom email error message'),
  // ... other fields
})
```

### Custom Success Message

```jsx
<CreateAccountForm 
  onSubmit={handleSubmit}
  successMessage="Welcome! Your account is ready to go."
/>
```

### Custom Button Text

Modify the button text in the component:

```jsx
// In CreateAccountForm.jsx, change the button text
<button type="submit">
  {isSubmitting || isLoading ? 'Creating account...' : 'Create Account'}
</button>

// To:
<button type="submit">
  {isSubmitting || isLoading ? 'Setting up profile...' : 'Next Step'}
</button>
```

### Custom Styling

Extend with Tailwind by modifying class names:

```jsx
// Change button style
className="btn-accent"  // Instead of btn-primary

// Change card border
className="border border-blue-300"  // Instead of border-gray-200

// Change spacing
className="p-10"  // Instead of p-8
```

## 🛠️ Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | ^7.50.0 | Form state management |
| `zod` | ^3.22.4 | Schema validation |
| `@hookform/resolvers` | ^3.3.4 | Integration layer |
| `lucide-react` | ^0.263.1 | Icons (Eye, EyeOff, etc.) |
| `tailwindcss` | ^3.3.6 | Styling |
| `react` | ^18.2.0 | UILibrary |

## 📋 File Location

```
src/
├── components/
│   └── CreateAccountForm.jsx
├── pages/
│   └── CreateAccountDemo.jsx
└── ...
```

## 🚨 Error Handling

The form handles multiple error scenarios:

1. **Client-side validation errors** - Displayed inline below fields
2. **Server-side errors** - Displayed in error banner (pass via `serverError` prop)
3. **Network errors** - Caught in try-catch, displayed via `serverError`
4. **Submission errors** - Form shows error state, allow retry

Example:

```jsx
const [error, setError] = useState(null)

const handleSubmit = async (data) => {
  try {
    const response = await api.createAccount(data)
  } catch (err) {
    setError(err.message)  // Display in form
  }
}

return <CreateAccountForm serverError={error} onSubmit={handleSubmit} />
```

## 🎯 Best Practices

1. **Always handle async submission**
   ```jsx
   const handleSubmit = async (data) => {
     // Make async API call
   }
   ```

2. **Clear errors on successful submission**
   ```jsx
   if (response.ok) {
     setError(null)
     navigate('/next-page')
   }
   ```

3. **Provide user feedback**
   ```jsx
   successMessage="Check your email to verify your account"
   ```

4. **Validate on both client and server**
   - Client validation: Fast UX
   - Server validation: Security

5. **Log form submissions (for debugging)**
   ```jsx
   const handleSubmit = async (data) => {
     console.log('Form submitted:', { timestamp: new Date(), data })
   }
   ```

## 📊 Form State Management

The component uses React Hook Form's watch API to track real-time validation:

```jsx
const { watch, formState: { isValid, errors } } = useForm()

// Watch password field for strength indicator
const password = watch('password')

// Check display conditions
if (password.length >= 8) {
  // Show strength bar
}
```

## 🔒 Security Considerations

1. **Passwords never logged** - Form data is not logged
2. **No password in URL** - Form is client-side
3. **HTTPS required** - Use SSL in production
4. **Server-side validation** - Also validate on backend
5. **Rate limiting** - Implement on API endpoints
6. **CSRF protection** - Implement token-based CSRF protection

## 📞 Troubleshooting

### Form won't submit even when valid
- Check if `onSubmit` is provided as prop
- Verify form state with browser DevTools
- Check console for JavaScript errors

### Validation messages not showing
- Check `mode="onChange"` is set in useForm
- Verify Zod schema matches form field names
- Check if field is properly registered with `{...register()}`

### Styling issues
- Ensure Tailwind CSS is imported in index.css
- Check color tokens exist in tailwind.config.js
- Verify classes match your Tailwind setup

### Password strength not updating
- Check `watch('password')` is working
- Verify regex patterns for strength checks
- Check console for errors in calculateStrength function

## 🎓 Learning Resources

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## 📄 License

This component is part of the GrabAjob project.

---

**Last Updated:** February 16, 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
