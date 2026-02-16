# CreateAccountForm - Testing Guide

Complete testing guide for the CreateAccountForm component including unit tests, integration tests, and manual test cases.

## 🧪 Testing Overview

This guide covers:
- Manual testing procedures
- Unit test examples
- Integration test examples
- E2E test examples
- Performance testing
- Accessibility testing

## 📋 Manual Testing Checklist

### Pre-Test Setup
- [ ] `npm install` completed successfully
- [ ] Development server running (`npm run dev`)
- [ ] Demo form accessible at `http://localhost:5173/demo/create-account`
- [ ] Browser console open (F12)
- [ ] No JavaScript errors displayed

### Form Display Tests

#### Test 1: Component Renders
**Steps:**
1. Navigate to demo page
2. Observe form elements

**Expected Results:**
- [ ] Email input field visible
- [ ] Password input field visible
- [ ] Confirm password input field visible
- [ ] Create Account button visible
- [ ] Password strength indicator visible
- [ ] All labels properly displayed
- [ ] Responsive on mobile (test with DevTools)

#### Test 2: Initial State
**Steps:**
1. Load form page
2. Examine form state

**Expected Results:**
- [ ] All input fields are empty
- [ ] Create Account button is disabled (gray)
- [ ] No error messages visible
- [ ] No success message visible
- [ ] Password strength bar is empty/hidden

#### Test 3: Responsive Design
**Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test widths: 375px (mobile), 768px (tablet), 1024px (desktop)

**Expected Results:**
- [ ] Form stacks vertically on mobile
- [ ] Inputs are full width on mobile
- [ ] Form center-aligned on desktop
- [ ] No horizontal scroll
- [ ] Touch targets adequate on mobile (44px+)

---

### Email Validation Tests

#### Test 4: Valid Email
**Steps:**
1. Click email input
2. Type: `john.doe@example.com`
3. Tab to next field or wait 500ms

**Expected Results:**
- [ ] No error message shows
- [ ] CheckCircle icon appears (green)
- [ ] Field has green border
- [ ] Button remains disabled (other fields invalid)

#### Test 5: Invalid Email Format
**Steps:**
1. Click email input
2. Type: `notanemail`
3. Tab out or wait

**Expected Results:**
- [ ] Error message: "Please enter a valid email address"
- [ ] AlertCircle icon appears (red)
- [ ] Field has red border
- [ ] Button disabled

#### Test 6: Empty Email
**Steps:**
1. Click email input
2. Leave empty
3. Click elsewhere

**Expected Results:**
- [ ] Error message: "Email is required"
- [ ] AlertCircle icon shown
- [ ] Button disabled

#### Test 7: Special Characters in Email
**Steps:**
1. Type: `test+tag@example.co.uk`

**Expected Results:**
- [ ] Valid email accepted
- [ ] No error shown
- [ ] Green checkmark appears

#### Test 8: Email Already Exists (Server Error)
**Prerequisite:** Pass `serverError="Email already registered"`

**Steps:**
1. Fill all fields validly
2. Click Create Account

**Expected Results:**
- [ ] Server error banner shows
- [ ] Error text displays at top of form
- [ ] Button not disabled for retry

---

### Password Validation Tests

#### Test 9: Valid Strong Password
**Steps:**
1. Click password field
2. Type: `SecurePass123!`
3. Observe strength indicator

**Expected Results:**
- [ ] Strength bar shows full green
- [ ] Strength text shows "Strong"
- [ ] Requirements show:
  - [ ] ✓ 8+ characters
  - [ ] ✓ Number
  - [ ] ✓ Uppercase

#### Test 10: Weak Password (Too Short)
**Steps:**
1. Type: `abc123`
2. Observe strength indicator

**Expected Results:**
- [ ] Strength bar shows 1/3 (red)
- [ ] Text shows "Weak"
- [ ] Error message: "Password must be at least 8 characters"
- [ ] Button disabled
- [ ] Checklist shows:
  - [ ] ✗ 8+ characters (unfilled)

