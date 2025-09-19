import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ApiProvider } from './context/ApiContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Courses from './pages/Courses'
import Achievements from './pages/Achievements'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import About from './pages/About'

function App() {
  return (
    <ApiProvider>
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
    </ApiProvider>
  )
}

export default App