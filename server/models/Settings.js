import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'T-Shirt'
  },
  siteDescription: {
    type: String,
    default: 'Professional clothing dashboard'
  },
  contactEmail: {
    type: String,
    default: 'admin@T-Shirt.com'
  },
  supportPhone: {
    type: String,
    default: '+1-234-567-8900'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  businessSettings: {
    currency: {
      type: String,
      default: 'BDT'
    },
    taxRate: {
      type: Number,
      default: 8
    },
    shippingFee: {
      type: Number,
      default: 10
    },
    freeShippingThreshold: {
      type: Number,
      default: 100
    }
  },
  emailSettings: {
    smtpHost: String,
    smtpPort: {
      type: Number,
      default: 587
    },
    smtpUser: String,
    smtpPassword: String,
    fromEmail: String,
    fromName: {
      type: String,
      default: 'T-Shirt Team'
    }
  },
  branding: {
    darkLogo: String,
    lightLogo: String,
    favicon: String
  }
}, {
  timestamps: true
})

export default mongoose.model('Settings', settingsSchema)