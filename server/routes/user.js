import express from 'express'
import Order from '../models/Order.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get user dashboard data
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id

    // Get user orders
    const orders = await Order.find({ customer: userId })
      .populate('items.product', 'name category')
      .sort({ createdAt: -1 })

    // Calculate stats
    const totalOrders = orders.length
    const totalReceived = orders.filter(order => order.status === 'Delivered').length
    const totalCancelled = orders.filter(order => order.status === 'Cancelled').length
    const totalSpent = orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0)

    // Order status breakdown
    const orderStatus = [
      { status: 'Pending', count: orders.filter(o => o.status === 'Pending').length },
      { status: 'Processing', count: orders.filter(o => o.status === 'Processing').length },
      { status: 'Shipped', count: orders.filter(o => o.status === 'Shipped').length },
      { status: 'Delivered', count: orders.filter(o => o.status === 'Delivered').length },
      { status: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
    ].filter(item => item.count > 0)

    // Category spending
    const categorySpending = {}
    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        order.items.forEach(item => {
          const category = item.product?.category || 'Other'
          if (!categorySpending[category]) {
            categorySpending[category] = 0
          }
          categorySpending[category] += item.price * item.quantity
        })
      }
    })

    const categoryStats = Object.entries(categorySpending).map(([category, spent]) => ({
      category,
      spent
    }))

    // Mock wishlist count (you can implement actual wishlist later)
    const wishlistCount = 5

    res.json({
      success: true,
      data: {
        user: req.user,
        stats: {
          totalOrders,
          totalReceived,
          totalCancelled,
          totalSpent,
          wishlistCount,
          orderStatus,
          categoryStats
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router