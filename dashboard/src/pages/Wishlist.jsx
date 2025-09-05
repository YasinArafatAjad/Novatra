import { useState, useEffect } from 'react'
import { Layout } from '../components/Layout'
import { SEOHelmet } from '../components/SEOHelmet'
import { useApi } from '../hooks/useApi'
import { useNotification } from '../contexts/NotificationContext'
import { useTheme } from '../contexts/ThemeContext'

const Wishlist = () => {
  const { isDark } = useTheme()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { apiCall } = useApi()
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      // Mock data with more realistic items
      const mockWishlist = [
        {
          _id: '1',
          product: {
            _id: 'p1',
            name: 'Summer Floral Dress',
            price: 89.99,
            images: [{ url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg' }],
            category: 'Dresses',
            stock: 15,
            description: 'Beautiful floral pattern perfect for summer occasions'
          },
          addedAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          product: {
            _id: 'p2',
            name: 'Classic White Shirt',
            price: 45.50,
            images: [{ url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg' }],
            category: 'Tops',
            stock: 8,
            description: 'Timeless white shirt for professional and casual wear'
          },
          addedAt: new Date('2024-01-10')
        },
        {
          _id: '3',
          product: {
            _id: 'p3',
            name: 'Denim Jacket',
            price: 125.00,
            images: [{ url: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg' }],
            category: 'Outerwear',
            stock: 0,
            description: 'Vintage-style denim jacket with modern fit'
          },
          addedAt: new Date('2024-01-05')
        },
        {
          _id: '4',
          product: {
            _id: 'p4',
            name: 'Black Leather Boots',
            price: 199.99,
            images: [{ url: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg' }],
            category: 'Shoes',
            stock: 12,
            description: 'Premium leather boots with comfortable sole'
          },
          addedAt: new Date('2024-01-20')
        }
      ]
      setWishlistItems(mockWishlist)
    } catch (error) {
      showError('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId) => {
    try {
      setWishlistItems(prev => prev.filter(item => item._id !== itemId))
      showSuccess('Item removed from wishlist')
    } catch (error) {
      showError('Failed to remove item')
    }
  }

  const addToCart = async (product) => {
    try {
      if (product.stock === 0) {
        showError('This item is out of stock')
        return
      }
      showSuccess(`${product.name} added to cart`)
    } catch (error) {
      showError('Failed to add to cart')
    }
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

  return (
    <>
      <SEOHelmet 
        title="My Wishlist - T-Shirt"
        description="Your saved items and favorites"
      />
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Wishlist</h1>
              <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Items you've saved for later ({wishlistItems.length} items)</p>
            </div>
            {wishlistItems.length > 0 && (
              <button
                onClick={() => setWishlistItems([])}
                className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item._id} className={`rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 group ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'
                }`}>
                  <div className="relative">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className={`absolute top-3 right-3 rounded-full p-2 shadow-md transition-colors opacity-0 group-hover:opacity-100 ${
                        isDark ? 'bg-gray-700 hover:bg-red-900' : 'bg-white hover:bg-red-50'
                      }`}
                    >
                      <span className="text-red-500 text-sm">❤️</span>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</h3>
                      <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.product.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm px-2 py-1 rounded ${
                        isDark ? 'text-gray-400 bg-gray-700' : 'text-gray-500 bg-gray-100'
                      }`}>
                        {item.product.category}
                      </span>
                      <span className="text-lg font-bold text-primary-600">
                        {formatCurrency(item.product.price)}
                      </span>
                    </div>
                    
                    <div className={`flex items-center justify-between text-xs mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>Added {new Date(item.addedAt).toLocaleDateString()}</span>
                      <span className={item.product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.product.stock > 0 ? `${item.product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(item.product)}
                        disabled={item.product.stock === 0}
                        className="flex-1 px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className={`px-3 py-2 border rounded-lg transition-colors ${
                          isDark 
                            ? 'text-gray-400 border-gray-600 hover:bg-gray-700' 
                            : 'text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`rounded-xl shadow-sm border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <div className="text-6xl mb-4">💝</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Your wishlist is empty</h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Start adding items you love to keep track of them</p>
              <button
                onClick={() => window.location.href = '/products'}
                className="px-6 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium"
              >
                Browse Products
              </button>
            </div>
          )}
        </div>
      </Layout>
    </>
  )
}

export default Wishlist