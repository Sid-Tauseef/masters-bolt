# 🚀 Local Setup Guide for Masters Academy Website

## Prerequisites

Before setting up the project, make sure you have the following installed:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone and Navigate to Project
```bash
git clone https://github.com/itzMeDollar/masters-bolt.git
cd masters-bolt
```

### 2. Install Root Dependencies
```bash
npm install
```

### 3. Fix Frontend Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
cd ..
```

### 4. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 5. Setup MongoDB

#### Option A: Local MongoDB Installation
1. **Install MongoDB Community Server** from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. **Start MongoDB Service:**
   - **Windows:** MongoDB should start automatically after installation
   - **macOS:** `brew services start mongodb/brew/mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and replace in `.env` file

### 6. Setup Cloudinary (Image Storage)
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret

### 7. Configure Environment Variables
Create `backend/.env` file with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/radiance-academy
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
PORT=5000
NODE_ENV=development
```

### 8. Seed Database with Sample Data
```bash
cd backend
npm run seed
cd ..
```

### 9. Start Development Servers
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend server on http://localhost:3000

## 🔧 Troubleshooting

### Frontend ESLint Error
If you get ESLint dependency conflicts:
```bash
cd frontend
npm install --legacy-peer-deps
```

### MongoDB Connection Error
1. **Check if MongoDB is running:**
   - Windows: Check Services for "MongoDB Server"
   - macOS/Linux: `ps aux | grep mongod`

2. **Start MongoDB manually:**
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`

### Port Already in Use
If ports 3000 or 5000 are busy:
1. Kill processes: `npx kill-port 3000 5000`
2. Or change ports in `frontend/vite.config.js` and `backend/.env`

### Cloudinary Issues
- Make sure you've copied the correct credentials from Cloudinary dashboard
- Check that your Cloudinary account is active

## 🎯 Default Admin Access

After seeding the database:
- **URL:** http://localhost:3000/admin
- **Email:** admin@radianceacademy.com
- **Password:** admin123

## 📁 Project Structure
```
masters-bolt/
├── backend/          # Node.js API server
├── frontend/         # React frontend
├── package.json      # Root package file
└── README.md
```

## 🚀 Production Deployment

For production deployment:
1. Set `NODE_ENV=production` in backend `.env`
2. Update MongoDB URI to production database
3. Update Cloudinary credentials for production
4. Build frontend: `cd frontend && npm run build`
5. Deploy backend to services like Railway, Render, or Heroku
6. Deploy frontend to Vercel, Netlify, or similar

## 📞 Need Help?

If you encounter any issues:
1. Check that all prerequisites are installed
2. Ensure MongoDB is running
3. Verify environment variables are correct
4. Check console logs for specific error messages

Happy coding! 🎉