import { createContext, useContext, useState, useEffect } from 'react'
import { useNotification } from './NotificationContext'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const { showSuccess, showInfo } = useNotification()

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const existingItem = cartItems.find(item => 
      item._id === product._id && 
      item.selectedSize === selectedSize && 
      item.selectedColor === selectedColor
    )

    if (existingItem) {
      setCartItems(prev => prev.map(item =>
        item._id === product._id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
      showInfo(`Updated ${product.name} quantity in cart`)
    } else {
      const cartItem = {
        ...product,
        quantity,
        selectedSize,
        selectedColor,
        cartId: `${product._id}-${selectedSize}-${selectedColor}-${Date.now()}`
      }
      setCartItems(prev => [...prev, cartItem])
      showSuccess(`${product.name} added to cart`)
    }
  }

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId))
    showInfo('Item removed from cart')
  }

  const updateQuantity = (cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
      return
    }

    setCartItems(prev => prev.map(item =>
      item.cartId === cartId ? { ...item, quantity } : item
    ))
  }

  const clearCart = () => {
    setCartItems([])
    showInfo('Cart cleared')
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.price
      return total + (price * item.quantity)
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}