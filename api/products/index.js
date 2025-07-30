const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Product = require('../../models/Product');

// Database connection
const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
};

// Auth middleware
const authenticateUser = async (req) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new Error('Not authorized');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();
    const user = await authenticateUser(req);

    // GET - Fetch all products
    if (req.method === 'GET') {
      const products = await Product.find({ user: user._id });
      return res.json({
        success: true,
        data: products
      });
    }

    // POST - Create new product
    if (req.method === 'POST') {
      const product = await Product.create({
        ...req.body,
        user: user._id
      });
      return res.status(201).json({
        success: true,
        data: product
      });
    }

    // PUT - Update product
    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      const product = await Product.findOneAndUpdate(
        { _id: id, user: user._id },
        updateData,
        { new: true }
      );
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      return res.json({
        success: true,
        data: product
      });
    }

    // DELETE - Delete product
    if (req.method === 'DELETE') {
      const { id } = req.query;
      const product = await Product.findOneAndDelete({ _id: id, user: user._id });
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
      
      return res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });

  } catch (error) {
    console.error('Products API error:', error);
    
    if (error.message === 'Not authorized' || error.message === 'User not found') {
      return res.status(401).json({ 
        success: false, 
        message: error.message 
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}; 