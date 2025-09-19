import React from 'react'
import { Clock, Users, Star, ArrowRight, BookOpen, Award } from 'lucide-react'
import { motion } from 'framer-motion'

const CourseCard = ({ course, index = 0 }) => {
  const {
    title,
    shortDescription,
    image,
    duration,
    level,
    price,
    discountPrice,
    instructor,
    enrollmentCount = 0,
    rating = 0,
    features = []
  } = course

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-700'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700'
      case 'Advanced':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="card group overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(level)}`}>
            {level}
          </span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-1 shadow-md">
          <div className="text-right">
            {discountPrice && discountPrice < price ? (
              <>
                <div className="text-xs text-gray-500 line-through">
                  {formatPrice(price)}
                </div>
                <div className="text-sm font-bold text-primary-600">
                  {formatPrice(discountPrice)}
                </div>
              </>
            ) : (
              <div className="text-sm font-bold text-primary-600">
                {formatPrice(price)}
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="bg-white text-primary-600 p-2 rounded-full shadow-lg hover:bg-primary-600 hover:text-white transition-colors duration-200">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {shortDescription}
        </p>

        {/* Features */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {features.slice(0, 3).map((feature, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                <BookOpen className="h-3 w-3 mr-1" />
                {feature}
              </span>
            ))}
            {features.length > 3 && (
              <span className="text-xs text-gray-500">
                +{features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {duration}
            </div>
            
            {enrollmentCount > 0 && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {enrollmentCount}
              </div>
            )}
          </div>

          {rating > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
              <span className="font-medium">{rating}</span>
            </div>
          )}
        </div>

        {/* Instructor */}
        {instructor && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-primary-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {instructor.name}
                </div>
                <div className="text-xs text-gray-500">
                  {instructor.experience}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-4">
          <button className="w-full btn-primary group">
            Enroll Now
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default CourseCard