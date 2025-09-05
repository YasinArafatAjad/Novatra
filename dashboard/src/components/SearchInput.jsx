import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export const SearchInput = ({ onSearch, placeholder = "Search..." }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { isDark } = useTheme()

  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className={`text-lg ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>🔍</span>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-colors ${
          isDark 
            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
        }`}
        placeholder={placeholder}
      />
      {searchTerm && (
        <button
          onClick={clearSearch}
          className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
            isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <span className="text-lg">✕</span>
        </button>
      )}
    </div>
  )
}