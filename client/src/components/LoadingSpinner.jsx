import { useTheme } from '../contexts/ThemeContext'

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const { isDark } = useTheme()
  
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        border-4 border-gray-200 dark:border-dark-700 
        border-t-primary-500 
        rounded-full 
        animate-spin
      `}></div>
    </div>
  )
}

export default LoadingSpinner