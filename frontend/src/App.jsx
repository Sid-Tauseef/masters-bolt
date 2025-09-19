import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ApiProvider } from './context/ApiContext'
import { AuthProvider } from './context/AuthContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Courses from './pages/Courses'
import Achievements from './pages/Achievements'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import About from './pages/About'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminCourses from './pages/admin/Courses'
import AdminToppers from './pages/admin/Toppers'
import AdminAchievements from './pages/admin/Achievements'
import AdminGallery from './pages/admin/Gallery'
import AdminContacts from './pages/admin/Contacts'
import AdminHomeContent from './pages/admin/HomeContent'

function App() {
  return (
    <AuthProvider>
      <ApiProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/*" element={
            <div className="min-h-screen bg-white">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="toppers" element={<AdminToppers />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="home" element={<AdminHomeContent />} />
          </Route>
        </Routes>
      </ApiProvider>
    </AuthProvider>
  )
}

export default App