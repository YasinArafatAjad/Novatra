import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingCart, FiStar, FiArrowLeft, FiShare2, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi'
import { useApi } from '../hooks/useApi'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import SEOHelmet from '../components/SEOHelmet'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTheme } from '../contexts/ThemeContext'

const ProductDetail = () => {
  const { isDark } = useTheme()
  const { id } = useParams()
  const navigate = useNavigate()
  const { apiCall } = useApi()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { showSuccess, showWarning, showError } = useNotification()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await apiCall(`/products/public/${id}`)
      if (response.data.success) {
        setProduct(response.data.data)
      } else {
        throw new Error('Product not found')
      }
      
      // Set default selections
      if (response.data.data.sizes?.length > 0) {
        setSelectedSize(response.data.data.sizes[0].size)
      }
      if (response.data.data.colors?.length > 0) {
        setSelectedColor(response.data.data.colors[0])
      }
    } catch (error) {
      console.error('Error loading product:', error)
      // Set mock product for demo
      setProduct({
        _id: id,
        name: 'Sample Product',
        price: 59.99,
        category: 'Tops',
        stock: 10,
        description: 'This is a sample product for demonstration purposes.',
        images: [{ url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg' }],
        sizes: [{ size: 'M', stock: 5 }, { size: 'L', stock: 5 }],
        colors: ['Blue', 'White']
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      showWarning('Product is out of stock')
      return
    }

    if (product.sizes?.length > 0 && !selectedSize) {
      showWarning('Please select a size')
      return
    }

    if (product.colors?.length > 0 && !selectedColor) {
      showWarning('Please select a color')
      return
    }

    addToCart(product, quantity, selectedSize, selectedColor)
  }

  const handleWishlist = () => {
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

  const discountPercentage = product?.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className={`min-h-screen flex items-center justify-center pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEOHelmet 
        title={product.name}
        description={product.description}
        keywords={`${product.name}, ${product.category}, ${product.tags?.join(', ')}`}
        image={product.images?.[0]?.url}
      />

      <div className={`pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 transition-colors ${
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{product.category}</span>
            <span className={isDark ? 'text-gray-600' : 'text-gray-400'}>/</span>
            <span className={isDark ? 'text-white' : 'text-gray-900'}>{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className={`aspect-square rounded-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <img
                  src={product.images?.[selectedImage]?.url || 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{discountPercentage}%
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index 
                          ? 'border-primary-500' 
                          : isDark ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {product.name}
                </h1>
                <div className="flex items-center gap-4 mb-4">
                  {renderStars(4.5)}
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    (4.5) • 127 reviews
                  </span>
                </div>
                <p className={`text-sm uppercase tracking-wide font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {product.category}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {formatPrice(product.discountPrice || product.price)}
                </span>
                {product.discountPrice && (
                  <span className={`text-xl line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {product.description}
                </p>
              </div>

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Size: {selectedSize}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sizeOption) => (
                      <button
                        key={sizeOption.size}
                        onClick={() => setSelectedSize(sizeOption.size)}
                        disabled={sizeOption.stock <= 0}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                          selectedSize === sizeOption.size
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : isDark 
                              ? 'border-gray-600 text-gray-300 hover:border-gray-500' 
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {sizeOption.size}
                        {sizeOption.stock <= 5 && sizeOption.stock > 0 && (
                          <span className="ml-1 text-xs">({sizeOption.stock})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div>
                  <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Color: {selectedColor}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                          selectedColor === color
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : isDark 
                              ? 'border-gray-600 text-gray-300 hover:border-gray-500' 
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Quantity
                </h3>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center border rounded-lg ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`px-3 py-2 transition-colors ${
                        isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      -
                    </button>
                    <span className={`px-4 py-2 border-x ${isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'}`}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className={`px-3 py-2 transition-colors ${
                        isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      +
                    </button>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {product.stock} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleWishlist}
                  className={`p-4 border rounded-lg transition-colors ${
                    isWishlisted
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : isDark 
                        ? 'border-gray-600 text-gray-300 hover:border-gray-500' 
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className={`p-4 border rounded-lg transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:border-gray-500' 
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}>
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>

              {/* Features */}
              <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <FiTruck className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Free Shipping</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiRefreshCw className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Easy Returns</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>30-day return policy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiShield className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Secure Payment</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>SSL encrypted</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              {(product.brand || product.material || product.sku) && (
                <div className={`border-t pt-6 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Product Details
                  </h3>
                  <div className="space-y-2">
                    {product.brand && (
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Brand:</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{product.brand}</span>
                      </div>
                    )}
                    {product.material && (
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Material:</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{product.material}</span>
                      </div>
                    )}
                    {product.sku && (
                      <div className="flex justify-between">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>SKU:</span>
                        <span className={isDark ? 'text-white' : 'text-gray-900'}>{product.sku}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductDetail