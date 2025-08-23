# 🛍️ Mavericks - Modern E-commerce Platform

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://mavericks-app.vercel.app)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A full-featured e-commerce platform built with modern web technologies, offering a seamless shopping experience.

## 🚀 Features

### User Features
- 🔐 Secure authentication (Register/Login/Logout)
- 🛒 Shopping cart management
- 📦 Order history and tracking
- 👤 User profile management
- 🔍 Advanced product search and filtering
- ⭐ Product reviews and ratings

### Admin Features
- 📊 Dashboard with sales analytics
- 🏷️ Product management (CRUD operations)
- 📝 Order management
- 👥 User management

## 🛠️ Tech Stack

### Frontend
- ⚛️ React.js
- 🎨 Tailwind CSS
- 🔄 React Router
- 🚀 Vite
- 📱 Fully responsive design

### Backend
- 🟢 Node.js
- 🚄 Express.js
- 🍃 MongoDB (with Mongoose)
- 🔐 JWT Authentication
- 🌐 RESTful API

### Deployment
- ☁️ Vercel (Frontend)
- 🚀 Render (Backend)
- 🍃 MongoDB Atlas (Database)
- 🌐 Cloudinary (Image Storage)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinayak746/Mavericks.git
   cd Mavericks
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the `backend` directory with:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     ```

4. **Running the application**
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # In a new terminal, start frontend (from frontend directory)
   cd frontend
   npm run dev
   ```

## 📂 Project Structure

```
Mavericks/
├── admin/              # Admin dashboard frontend
├── backend/            # Backend server
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   └── routes/         # API routes
├── frontend/           # Main frontend application
│   ├── public/         # Static files
│   └── src/            # React components and logic
└── README.md           # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

Author: [Vinayak](https://github.com/vinayak746/)
