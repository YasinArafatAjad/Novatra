import { useState, useEffect } from 'react'

export const NotificationItem = ({ notification, onRemove }) => {
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
        return `${baseStyles} bg-green-50 border-green-400 text-green-800`
      case 'error':
        return `${baseStyles} bg-red-50 border-red-400 text-red-800`
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-400 text-yellow-800`
      default:
        return `${baseStyles} bg-blue-50 border-blue-400 text-blue-800`
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  return (
    <div
      className={`
        ${getNotificationStyles()}
        ${isVisible ? 'notification-enter-active' : 'notification-enter'}
        transition-all duration-300 ease-out
        max-w-sm w-full
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-lg font-semibold">{getIcon()}</span>
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <span className="text-lg">×</span>
        </button>
      </div>
    </div>
  )
}