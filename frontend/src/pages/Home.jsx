import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Users, 
  Trophy, 
  BookOpen, 
  Star,
  Quote,
  Calendar,
  Award,
  Target,
  Eye
} from 'lucide-react'

import Hero from '../components/Hero'
import CourseCard from '../components/CourseCard'
import { useApi } from '../context/ApiContext'

const Home = () => {
  const { fetchHomeSections, fetchCourses, fetchToppers, fetchAchievements } = useApi()
  const [homeData, setHomeData] = useState({})
  const [courses, setCourses] = useState([])
  const [toppers, setToppers] = useState([])
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load all data in parallel
        const [homeSections, coursesData, toppersData, achievementsData] = await Promise.all([
          fetchHomeSections(),
          fetchCourses({ limit: 3 }),
          fetchToppers({ featured: true, limit: 3 }),
          fetchAchievements({ featured: true, limit: 3 })
        ])

        // Process home sections
        const sectionsMap = {}
        homeSections.forEach(section => {
          sectionsMap[section.section] = section
        })
        setHomeData(sectionsMap)

        setCourses(coursesData.courses || [])
        setToppers(toppersData.toppers || [])
        setAchievements(achievementsData.achievements || [])
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero Section */}
      <Hero data={homeData.hero} />

      {/* About Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <img
                src={homeData.about?.image || 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt="About Masters Academy"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {homeData.about?.title || 'About Masters Academy'}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {homeData.about?.content || 'Masters Academy has been a beacon of educational excellence for over a decade. We specialize in competitive exam preparation, academic support, and skill development programs that prepare students for success in their academic and professional journeys.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">15+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary-600">5000+</div>
                  <div className="text-sm text-gray-600">Students Taught</div>
                </div>
              </div>

              <Link
                to="/about"
                className="btn-outline inline-flex items-center"
              >
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {homeData.vision?.title || 'Our Vision'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {homeData.vision?.content || 'To be the leading educational institution that transforms lives through innovative teaching methodologies, personalized attention, and comprehensive development programs.'}
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-8 text-center"
            >
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {homeData.mission?.title || 'Our Mission'}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {homeData.mission?.content || 'To provide world-class education that nurtures intellectual curiosity, develops critical thinking skills, and prepares students to become responsible global citizens and future leaders.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {homeData.stats && (
        <section className="section-padding bg-primary-600 text-white">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {homeData.stats.title}
              </h2>
              <p className="text-xl text-primary-100">
                {homeData.stats.content}
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {homeData.stats.stats?.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-secondary-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-primary-100">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Courses */}
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
              Popular Courses
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive range of courses designed to help you achieve your academic goals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {courses.map((course, index) => (
              <CourseCard key={course._id} course={course} index={index} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/courses"
              className="btn-primary inline-flex items-center"
            >
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Toppers Section */}
      {toppers.length > 0 && (
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
                Our Star Performers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet our successful students who have achieved remarkable results
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {toppers.map((topper, index) => (
                <motion.div
                  key={topper._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card p-6 text-center"
                >
                  <img
                    src={topper.photo}
                    alt={topper.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {topper.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {topper.achievement}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {topper.exam} - {topper.year}
                  </p>
                  {topper.testimonial && (
                    <p className="text-gray-600 text-sm italic">
                      "{topper.testimonial}"
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/achievements"
                className="btn-outline inline-flex items-center"
              >
                View All Achievements
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Achievements */}
      {achievements.length > 0 && (
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
                Recent Achievements
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Celebrating our latest milestones and recognitions
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card overflow-hidden"
                >
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                        {achievement.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of successful students who have achieved their dreams with Masters Academy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/courses"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Explore Courses
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home