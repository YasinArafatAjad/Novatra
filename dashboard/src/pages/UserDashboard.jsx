import { useEffect, useState } from "react"
import { Layout } from "../components/Layout"
import { DashboardCard } from "../components/DashboardCard"
import { SEOHelmet } from "../components/SEOHelmet"
import { useApi } from "../hooks/useApi"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

const COLORS = ["#3B82F6", "#22C55E", "#EF4444", "#FACC15", "#EC4899"]

const UserDashboard = () => {
  const [user, setUser] = useState(null)
  const [data, setData] = useState({
    totalOrders: 0,
    totalReceived: 0,
    totalCancelled: 0,
    totalSpent: 0,
    wishlistCount: 0,
    orderStatus: [], // e.g. [{status: "Pending", count: 3}, ...]
    categoryStats: [], // e.g. [{category: "Shirts", spent: 5000}, ...]
  })
  const { apiCall } = useApi()

  useEffect(() => {
    loadUserDashboard()
  }, [])

  const loadUserDashboard = async () => {
    try {
      const response = await apiCall("/user/dashboard")
      setUser(response.data.user)
      setData(response.data.stats)
    } catch (error) {
      console.error("Error loading user dashboard:", error)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount)
  }

  return (
    <>
      <SEOHelmet
        title="My Dashboard - Clothing Store"
        description="Overview of your shopping activity"
      />
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hello {user?.firstName || "Customer"} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here’s a summary of your shopping activity.
            </p>
          </div>

          {/* State Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <DashboardCard title="My Orders" value={data.totalOrders} icon="📦" color="blue" />
            <DashboardCard title="Total Received" value={data.totalReceived} icon="✅" color="green" />
            <DashboardCard title="Total Cancelled" value={data.totalCancelled} icon="❌" color="red" />
            <DashboardCard
              title="Total Spent"
              value={formatCurrency(data.totalSpent)}
              icon="💰"
              color="yellow"
            />
            <DashboardCard title="Wishlist" value={data.wishlistCount} icon="❤️" color="pink" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Status Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
              {data.orderStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.orderStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {data.orderStatus.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-10">No order data available</p>
              )}
            </div>

            {/* Spending by Category Bar Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
              {data.categoryStats.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.categoryStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="spent" fill="#3B82F6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-10">No spending data available</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default UserDashboard
