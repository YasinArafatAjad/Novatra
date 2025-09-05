import express from 'express'
import Order from '../models/Order.js'
import ReturnRequest from '../models/ReturnRequest.js'
import Invoice from '../models/Invoice.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'
import PDFDocument from 'pdfkit'

const router = express.Router()

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query
    
    const query = {}
    if (status) query.status = status

    const orders = await Order.find(query)
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(query)

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Create new order
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body
    
    let subtotal = 0
    const orderItems = []

    // Validate and calculate order items
    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${item.productId}`
        })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        })
      }

      const itemTotal = product.price * item.quantity
      subtotal += itemTotal

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: product.price
      })

      // Update product stock
      product.stock -= item.quantity
      await product.save()
    }

    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping

    const order = new Order({
      customer: req.user._id || 'mew 123',
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      notes
    })

    await order.save()
    await order.populate('customer', 'firstName lastName email')
    await order.populate('items.product', 'name price')

    res.status(201).json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update order status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('customer', 'firstName lastName email')
     .populate('items.product', 'name price')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Track order by order number
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate('customer', 'firstName lastName email')
      .populate('items.product', 'name price')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Get return request if exists
    const returnRequest = await ReturnRequest.findOne({ order: order._id })

    res.json({
      success: true,
      data: {
        ...order.toObject(),
        returnRequest
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Download invoice PDF
router.get('/:id/invoice', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'firstName lastName email address')
      .populate('items.product', 'name')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 })
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`)
    
    // Pipe PDF to response
    doc.pipe(res)

    // Header
    doc.fontSize(20).text('T-Shirt', 50, 50)
    doc.fontSize(10).text('Professional Clothing Store', 50, 75)
    
    // Invoice details
    doc.fontSize(16).text(`Invoice ${order.orderNumber}`, 400, 50)
    doc.fontSize(10).text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 75)

    // Customer details
    doc.fontSize(12).text('Bill To:', 50, 150)
    doc.fontSize(10)
      .text(`${order.customer.firstName} ${order.customer.lastName}`, 50, 170)
      .text(order.customer.email, 50, 185)

    if (order.shippingAddress) {
      doc.text(order.shippingAddress.street || '', 50, 200)
      doc.text(`${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zipCode || ''}`, 50, 215)
    }

    // Items table
    let yPosition = 280
    doc.fontSize(12).text('Items:', 50, yPosition)
    yPosition += 20

    // Table headers
    doc.fontSize(10)
      .text('Item', 50, yPosition)
      .text('Qty', 300, yPosition)
      .text('Price', 350, yPosition)
      .text('Total', 450, yPosition)
    
    yPosition += 20
    doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke()
    yPosition += 10

    // Items
    order.items.forEach(item => {
      doc.text(item.product.name, 50, yPosition)
      doc.text(item.quantity.toString(), 300, yPosition)
      doc.text(`৳${item.price.toFixed(2)}`, 350, yPosition)
      doc.text(`৳${(item.price * item.quantity).toFixed(2)}`, 450, yPosition)
      yPosition += 20
    })

    // Totals
    yPosition += 20
    doc.moveTo(350, yPosition).lineTo(550, yPosition).stroke()
    yPosition += 10

    doc.text('Subtotal:', 350, yPosition)
    doc.text(`৳${order.subtotal.toFixed(2)}`, 450, yPosition)
    yPosition += 15

    doc.text('Tax:', 350, yPosition)
    doc.text(`৳${order.tax.toFixed(2)}`, 450, yPosition)
    yPosition += 15

    doc.text('Shipping:', 350, yPosition)
    doc.text(`৳${order.shipping.toFixed(2)}`, 450, yPosition)
    yPosition += 15

    doc.fontSize(12).text('Total:', 350, yPosition)
    doc.text(`৳${order.total.toFixed(2)}`, 450, yPosition)

    // Footer
    doc.fontSize(8).text('Thank you for your business!', 50, 700, { align: 'center' })

    doc.end()
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Submit return/exchange request
router.post('/:id/return-request', authenticateToken, async (req, res) => {
  try {
    const { type, reason, items } = req.body
    
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({
        success: false,
        message: 'Can only request return/exchange for delivered orders'
      })
    }

    // Check if return request already exists
    const existingRequest = await ReturnRequest.findOne({ order: order._id })
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Return/exchange request already exists for this order'
      })
    }

    const returnRequest = new ReturnRequest({
      order: order._id,
      customer: req.user._id,
      type,
      reason,
      items: items || order.items.map(item => ({
        product: item.product,
        quantity: item.quantity
      }))
    })

    await returnRequest.save()

    res.status(201).json({
      success: true,
      data: returnRequest,
      message: 'Return/exchange request submitted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router