import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Delete image from Cloudinary
router.delete('/delete-image', authenticateToken, requireRole(['admin', 'employee']), async (req, res) => {
  try {
    const { public_id } = req.body

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      })
    }

    const result = await cloudinary.uploader.destroy(public_id)

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to delete image'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router