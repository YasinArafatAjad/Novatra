# TechStyle - Modern E-commerce Platform

A full-stack e-commerce platform built with React, Node.js, Express, and MongoDB. Features a customer-facing website, admin dashboard, and comprehensive order management system.

## 🚀 Features

### Customer Website (Port 5173)
- **Product Browsing**: Browse products by category, search, and filter
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Register, login, profile management
- **Checkout Process**: Multi-step checkout with shipping and payment
- **Order Tracking**: Track order status and history
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Theme**: Toggle between themes

### Admin Dashboard (Port 3000)
- **Product Management**: Add, edit, delete products with image upload
- **Order Management**: View and update order status
- **User Management**: Manage customer accounts and roles
- **Analytics Dashboard**: Sales statistics and insights
- **Invoice Generation**: Generate and send invoices
- **Settings**: Configure website settings and preferences

### Backend API (Port 8000)
- **RESTful API**: Complete REST API for all operations
- **Authentication**: JWT-based authentication system
- **File Upload**: Cloudinary integration for image uploads
- **Email System**: Nodemailer for transactional emails
- **Database**: MongoDB with Mongoose ODM

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animations
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd techstyle-ecommerce
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# This will automatically install dependencies for all three projects
```

### 3. Environment Setup

#### Server Environment (.env in /server)
```env
PORT=8000
MONGODB_URI=mongodb://localhost:27017/techstyle
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/techstyle

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=development

# Cloudinary (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
CLOUDINARY_API_SECRET=your_api_secret

# Email settings (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=noreply@techstyle.com
FRONTEND_URL=http://localhost:5173
```

#### Client Environment (.env in /client)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WEBSITE_NAME=TechStyle
```

#### Dashboard Environment (.env in /dashboard)
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Start the Application

#### Option 1: Start All Services (Recommended)
```bash
npm run dev
```
This will start:
- Backend server on http://localhost:8000
- Admin dashboard on http://localhost:3000
- Customer website on http://localhost:5173

#### Option 2: Start Services Individually
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Admin Dashboard
npm run dashboard

# Terminal 3 - Customer Website
npm run client
```

## 🔐 Default Admin Account

When you first register a user, they will automatically become an admin. Subsequent registrations will be customers.

**First Registration becomes Admin:**
- Email: admin@techstyle.com
- Password: admin123
- Role: admin

## 📱 How to Use

### Customer Website (http://localhost:5173)

1. **Browse Products**
   - Visit the homepage to see featured products
   - Use the Products page to browse all items
   - Filter by category, price, or search for specific items

2. **Create Account & Login**
   - Click "Login" in the header
   - Register a new account or login with existing credentials
   - Update your profile information

3. **Shopping & Checkout**
   - Add products to cart
   - Adjust quantities in cart
   - Proceed to checkout (requires login)
   - Fill in shipping information
   - Complete mock payment process

4. **Order Management**
   - View order history in your account
   - Track order status
   - Download invoices

### Admin Dashboard (http://localhost:3000)

1. **Login as Admin**
   - Use admin credentials to access dashboard
   - View analytics and statistics

2. **Manage Products**
   - Add new products with images
   - Edit existing products
   - Manage inventory and pricing
   - Upload product images via Cloudinary

3. **Process Orders**
   - View all customer orders
   - Update order status (Pending → Processing → Shipped → Delivered)
   - Generate and send invoices

4. **User Management**
   - View all registered users
   - Change user roles (customer/employee/admin)
   - Activate/deactivate accounts

5. **Settings**
   - Configure website settings
   - Update business information
   - Manage email templates

## 🛒 Making Test Orders

### Step-by-Step Order Process:

1. **Customer Registration**
   ```
   - Go to http://localhost:5173
   - Click "Login" → "Sign up"
   - Fill registration form
   - Login with new account
   ```

2. **Browse & Add to Cart**
   ```
   - Browse products on homepage or Products page
   - Click on a product to view details
   - Select size/color if available
   - Click "Add to Cart"
   - View cart by clicking cart icon
   ```

3. **Checkout Process**
   ```
   - Click "Proceed to Checkout" in cart
   - Fill shipping information
   - Enter mock payment details:
     * Card: 4242 4242 4242 4242
     * Expiry: 12/25
     * CVV: 123
   - Review and place order
   ```

4. **Admin Order Management**
   ```
   - Go to http://localhost:3000
   - Login as admin
   - Navigate to Orders section
   - Update order status
   - Generate invoice
   ```

## 🎨 Customization

### Themes
- The application supports dark/light themes
- Toggle theme using the theme button in header
- Themes are persistent across sessions

### Styling
- Built with Tailwind CSS
- Custom color scheme defined in tailwind.config.js
- Responsive design for all screen sizes

### Adding Products
1. Login to admin dashboard
2. Go to Products → Add Product
3. Fill product information
4. Upload images (requires Cloudinary setup)
5. Set pricing and inventory
6. Publish product

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate token

### Products
- `GET /api/products/public` - Get all products (public)
- `GET /api/products/public/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status

### Users
- `GET /api/auth/users` - Get all users (admin)
- `PATCH /api/auth/users/:id/role` - Update user role

## 🚀 Deployment

### Backend Deployment
1. Deploy to services like Heroku, Railway, or DigitalOcean
2. Set environment variables
3. Ensure MongoDB connection

### Frontend Deployment
1. Build the applications:
   ```bash
   cd client && npm run build
   cd dashboard && npm run build
   ```
2. Deploy to Netlify, Vercel, or similar
3. Update API URLs in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Cloudinary Upload Issues**
   - Verify Cloudinary credentials
   - Check upload preset settings

3. **Port Already in Use**
   - Kill processes on ports 3000, 5173, 8000
   - Or change ports in package.json scripts

4. **CORS Issues**
   - Ensure frontend URLs are correct in backend CORS config

### Getting Help:
- Check the console for error messages
- Verify all environment variables are set
- Ensure all dependencies are installed
- Check network connectivity for external services

---

**Happy Coding! 🎉**