#### Test 11: Fair Password (Medium)
**Steps:**
1. Clear field
2. Type: `MyPassword`

**Expected Results:**
- [ ] Strength bar shows 2/3 (yellow)
- [ ] Text shows "Fair"
- [ ] Checklist shows:
  - [ ] ✓ 8+ characters
  - [ ] ✗ Number

#### Test 12: Password with Numbers
**Steps:**
1. Clear field
2. Type: `Password123`

**Expected Results:**
- [ ] Strength bar shows 3/3 (green) or "Strong"
- [ ] Number requirement checked

#### Test 13: Empty Password
**Steps:**
1. Click password field
2. Leave empty
3. Tab out

**Expected Results:**
- [ ] Error: "Password is required"
- [ ] Button disabled

#### Test 14: Password Visibility Toggle
**Steps:**
1. Type password: `SecurePass123`
2. Click eye icon
3. Observe field type
4. Click again

**Expected Results:**
- [ ] First click: password becomes visible (text type)
- [ ] Text shows as plain characters
- [ ] Icon changes to EyeOff
- [ ] Second click: password hidden again
- [ ] Icon changes back to Eye

---

### Confirm Password Tests

#### Test 15: Matching Passwords
**Steps:**
1. Password field: `SecurePass123`
2. Confirm password: `SecurePass123`
3. Wait for validation

**Expected Results:**
- [ ] Confirm field shows green checkmark
- [ ] No error message
- [ ] Green border on field

#### Test 16: Non-Matching Passwords
**Steps:**
1. Password field: `SecurePass123`
2. Confirm password: `DifferentPass`
3. Wait for validation

**Expected Results:**
- [ ] Error message: "Passwords do not match"
- [ ] AlertCircle icon shown
- [ ] Red border on confirm field
- [ ] Button disabled

#### Test 17: Empty Confirm Password
**Steps:**
1. Password: `SecurePass123`
2. Confirm password: empty

**Expected Results:**
- [ ] Error (after tab/change event): "Please confirm your password"

#### Test 18: Confirm Password Visibility
**Steps:**
1. Fill both password fields
2. Click confirm password eye icon

**Expected Results:**
- [ ] Confirm password visibility toggles independently
- [ ] Password visibility unaffected

---

### Form Submission Tests

#### Test 19: Submit Valid Form
**Steps:**
1. Email: `test@example.com`
2. Password: `TestPass123`
3. Confirm: `TestPass123`
4. Click Create Account
5. Observe button state

