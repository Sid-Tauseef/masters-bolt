import React from 'react'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare,
  Navigation,
  Users,
  Award
} from 'lucide-react'
import ContactForm from '../components/ContactForm'

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Campus',
      details: [
        '123 Education Street',
        'Knowledge City, State 123456',
        'India'
      ],
      action: 'Get Directions',
      actionIcon: Navigation
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: [
        '+91 12345 67890',
        '+91 98765 43210',
        'Mon-Sat: 8AM-8PM'
      ],
      action: 'Call Now',
      actionIcon: Phone
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: [
        'info@radianceacademy.com',
        'admissions@radianceacademy.com',
        'support@radianceacademy.com'
      ],
      action: 'Send Email',
      actionIcon: Mail
    },
    {
      icon: Clock,
      title: 'Office Hours',
      details: [
        'Monday - Saturday: 8:00 AM - 8:00 PM',
        'Sunday: 9:00 AM - 5:00 PM',
        'Holidays: By Appointment'
      ],
      action: 'View Schedule',
      actionIcon: Clock
    }
  ]

  const departments = [
    {
      name: 'Admissions Office',
      phone: '+91 12345 67890',
      email: 'admissions@radianceacademy.com',
      description: 'For course enrollment and admission queries'
    },
    {
      name: 'Academic Support',
      phone: '+91 12345 67891',
      email: 'academic@radianceacademy.com',
      description: 'For academic guidance and course-related questions'
    },
    {
      name: 'Student Services',
      phone: '+91 12345 67892',
      email: 'students@radianceacademy.com',
      description: 'For student support and general assistance'
    },
    {
      name: 'Career Counseling',
      phone: '+91 12345 67893',
      email: 'careers@radianceacademy.com',
      description: 'For career guidance and counseling services'
    }
  ]

  const faqs = [
    {
      question: 'What are the admission requirements?',
      answer: 'Admission requirements vary by course. Generally, we require previous academic records, entrance test scores (if applicable), and completion of our admission form.'
    },
    {
      question: 'Do you offer online classes?',
      answer: 'Yes, we offer both online and offline classes. Our hybrid learning model ensures flexibility while maintaining quality education.'
    },
    {
      question: 'What is your fee structure?',
      answer: 'Our fee structure varies by course and duration. Please contact our admissions office for detailed fee information and available payment plans.'
    },
    {
      question: 'Do you provide study materials?',
      answer: 'Yes, we provide comprehensive study materials, practice tests, and access to our digital library for all enrolled students.'
    }
  ]

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
              Get in <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              We're here to help you start your educational journey
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Have questions about our courses, admission process, or need guidance? 
              Our team is ready to assist you every step of the way.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <info.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {info.title}
                </h3>
                
                <div className="space-y-2 mb-6">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>

                <button className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm group-hover:text-primary-600 transition-colors duration-300">
                  <info.actionIcon className="h-4 w-4 mr-2" />
                  {info.action}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Main Contact Section */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="card overflow-hidden"
              >
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">
                      123 Education Street, Knowledge City
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Visit Our Campus
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Come and experience our state-of-the-art facilities, meet our faculty, 
                    and get a feel for the Masters Academy environment.
                  </p>
                  <button className="btn-outline w-full">
                    Get Directions
                  </button>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Why Choose Us?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">5000+ Students</div>
                      <div className="text-sm text-gray-600">Trust our education</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">95% Success Rate</div>
                      <div className="text-sm text-gray-600">In competitive exams</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">15+ Years</div>
                      <div className="text-sm text-gray-600">Of excellence</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
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
              Contact Departments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Reach out to the right department for faster assistance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {dept.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {dept.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 text-primary-600 mr-2" />
                    <a 
                      href={`tel:${dept.phone}`}
                      className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    >
                      {dept.phone}
                    </a>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 text-primary-600 mr-2" />
                    <a 
                      href={`mailto:${dept.email}`}
                      className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    >
                      {dept.email}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our academy
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start">
                  <MessageSquare className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed ml-8">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions? We're here to help!
            </p>
            <button className="btn-primary">
              Contact Support
            </button>
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
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Don't wait! Contact us today and take the first step towards achieving your academic goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+911234567890"
                className="btn-secondary inline-flex items-center justify-center"
              >
                Call Now
                <Phone className="ml-2 h-5 w-5" />
              </a>
              <a
                href="/courses"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center justify-center"
              >
                View Courses
                <Users className="ml-2 h-5 w-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact