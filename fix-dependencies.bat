@echo off
echo 🔧 Fixing Radiance Academy Website Dependencies...
echo.

echo 📦 Installing root dependencies...
call npm install

echo.
echo 🎨 Fixing frontend dependencies...
cd frontend
call npm install --legacy-peer-deps
cd ..

echo.
echo ⚙️ Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo ✅ Dependencies fixed! 
echo.
echo 📋 Next steps:
echo 1. Install MongoDB: https://www.mongodb.com/try/download/community
echo 2. Create Cloudinary account: https://cloudinary.com/
echo 3. Configure backend/.env file with your credentials
echo 4. Run: npm run dev
echo.
pause