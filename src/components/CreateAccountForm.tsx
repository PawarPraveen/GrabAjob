import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react'

// Zod validation schema
const createAccountSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
)

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

interface CreateAccountFormProps {
  onSubmit?: (data: CreateAccountFormData) => Promise<void> | void
  isLoading?: boolean
  successMessage?: string
  serverError?: string
}

export default function CreateAccountForm({
  onSubmit,
  isLoading = false,
  successMessage,
  serverError,
}: CreateAccountFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    watch,
    reset,
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    mode: 'onChange',
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const handleFormSubmit = async (data: CreateAccountFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data)
      }
      setSubmitSuccess(true)
      reset()
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isPasswordValid = password && password.length >= 8
  const isConfirmPasswordValid = password && confirmPassword === password

  return (
    <div className="w-full max-w-md">
      <div className="card-premium bg-white rounded-2xl border border-gray-200 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-md mb-2">Create Account</h1>
          <p className="text-gray-600">Join GrabAjob and start your journey</p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-start gap-3">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900">Account created successfully!</p>
              <p className="text-sm text-green-700">
                {successMessage || 'Redirecting you to the next step...'}
              </p>
            </div>
          </div>
        )}

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className={`input-field transition-ring ${
                  errors.email
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {!errors.email && watch('email') && (
                <CheckCircle
                  size={20}
                  className="absolute right-3 top-3.5 text-green-500"
                />
              )}
            </div>
            {errors.email && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.email.message}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                {...register('password')}
                className={`input-field pr-10 transition-ring ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : isPasswordValid
                    ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {watch('password') && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        password.length < 8
                          ? 'w-1/3 bg-red-500'
                          : password.length < 12
                          ? 'w-2/3 bg-yellow-500'
                          : 'w-full bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <span className="text-xs font-semibold">
                    <span
                      className={
                        password.length < 8
                          ? 'text-red-600'
                          : password.length < 12
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }
                    >
                      {password.length < 8
                        ? 'Weak'
                        : password.length < 12
                        ? 'Fair'
                        : 'Strong'}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {errors.password && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.password.message}</span>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                {...register('confirmPassword')}
                className={`input-field pr-10 transition-ring ${
                  errors.confirmPassword
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : isConfirmPasswordValid
                    ? 'border-green-500 focus:ring-green-500/20 focus:border-green-500'
                    : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.confirmPassword.message}</span>
              </div>
            )}
          </div>

          {/* Password Requirements Checklist */}
          {watch('password') && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-3">Password requirements:</p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${
                      password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={password.length >= 8 ? 'text-green-700' : 'text-gray-600'}>
                    At least 8 characters
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${
                      /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={/[A-Z]/.test(password) ? 'text-green-700' : 'text-gray-600'}>
                    One uppercase letter
                  </span>
                </li>
                <li className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-white font-bold text-[10px] ${
                      /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={/[0-9]/.test(password) ? 'text-green-700' : 'text-gray-600'}>
                    One number
                  </span>
                </li>
              </ul>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || isSubmitting || isLoading}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
              !isValid || isSubmitting || isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary hover:shadow-lg hover:shadow-brand-primary/30'
            }`}
          >
            {isSubmitting || isLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/auth?tab=login"
                className="text-brand-primary font-semibold hover:text-brand-accent transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
          <p className="font-semibold text-gray-700 mb-1">Pro tip:</p>
          <p>Use a strong password with uppercase letters, numbers, and special characters for better security.</p>
        </div>
      </div>
    </div>
  )
}
