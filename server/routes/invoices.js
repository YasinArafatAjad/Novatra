import express from 'express'
import Order from '../models/Order.js'
import Invoice from '../models/Invoice.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'
import PDFDocument from 'pdfkit'
import nodemailer from 'nodemailer'

const router = express.Router()

// Get all invoices
router.get('/', authenticateToken, requireRole(['admin', 'employee']), async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('order', 'orderNumber')
      .populate('customer', 'firstName lastName email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: invoices
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Generate invoice for order
router.post('/generate/:orderId', authenticateToken, requireRole(['admin', 'employee']), async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customer', 'firstName lastName email address')
      .populate('items.product', 'name price')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      })
    }

    // Check if invoice already exists
    let invoice = await Invoice.findOne({ order: order._id })
    
    if (!invoice) {
      const invoiceCount = await Invoice.countDocuments()
      const invoiceNumber = `INV-${(invoiceCount + 1001).toString().padStart(4, '0')}`

      invoice = new Invoice({
        invoiceNumber,
        order: order._id,
        customer: order.customer._id,
        amount: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        items: order.items,
        status: order.paymentStatus === 'Paid' ? 'paid' : 'pending'
      })

      await invoice.save()
    }

    await invoice.populate('order', 'orderNumber')
    await invoice.populate('customer', 'firstName lastName email')

    res.json({
      success: true,
      data: invoice
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Download invoice PDF
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('order', 'orderNumber createdAt')
      .populate('customer', 'firstName lastName email address')
      .populate('items.product', 'name')

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      })
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 })
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`)
    
    // Pipe PDF to response
    doc.pipe(res)

    // Header
    doc.fontSize(20).text('T-Shirt', 50, 50)
    doc.fontSize(10).text('Professional Clothing Store', 50, 75)
    
    // Invoice details
    doc.fontSize(16).text(`Invoice ${invoice.invoiceNumber}`, 400, 50)
    doc.fontSize(10).text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 400, 75)
    doc.text(`Order: ${invoice.order.orderNumber}`, 400, 90)

    // Customer details
    doc.fontSize(12).text('Bill To:', 50, 150)
    doc.fontSize(10)
      .text(`${invoice.customer.firstName} ${invoice.customer.lastName}`, 50, 170)
      .text(invoice.customer.email, 50, 185)

    if (invoice.customer.address) {
      doc.text(invoice.customer.address.street || '', 50, 200)
      doc.text(`${invoice.customer.address.city || ''}, ${invoice.customer.address.state || ''} ${invoice.customer.address.zipCode || ''}`, 50, 215)
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
    invoice.items.forEach(item => {
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
    doc.text(`৳${invoice.subtotal.toFixed(2)}`, 450, yPosition)
    yPosition += 15

    doc.text('Tax:', 350, yPosition)
    doc.text(`৳${invoice.tax.toFixed(2)}`, 450, yPosition)
    yPosition += 15

    doc.text('Shipping:', 350, yPosition)
    doc.text(`৳${invoice.shipping.toFixed(2)}`, 450, yPosition)
    yPosition += 15

    doc.fontSize(12).text('Total:', 350, yPosition)
    doc.text(`৳${invoice.amount.toFixed(2)}`, 450, yPosition)

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

// Send invoice via email
router.post('/:id/send-email', authenticateToken, requireRole(['admin', 'employee']), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'firstName lastName email')
      .populate('order', 'orderNumber')

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      })
    }

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@T-Shirt.com',
      to: invoice.customer.email,
      subject: `Invoice ${invoice.invoiceNumber} - T-Shirt`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invoice ${invoice.invoiceNumber}</h2>
          <p>Dear ${invoice.customer.firstName} ${invoice.customer.lastName},</p>
          <p>Please find attached your invoice for order ${invoice.order.orderNumber}.</p>
          <p>Amount: ৳${invoice.amount.toFixed(2)}</p>
          <p>Status: ${invoice.status}</p>
          <p>Thank you for your business!</p>
          <hr>
          <p style="color: #666; font-size: 12px;">T-Shirt - Professional Clothing Store</p>
        </div>
      `
    })

    res.json({
      success: true,
      message: 'Invoice sent successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router