import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

const ProductCard = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { showSuccess, showWarning } = useNotification()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock <= 0) {
      showWarning('Product is out of stock')
      return
    }

    addToCart(product, 1)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      showWarning('Please login to add items to wishlist')
      return
    }

    setIsWishlisted(!isWishlisted)
    showSuccess(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const renderStars = (rating = 0) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    )
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <div className="group relative bg-white dark:bg-dark-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden card-hover">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          -{discountPercentage}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-dark-700"
      >
        <FiHeart 
          className={`w-4 h-4 ${
            isWishlisted 
              ? 'text-red-500 fill-current' 
              : 'text-gray-600 dark:text-gray-400'
          }`} 
        />
      </button>

      <Link to={`/products/${product._id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-700">
          <img
            src={product.images?.[0]?.url || 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-dark-700 animate-pulse"></div>
          )}

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
            <button
              onClick={handleAddToCart}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
              disabled={product.stock <= 0}
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
            <Link
              to={`/products/${product._id}`}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <FiEye className="w-5 h-5" />
            </Link>
          </div>

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
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            {renderStars(4.5)}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (4.5)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.discountPrice || product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard