import { useTheme } from '../contexts/ThemeContext'

export const DashboardCard = ({ title, value, change, icon, color = "primary" }) => {
  const { isDark } = useTheme()

  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return isDark ? 'text-green-400 bg-green-900' : 'text-green-600 bg-green-50'
      case 'blue':
        return isDark ? 'text-blue-400 bg-blue-900' : 'text-blue-600 bg-blue-50'
      case 'yellow':
        return isDark ? 'text-yellow-400 bg-yellow-900' : 'text-yellow-600 bg-yellow-50'
      case 'red':
        return isDark ? 'text-red-400 bg-red-900' : 'text-red-600 bg-red-50'
      default:
        return isDark ? 'text-primary-400 bg-primary-900' : 'text-primary-600 bg-primary-50'
    }
  }

  return (
    <div className={`p-6 rounded-xl shadow-sm card-hover border transition-colors duration-200 ${
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )
}