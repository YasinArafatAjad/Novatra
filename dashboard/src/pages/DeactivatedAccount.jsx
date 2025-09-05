import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { SEOHelmet } from '../components/SEOHelmet'

const DeactivatedAccount = () => {
  const { logout } = useAuth()
  const { showSuccess } = useNotification()

  const handleLogout = async () => {
    try {
      await logout()
      showSuccess('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@T-Shirt.com?subject=Account Reactivation Request&body=Hello T-Shirt Support Team,%0D%0A%0D%0AI would like to request the reactivation of my account.%0D%0A%0D%0AThank you.'
  }

  return (
    <>
      <SEOHelmet 
        title="Account Deactivated - T-Shirt"
        description="Your account has been deactivated"
      />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-bounce-in">
          <div className="text-red-500 text-6xl mb-6">🚫</div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Account Deactivated
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your account has been temporarily deactivated by an administrator. Please contact our support team for assistance with reactivating your account.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleContactSupport}
              className="w-full bg-primary-400 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-500 transition-colors"
            >
              📧 Contact Support
            </button>
            
            <button
              onClick={handleLogout}
              className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>📧 Email: <a href="mailto:support@T-Shirt.com" className="underline hover:text-blue-600">support@T-Shirt.com</a></p>
              <p>📞 Phone: <a href="tel:+1-234-567-8900" className="underline hover:text-blue-600">+1-234-567-8900</a></p>
              <p className="text-xs text-blue-600 mt-2">Support hours: Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Account ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeactivatedAccount