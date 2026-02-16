import { useState } from 'react'
import CreateAccountForm from '../components/CreateAccountForm'

export default function CreateAccountDemo() {
  const [serverError, setServerError] = useState<string | null>(null)

  const handleFormSubmit = async (data) => {
    try {
      // Simulate API call
      console.log('Form submitted with data:', data)
      
      // Clear any previous errors
      setServerError(null)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // You can add your actual submission logic here
      // For example: await supabase.auth.signUp({ ...data })
      
      // If there's an error, set it:
      // setServerError('An account with this email already exists')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-blue-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-lg mb-3">Create Account Form</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Modern, accessible form component with real-time validation, password strength indicator, and smooth interactions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form Column */}
          <div className="flex justify-center">
            <CreateAccountForm 
              onSubmit={handleFormSubmit}
              serverError={serverError}
              successMessage="Welcome to GrabAjob! Check your email to verify your account."
            />
          </div>

          {/* Features Column */}
          <div className="space-y-8">
            <div>
              <h2 className="heading-sm mb-4">✨ Features</h2>
              <ul className="space-y-3">
                {[
                  'Real-time email validation',
                  'Password strength indicator (Weak/Fair/Strong)',
                  'Password visibility toggle',
                  'Confirm password matching validation',
                  'Inline error messages with icons',
                  'Success state indicator',
                  'Disabled submit button until form is valid',
                  'Loading spinner on submission',
                  'Password requirements checklist',
                  'Smooth animations & transitions',
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      ✓
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="heading-sm mb-3">🔧 Tech Stack</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><span className="font-semibold">Validation:</span> Zod schema validation</p>
                <p><span className="font-semibold">Forms:</span> React Hook Form</p>
                <p><span className="font-semibold">Styling:</span> Tailwind CSS</p>
                <p><span className="font-semibold">Icons:</span> Lucide React</p>
                <p><span className="font-semibold">State:</span> React Hooks (useState, useForm, watch)</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
              <h3 className="heading-sm mb-3">💡 Usage</h3>
              <pre className="text-xs bg-white p-4 rounded-lg overflow-x-auto border border-blue-100">
{`import CreateAccountForm from '@/components/CreateAccountForm'

export default function SignUpPage() {
  const handleSubmit = async (data) => {
    await api.createAccount(data)
  }

  return (
    <CreateAccountForm 
      onSubmit={handleSubmit}
      serverError={error}
    />
  )
}`}
              </pre>
            </div>

            <div className="bg-green-50 p-6 rounded-2xl border border-green-200">
              <h3 className="heading-sm mb-3">✅ Validation Rules</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><span className="font-semibold">Email:</span> Valid email format required</li>
                <li><span className="font-semibold">Password:</span> Minimum 8 characters</li>
                <li><span className="font-semibold">Confirm:</span> Must match password</li>
                <li><span className="font-semibold">Strength:</span> Visual indicator (Weak→Fair→Strong)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="mt-16 p-8 bg-white rounded-2xl border border-gray-200 shadow-lg">
          <h3 className="heading-sm mb-4">🧪 Try It Out</h3>
          <p className="text-gray-600 mb-4">Use these test inputs to try the form:</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Email</p>
              <code className="text-sm text-brand-primary break-all">john@example.com</code>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Password</p>
              <code className="text-sm text-brand-primary break-all">SecurePass123!</code>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-sm mb-2">Confirm</p>
              <code className="text-sm text-brand-primary break-all">SecurePass123!</code>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            💡 Note: The form validates in real-time. Try entering invalid data to see the validation in action.
          </p>
        </div>
      </div>
    </div>
  )
}
