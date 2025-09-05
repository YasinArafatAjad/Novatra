import { createContext, useContext, useState } from 'react'
import { NotificationContainer } from '../components/NotificationContainer'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = (notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: notification.type || 'info',
      message: notification.message,
      duration: notification.duration || 5000
    }

    setNotifications(prev => [...prev, newNotification])

    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const showSuccess = (message, duration) => {
    addNotification({ type: 'success', message, duration })
  }

  const showError = (message, duration) => {
    addNotification({ type: 'error', message, duration })
  }

  const showWarning = (message, duration) => {
    addNotification({ type: 'warning', message, duration })
  }

  const showInfo = (message, duration) => {
    addNotification({ type: 'info', message, duration })
  }

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  )
}