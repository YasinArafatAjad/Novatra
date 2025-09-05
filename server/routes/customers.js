import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-firebaseUid')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: customers
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router