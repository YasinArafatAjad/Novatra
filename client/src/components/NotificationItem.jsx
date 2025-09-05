import { useState, useEffect } from 'react'
import { FiX, FiCheck, FiAlertTriangle, FiInfo, FiAlertCircle } from 'react-icons/fi'

const NotificationItem = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300)
  }

  const getNotificationStyles = () => {
    const baseStyles = "p-4 rounded-lg shadow-lg border-l-4 backdrop-blur-sm"
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-50 dark:bg-green-900/20 border-green-400 text-green-800 dark:text-green-200`
      case 'error':
        return `${baseStyles} bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200`
      case 'warning':
        return `${baseStyles} bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 text-yellow-800 dark:text-yellow-200`
      default:
        return `${baseStyles} bg-blue-50 dark:bg-blue-900/20 border-blue-400 text-blue-800 dark:text-blue-200`
    }
  }

  const getIcon = () => {
    const iconClass = "w-5 h-5"
    switch (notification.type) {
      case 'success':
        return <FiCheck className={iconClass} />
      case 'error':
        return <FiAlertCircle className={iconClass} />
      case 'warning':
        return <FiAlertTriangle className={iconClass} />
      default:
        return <FiInfo className={iconClass} />
    }
  }

  return (
    <div
      className={`
        ${getNotificationStyles()}
        ${isVisible ? 'notification-enter-active' : 'notification-enter'}
        transition-all duration-300 ease-out
        w-full animate-slide-down
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getIcon()}
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default NotificationItem