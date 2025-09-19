# Radiance Academy Website

A modern educational academy website built with React frontend and Node.js/MongoDB backend.

## Features

- 🎨 Modern, responsive design inspired by Dhruv Rathee Academy
- 📚 Complete course management system
- 🏆 Achievements and toppers showcase
- 🖼️ Dynamic gallery with Cloudinary integration
- 📞 Contact management system
- 🔐 Admin panel with authentication
- 📱 Mobile-first responsive design

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Cloudinary for media storage
- Multer for file uploads

## Installation

1. Clone the repository
2. Install dependencies for all packages:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your MongoDB connection string and Cloudinary credentials

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/radiance-academy
JWT_SECRET=your-jwt-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=5000
```

## API Endpoints

### Public Routes
- `GET /api/courses` - Get all courses
- `GET /api/toppers` - Get all toppers
- `GET /api/achievements` - Get all achievements
- `GET /api/gallery` - Get gallery items
- `GET /api/home` - Get home page content
- `POST /api/contact` - Submit contact form

### Admin Routes (Protected)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- CRUD operations for all entities

## Project Structure

```
academy-website/
├── backend/          # Node.js/Express backend
├── frontend/         # React frontend
├── package.json      # Root package.json
└── README.md
```

## Deployment

1. Set up MongoDB database (MongoDB Atlas recommended)
2. Configure Cloudinary account
3. Deploy backend to services like Railway, Render, or Heroku
4. Deploy frontend to Vercel, Netlify, or similar
5. Update API URLs in frontend configuration

## Admin Panel

Access the admin panel at `/admin` with default credentials:
- Email: admin@radianceacademy.com
- Password: admin123

**Important**: Change these credentials in production!