**Expected Results:**
- [ ] Button shows loading spinner
- [ ] Button text changes to "Creating account..."
- [ ] Button is disabled (can't click again)
- [ ] After 2-3 seconds: success message appears
- [ ] Form clears
- [ ] Success message auto-dismisses after 3 seconds

#### Test 20: Submit Invalid Form
**Steps:**
1. Leave email blank
2. Click Create Account button

**Expected Results:**
- [ ] Button remains disabled
- [ ] No submission occurs
- [ ] Error messages show for invalid fields

#### Test 21: Network Error Handling
**Prerequisite:** Pass `serverError="Network error. Please try again."`

**Steps:**
1. Fill form validly
2. Click submit
3. Observe error display

**Expected Results:**
- [ ] Error message shows at top of form
- [ ] Error is clearly visible
- [ ] Button is not disabled for retry
- [ ] User can correct and retry

#### Test 22: Form Reset After Success
**Steps:**
1. Complete valid submission
2. After success message
3. Check form state

**Expected Results:**
- [ ] All fields are empty
- [ ] Success message displays then fades
- [ ] Form ready for new entry

---

### Keyboard Navigation Tests

#### Test 23: Tab Navigation
**Steps:**
1. Load form
2. Press Tab repeatedly
3. Verify focus order

**Expected Results:**
- [ ] Focus moves through fields in order:
  - [ ] Email input
  - [ ] Password input
  - [ ] Password visibility toggle
  - [ ] Confirm password input
  - [ ] Confirm visibility toggle
  - [ ] Submit button
- [ ] Focus indicators visible (outline)
- [ ] Can Shift+Tab backwards

#### Test 24: Form Submission with Keyboard
**Steps:**
1. Fill all fields
2. Press Tab to reach button
3. Press Enter

**Expected Results:**
- [ ] Form submits
- [ ] Same behavior as mouse click

#### Test 25: Escape Key (if implemented)
**Steps:**
1. Click input field
2. Press Escape

**Expected Results:**
- [ ] Field focus maintained or cleared (design-dependent)
- [ ] No errors in console

---

### Browser Compatibility Tests

#### Test 26: Chrome/Edge
**Steps:**
1. Open in Chrome/Edge
2. Run through 5-10 tests above

**Expected Results:**
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

#### Test 27: Firefox
**Steps:**
1. Open in Firefox
2. Run through 5-10 tests above

**Expected Results:**
- [ ] All features work
- [ ] No console errors
- [ ] Styling matches Chrome

#### Test 28: Safari
**Steps:**
1. Open in Safari
2. Run through 5-10 tests above

**Expected Results:**
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct

---

## 🧑‍💻 Unit Tests

### Test Setup

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Basic Unit Test Example

```jsx
// CreateAccountForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateAccountForm from './CreateAccountForm'

describe('CreateAccountForm Component', () => {
  
  describe('Rendering', () => {
    it('should render all form elements', () => {
      render(<CreateAccountForm />)
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i }))
        .toBeInTheDocument()
    })

    it('should have submit button initially disabled', () => {
      render(<CreateAccountForm />)
      const button = screen.getByRole('button', { name: /create account/i })
      expect(button).toBeDisabled()
    })

    it('should render password strength indicator', () => {
      render(<CreateAccountForm />)
      expect(screen.getByText(/strength/i)).toBeInTheDocument()
    })
  })

  describe('Email Validation', () => {
    it('should show error for invalid email', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab()
      
      expect(screen.getByText(/valid email address/i)).toBeInTheDocument()
    })

    it('should accept valid email', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.type(emailInput, 'test@example.com')
      await user.tab()
      
      expect(screen.queryByText(/valid email/i)).not.toBeInTheDocument()
    })

    it('should show error for empty email', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      await user.click(emailInput)
      await user.tab()
      
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    })
  })

  describe('Password Validation', () => {
    it('should show error for password < 8 chars', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      await user.type(passwordInput, 'short')
      await user.tab()
      
      expect(screen.getByText(/at least 8 characters/i))
        .toBeInTheDocument()
    })

    it('should accept password >= 8 chars', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      await user.type(passwordInput, 'ValidPass123')
      await user.tab()
      
      expect(screen.queryByText(/at least 8 characters/i))
        .not.toBeInTheDocument()
    })

    it('should update password strength indicator', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      
      // Weak
      await user.type(passwordInput, 'abc')
      expect(screen.getByText(/weak/i)).toBeInTheDocument()
      
      // Clear and try fair
      await user.clear(passwordInput)
      await user.type(passwordInput, 'Moderate')
      expect(screen.getByText(/fair/i)).toBeInTheDocument()
      
      // Clear and try strong
      await user.clear(passwordInput)
      await user.type(passwordInput, 'Strong123')
      expect(screen.getByText(/strong/i)).toBeInTheDocument()
    })
  })

  describe('Confirm Password Validation', () => {
    it('should show error if passwords do not match', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'ValidPass123')
      await user.type(confirmInput, 'DifferentPass')
      await user.tab()
      
      expect(screen.getByText(/passwords do not match/i))
        .toBeInTheDocument()
    })

    it('should not show error if passwords match', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      const confirmInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'ValidPass123')
      await user.type(confirmInput, 'ValidPass123')
      await user.tab()
      
      expect(screen.queryByText(/passwords do not match/i))
        .not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should call onSubmit with form data when valid', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn()
      render(<CreateAccountForm onSubmit={mockSubmit} />)
      
      const form = screen.getByRole('button', { name: /create account/i })
        .closest('form')
      
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123')
      await user.type(screen.getByLabelText(/confirm/i), 'ValidPass123')
      
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'ValidPass123',
          confirmPassword: 'ValidPass123',
        })
      })
    })

    it('should not submit if form is invalid', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn()
      render(<CreateAccountForm onSubmit={mockSubmit} />)
      
      const button = screen.getByRole('button', { name: /create account/i })
      expect(button).toBeDisabled()
      
      await user.click(button)
      
      expect(mockSubmit).not.toHaveBeenCalled()
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      const slowSubmit = jest.fn(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )
      render(<CreateAccountForm onSubmit={slowSubmit} />)
      
      // Fill form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123')
      await user.type(screen.getByLabelText(/confirm/i), 'ValidPass123')
      
      // Submit
      const button = screen.getByRole('button', { name: /create account/i })
      await user.click(button)
      
      // Check loading state
      expect(screen.getByText(/creating account/i)).toBeInTheDocument()
      expect(button).toBeDisabled()
    })

    it('should display server error when provided', () => {
      render(<CreateAccountForm serverError="Email already exists" />)
      
      expect(screen.getByText(/email already exists/i))
        .toBeInTheDocument()
    })

    it('should display success message on successful submission', async () => {
      const user = userEvent.setup()
      const mockSubmit = jest.fn()
      render(
        <CreateAccountForm 
          onSubmit={mockSubmit}
          successMessage="Account created successfully!"
        />
      )
      
      // Fill and submit form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password/i), 'ValidPass123')
      await user.type(screen.getByLabelText(/confirm/i), 'ValidPass123')
      await user.click(screen.getByRole('button', { name: /create account/i }))
      
      // Success message should appear
      await waitFor(() => {
        expect(screen.getByText(/account created successfully/i))
          .toBeInTheDocument()
      })
    })
  })

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const passwordInput = screen.getByLabelText(/^password/i)
      
      // Starts as password type
      expect(passwordInput).toHaveAttribute('type', 'password')
      
      // Click eye icon
      const eyeButtons = screen.getAllByRole('button', { name: '' })
      // Find the password eye icon (first one)
      await user.click(eyeButtons[0])
      
      // Should be text type now
      expect(passwordInput).toHaveAttribute('type', 'text')
      
      // Click again
      await user.click(eyeButtons[0])
      
      // Back to password type
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('Accessibility', () => {
    it('should have proper labels', () => {
      render(<CreateAccountForm />)
      
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    })

    it('should have proper button text', () => {
      render(<CreateAccountForm />)
      
      expect(screen.getByRole('button', { name: /create account/i }))
        .toBeInTheDocument()
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<CreateAccountForm />)
      
      const emailInput = screen.getByLabelText(/email/i)
      
      // Initial focus
      emailInput.focus()
      expect(emailInput).toHaveFocus()
      
      // Tab to password
      await user.tab()
      const passwordInput = screen.getByLabelText(/^password/i)
      expect(passwordInput).toHaveFocus()
      
      // Tab to confirm
      await user.tab()
      const confirmInput = screen.getByLabelText(/confirm password/i)
      expect(confirmInput).toHaveFocus()
    })
  })
})
```

### Run Tests

```bash
npm test CreateAccountForm.test.jsx
```

---

## 🔗 Integration Tests

```jsx
// CreateAccountForm.integration.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateAccountForm from './CreateAccountForm'
import { BrowserRouter } from 'react-router-dom'

// Mock Supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
    },
  },
}))

describe('CreateAccountForm Integration', () => {
  it('should integrate with authentication flow', async () => {
    const user = userEvent.setup()
    const mockSubmit = jest.fn(async (data) => {
      // Simulate Supabase signup
      return { success: true }
    })

    render(
      <BrowserRouter>
        <CreateAccountForm onSubmit={mockSubmit} />
      </BrowserRouter>
    )

    // Complete form
    await user.type(screen.getByLabelText(/email/i), 'newuser@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'SecurePass123')
    await user.type(screen.getByLabelText(/confirm/i), 'SecurePass123')

    // Submit
    await user.click(screen.getByRole('button', { name: /create account/i }))

    // Verify submission
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled()
    })
  })
})
```

---

## 🎯 E2E Tests (Cypress)

```javascript
// cypress/e2e/signup.cy.js
describe('Sign Up Flow', () => {
  beforeEach(() => {
    cy.visit('/demo/create-account')
  })

  it('should complete successful signup', () => {
    // Fill form
    cy.get('input[type="email"]').type('newuser@example.com')
    cy.get('input[name="password"]').type('SecurePass123')
    cy.get('input[name="confirmPassword"]').type('SecurePass123')

    // Submit
    cy.contains('button', 'Create Account').click()

    // Verify success
    cy.contains('Account created').should('be.visible')
  })

  it('should show validation errors', () => {
    // Invalid email
    cy.get('input[type="email"]').type('invalidemail')
    cy.get('input[name="password"]').focus()

    // Error should appear
    cy.contains('valid email address').should('be.visible')
  })

  it('should toggle password visibility', () => {
    const passwordInput = cy.get('input[name="password"]')
    
    // Type password
    passwordInput.type('SecurePass123')
    passwordInput.should('have.attr', 'type', 'password')

    // Click eye icon
    cy.get('button[aria-label*="password"]').first().click()

    // Password should be visible
    passwordInput.should('have.attr', 'type', 'text')
  })
})
```

---

## ⚡ Performance Testing

### Lighthouse Audit
```bash
npm run build
npm run preview
# Open DevTools > Lighthouse > Generate report
```

### Expected Scores
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### Bundle Size
```bash
npm run build -- --report
```

Expected form component size: < 50KB

---

## ♿ Accessibility Testing

### Manual Testing

1. **Screen Reader**
   - Use NVDA (Windows) or VoiceOver (Mac)
   - Read through form top to bottom
   - All labels should be announced
   - Error messages should be associated with fields

2. **Keyboard Navigation**
   - Tab through all interactable elements
   - All buttons clickable via Enter/Space
   - Focus indicators visible
   - Logical tab order

3. **Color Contrast**
   - Use WebAIM Contrast Checker
   - All text should be WCAG AA compliant
   - Error colors distinguishable without color alone

### Automated Testing

```bash
# Install axe DevTools browser extension
# Or use: npm install --save-dev @axe-core/react

npm test -- --a11y
```

---

## 📊 Test Coverage Goals

| Area | Target |
|------|--------|
| Statements | 90%+ |
| Branches | 85%+ |
| Functions | 90%+ |
| Lines | 90%+ |

Check coverage:
```bash
npm test -- --coverage
```

---

## ✅ Pre-Launch Checklist

- [ ] All 25+ manual tests pass
- [ ] Unit tests: 90%+ coverage
- [ ] Integration tests pass
- [ ] E2E tests pass in Chrome, Firefox, Safari
- [ ] No console errors or warnings
- [ ] Performance score 90+
- [ ] Accessibility score 95+
- [ ] Mobile responsive verified
- [ ] Form submits to real API successfully
- [ ] Error handling works end-to-end
- [ ] Documentation complete
- [ ] Code reviewed by team

---

**Testing Guide Version:** 1.0.0
**Last Updated:** February 16, 2026
**Status:** Ready for Implementation ✅
