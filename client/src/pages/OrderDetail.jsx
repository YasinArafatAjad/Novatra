import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiDownload, FiRefreshCw, FiPackage, FiTruck, FiCheck } from 'react-icons/fi'
import { useApi } from '../hooks/useApi'
import { useNotification } from '../contexts/NotificationContext'
import SEOHelmet from '../components/SEOHelmet'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTheme } from '../contexts/ThemeContext'

const OrderDetail = () => {
  const { isDark } = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const { apiCall } = useApi()
  const { showSuccess, showError } = useNotification()
  
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returnType, setReturnType] = useState('return')

  useEffect(() => {
    loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      // Mock order data
      const mockOrder = {
        _id: id,
        orderNumber: '#1001',
        status: 'Delivered',
        total: 156.99,
        subtotal: 145.00,
        tax: 11.60,
        shipping: 0.39,
        createdAt: new Date('2024-01-15'),
        deliveredAt: new Date('2024-01-18'),
        items: [
          {
            product: { 
              _id: 'p1',
              name: 'Summer Floral Dress',
              images: [{ url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg' }]
            },
            quantity: 1,
            price: 89.99,
            size: 'M',
            color: 'Blue'
          },
          {
            product: { 
              _id: 'p2',
              name: 'White Canvas Sneakers',
              images: [{ url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg' }]
            },
            quantity: 1,
            price: 55.00,
            size: '8',
            color: 'White'
          }
        ],
        shippingAddress: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        trackingNumber: 'TRK123456789'
      }
      
      setOrder(mockOrder)
    } catch (error) {
      showError('Failed to load order details')
      navigate('/orders')
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async () => {
    try {
      showSuccess('Invoice download started')
    } catch (error) {
      showError('Failed to download invoice')
    }
  }

  const submitReturnRequest = async () => {
    try {
      showSuccess(`${returnType === 'return' ? 'Return' : 'Exchange'} request submitted successfully`)
      setShowReturnModal(false)
    } catch (error) {
      showError('Failed to submit request')
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusSteps = () => {
    const steps = [
      { key: 'Pending', label: 'Order Placed', icon: '📝', date: order?.createdAt },
      { key: 'Processing', label: 'Processing', icon: '⚙️', date: order?.createdAt },
      { key: 'Shipped', label: 'Shipped', icon: '🚚', date: order?.createdAt },
      { key: 'Delivered', label: 'Delivered', icon: '📦', date: order?.deliveredAt }
    ]

    if (order?.status === 'Cancelled') {
      return [
        { key: 'Pending', label: 'Order Placed', icon: '📝', date: order?.createdAt },
        { key: 'Cancelled', label: 'Cancelled', icon: '❌', date: order?.createdAt }
      ]
    }

    return steps
  }

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps()
    return steps.findIndex(step => step.key === order?.status)
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

  if (!order) {
    return (
      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order not found</h2>
            <button
              onClick={() => navigate('/orders')}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHelmet 
        title={`Order ${order.orderNumber}`}
        description="View detailed information about your order"
      />

      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => navigate('/orders')}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Order {order.orderNumber}
                </h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className={`p-6 rounded-xl shadow-sm mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Progress</h3>
              
              <div className="relative">
                <div className="flex items-center justify-between">
                  {getStatusSteps().map((step, index) => {
                    const currentIndex = getCurrentStepIndex()
                    const isCompleted = index <= currentIndex
                    const isCurrent = index === currentIndex
                    const isCancelled = order.status === 'Cancelled' && step.key === 'Cancelled'
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center relative flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 ${
                          isCancelled 
                            ? 'bg-red-100 border-red-500 text-red-600'
                            : isCompleted 
                              ? 'bg-primary-100 border-primary-500 text-primary-600' 
                              : isDark 
                                ? 'bg-gray-700 border-gray-600 text-gray-400'
                                : 'bg-gray-100 border-gray-300 text-gray-400'
                        }`}>
                          {isCancelled ? '❌' : isCompleted ? '✓' : step.icon}
                        </div>
                        <span className={`mt-2 text-sm font-medium text-center ${
                          isCompleted 
                            ? isDark ? 'text-white' : 'text-gray-900'
                            : isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </span>
                        {step.date && isCompleted && (
                          <span className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date(step.date).toLocaleDateString()}
                          </span>
                        )}
                        
                        {index < getStatusSteps().length - 1 && (
                          <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                            index < currentIndex 
                              ? isCancelled ? 'bg-red-300' : 'bg-primary-300'
                              : isDark ? 'bg-gray-600' : 'bg-gray-300'
                          }`} style={{ transform: 'translateX(50%)' }}></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Items */}
              <div className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className={`flex gap-4 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <img
                        src={item.product.images?.[0]?.url || 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Quantity: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </p>
                        <p className={`text-sm font-medium mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary & Actions */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tax:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(order.tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                      <span className={isDark ? 'text-white' : 'text-gray-900'}>
                        {order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}
                      </span>
                    </div>
                    <div className={`flex justify-between font-semibold text-lg border-t pt-3 ${isDark ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                      <span>Total:</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Delivery Address</label>
                      <div className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <p>{order.shippingAddress.street}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        <p>{order.shippingAddress.country}</p>
                      </div>
                    </div>
                    
                    {order.trackingNumber && (
                      <div>
                        <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Tracking Number</label>
                        <p className={`mt-1 text-sm font-mono ${isDark ? 'text-white' : 'text-gray-900'}`}>{order.trackingNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <button
                    onClick={downloadInvoice}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-5 h-5" />
                    Download Invoice
                  </button>
                  
                  {order.status === 'Delivered' && (
                    <button
                      onClick={() => setShowReturnModal(true)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <FiRefreshCw className="w-5 h-5" />
                      Request Return/Exchange
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return/Exchange Modal */}
        {showReturnModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-xl max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Request Return/Exchange
                  </h3>
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className={`transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Request Type
                  </label>
                  <select
                    value={returnType}
                    onChange={(e) => setReturnType(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="return">Return (Refund)</option>
                    <option value="exchange">Exchange (Different Size/Color)</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Reason
                  </label>
                  <textarea
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Please explain the reason for your request..."
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      isDark 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReturnRequest}
                    disabled={!returnReason.trim()}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default OrderDetail