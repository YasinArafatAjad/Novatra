import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import SEOHelmet from '../components/SEOHelmet'
import { useTheme } from '../contexts/ThemeContext'

const Cart = () => {
  const { isDark } = useTheme()
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [promoCode, setPromoCode] = useState('')

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(price)
  }

  const subtotal = getCartTotal()
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } })
      return
    }
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <>
        <SEOHelmet 
          title="Shopping Cart"
          description="Your shopping cart is empty. Browse our products and add items to your cart."
        />
        
        <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="container mx-auto px-4 py-12">
            <div className={`max-w-md mx-auto text-center p-8 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <FiShoppingBag className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Your cart is empty
              </h2>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Shopping
                <FiArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEOHelmet 
        title="Shopping Cart"
        description="Review your selected items and proceed to checkout."
      />

      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Shopping Cart ({cartItems.length} items)
            </h1>
            <button
              onClick={clearCart}
              className={`text-sm transition-colors ${
                isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartId} className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.images?.[0]?.url || 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        <Link 
                          to={`/products/${item._id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </h3>
                      <p className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.category}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        {item.selectedSize && (
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Color: {item.selectedColor}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatPrice((item.discountPrice || item.price) * item.quantity)}
                      </div>
                      {item.discountPrice && (
                        <div className={`text-sm line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className={`p-1 rounded transition-colors ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className={`px-3 py-1 border rounded ${
                        isDark ? 'border-gray-600 text-white' : 'border-gray-300 text-gray-900'
                      }`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className={`p-1 rounded transition-colors ${
                          isDark 
                            ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className={`p-2 rounded transition-colors ${
                        isDark 
                          ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                      }`}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-xl shadow-sm sticky top-24 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code"
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                    <button className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Subtotal:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Shipping:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tax:</span>
                    <span className={isDark ? 'text-white' : 'text-gray-900'}>{formatPrice(tax)}</span>
                  </div>
                  <div className={`border-t pt-3 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total:</span>
                      <span className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 100 && (
                  <div className={`p-3 rounded-lg mb-6 ${isDark ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                      Add {formatPrice(100 - subtotal)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <FiArrowRight className="w-4 h-4" />
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className={`block text-center mt-4 transition-colors ${
                    isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart