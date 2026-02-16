# GrabAjob - Quick Start Guide

## 🎯 Application Overview

GrabAjob is a complete job matching platform built with modern React, Tailwind CSS, and Framer Motion animations. The application is fully responsive and ready for production.

---

## 🌐 PUBLIC WEBSITE (No Login Required)

### Landing Page (`/`)
**What you see:**
- **Navbar** - Contains GrabAjob logo, navigation menu, Login/Create Account buttons
- **Hero Section** - "Find Jobs Faster. Hire Smarter." headline with animated floating job cards
- **Value Section** - 3 cards highlighting key features (Smart Job Matching, Resume Builder, Skill-Based Filtering)
- **Who Is It For** - Split section showcasing benefits for Job Seekers vs Recruiters
- **How It Works** - 4-step timeline (Sign Up → Complete Profile → Connect → Succeed)
- **CTA Section** - Blue gradient section with call-to-action buttons
- **Footer** - Links and branding

**Key Features:**
- Smooth scroll animations
- Floating animated cards
- Responsive mobile menu
- Glassmorphism design effects

---

## 🔐 AUTHENTICATION FLOW

### Sign Up Page (`/auth?tab=signup`)

**Step 1: Choose Your Role**
- Select "I'm Looking for a Job" OR "I'm Hiring Talent"
- Large interactive cards with emojis

**Step 2: Create Account**
- Email address input
- Password + confirm password
- Form validation
- Error handling

**Step 3: Complete Profile**

**If Job Seeker:**
- Select experience level (Fresher or Experienced)
- Enter location (City, Country)
- Add top skills (press Enter to add each skill)
- Skills appear as removable badges

**If Recruiter:**
- Enter company name
- Select company size (1-10, 10-50, 50-200, 200+)
- Enter primary hiring role
- Add work email

### Login Page (`/auth?tab=login`)
- Switch between Sign Up/Login tabs
- Email and password fields
- Sign in button
- Link to create account

---

## 👤 JOB SEEKER DASHBOARD

### Access
- **URL:** `http://localhost:5173/dashboard/seeker`
- **Auto-redirect:** After signup as job seeker, or login with job-seeker role

### Layout
- **Left Sidebar:** Navigation menu (6 items)
- **Top Bar:** Search bar + notifications bell
- **Main Content:** Dashboard view

### Sidebar Menu
1. **Dashboard** - Home page with stats and recommendations
2. **Jobs** - Browse all jobs with advanced filters
3. **Saved** - Bookmarked/saved jobs
4. **Resume** - Upload and manage resume
5. **Interviews** - Calendar of scheduled interviews
6. **Settings** - Account preferences

### Dashboard Home Tab
**Profile Completion Card**
- Circular progress indicator (70% example)
- Message: "Complete your profile to get better matches"

**Quick Stats Row**
- Applications Sent (12)
- Interviews Scheduled (2)
- Profile Views

**Recommended Jobs Section**
- 3 job cards showing:
  - Job title
  - Company name & location
  - Salary range
  - Match percentage
  - Apply button

### Jobs Tab
Detailed jobs listing with:
- **Search bar** - Search by title, company, or skill
- **Filters sidebar:**
  - Location input
  - Salary range slider ($0k - $200k)
  - Experience level checkboxes
  - Work type checkboxes
  - Clear filters button
- **Job listings** - Cards showing full job details

### Saved Tab
Shows saved/bookmarked jobs (placeholder in v1)

### Resume Tab
- Upload area for resume files
- Shows current resume status

### Interviews Tab
Calendar view of scheduled interviews (placeholder in v1)

### Settings Tab
Account preferences (placeholder in v1)

---

## 🏢 RECRUITER DASHBOARD

### Access
- **URL:** `http://localhost:5173/dashboard/recruiter`
- **Auto-redirect:** After signup as recruiter, or login with recruiter role

### Layout
- Similar to job seeker but tailored for recruitment
- Left sidebar + top bar + main content

### Sidebar Menu
1. **Overview** - Dashboard with metrics
2. **Posted Jobs** - Manage job listings
3. **Applicants** - Review applicants
4. **Post New Job** - Job posting form
5. **Settings** - Company preferences

### Overview Tab
**Stats Cards:**
- Active Jobs (5)
- Total Applicants (47, with 12 new this week)
- Hired (3)

**Recent Applicants Section:**
- Applicant name and target role
- Match percentage
- Status badge (New, Reviewing, Interview)
- View Profile button

### Posted Jobs Tab
Shows all posted jobs with:
- Job title
- Number of applicants
- Number of views
- Posted date
- View Job button

### Applicants Tab
View all applicants (placeholder in v1)

### Post New Job Tab
Form to create new job posting:
- Job Title
- Job Description
- Salary Range
- Location
- Required Skills (comma-separated)
- Post Job button

### Settings Tab
Company preferences (placeholder in v1)

---

## 👥 PROFILE PAGE

### Access
- Not directly routed in v1, but structure is ready at `src/pages/ProfilePage.jsx`

### Layout
- Full-width profile page
- Profile header with avatar
- Profile strength indicator (circular chart)
- Tab navigation
- Edit/Share buttons

### Profile Header
- Large avatar with initials
- First & Last name
- Title
- Location
- Profile Strength percentage (85% example)

### Tabs
1. **Overview** - About section (editable bio)
2. **Experience** - Work history with company, title, duration, description
3. **Education** - School, degree, field, graduation year
4. **Skills** - Skill tags with add/remove functionality
5. **Resume** - Resume file upload

### Features
- Edit mode toggle
- Inline editing for all sections
- Add/remove functionality
- Profile strength calculation

---

## 🎨 DESIGN & ANIMATIONS

### Color Scheme
- **Primary (Deep Blue):** #1e3a8a
- **Accent (Electric Blue):** #3b82f6
- **Background (Light Gray):** #f9fafb
- **Dark:** #0f172a

### Typography
- Headlines: Bold, large (4xl - 2xl)
- Body text: Medium weight, 16-18px
- Small text: Muted gray

### Visual Effects
- **Glass effect:** Frosted glass with backdrop blur
- **Gradient backgrounds:** Brand gradient overlays
- **Floating animations:** Cards bob up and down
- **Hover states:** Scale, shadow, and color changes
- **Smooth transitions:** 200-300ms animations

### Components
- **Buttons:** Primary (blue), Accent (light blue), Outline, Secondary
- **Input fields:** Rounded corners with focus states
- **Cards:** Bordered with hover elevation
- **Badges:** Small tag-style badges in various colors

---

## 📱 RESPONSIVE DESIGN

### Mobile (< 768px)
- Hamburger menu for sidebar
- Single column layouts
- Stacked cards
- Mobile-optimized buttons
- Touch-friendly spacing

### Tablet (768px - 1024px)
- 2-column layouts
- Visible sidebar on larger tablets
- Optimized spacing

### Desktop (> 1024px)
- Multi-column grids
- Sticky sidebar
- Full-width content areas

---

## 🔄 User Journey Examples

### New Job Seeker
1. Land on homepage (`/`)
2. Click "Get Started" or "Create Account"
3. Redirected to `/auth?tab=signup`
4. Step 1: Select "I'm Looking for a Job"
5. Step 2: Enter email, password
6. Step 3: Select experience, location, add skills
7. Click "Create Account"
8. Auto-redirect to `/dashboard/seeker`

### New Recruiter
1. Land on homepage (`/`)
2. Click "Hire Talent" or "Create Account"
3. Redirected to `/auth?tab=signup`
4. Step 1: Select "I'm Hiring Talent"
5. Step 2: Enter email, password
6. Step 3: Enter company info
7. Click "Create Account"
8. Auto-redirect to `/dashboard/recruiter`

### Existing User Login
1. Click "Login" on navbar
2. Redirected to `/auth?tab=login`
3. Enter email and password
4. Click "Sign In"
5. Auto-redirect to appropriate dashboard based on stored role

---

## 📊 Database & Backend Integration

The current build uses Supabase for authentication. You can extend it by:

### Next Steps
1. **Set up Supabase project**
   - Create tables for jobs, applicants, experiences, education
   - Set up row-level security

2. **Integrate API calls**
   - Replace mock data with real API calls
   - Add error handling

3. **Add backend endpoints**
   - Job posting API
   - Applicant tracking API
   - Profile update API
   - Search and filter APIs

---

## 🛠️ Troubleshooting

### Issue: Routes not working
- **Solution:** Ensure React Router is properly set up in App.jsx
- Check that component paths are correct

### Issue: Styles not applying
- **Solution:** Make sure Tailwind CSS is imported in index.css
- Rebuild CSS with `npm run dev`

### Issue: Animations not smooth
- **Solution:** Check if Framer Motion is installed
- Verify animation variants in component code

### Issue: Auth not working
- **Solution:** Ensure Supabase keys are configured
- Check localStorage for userRole

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main routing & protected routes |
| `src/index.css` | Global styles & design tokens |
| `src/pages/Landing.jsx` | Public landing page |
| `src/pages/Auth.jsx` | Authentication & onboarding |
| `src/pages/JobSeekerDashboard.jsx` | Job seeker home |
| `src/pages/JobsPage.jsx` | Job browsing & filters |
| `src/pages/ProfilePage.jsx` | User profile |
| `src/pages/RecruiterDashboard.jsx` | Recruiter home |
| `src/components/NavbarPublic.jsx` | Public navigation |
| `tailwind.config.js` | Tailwind configuration |

---

## 🚀 Next Features to Add

Priority v1+ features:
1. Resume upload to Supabase Storage
2. Real job data from database
3. Application tracking
4. Interview scheduling
5. Notifications
6. Email verification
7. Password reset
8. Social login (Google, LinkedIn)
9. User profile avatars
10. Analytics dashboard

---

## 💬 Support

For issues or questions:
1. Check the IMPLEMENTATION_GUIDE.md for detailed info
2. Review component code for inline comments
3. Test with browser DevTools
4. Check console for error messages

---

**Happy recruiting and job hunting! 🎉**
