import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { DashboardCard } from '../components/DashboardCard'
import { SEOHelmet } from '../components/SEOHelmet'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentOrders: [],
    lowStockItems: []
  })
  const { apiCall } = useApi()
  const { user } = useAuth()

  useEffect(() => {
    loadEmployeeStats()
  }, [])

  const loadEmployeeStats = async () => {
    try {
      const [dashboardResponse, productsResponse, ordersResponse] = await Promise.all([
        apiCall('/dashboard/stats'),
        apiCall('/products'),
        apiCall('/orders?limit=5')
      ])

      const lowStockItems = productsResponse.data.filter(product => product.stock <= 10)
      const pendingOrdersCount = ordersResponse.data.filter(order => order.status === 'Pending').length

      setStats({
        totalProducts: dashboardResponse.data.totalProducts,
        totalOrders: dashboardResponse.data.totalOrders,
        pendingOrders: pendingOrdersCount,
        lowStockProducts: lowStockItems.length,
        recentOrders: ordersResponse.data.slice(0, 5),
        lowStockItems: lowStockItems.slice(0, 5)
      })
    } catch (error) {
      console.error('Error loading employee stats:', error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <SEOHelmet 
        title="Employee Dashboard - Clothing Management"
        description="Employee dashboard for managing daily operations"
      />
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}! Here's your daily overview</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard
              title="Total Products"
              value={stats.totalProducts}
              icon="👕"
              color="primary"
            />
            <DashboardCard
              title="Pending Orders"
              value={stats.pendingOrders}
              icon="⏳"
              color="yellow"
            />
            <DashboardCard
              title="Low Stock Items"
              value={stats.lowStockProducts}
              icon="⚠️"
              color="red"
            />
            <DashboardCard
              title="Total Orders"
              value={stats.totalOrders}
              icon="📦"
              color="blue"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <span className="text-sm text-gray-500">Last 5 orders</span>
              </div>
              <div className="space-y-3">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-sm text-gray-900 font-medium mt-1">{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent orders</p>
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
                <span className="text-sm text-red-600 font-medium">Needs attention</span>
              </div>
              <div className="space-y-3">
                {stats.lowStockItems.length > 0 ? (
                  stats.lowStockItems.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-red-600 font-bold">{product.stock} left</span>
                        <p className="text-sm text-gray-500">Restock needed</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">All products are well stocked</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => window.location.href = '/products/add'}
                className="p-4 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2">➕</div>
                <div className="font-medium">Add Product</div>
              </button>
              <button
                onClick={() => window.location.href = '/orders'}
                className="p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📦</div>
                <div className="font-medium">View Orders</div>
              </button>
              <button
                onClick={() => window.location.href = '/products'}
                className="p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium">Manage Inventory</div>
              </button>
              <button
                onClick={() => window.location.href = '/customers'}
                className="p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-center"
              >
                <div className="text-2xl mb-2">👥</div>
                <div className="font-medium">View Customers</div>
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default EmployeeDashboard