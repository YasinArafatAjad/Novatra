import express from "express";
import Product from "../models/Product.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes (no authentication required)

// Get all products (public)
router.get("/public", async (req, res) => {
  try {
    const { category, featured, limit = 20, page = 1, sortBy, inStock, minPrice, maxPrice } = req.query;
    
    const query = { isActive: true };
    if (category && category !== 'all') {
      query.category = new RegExp(category, 'i');
    }
    if (featured === 'true') {
      query.featured = true;
    }
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortOptions = { createdAt: -1 };
    switch (sortBy) {
      case 'price-low':
        sortOptions = { price: 1 };
        break;
      case 'price-high':
        sortOptions = { price: -1 };
        break;
      case 'popular':
        sortOptions = { featured: -1, createdAt: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get featured products (public)
router.get("/public/featured", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .limit(8)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get categories (public)
router.get("/public/categories", async (req, res) => {
  try {
    // Get distinct category names
    const categories = await Product.distinct("category");

    res.json({
      success: true,
      data: categories // e.g. ["Tops", "Bottoms", "Dresses"]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get single product (public)
router.get("/public/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Protected routes (authentication required)

// Get single Product
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all products
router.get("/", authenticateToken, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const total = await Product.countDocuments();

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create new product
router.post(
  "/",
  authenticateToken,
  requireRole(["admin", "employee"]),
  async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();

      res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Update product
router.put(
  "/:id",
  authenticateToken,
  requireRole(["admin", "employee"]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete product (soft delete)
router.delete(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;
