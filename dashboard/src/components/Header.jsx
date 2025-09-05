import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth()
  const { showSuccess } = useNotification()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
      showSuccess('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className={`shadow-sm border-b transition-colors duration-200 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'
    }`}>
      <div className="flex items-center justify-between lg:justify-end h-16 px-6">
        <button
          onClick={onMenuClick}
          className={`p-2 rounded-md transition-colors lg:hidden ${
            isDark 
              ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700' 
              : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
          }`}
        >
          <span className="text-xl">☰</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
          </button>
          
          <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Welcome, {user?.firstName} {user?.lastName}
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-400 rounded-lg hover:bg-primary-500 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}