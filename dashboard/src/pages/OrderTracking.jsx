import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { SEOHelmet } from '../components/SEOHelmet'
import { useApi } from '../hooks/useApi'
import { useNotification } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'

const OrderTracking = () => {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [returnReason, setReturnReason] = useState('')
  const [returnType, setReturnType] = useState('return')
  const { apiCall } = useApi()
  const { showSuccess, showError } = useNotification()
  const { isDark } = useTheme()

  useEffect(() => {
    if (orderNumber) {
      loadOrder()
    }
  }, [orderNumber])

  const loadOrder = async () => {
    try {
      const response = await apiCall(`/orders/track/${orderNumber}`)
      setOrder(response.data)
    } catch (error) {
      showError('Order not found')
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async () => {
    try {
      const response = await apiCall(`/orders/${order._id}/invoice`, {
        method: 'GET',
        responseType: 'blob'
      })
      
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${order.orderNumber}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      
      showSuccess('Invoice downloaded successfully')
    } catch (error) {
      showError('Failed to download invoice')
    }
  }

  const submitReturnRequest = async () => {
    try {
      await apiCall(`/orders/${order._id}/return-request`, {
        method: 'POST',
        data: {
          type: returnType,
          reason: returnReason
        }
      })
      
      showSuccess(`${returnType === 'return' ? 'Return' : 'Exchange'} request submitted successfully`)
      setShowReturnModal(false)
      loadOrder()
    } catch (error) {
      showError('Failed to submit request')
    }
  }

  const getStatusSteps = () => {
    const steps = [
      { key: 'Pending', label: 'Order Placed', icon: '📝' },
      { key: 'Processing', label: 'Processing', icon: '⚙️' },
      { key: 'Shipped', label: 'Shipped', icon: '🚚' },
      { key: 'Delivered', label: 'Delivered', icon: '📦' }
    ]

    if (order?.status === 'Cancelled') {
      return [
        { key: 'Pending', label: 'Order Placed', icon: '📝' },
        { key: 'Cancelled', label: 'Cancelled', icon: '❌' }
      ]
    }

    return steps
  }

  const getCurrentStepIndex = () => {
    const steps = getStatusSteps()
    return steps.findIndex(step => step.key === order?.status)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
        </div>
      </Layout>
    )
  }

  if (!order) {
    return (
      <Layout>
        <div className={`text-center py-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="text-6xl mb-4">📦</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Not Found</h2>
          <p>The order you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </Layout>
    )
  }

  return (
    <>
      <SEOHelmet 
        title={`Track Order ${order.orderNumber} - T-Shirt`}
        description="Track your order status and manage returns"
      />
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Order {order.orderNumber}
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={downloadInvoice}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📄 Download Invoice
              </button>
              {(order.status === 'Delivered') && (
                <button
                  onClick={() => setShowReturnModal(true)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  🔄 Return/Exchange
                </button>
              )}
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Status</h3>
            
            <div className="relative">
              <div className="flex items-center justify-between">
                {getStatusSteps().map((step, index) => {
                  const currentIndex = getCurrentStepIndex()
                  const isCompleted = index <= currentIndex
                  const isCurrent = index === currentIndex
                  const isCancelled = order.status === 'Cancelled' && step.key === 'Cancelled'
                  
                  return (
                    <div key={step.key} className="flex flex-col items-center relative">
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
                      {isCurrent && (
                        <div className={`absolute -bottom-2 w-2 h-2 rounded-full animate-pulse ${
                          isCancelled ? 'bg-red-500' : 'bg-primary-500'
                        }`}></div>
                      )}
                      
                      {index < getStatusSteps().length - 1 && (
                        <div className={`absolute top-6 left-12 w-full h-0.5 ${
                          index < currentIndex 
                            ? isCancelled ? 'bg-red-300' : 'bg-primary-300'
                            : isDark ? 'bg-gray-600' : 'bg-gray-300'
                        }`}></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Items</h3>
              <div className="space-y-3">
                {order.items?.map((item, index) => (
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

            <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tax:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(order.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                  <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(order.shipping)}</span>
                </div>
                <div className={`flex justify-between font-semibold text-lg border-t pt-3 ${isDark ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Shipping Address</h4>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Return/Refund Status */}
          {order.returnRequest && (
            <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Return/Exchange Status</h3>
              <div className={`p-4 rounded-lg ${
                order.returnRequest.status === 'approved' ? 'bg-green-50 border-green-200' :
                order.returnRequest.status === 'rejected' ? 'bg-red-50 border-red-200' :
                'bg-yellow-50 border-yellow-200'
              } border`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.returnRequest.type === 'return' ? 'Return Request' : 'Exchange Request'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Reason: {order.returnRequest.reason}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted: {new Date(order.returnRequest.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    order.returnRequest.status === 'approved' ? 'bg-green-100 text-green-800' :
                    order.returnRequest.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.returnRequest.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Return/Exchange Modal */}
        {showReturnModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-xl max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Request Return/Exchange
                  </h3>
                  <button
                    onClick={() => setShowReturnModal(false)}
                    className={`hover:text-gray-600 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400'}`}
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 ${
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
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
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
                    className="flex-1 bg-primary-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  )
}

export default OrderTracking