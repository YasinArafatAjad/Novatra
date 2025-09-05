import express from 'express'
import Product from '../models/Product.js'
import User from '../models/User.js'
import Order from '../models/Order.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [productCount, customerCount, orderCount, pendingOrderCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' })
    ])

    // Calculate total revenue
    const revenueResult = await Order.aggregate([
      { $match: { status: { $in: ['Shipped', 'Delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    const totalRevenue = revenueResult[0]?.total || 0

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'firstName lastName')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5)

    // Get top products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' }
    ])

    // Get sales by category
    const categoryStats = await Order.aggregate([
      { $unwind: '$items' },
      { $lookup: {
        from: 'products',
        localField: 'items.product',
        foreignField: '_id',
        as: 'product'
      }},
      { $unwind: '$product' },
      { $group: {
        _id: '$product.category',
        totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        totalItems: { $sum: '$items.quantity' }
      }},
      { $sort: { totalSales: -1 } }
    ])

    res.json({
      success: true,
      data: {
        totalProducts: productCount,
        totalOrders: orderCount,
        pendingOrders: pendingOrderCount,
        totalRevenue,
        totalCustomers: customerCount,
        recentOrders,
        topProducts,
        categoryStats
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Get sales analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { period = '7d' } = req.query
    
    let dateFilter = new Date()
    switch (period) {
      case '7d':
        dateFilter.setDate(dateFilter.getDate() - 7)
        break
      case '30d':
        dateFilter.setDate(dateFilter.getDate() - 30)
        break
      case '90d':
        dateFilter.setDate(dateFilter.getDate() - 90)
        break
      default:
        dateFilter.setDate(dateFilter.getDate() - 7)
    }

    // Daily sales for the period
    const dailySales = await Order.aggregate([
      { $match: { 
        createdAt: { $gte: dateFilter },
        status: { $in: ['Shipped', 'Delivered'] }
      }},
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        sales: { $sum: '$total' },
        orders: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ])

    // Conversion metrics
    const totalVisitors = Math.floor(Math.random() * 1000) + 500 // Mock data
    const conversionRate = ((orderCount / totalVisitors) * 100).toFixed(2)

    res.json({
      success: true,
      data: {
        dailySales,
        conversionRate,
        totalVisitors
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