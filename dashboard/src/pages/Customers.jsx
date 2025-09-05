import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { SEOHelmet } from '../components/SEOHelmet'
import { useApi } from '../hooks/useApi'
import { SearchInput } from '../components/SearchInput'
import { useTheme } from '../contexts/ThemeContext'

const Customers = () => {
  const { isDark } = useTheme()
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { apiCall, loading } = useApi()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await apiCall('/customers')
      setCustomers(response.data)
      setFilteredCustomers(response.data)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredCustomers(customers)
    } else {
      const filtered = customers.filter(customer =>
        `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.phone?.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredCustomers(filtered)
    }
  }

  const getCustomerInitials = (customer) => {
    return `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase()
  }

  const getCustomerStatus = (customer) => {
    const joinDate = new Date(customer.createdAt)
    const daysSinceJoin = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24))
    
    if (daysSinceJoin < 30) return 'New'
    if (daysSinceJoin < 365) return 'Regular'
    return 'VIP'
  }

  return (
    <>
      <SEOHelmet 
        title="Customers - Clothing Dashboard"
        description="Manage customer information and relationships"
      />
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customers</h1>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your customer base ({filteredCustomers.length} customers)</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="w-full max-w-md">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search customers by name, email, phone..."
              />
            </div>
          </div>

          <div className={`rounded-xl shadow-sm border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer Directory</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-700' : 'bg-neutral-50'}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Customer</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Email</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Phone</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Joined</th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-neutral-200'}`}>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer._id} className={`transition-colors duration-200 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-neutral-50'}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${isDark ? 'bg-primary-900' : 'bg-primary-100'}`}>
                            <span className={`font-semibold text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                              {getCustomerInitials(customer)}
                            </span>
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>ID: {customer._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{customer.email}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {customer.phone || 'Not provided'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getCustomerStatus(customer) === 'VIP' ? 'bg-primary-100 text-primary-800' :
                          getCustomerStatus(customer) === 'Regular' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {getCustomerStatus(customer)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedCustomer(customer)
                            setShowModal(true)
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && searchTerm && (
                    <tr>
                      <td colSpan="6" className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div className="text-4xl mb-2">🔍</div>
                        <p>No customers found matching "{searchTerm}"</p>
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

        {/* Customer Details Modal */}
        {showModal && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className={`rounded-xl shadow-xl max-w-md w-full ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-neutral-200'}`}>
                <div className="flex justify-between items-center">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Customer Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`transition-colors ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3 ${isDark ? 'bg-primary-900' : 'bg-primary-100'}`}>
                    <span className={`font-semibold text-xl ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                      {getCustomerInitials(selectedCustomer)}
                    </span>
                  </div>
                  <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                  </h4>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{selectedCustomer.email}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone</label>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>{selectedCustomer.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Role</label>
                    <p className={`capitalize ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedCustomer.role}</p>
                  </div>
                  
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Member Since</label>
                    <p className={isDark ? 'text-white' : 'text-gray-900'}>
                      {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getCustomerStatus(selectedCustomer) === 'VIP' ? 'bg-primary-100 text-primary-800' :
                      getCustomerStatus(selectedCustomer) === 'Regular' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getCustomerStatus(selectedCustomer)}
                    </span>
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

export default Customers