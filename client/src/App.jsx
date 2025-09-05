import { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { CartProvider } from './contexts/CartContext'
import LoadingSpinner from './components/LoadingSpinner'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300">
              <Suspense fallback={<LoadingSpinner />}>
                <AppRoutes />
              </Suspense>
            </div>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App