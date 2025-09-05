import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { useApi } from '../hooks/useApi'
import SEOHelmet from '../components/SEOHelmet'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTheme } from '../contexts/ThemeContext'

const Search = () => {
  const { isDark } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const { apiCall } = useApi()

  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      searchProducts(query)
    }
  }, [searchParams])

  const searchProducts = async (query) => {
    if (!query.trim()) return

    try {
      setLoading(true)
      // Since we don't have a search endpoint, we'll filter all products
      const response = await apiCall('/products/public', {
        params: { limit: 50 }
      })
      
      // Filter products based on search query
      const filtered = response.data.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      
      setProducts(filtered)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() })
    }
  }

  const currentQuery = searchParams.get('q') || ''

  return (
    <>
      <SEOHelmet 
        title={currentQuery ? `Search results for "${currentQuery}"` : 'Search Products'}
        description={currentQuery ? `Find products matching "${currentQuery}"` : 'Search our complete product catalog'}
      />

      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Search Header */}
        <section className={`py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {currentQuery ? `Search Results for "${currentQuery}"` : 'Search Products'}
              </h1>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className={`w-full pl-12 pr-4 py-4 text-lg border rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Search Results */}
        <section className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : currentQuery ? (
            <>
              <div className="mb-8">
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {products.length} {products.length === 1 ? 'result' : 'results'} found for "{currentQuery}"
                </p>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    No results found
                  </h3>
                  <p className="text-lg mb-8 max-w-md mx-auto">
                    We couldn't find any products matching "{currentQuery}". 
                    Try adjusting your search terms or browse our categories.
                  </p>
                  
                  {/* Search Suggestions */}
                  <div className="max-w-md mx-auto">
                    <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Try searching for:
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['shirts', 'dresses', 'jeans', 'shoes', 'accessories'].map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => {
                            setSearchQuery(suggestion)
                            setSearchParams({ q: suggestion })
                          }}
                          className={`px-4 py-2 border rounded-full transition-colors ${
                            isDark 
                              ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="text-6xl mb-6">🔍</div>
              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Start Your Search
              </h3>
              <p className="text-lg mb-8 max-w-md mx-auto">
                Enter a search term above to find products in our catalog.
              </p>
              
              {/* Popular Searches */}
              <div className="max-w-md mx-auto">
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Popular Searches:
                </h4>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['summer dress', 'casual shirt', 'running shoes', 'handbag', 'sunglasses'].map(popular => (
                    <button
                      key={popular}
                      onClick={() => {
                        setSearchQuery(popular)
                        setSearchParams({ q: popular })
                      }}
                      className={`px-4 py-2 border rounded-full transition-colors ${
                        isDark 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {popular}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Search Tips */}
        <section className={`py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h3 className={`text-xl font-semibold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Search Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-3">💡</div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Use specific terms
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Try "red summer dress" instead of just "dress"
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🏷️</div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Search by category
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Use category names like "tops", "shoes", "accessories"
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">🔤</div>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Check spelling
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Make sure your search terms are spelled correctly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Search