import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiEye, FiDownload, FiRefreshCw } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { useApi } from '../hooks/useApi'
import { useNotification } from '../contexts/NotificationContext'
import SEOHelmet from '../components/SEOHelmet'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTheme } from '../contexts/ThemeContext'

const Orders = () => {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { apiCall } = useApi()
  const { showSuccess, showError } = useNotification()
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      // Mock orders data since we don't have user-specific orders endpoint
      const mockOrders = [
        {
          _id: '1',
          orderNumber: '#1001',
          status: 'Delivered',
          total: 156.99,
          subtotal: 145.00,
          tax: 11.60,
          shipping: 0.39,
          createdAt: new Date('2024-01-15'),
          items: [
            {
              product: { name: 'Summer Dress', _id: 'p1' },
              quantity: 1,
              price: 89.99,
              size: 'M',
              color: 'Blue'
            },
            {
              product: { name: 'White Sneakers', _id: 'p2' },
              quantity: 1,
              price: 55.00,
              size: '8',
              color: 'White'
            }
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        },
        {
          _id: '2',
          orderNumber: '#1002',
          status: 'Shipped',
          total: 89.99,
          subtotal: 83.32,
          tax: 6.67,
          shipping: 0,
          createdAt: new Date('2024-01-20'),
          items: [
            {
              product: { name: 'Classic T-Shirt', _id: 'p3' },
              quantity: 2,
              price: 25.00,
              size: 'L',
              color: 'Black'
            },
            {
              product: { name: 'Denim Jeans', _id: 'p4' },
              quantity: 1,
              price: 39.99,
              size: '32',
              color: 'Blue'
            }
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        },
        {
          _id: '3',
          orderNumber: '#1003',
          status: 'Processing',
          total: 199.99,
          subtotal: 185.18,
          tax: 14.81,
          shipping: 0,
          createdAt: new Date('2024-01-25'),
          items: [
            {
              product: { name: 'Winter Coat', _id: 'p5' },
              quantity: 1,
              price: 199.99,
              size: 'M',
              color: 'Navy'
            }
          ],
          shippingAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          }
        }
      ]
      
      setOrders(mockOrders)
    } catch (error) {
      showError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async (order) => {
    try {
      showSuccess('Invoice download started')
      // In a real app, this would download the actual PDF
    } catch (error) {
      showError('Failed to download invoice')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return '✅'
      case 'Shipped':
        return '🚚'
      case 'Processing':
        return '⚙️'
      case 'Cancelled':
        return '❌'
      default:
        return '📦'
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHelmet 
        title="My Orders"
        description="View and track your order history"
      />

      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                My Orders
              </h1>
              <button
                onClick={loadOrders}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className={`p-6 rounded-xl shadow-sm border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                      <div className="flex items-center gap-4 mb-4 lg:mb-0">
                        <div className="text-3xl">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Order {order.orderNumber}
                          </h3>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className={`text-sm px-3 py-1 rounded-full ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.quantity}x {item.product.name}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order)
                          setShowModal(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                      >
                        <FiEye className="w-4 h-4" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => downloadInvoice(order)}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                          isDark 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <FiDownload className="w-4 h-4" />
                        Invoice
                      </button>

                      {order.status === 'Delivered' && (
                        <button
                          className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                            isDark 
                              ? 'border-orange-600 text-orange-400 hover:bg-orange-900/20' 
                              : 'border-orange-300 text-orange-700 hover:bg-orange-50'
                          }`}
                        >
                          <FiRefreshCw className="w-4 h-4" />
                          Return/Exchange
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-16 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
                <FiPackage className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  No orders yet
                </h3>
                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
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
                {/* Order Status */}
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Status</h4>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(selectedOrder.status)}</span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Items Ordered</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className={`flex justify-between items-center p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</p>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            Qty: {item.quantity}
                            {item.size && ` • Size: ${item.size}`}
                            {item.color && ` • Color: ${item.color}`}
                          </p>
                        </div>
                        <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className={`border-t pt-4 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tax:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {selectedOrder.shipping === 0 ? 'Free' : formatPrice(selectedOrder.shipping)}
                      </span>
                    </div>
                    <div className={`flex justify-between font-semibold text-lg border-t pt-2 ${isDark ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className={`border-t pt-4 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Address</h4>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                      </p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => downloadInvoice(selectedOrder)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Download Invoice
                  </button>
                  
                  {selectedOrder.status === 'Delivered' && (
                    <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <FiRefreshCw className="w-4 h-4" />
                      Return/Exchange
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Orders