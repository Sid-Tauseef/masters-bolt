import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send, User, Mail, Phone, MessageSquare, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useApi } from '../context/ApiContext'

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { submitContact } = useApi()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      await submitContact(data)
      toast.success('Message sent successfully! We will get back to you soon.')
      reset()
    } catch (error) {
      toast.error(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses = "input-field"
  const errorClasses = "text-red-500 text-sm mt-1"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card p-8"
    >
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Send us a Message
        </h3>
        <p className="text-gray-600">
          Have questions about our courses? We'd love to hear from you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                },
                maxLength: {
                  value: 50,
                  message: 'Name cannot exceed 50 characters'
                }
              })}
              className={`${inputClasses} pl-10`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className={errorClasses}>{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Please enter a valid email address'
                }
              })}
              className={`${inputClasses} pl-10`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className={errorClasses}>{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              })}
              className={`${inputClasses} pl-10`}
              placeholder="Enter your phone number"
            />
          </div>
          {errors.phone && (
            <p className={errorClasses}>{errors.phone.message}</p>
          )}
        </div>

        {/* Course Interest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course of Interest
          </label>
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              {...register('course')}
              className={`${inputClasses} pl-10`}
            >
              <option value="">Select a course (optional)</option>
              <option value="JEE Main & Advanced">JEE Main & Advanced</option>
              <option value="NEET Preparation">NEET Preparation</option>
              <option value="Class 10 CBSE">Class 10 CBSE</option>
              <option value="Class 12 CBSE">Class 12 CBSE</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            {...register('subject', {
              required: 'Subject is required',
              minLength: {
                value: 5,
                message: 'Subject must be at least 5 characters'
              },
              maxLength: {
                value: 100,
                message: 'Subject cannot exceed 100 characters'
              }
            })}
            className={inputClasses}
            placeholder="What is this regarding?"
          />
          {errors.subject && (
            <p className={errorClasses}>{errors.subject.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              {...register('message', {
                required: 'Message is required',
                minLength: {
                  value: 10,
                  message: 'Message must be at least 10 characters'
                },
                maxLength: {
                  value: 1000,
                  message: 'Message cannot exceed 1000 characters'
                }
              })}
              rows={5}
              className={`${inputClasses} pl-10 resize-none`}
              placeholder="Tell us more about your inquiry..."
            />
          </div>
          {errors.message && (
            <p className={errorClasses}>{errors.message.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="loading-spinner mr-2" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </>
          )}
        </motion.button>
      </form>

      {/* Additional Info */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 text-center">
          We typically respond within 24 hours. For urgent inquiries, 
          please call us directly at{' '}
          <a 
            href="tel:+911234567890" 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            +91 12345 67890
          </a>
        </p>
      </div>
    </motion.div>
  )
}

export default ContactForm