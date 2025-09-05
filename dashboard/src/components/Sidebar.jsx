import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export const Sidebar = ({ isOpen, onClose }) => {
  const { userRole } = useAuth()
  const { isDark } = useTheme()

  const getNavigation = () => {
    const baseNav = [
      { name: 'Dashboard', href: '/', icon: '📊' },
    ]

    if (userRole === 'customer') {
      return [
        ...baseNav,
        { name: 'Profile', href: '/profile', icon: '👤' },
        { name: 'Orders', href: '/orders', icon: '📦' },
        { name: 'Wishlist', href: '/wishlist', icon: '💝' },
      ]
    }

    const staffNav = [
      ...baseNav,
      { name: 'Products', href: '/products', icon: '👕' },
      { name: 'Orders', href: '/orders', icon: '📦' },
      { name: 'Invoices', href: '/invoices', icon: '📄' },
      { name: 'Customers', href: '/customers', icon: '👥' },
      { name: 'Profile', href: '/profile', icon: '👤' },
    ]

    if (userRole === 'admin') {
      return [
        ...staffNav,
        { name: 'User Management', href: '/users', icon: '👨‍💼' },
        { name: 'Settings', href: '/settings', icon: '⚙️' },
      ]
    }

    return staffNav
  }

  const navigation = getNavigation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className={`flex items-center justify-between h-16 px-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
          <h1 className="text-xl font-bold text-primary-400">T-Shirt</h1>
          <button 
            onClick={onClose}
            className={`lg:hidden transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
          >
            ×
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center px-3 py-2 text-sm font-medium rounded-lg mb-1 transition-colors duration-200
                ${isActive 
                  ? isDark 
                    ? 'bg-primary-900 text-primary-300 border-r-2 border-primary-400' 
                    : 'bg-primary-50 text-primary-700 border-r-2 border-primary-400'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-600 hover:bg-neutral-50 hover:text-gray-900'
                }
              `}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}