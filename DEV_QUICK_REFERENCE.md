# GrabAjob Developer Quick Reference

## 🎯 Project Overview

GrabAjob is a modern job platform connecting job seekers with recruiters. Built with React 18, Vite, Tailwind CSS, and Supabase.

## 📁 Project Structure

```
GrabAjob/
├── src/
│   ├── components/
│   │   ├── AuthTabs.jsx           # Auth tab switcher
│   │   ├── InputField.jsx         # Reusable input component
│   │   ├── CreateAccountForm.jsx  # NEW: Form with validation
│   │   ├── Navbar.jsx             # Protected navbar
│   │   ├── NavbarPublic.jsx       # Public landing navbar
│   │   └── SocialLoginButtons.jsx # OAuth buttons
│   ├── pages/
│   │   ├── Auth.jsx               # 3-step auth flow
│   │   ├── Landing.jsx            # Public landing page
│   │   ├── Landing-simple.jsx     # Alternative landing
│   │   ├── CreateAccountDemo.jsx  # NEW: Form showcase
│   │   ├── JobSeekerDashboard.jsx # Seeker home
│   │   ├── JobsPage.jsx           # Job browse/filter
│   │   ├── ProfilePage.jsx        # Profile management
│   │   └── RecruiterDashboard.jsx # Recruiter home
│   ├── lib/
│   │   └── supabaseClient.js      # Supabase setup
│   ├── App.jsx                    # Routes, layout
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── public/
├── package.json                   # Dependencies
├── vite.config.js                 # Build config
├── tailwind.config.js             # Tailwind tokens
├── postcss.config.js              # PostCSS config
└── index.html                     # HTML template
```

## 🎨 Design System

### Colors

```javascript
// tailwind.config.js
Primary:    '#1e3a8a'  (Deep Blue)
Accent:     '#3b82f6'  (Electric Blue)
Light:      '#f9fafb'  (Off White)
Dark:       '#0f172a'  (Navy)
Success:    '#22c55e'  (Green)
Error:      '#ef4444'  (Red)
Warning:    '#eab308'  (Yellow)
```

### Typography Classes

```css
.heading-xl   /* Large heading */
.heading-lg   /* Medium-large heading */
.heading-md   /* Medium heading */
.heading-sm   /* Small heading */
.text-body    /* Body text */
.text-muted   /* Secondary text */
```

### Component Classes

```css
/* Buttons */
.btn-primary    /* Blue primary button */
.btn-secondary  /* Gray secondary button */
.btn-accent     /* Accent button */
.btn-outline    /* Outlined button */

/* Cards */
.card-base      /* Basic card */
.card-premium   /* Premium card with shadow */

/* Forms */
.input-field    /* Styled input */
.glass-effect   /* Frosted glass effect */
.glass-dark     /* Dark glass effect */

/* Badges */
.badge-primary  /* Blue badge */
.badge-accent   /* Accent badge */
```

### Animations

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.7); }
}

/* Usage */
.animate-float { animation: float 3s infinite; }
.animate-glow { animation: glow 2s infinite; }
```

## 🔑 Key Components

### CreateAccountForm (NEW)

**Location:** `src/components/CreateAccountForm.jsx`

**Purpose:** Modern account creation form with validation

**Features:**
- Email validation
- Password strength indicator
- Confirm password matching
- Inline error messages
- Password visibility toggle
- Loading states
- Success/error notifications

**Usage:**
```jsx
import CreateAccountForm from '@/components/CreateAccountForm'

<CreateAccountForm 
  onSubmit={handleSubmit}
  isLoading={false}
  serverError={null}
  successMessage="Account created!"
/>
```

**Props:**
```typescript
onSubmit?: (data: FormData) => Promise<void>
isLoading?: boolean
successMessage?: string
serverError?: string
```

### Navbar Components

**NavbarPublic** - For landing page
```jsx
import NavbarPublic from '@/components/NavbarPublic'
<NavbarPublic />
```

Features: Logo, nav links, login/signup buttons, mobile menu

**Navbar** - For authenticated pages
```jsx
import Navbar from '@/components/Navbar'
<Navbar>
  {/* Page content */}
</Navbar>
```

### InputField

Reusable input wrapper with labels
```jsx
<InputField 
  label="Email"
  type="email"
  placeholder="your@email.com"
/>
```

## 🛣️ Routes

### Public Routes
```
/                    → Landing page
/auth                → Auth flow (login/signup)
/demo/create-account → Form demo & documentation
```

### Protected Routes (Job Seeker)
```
/dashboard/seeker         → Dashboard & stats
/dashboard/seeker/jobs    → Browse & filter jobs
/dashboard/seeker/profile → Profile management
```

### Protected Routes (Recruiter)
```
/dashboard/recruiter      → Dashboard & metrics
/dashboard/recruiter/jobs → Posted jobs management
```

## 🔐 Authentication

### Supabase Setup

```javascript
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)
```

### Protected Route Pattern

```jsx
<ProtectedRoute>
  <JobSeekerDashboard />
</ProtectedRoute>
```

Checks session and user role before allowing access.

### Sign Up Flow
```jsx
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123',
  options: {
    data: { role: 'job-seeker' }
  }
})
```

### Sign In Flow
```jsx
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'SecurePassword123'
})
```

### Get Current Session
```jsx
const { data: { session } } = await supabase.auth.getSession()
const user = session?.user
```

### Sign Out
```jsx
await supabase.auth.signOut()
```

## 📦 Dependencies

### Core
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x.x"
}
```

### UI & Styling
```json
{
  "framer-motion": "^10.x.x",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.3.6"
}
```

### Forms & Validation (NEW)
```json
{
  "react-hook-form": "^7.50.0",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.4"
}
```

### Backend
```json
{
  "@supabase/supabase-js": "^2.x.x"
}
```

### Dev Tools
```json
{
  "vite": "^4.x.x",
  "postcss": "^8.x.x",
  "autoprefixer": "^10.x.x"
}
```

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 💾 Environment Variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🎯 Common Tasks

### Add New Page

```jsx
// src/pages/NewPage.jsx
import Navbar from '@/components/Navbar'

export default function NewPage() {
  return (
    <Navbar>
      <div className="container mx-auto p-4">
        {/* Content */}
      </div>
    </Navbar>
  )
}
```

Add to `App.jsx`:
```jsx
<Route path="/new-page" element={<NewPage />} />
```

### Add New Component

```jsx
// src/components/MyComponent.jsx
export default function MyComponent({ prop1, prop2 }) {
  return <div>{prop1} {prop2}</div>
}
```

### Style with Tailwind

```jsx
<div className="max-w-md mx-auto p-6 bg-brand-light rounded-lg shadow-lg">
  <h1 className="heading-lg mb-4">Title</h1>
  <p className="text-body text-muted">Content</p>
  <button className="btn-primary mt-4">Action</button>
</div>
```

### Add Animation

```jsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### Form with Validation

```jsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

export default function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  )
}
```

## 🔍 Debugging

### Check Session in Console
```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log(session)
```

### View LocalStorage
```javascript
console.log(localStorage.getItem('userData'))
console.log(localStorage.getItem('userRole'))
```

### React Router Debug
```jsx
// Enable React Router debugging
import { useLocation } from 'react-router-dom'

export default function MyComponent() {
  const location = useLocation()
  useEffect(() => {
    console.log('Location changed:', location)
  }, [location])
}
```

### Form State Debug
```jsx
import { useFormState } from 'react-hook-form'

const { isDirty, isValid, errors } = useFormState()
console.log({ isDirty, isValid, errors })
```

## 📱 Responsive Breakpoints

Tailwind CSS breakpoints (included by default):

```css
sm  640px
md  768px
lg  1024px
xl  1280px
2xl 1536px
```

**Usage:**
```jsx
<div className="p-4 md:p-8 lg:p-12">
  Responsive padding
</div>
```

## ♿ Accessibility Features

- Semantic HTML (`<button>`, `<form>`, `<header>`)
- ARIA labels for icons
- Focus management in forms
- Keyboard navigation support
- Color contrast meets WCAG AA
- Form error associations

## 🧪 Testing Resources

### Run Demo Form
Visit: `http://localhost:5173/demo/create-account`

### Test Accounts
```
Email: demo@grabajob.com
Password: DemoPass123!

Email: recruiter@grabajob.com
Password: RecruiterPass123!
```

## 📚 Documentation Files

- **FORM_COMPONENT_DOCS.md** - CreateAccountForm detailed docs
- **FORM_INTEGRATION_GUIDE.md** - Integration patterns and examples
- **QUICK_START.md** - User journey guide
- **IMPLEMENTATION_GUIDE.md** - Technical architecture

## 🔗 Useful Links

- [React 18 Docs](https://react.dev)
- [React Router v6](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)
- [Supabase](https://supabase.com)
- [Lucide Icons](https://lucide.dev)

## 💡 Best Practices

1. **Components**: Keep them small and focused
2. **Styling**: Use Tailwind classes + design system
3. **State**: Use localStorage for user data, Context for app state
4. **Forms**: Always validate client-side and server-side
5. **Security**: Never store tokens in localStorage in production
6. **Performance**: Code split routes with React.lazy()
7. **Accessibility**: Test with keyboard navigation

## 🐛 Troubleshooting

### Tailwind not applying
- Rebuild: `npm run dev`
- Clear cache: Delete `.next` or `dist` folder
- Check config: `tailwind.config.js` extends properly

### Supabase auth not working
- Check environment variables in `.env.local`
- Verify session with `supabase.auth.getSession()`
- Check browser console for errors

### Routes not working
- Check route path spelling
- Verify component imports
- Check ProtectedRoute wrapper logic

### Form validation not working
- Verify Zod schema field names match input names
- Check `mode="onChange"` is set
- Inspect `useForm` options

## 📞 Getting Help

1. Check documentation files in project root
2. Review existing component implementations
3. Check React/Tailwind/Supabase official docs
4. Search workspace for similar implementations

---

**Quick Reference Version:** 1.0.0
**Last Updated:** February 16, 2026
**Status:** Complete & Ready ✅
