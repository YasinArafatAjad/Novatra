import express from 'express'
import Settings from '../models/Settings.js'
import { authenticateToken, requireRole } from '../middleware/auth.js'

const router = express.Router()

// Get settings
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    let settings = await Settings.findOne()
    
    if (!settings) {
      settings = new Settings()
      await settings.save()
    }

    res.json({
      success: true,
      data: settings
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// Update settings
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      // Deep merge for nested objects
      settings.siteName = req.body.siteName || settings.siteName;
      settings.siteDescription = req.body.siteDescription || settings.siteDescription;
      settings.contactEmail = req.body.contactEmail || settings.contactEmail;
      settings.supportPhone = req.body.supportPhone || settings.supportPhone;
      
      if (req.body.address) {
        settings.address = { ...settings.address, ...req.body.address };
      }
      
      if (req.body.socialMedia) {
        settings.socialMedia = { ...settings.socialMedia, ...req.body.socialMedia };
      }
      
      if (req.body.businessSettings) {
        settings.businessSettings = { ...settings.businessSettings, ...req.body.businessSettings };
      }
      
      if (req.body.emailSettings) {
        settings.emailSettings = { ...settings.emailSettings, ...req.body.emailSettings };
      }
      
      if (req.body.branding) {
        settings.branding = { ...settings.branding, ...req.body.branding };
      }
    }
    
    await settings.save();

    res.json({
      success: true,
      data: settings,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router