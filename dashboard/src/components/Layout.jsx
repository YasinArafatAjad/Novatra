import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useTheme } from '../contexts/ThemeContext'

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isDark } = useTheme()

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gray-900' : 'bg-neutral-100'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className={`flex-1 overflow-x-hidden overflow-y-auto p-6 ${isDark ? 'bg-gray-900' : 'bg-neutral-100'}`}>
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}