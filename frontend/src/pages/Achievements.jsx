import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Calendar, Award, Star, Users, Target, Medal, Crown } from 'lucide-react'
import { useApi } from '../context/ApiContext'

const Achievements = () => {
  const { fetchAchievements, fetchToppers, loading } = useApi()
  const [achievements, setAchievements] = useState([])
  const [toppers, setToppers] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Academic Excellence', 'Student Achievement', 'Institute Recognition', 'Awards', 'Certifications', 'Other']

  useEffect(() => {
    const loadData = async () => {
      try {
        const [achievementsData, toppersData] = await Promise.all([
          fetchAchievements({ limit: 50 }),
          fetchToppers({ limit: 20 })
        ])
        
        setAchievements(achievementsData.achievements || [])
        setToppers(toppersData.toppers || [])
      } catch (error) {
        console.error('Error loading achievements:', error)
      }
    }

    loadData()
  }, [])

  const filteredAchievements = selectedCategory === 'All' 
    ? achievements 
    : achievements.filter(achievement => achievement.category === selectedCategory)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const stats = [
    { icon: Trophy, label: 'Awards Won', value: '25+', color: 'text-yellow-600' },
    { icon: Medal, label: 'Top Rankers', value: '500+', color: 'text-blue-600' },
    { icon: Star, label: 'Success Rate', value: '95%', color: 'text-green-600' },
    { icon: Crown, label: 'Years of Excellence', value: '15+', color: 'text-purple-600' },
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
              Our <span className="text-gradient">Achievements</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Celebrating excellence, recognizing success, and inspiring future achievements
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Over the years, Masters Academy has been recognized for its outstanding contribution 
              to education and the remarkable achievements of our students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Performers Section */}
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
              Meet our exceptional students who have achieved remarkable success in their respective fields
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {toppers.slice(0, 8).map((topper, index) => (
              <motion.div
                key={topper._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative mb-4">
                  <img
                    src={topper.photo}
                    alt={topper.name}
                    className="w-20 h-20 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {topper.featured && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {topper.name}
                </h3>
                <p className="text-primary-600 font-medium mb-1 text-sm">
                  {topper.achievement}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  {topper.exam}
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>{topper.year}</span>
                  <span>•</span>
                  <span>{topper.score}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {toppers.length > 8 && (
            <div className="text-center mt-8">
              <button className="btn-outline">
                View All Toppers
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Achievements Section */}
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
              Institute Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Recognition and awards that showcase our commitment to educational excellence
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Achievements Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={achievement.image}
                    alt={achievement.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {achievement.category}
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {achievement.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </span>
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(achievement.date)}
                    </div>
                    {achievement.priority > 0 && (
                      <div className="flex items-center text-yellow-500">
                        <Award className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                    {achievement.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {achievement.description}
                  </p>

                  {achievement.details && (
                    <p className="text-gray-500 text-xs leading-relaxed">
                      {achievement.details}
                    </p>
                  )}

                  {/* Related Students */}
                  {achievement.relatedStudents && achievement.relatedStudents.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Related Students:
                      </h4>
                      <div className="space-y-1">
                        {achievement.relatedStudents.slice(0, 2).map((student, idx) => (
                          <div key={idx} className="text-xs text-gray-600">
                            <span className="font-medium">{student.name}</span>
                            {student.class && <span> - {student.class}</span>}
                            {student.achievement && <span> - {student.achievement}</span>}
                          </div>
                        ))}
                        {achievement.relatedStudents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{achievement.relatedStudents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No achievements found
              </h3>
              <p className="text-gray-600 mb-6">
                No achievements match the selected category.
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="btn-primary"
              >
                View All Achievements
              </button>
            </motion.div>
          )}
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
              Be Part of Our Success Story
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join Masters Academy and become our next success story. Your achievement could be featured here!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Explore Courses
                <Trophy className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/contact"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                Contact Us
                <Users className="ml-2 h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Achievements