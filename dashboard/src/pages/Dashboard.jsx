import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { DashboardCard } from '../components/DashboardCard'
import { SEOHelmet } from '../components/SEOHelmet'
import { useTheme } from '../contexts/ThemeContext'
import { useApi } from '../hooks/useApi'

const Dashboard = () => {
  const { isDark } = useTheme()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    categoryStats: []
  })
  const { apiCall, loading } = useApi()

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      const response = await apiCall('/dashboard/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount)
  }

  return (
    <>
      <SEOHelmet 
        title="Dashboard - Clothing Management"
        description="Overview of your clothing business metrics and performance"
      />
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dashboard</h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Welcome to your clothing business overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <DashboardCard
              title="Total Products"
              value={stats.totalProducts}
              change="+12%"
              icon="👕"
              color="primary"
            />
            <DashboardCard
              title="Total Orders"
              value={stats.totalOrders}
              change="-8%"
              icon="📦"
              color="blue"
            />
            <DashboardCard
              title="Pending Orders"
              value={stats.pendingOrders}
              change="+3%"
              icon="⏳"
              color="yellow"
            />
            <DashboardCard
              title="Revenue"
              value={formatCurrency(stats.totalRevenue)}
              change="+15%"
              icon="💰"
              color="green"
            />
            <DashboardCard
              title="Customers"
              value={stats.totalCustomers}
              change="+5%"
              icon="👥"
              color="yellow"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Orders</h3>
              <div className="space-y-3">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order._id} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-neutral-50'}`}>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.orderNumber}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-green-600 font-semibold">{formatCurrency(order.total)}</span>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{order.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No recent orders</p>
                )}
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Top Products</h3>
              <div className="space-y-3">
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-neutral-50'}`}>
                      <div>
                        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.product?.name}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.totalSold} sold</p>
                      </div>
                      <span className="text-primary-600 font-semibold">{formatCurrency(item.revenue)}</span>
                    </div>
                  ))
                ) : (
                  <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No sales data available</p>
                )}
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Sales by Category</h3>
            <div className="space-y-4">
              {stats.categoryStats.length > 0 ? (
                stats.categoryStats.map((category, index) => {
                  const maxSales = Math.max(...stats.categoryStats.map(c => c.totalSales))
                  const percentage = (category.totalSales / maxSales) * 100
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{category._id}</span>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{category.totalItems} items</span>
                        </div>
                        <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-600' : 'bg-neutral-200'}`}>
                          <div 
                            className="bg-primary-400 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className={`ml-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(category.totalSales)}
                      </span>
                    </div>
                  )
                })
              ) : (
                <p className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No category data available</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Dashboard