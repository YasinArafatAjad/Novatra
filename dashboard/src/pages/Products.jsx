import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { SEOHelmet } from '../components/SEOHelmet'
import { useApi } from '../hooks/useApi'
import { useNotification } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { SearchInput } from '../components/SearchInput'
import { useTheme } from '../contexts/ThemeContext'

const Products = () => {
  const { isDark } = useTheme()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const { apiCall } = useApi()
  const { showError } = useNotification()
  const navigate = useNavigate()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const response = await apiCall('/products')
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      showError('Failed to load products')
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(term.toLowerCase()) ||
        product.category.toLowerCase().includes(term.toLowerCase()) ||
        product.description?.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(amount)

  return (
    <>
      <SEOHelmet title="Products - Dashboard" description="Manage your clothing inventory" />
      <Layout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Products</h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Manage your clothing inventory ({filteredProducts.length} products)</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-80">
                <SearchInput
                  onSearch={handleSearch}
                  placeholder="Search products by name, category..."
                />
              </div>
              <button
                onClick={() => navigate('/products/add')}
                className="px-6 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors duration-200 font-medium whitespace-nowrap"
              >
                Add Product
              </button>
            </div>
          </div>

          <div className={`rounded-xl shadow-sm border overflow-x-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
            <table className="w-full min-w-[700px]">
              <thead className={isDark ? 'bg-gray-700' : 'bg-neutral-50'}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Product</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Category</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Price</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Stock</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-neutral-200'}`}>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className={`transition-colors duration-200 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-neutral-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-primary-900' : 'bg-primary-100'}`}>
                          <span>👕</span>
                        </div>
                        <div>
                          <div className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{product.name}</div>
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{product.description?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{product.category}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(product.price)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{product.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => navigate(`/products/edit/${product._id}`)} className="text-primary-600 hover:text-primary-900">Edit</button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && searchTerm && (
                  <tr>
                    <td colSpan="6" className={`px-6 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <div className="text-4xl mb-2">🔍</div>
                      <p>No products found matching "{searchTerm}"</p>
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
      </Layout>
    </>
  )
}

export default Products