import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Accessories', 'Shoes'] 
  },
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 }, // optional
  stock: { type: Number, required: true, min: 0 },
  images: [{
    url: String,
    alt: String,
    public_id: String
  }],
  sizes: [{ size: String, stock: Number }],
  colors: [String],
  tags: [String],
  brand: { type: String },
  sku: { type: String },
  weight: { type: String },
  dimensions: { type: String },
  material: { type: String },
  warranty: { type: String },
  gender: { type: String, enum: ['Everyone', 'Men', 'Women', 'Kids'], default: 'Everyone' },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
