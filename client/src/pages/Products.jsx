import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi'
import { useApi } from '../hooks/useApi'
import SEOHelmet from '../components/SEOHelmet'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTheme } from '../contexts/ThemeContext'

const Products = () => {
  const { isDark } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const { apiCall } = useApi()

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    sortBy: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true'
  })

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    loadProducts()
  }, [filters, pagination.page])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        category: filters.category !== 'all' ? filters.category : undefined,
        sortBy: filters.sortBy,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        inStock: filters.inStock || undefined
      }

      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key])

      const response = await apiCall('/products/public', { params })
      if (response.data.success) {
        setProducts(response.data.data)
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || response.data.data.length,
          pages: response.data.pagination?.pages || 1
        }))
      }
    } catch (error) {
      console.error('Error loading products:', error)
      // Set some mock products for demo
      setProducts([
        {
          _id: '1',
          name: 'Summer Dress',
          price: 89.99,
          category: 'Dresses',
          stock: 10,
          images: [{ url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg' }]
        },
        {
          _id: '2',
          name: 'Classic Shirt',
          price: 45.50,
          category: 'Tops',
          stock: 15,
          images: [{ url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg' }]
        },
        {
          _id: '3',
          name: 'Denim Jeans',
          price: 79.99,
          category: 'Bottoms',
          stock: 8,
          images: [{ url: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg' }]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))

    // Update URL params
    const newParams = new URLSearchParams()
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'all' && v !== false) {
        newParams.set(k, v.toString())
      }
    })
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      sortBy: 'newest',
      minPrice: '',
      maxPrice: '',
      inStock: false
    }
    setFilters(defaultFilters)
    setSearchParams({})
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Tops', label: 'Tops' },
    { value: 'Bottoms', label: 'Bottoms' },
    { value: 'Dresses', label: 'Dresses' },
    { value: 'Outerwear', label: 'Outerwear' },
    { value: 'Accessories', label: 'Accessories' },
    { value: 'Shoes', label: 'Shoes' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' }
  ]

  return (
    <>
      <SEOHelmet 
        title="Products"
        description="Browse our complete collection of fashionable clothing and accessories. Find the perfect style for any occasion."
        keywords="clothing, fashion, products, shop, buy online"
      />

      <div className="pt-16 lg:pt-20">
        {/* Header */}
        <section className={`py-8 border-b ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {filters.category !== 'all' ? filters.category : 'All Products'}
                </h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {pagination.total} products found
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className={`flex rounded-lg border ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' 
                      ? 'bg-primary-500 text-white' 
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' 
                      ? 'bg-primary-500 text-white' 
                      : isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiList className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className={`sticky top-24 p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort Filter */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sort By
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* In Stock Filter */}
                  <div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        In Stock Only
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="large" />
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex justify-center mt-12">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                          disabled={pagination.page === 1}
                          className={`px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDark 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setPagination(prev => ({ ...prev, page }))}
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              page === pagination.page
                                ? 'bg-primary-500 text-white border-primary-500'
                                : isDark 
                                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                          disabled={pagination.page === pagination.pages}
                          className={`px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDark 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    No products found
                  </h3>
                  <p className="mb-6">Try adjusting your filters or search terms</p>
                  <button
                    onClick={clearFilters}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className={`fixed right-0 top-0 h-full w-80 p-6 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className={isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              {/* Filter content would go here - same as desktop */}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Products