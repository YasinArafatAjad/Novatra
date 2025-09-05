import { useState } from 'react';
import { Layout } from '../components/Layout';
import { SEOHelmet } from '../components/SEOHelmet';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNotification } from '../contexts/NotificationContext';
import { useApi } from '../hooks/useApi';

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your password')
});

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { apiCall } = useApi();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(changePasswordSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiCall('/auth/change-password', {
        method: 'POST',
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }
      });
      
      showSuccess('Password changed successfully');
      reset();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHelmet 
        title="Change Password - T-Shirt"
        description="Update your account password"
      />
      <Layout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
            <p className="text-gray-600 mt-1">Update your account password for security</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  {...register('currentPassword')}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter your current password"
                />
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  {...register('newPassword')}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="Enter your new password"
                />
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  placeholder="Confirm your new password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Security Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Password Security Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center space-x-2">
                <span>✓</span>
                <span>Use at least 8 characters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✓</span>
                <span>Include uppercase and lowercase letters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✓</span>
                <span>Add numbers and special characters</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✓</span>
                <span>Avoid common words or personal information</span>
              </li>
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ChangePassword;