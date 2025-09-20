import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Image, Calendar, Tag } from 'lucide-react'
import GalleryGrid from '../components/GalleryGrid'
import { useApi } from '../context/ApiContext'

const Gallery = () => {
  const { fetchGallery, loading } = useApi()
  const [galleryItems, setGalleryItems] = useState([])
  const [stats, setStats] = useState({
    totalImages: 0,
    categories: 0,
    events: 0,
    years: 0
  })

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await fetchGallery({ limit: 100 })
        const items = data.items || []
        setGalleryItems(items)

        // Calculate stats
        const categories = new Set(items.map(item => item.category))
        const events = items.filter(item => item.category === 'Events').length
        const years = new Set(items.map(item => new Date(item.date).getFullYear()))

        setStats({
          totalImages: items.length,
          categories: categories.size,
          events,
          years: years.size
        })
      } catch (error) {
        console.error('Error loading gallery:', error)
      }
    }

    loadGallery()
  }, [])

  const highlights = [
    {
      icon: Camera,
      title: 'Capturing Moments',
      description: 'Every picture tells a story of growth, achievement, and memorable experiences at Masters Academy.'
    },
    {
      icon: Image,
      title: 'Visual Journey',
      description: 'From classroom sessions to cultural events, explore the vibrant life of our academy through images.'
    },
    {
      icon: Calendar,
      title: 'Timeline of Events',
      description: 'Witness the evolution of our academy through years of celebrations, achievements, and milestones.'
    },
    {
      icon: Tag,
      title: 'Diverse Categories',
      description: 'Academic excellence, cultural programs, sports events, and campus life - all captured beautifully.'
    }
  ]

  if (loading) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="section-padding hero-gradient">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              A visual journey through the vibrant life at Masters Academy
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore our collection of memorable moments, achievements, events, and the 
              everyday life that makes Masters Academy a special place for learning and growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stats.totalImages}+
              </div>
              <div className="text-gray-600">Total Images</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-secondary-600 mb-2">
                {stats.categories}
              </div>
              <div className="text-gray-600">Categories</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                {stats.events}+
              </div>
              <div className="text-gray-600">Events Covered</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {stats.years}+
              </div>
              <div className="text-gray-600">Years Documented</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Our Gallery Special
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every image in our gallery represents a moment of learning, growth, and achievement
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <highlight.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Our Moments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse through our collection of images showcasing the vibrant life at Masters Academy
            </p>
          </motion.div>

          <GalleryGrid items={galleryItems} />
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the most popular categories in our gallery
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Events', count: galleryItems.filter(item => item.category === 'Events').length, color: 'bg-blue-500' },
              { name: 'Academic', count: galleryItems.filter(item => item.category === 'Academic').length, color: 'bg-green-500' },
              { name: 'Cultural', count: galleryItems.filter(item => item.category === 'Cultural').length, color: 'bg-purple-500' },
              { name: 'Sports', count: galleryItems.filter(item => item.category === 'Sports').length, color: 'bg-orange-500' }
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Image className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-2xl font-bold text-primary-600 mb-1">
                  {category.count}
                </p>
                <p className="text-sm text-gray-600">
                  Images
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Be Part of Our Story
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join Masters Academy and create your own memorable moments that could be featured in our gallery
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Explore Courses
                <Camera className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Contact Us
                <Image className="ml-2 h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Gallery