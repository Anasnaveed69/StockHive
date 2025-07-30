// Vercel API handler
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('../routes/authRoutes');
const productRoutes = require('../routes/productRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://stock-hive-chi.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🐝 StockHive: Connected to MongoDB Atlas successfully!');
  } catch (error) {
    console.error('❌ StockHive: MongoDB connection error:', error.message);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ StockHive Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Export for Vercel
module.exports = app; 