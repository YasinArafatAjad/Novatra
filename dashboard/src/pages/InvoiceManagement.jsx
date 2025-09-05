import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { SEOHelmet } from '../components/SEOHelmet'
import { useApi } from '../hooks/useApi'
import { useNotification } from '../contexts/NotificationContext'
import { SearchInput } from '../components/SearchInput'
import { useTheme } from '../contexts/ThemeContext'

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { apiCall, loading } = useApi()
  const { showSuccess, showError } = useNotification()
  const { isDark } = useTheme()

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const response = await apiCall('/invoices')
      setInvoices(response.data)
      setFilteredInvoices(response.data)
    } catch (error) {
      showError('Failed to load invoices')
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredInvoices(invoices)
    } else {
      const filtered = invoices.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(term.toLowerCase()) ||
        invoice.order.orderNumber.toLowerCase().includes(term.toLowerCase()) ||
        `${invoice.customer?.firstName} ${invoice.customer?.lastName}`.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredInvoices(filtered)
    }
  }

  const downloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
      const response = await apiCall(`/invoices/${invoiceId}/download`, {
        method: 'GET',
        responseType: 'blob'
      })
      
      const blob = new Blob([response], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceNumber}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      
      showSuccess('Invoice downloaded successfully')
    } catch (error) {
      showError('Failed to download invoice')
    }
  }

  const sendInvoiceEmail = async (invoiceId) => {
    try {
      await apiCall(`/invoices/${invoiceId}/send-email`, {
        method: 'POST'
      })
      showSuccess('Invoice sent to customer email')
    } catch (error) {
      showError('Failed to send invoice')
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
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <SEOHelmet 
        title="Invoice Management - T-Shirt Admin"
        description="Manage customer invoices and billing"
      />
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Invoice Management</h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage customer invoices and billing ({filteredInvoices.length} invoices)
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="w-full max-w-md">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search invoices by number, order, customer..."
              />
            </div>
          </div>

          <div className={`rounded-xl shadow-sm border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>All Invoices</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-700' : 'bg-neutral-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Invoice</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Order</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Customer</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Amount</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Date</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-neutral-200'}`}>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className={`transition-colors duration-200 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-neutral-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {invoice.invoiceNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                          {invoice.order?.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                          {invoice.customer?.firstName} {invoice.customer?.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(invoice.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => downloadInvoice(invoice._id, invoice.invoiceNumber)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => sendInvoiceEmail(invoice._id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Email
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInvoice(invoice)
                            setShowModal(true)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInvoices.length === 0 && searchTerm && (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        <div className="text-4xl mb-2">🔍</div>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                          No invoices found matching "{searchTerm}"
                        </p>
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

        {/* Invoice Details Modal */}
        {showModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Invoice {selectedInvoice.invoiceNumber}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`hover:text-gray-600 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400'}`}
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
                      {selectedInvoice.customer?.firstName} {selectedInvoice.customer?.lastName}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{selectedInvoice.customer?.email}</p>
                  </div>
                  <div>
                    <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Invoice Details</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Order: {selectedInvoice.order?.orderNumber}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tax:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatCurrency(selectedInvoice.shipping)}</span>
                  </div>
                  <div className={`flex justify-between font-semibold text-lg border-t pt-3 ${isDark ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900'}`}>
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => downloadInvoice(selectedInvoice._id, selectedInvoice.invoiceNumber)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    📄 Download PDF
                  </button>
                  <button
                    onClick={() => sendInvoiceEmail(selectedInvoice._id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    📧 Send Email
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

export default InvoiceManagement