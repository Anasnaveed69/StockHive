# StockHive 🐝

**Central hub for all your products**

A modern, authenticated product management system built with Node.js, Express, MongoDB, and vanilla JavaScript. StockHive provides a secure and intuitive interface for managing your product inventory with real-time updates and comprehensive CRUD operations.

## 🚀 Features

### 🔐 Authentication System
- **User Registration & Login** with secure password hashing
- **JWT Token-based Authentication** for secure sessions
- **Protected Routes** ensuring only authenticated users can access features
- **Automatic Session Management** with token validation

### 📦 Product Management
- **Add New Products** with comprehensive details (name, brand, description, price, category, image, stock)
- **View All Products** in an organized grid layout
- **Edit Existing Products** with real-time updates
- **Delete Products** with confirmation dialogs
- **Search Products** by name, description, or category
- **Filter by Categories** for easy navigation

### 🎨 Modern UI/UX
- **Responsive Design** that works on all devices
- **Dark/Light Theme Toggle** for user preference
- **Professional Interface** with smooth animations
- **Real-time Statistics** showing total products, categories, and price ranges
- **Interactive Product Cards** with hover effects

### 🔧 Technical Features
- **MongoDB Atlas Integration** for cloud database storage
- **RESTful API** with proper HTTP status codes
- **Error Handling** with user-friendly messages
- **Form Validation** for data integrity
- **Image Support** with fallback placeholders

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcryptjs
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## 📋 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Product Routes (Protected)
- `GET /api/products` - Get all products for the user
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get a specific product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product
- `GET /api/products/search?query=...` - Search products
- `GET /api/products/category/:categoryName` - Filter by category

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
```bash
   git clone <repository-url>
   cd stockhive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `config.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=3000
   ```

4. **Start the application**
```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
stockhive/
├── controllers/
│   ├── authController.js
│   └── productController.js
├── data/
│   └── products.json
├── middleware/
│   └── auth.js
├── models/
│   ├── Product.js
│   └── User.js
├── public/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
├── utils/
│   └── addMoreProducts.js
├── config.env
├── index.js
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `PORT`: Server port (default: 3000)

### Database Schema

#### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  timestamps: true
}
```

#### Product Model
```javascript
{
  name: String (required),
  brand: String,
  description: String,
  price: Number (required),
  category: String (required),
  image: String,
  stock: Number (default: 0),
  user: ObjectId (required, ref: 'User'),
  timestamps: true
}
```

## 🎨 UI Features

### Responsive Design
- **Desktop**: Full-featured interface with side-by-side layouts
- **Tablet**: Optimized layouts with adjusted spacing
- **Mobile**: Stacked layouts with touch-friendly buttons

### Theme System
- **Light Theme**: Clean, modern appearance
- **Dark Theme**: Easy on the eyes with proper contrast
- **Automatic Persistence** of theme preference

### Interactive Elements
- **Hover Effects**: Smooth transitions and visual feedback
- **Loading States**: Spinner animations during API calls
- **Toast Notifications**: Success, error, and info messages
- **Modal Dialogs**: Product details and confirmation dialogs

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Stateless authentication with tokens
- **Protected Routes**: Middleware-based route protection
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing

## 🚀 Deployment

### Heroku Deployment
1. Create a Heroku account and install Heroku CLI
2. Initialize git repository and connect to Heroku
3. Set environment variables in Heroku dashboard
4. Deploy using `git push heroku main`

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed description
3. Contact the development team

## 🔮 Future Enhancements

- [ ] **Bulk Operations**: Import/export products via CSV
- [ ] **Advanced Search**: Filter by price range, date, etc.
- [ ] **Product Images**: File upload and image management
- [ ] **User Roles**: Admin and regular user permissions
- [ ] **Analytics Dashboard**: Sales reports and insights
- [ ] **API Documentation**: Swagger/OpenAPI integration
- [ ] **Real-time Updates**: WebSocket integration
- [ ] **Mobile App**: React Native companion app

---

**Built with ❤️ for efficient product management**

*StockHive - Central hub for all your products* 