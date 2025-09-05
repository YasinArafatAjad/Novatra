import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { SEOHelmet } from '../components/SEOHelmet'

const resetSchema = yup.object({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
})

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { token } = useParams()
  const { user, resetPassword } = useAuth()
  const { showError, showSuccess } = useNotification()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(resetSchema)
  })

  if (user) {
    return <Navigate to="/" />
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await resetPassword(token, data.password)
      showSuccess('Password reset successfully!')
      setSuccess(true)
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <SEOHelmet 
          title="Password Reset Successful - Clothing Dashboard"
          description="Your password has been reset successfully"
        />
        <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-primary-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h2>
            <p className="text-gray-600 mb-6">Your password has been updated successfully.</p>
            <Link
              to="/login"
              className="inline-block bg-primary-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-500 transition-all duration-200"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHelmet 
        title="Reset Password - Clothing Dashboard"
        description="Reset your password to access your account"
      />
      <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-primary-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-bounce-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Enter your new password</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200"
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-500 focus:ring-4 focus:ring-primary-200 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>

            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default ResetPassword