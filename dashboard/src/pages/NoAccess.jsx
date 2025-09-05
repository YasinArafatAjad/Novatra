import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { SEOHelmet } from '../components/SEOHelmet'

const NoAccess = () => {
  const { user, logout } = useAuth()
  const { isDark } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleContactAdmin = () => {
    window.location.href = 'mailto:admin@T-Shirt.com?subject=Access Request&body=Hello Admin,%0D%0A%0D%0AI need access to additional features in the dashboard.%0D%0A%0D%0AUser: ' + user?.email + '%0D%0ACurrent Role: ' + user?.role + '%0D%0A%0D%0AThank you.'
  }

  return (
    <>
      <SEOHelmet 
        title="Access Denied - T-Shirt"
        description="You don't have permission to access this page"
      />
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-red-50 to-red-100'
      }`}>
        <div className={`max-w-md w-full rounded-2xl shadow-xl p-8 text-center animate-bounce-in ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <div className="text-red-500 text-6xl mb-6">🔒</div>
          
          <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Access Denied
          </h1>
          
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            You don't have permission to access this page. Your current role ({user?.role}) doesn't include the necessary permissions.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleContactAdmin}
              className="w-full bg-primary-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-500 transition-colors"
            >
              📧 Contact Administrator
            </button>
            
            <button
              onClick={() => window.history.back()}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isDark 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              ← Go Back
            </button>

            <button
              onClick={handleLogout}
              className={`w-full py-2 px-4 rounded-lg text-sm transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:text-gray-300' 
                  : 'text-gray-600 hover:text-gray-500'
              }`}
            >
              Logout
            </button>
          </div>

          <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-900'}`}>Need Help?</h3>
            <div className={`text-sm space-y-1 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
              <p>📧 Email: <a href="mailto:admin@T-Shirt.com" className="underline hover:text-blue-600">admin@T-Shirt.com</a></p>
              <p>📞 Phone: <a href="tel:+1-234-567-8900" className="underline hover:text-blue-600">+1-234-567-8900</a></p>
              <p className={`text-xs mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Support hours: Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>

          <div className={`mt-6 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            <p>User: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default NoAccess