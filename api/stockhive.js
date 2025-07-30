const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Product = require('../models/Product');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://stock-hive-chi.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Database connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🐝 StockHive: Connected to MongoDB Atlas successfully!');
  }
};

// Connect to database
connectDB();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Auth middleware
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get current user
app.get('/api/auth/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

// Products routes
app.get('/api/products', protect, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id });
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

app.post('/api/products', protect, async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product'
    });
  }
});

// Update product
app.put('/api/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
});

// Delete product
app.delete('/api/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// Search products
app.get('/api/products/search/:query', protect, async (req, res) => {
  try {
    const searchRegex = new RegExp(req.params.query, 'i');
    const products = await Product.find({
      user: req.user._id,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    });
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products'
    });
  }
});

// Get products by category
app.get('/api/products/category/:category', protect, async (req, res) => {
  try {
    const products = await Product.find({ 
      user: req.user._id,
      category: req.params.category 
    });
    
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category'
    });
  }
});

// Get single product (must be last to avoid conflicts)
app.get('/api/products/:id', protect, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// Get categories
app.get('/api/categories', protect, async (req, res) => {
  try {
    const categories = await Product.distinct('category', { user: req.user._id });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// Get product statistics
app.get('/api/products/stats', protect, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ user: req.user._id });
    const lowStockProducts = await Product.countDocuments({ 
      user: req.user._id,
      quantity: { $lte: 10 }
    });
    const outOfStockProducts = await Product.countDocuments({ 
      user: req.user._id,
      quantity: { $lte: 0 }
    });
    
    const totalValue = await Product.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalValue: totalValue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// Export for Vercel
module.exports = app; 