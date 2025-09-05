import { Link } from 'react-router-dom'
import { FiLock, FiHome, FiMail } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import SEOHelmet from '../components/SEOHelmet'

const NoAccess = () => {
  const { user } = useAuth()

  return (
    <>
      <SEOHelmet 
        title="Access Denied"
        description="You don't have permission to access this page"
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center px-4 pt-16 lg:pt-20">
        <div className="max-w-md w-full text-center">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-xl p-8 animate-bounce-in">
            {/* Icon */}
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiLock className="w-10 h-10 text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              {user 
                ? `Sorry, you don't have permission to access this page. Your current role (${user.role}) doesn't include the necessary permissions.`
                : 'You need to be logged in to access this page. Please sign in to continue.'
              }
            </p>

            {/* Actions */}
            <div className="space-y-4">
              <Link
                to="/"
                className="inline-flex items-center justify-center w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 btn-hover"
              >
                <FiHome className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>

              {!user && (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center w-full bg-gray-200 dark:bg-dark-700 hover:bg-gray-300 dark:hover:bg-dark-600 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Sign In
                </Link>
              )}

              <a
                href="mailto:support@techstyle.com"
                className="inline-flex items-center justify-center w-full text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 px-6 py-3 font-medium transition-colors duration-300"
              >
                <FiMail className="w-5 h-5 mr-2" />
                Contact Support
              </a>
            </div>

            {/* Additional Info */}
            {user && (
              <div className="mt-8 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Current User:</strong> {user.firstName} {user.lastName}
                  <br />
                  <strong>Role:</strong> {user.role}
                  <br />
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default NoAccess