import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { SEOHelmet } from '../components/SEOHelmet'
import { useApi } from '../hooks/useApi'
import { SearchInput } from '../components/SearchInput'
import { useTheme } from '../contexts/ThemeContext'

const Orders = () => {
  const { isDark } = useTheme()
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { apiCall, loading } = useApi()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await apiCall('/orders')
      setOrders(response.data)
      setFilteredOrders(response.data)
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredOrders(orders)
    } else {
      const filtered = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
        `${order.customer?.firstName} ${order.customer?.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        order.status.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredOrders(filtered)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiCall(`/orders/${orderId}/status`, {
        method: 'PATCH',
        data: { status: newStatus }
      })
      loadOrders()
      setShowModal(false)
    } catch (error) {
      console.error('Error updating order status:', error)
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
        title="Orders - Clothing Dashboard"
        description="Manage customer orders and track fulfillment status"
      />
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Orders</h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Track and manage customer orders ({filteredOrders.length} orders)</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="w-full max-w-md">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search orders by number, customer, status..."
              />
            </div>
          </div>

          <div className={`rounded-xl shadow-sm border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>All Orders</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-700' : 'bg-neutral-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Order</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Customer</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Items</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Total</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Date</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-neutral-200'}`}>
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className={`transition-colors duration-200 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-neutral-50'}`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {order.orderNumber}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                        {order.customer?.firstName} {order.customer?.lastName}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {order.items?.length} items
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowModal(true)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && searchTerm && (
                    <tr>
                      <td colSpan="7" className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="text-4xl mb-2">🔍</div>
                        <p>No orders found matching "{searchTerm}"</p>
                        <button
                          onClick={() => handleSearch('')}
                          className="mt-2 text-primary-600 hover:text-primary-500 text-sm"
                        >
                          Clear search
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer</h4>
                    <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                      {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{selectedOrder.customer?.email}</p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Status</h4>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-neutral-50'}`}>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.product?.name}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                          </p>
                        </div>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`border-t pt-4 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tax:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(selectedOrder.shipping)}</span>
                    </div>
                    <div className={`flex justify-between font-semibold text-lg border-t pt-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>Total:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}

export default Orders