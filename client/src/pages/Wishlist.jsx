import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiTrash2, FiStar } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { useNotification } from '../contexts/NotificationContext'
import SEOHelmet from '../components/SEOHelmet'
import { useTheme } from '../contexts/ThemeContext'

const Wishlist = () => {
  const { isDark } = useTheme()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { showSuccess, showWarning } = useNotification()
  
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWishlist()
  }, [])

  const loadWishlist = async () => {
    try {
      // Mock wishlist data
      const mockWishlist = [
        {
          _id: '1',
          product: {
            _id: 'p1',
            name: 'Summer Floral Dress',
            price: 89.99,
            discountPrice: 69.99,
            images: [{ url: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg' }],
            category: 'Dresses',
            stock: 15,
            description: 'Beautiful floral pattern perfect for summer occasions',
            sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 2 }],
            colors: ['Blue', 'Pink', 'White']
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
            description: 'Timeless white shirt for professional and casual wear',
            sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 3 }, { size: 'L', stock: 2 }],
            colors: ['White', 'Light Blue']
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
            description: 'Vintage-style denim jacket with modern fit',
            sizes: [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }],
            colors: ['Blue', 'Black']
          },
          addedAt: new Date('2024-01-05')
        }
      ]
      
      setWishlistItems(mockWishlist)
    } catch (error) {
      console.error('Error loading wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item._id !== itemId))
    showSuccess('Item removed from wishlist')
  }

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      showWarning('This item is out of stock')
      return
    }

    addToCart(product, 1)
  }

  const clearWishlist = () => {
    setWishlistItems([])
    showSuccess('Wishlist cleared')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const renderStars = (rating = 4.5) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : isDark ? 'text-gray-600' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHelmet 
        title="My Wishlist"
        description="Your saved items and favorites"
      />

      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  My Wishlist
                </h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Items you've saved for later ({wishlistItems.length} items)
                </p>
              </div>
              
              {wishlistItems.length > 0 && (
                <button
                  onClick={clearWishlist}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                    isDark 
                      ? 'border-red-600 text-red-400 hover:bg-red-900/20' 
                      : 'border-red-300 text-red-600 hover:bg-red-50'
                  }`}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => {
                  const product = item.product
                  const discountPercentage = product.discountPrice 
                    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
                    : 0

                  return (
                    <div key={item._id} className={`group relative rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden card-hover ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      {/* Discount Badge */}
                      {discountPercentage > 0 && (
                        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          -{discountPercentage}%
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-700"
                      >
                        <FiHeart className="w-4 h-4 text-red-500 fill-current" />
                      </button>

                      <Link to={`/products/${product._id}`} className="block">
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                          <img
                            src={product.images?.[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                            loading="lazy"
                          />

                          {/* Stock Status */}
                          {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                          {/* Category */}
                          <p className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {product.category}
                          </p>

                          {/* Product Name */}
                          <h3 className={`font-semibold mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center space-x-2 mb-3">
                            {renderStars(4.5)}
                            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              (4.5)
                            </span>
                          </div>

                          {/* Price */}
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {formatPrice(product.discountPrice || product.price)}
                            </span>
                            {product.discountPrice && (
                              <span className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>

                          {/* Added Date */}
                          <p className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            Added {new Date(item.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>

                      {/* Action Buttons */}
                      <div className="p-4 pt-0 flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <FiShoppingCart className="w-4 h-4" />
                          {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item._id)}
                          className={`p-2 border rounded-lg transition-colors ${
                            isDark 
                              ? 'border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-red-400' 
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-red-600'
                          }`}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className={`text-center py-16 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <FiHeart className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Your wishlist is empty
                </h3>
                <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Start adding items you love to keep track of them
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Wishlist