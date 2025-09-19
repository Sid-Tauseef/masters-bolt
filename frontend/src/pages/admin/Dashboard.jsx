import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  BookOpen, 
  Trophy, 
  Image, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Star,
  Eye,
  Plus
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

const Dashboard = () => {
  const { admin } = useAuth()
  const [stats, setStats] = useState({
    courses: 0,
    toppers: 0,
    achievements: 0,
    gallery: 0,
    contacts: 0,
    unreadContacts: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch stats from different endpoints
        const [coursesRes, toppersRes, achievementsRes, galleryRes, contactsRes] = await Promise.all([
          api.get('/courses?limit=1'),
          api.get('/toppers?limit=1'),
          api.get('/achievements?limit=1'),
          api.get('/gallery?limit=1'),
          api.get('/contact/stats')
        ])

        setStats({
          courses: coursesRes.data.data.pagination?.total || 0,
          toppers: toppersRes.data.data.pagination?.total || 0,
          achievements: achievementsRes.data.data.pagination?.total || 0,
          gallery: galleryRes.data.data.pagination?.total || 0,
          contacts: contactsRes.data.data.totalContacts || 0,
          unreadContacts: contactsRes.data.data.unreadContacts || 0
        })

        // Mock recent activity (you can implement this properly later)
        setRecentActivity([
          { id: 1, type: 'course', action: 'created', item: 'JEE Main & Advanced', time: '2 hours ago' },
          { id: 2, type: 'topper', action: 'added', item: 'Arjun Patel - AIR 15', time: '5 hours ago' },
          { id: 3, type: 'contact', action: 'received', item: 'New inquiry from student', time: '1 day ago' },
          { id: 4, type: 'achievement', action: 'updated', item: 'Best Institute Award 2023', time: '2 days ago' }
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Total Courses',
      value: stats.courses,
      icon: BookOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Star Toppers',
      value: stats.toppers,
      icon: Trophy,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Achievements',
      value: stats.achievements,
      icon: Star,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Gallery Items',
      value: stats.gallery,
      icon: Image,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+25%',
      changeType: 'positive'
    },
    {
      title: 'Total Contacts',
      value: stats.contacts,
      icon: MessageSquare,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Unread Messages',
      value: stats.unreadContacts,
      icon: Eye,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      change: stats.unreadContacts > 0 ? 'New' : 'None',
      changeType: stats.unreadContacts > 0 ? 'neutral' : 'positive'
    }
  ]

  const quickActions = [
    { title: 'Add New Course', icon: BookOpen, href: '/admin/courses/new', color: 'bg-blue-500' },
    { title: 'Add Topper', icon: Trophy, href: '/admin/toppers/new', color: 'bg-yellow-500' },
    { title: 'Add Achievement', icon: Star, href: '/admin/achievements/new', color: 'bg-green-500' },
    { title: 'Upload to Gallery', icon: Image, href: '/admin/gallery/new', color: 'bg-purple-500' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'course': return BookOpen
      case 'topper': return Trophy
      case 'achievement': return Star
      case 'contact': return MessageSquare
      default: return Calendar
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'course': return 'text-blue-600 bg-blue-100'
      case 'topper': return 'text-yellow-600 bg-yellow-100'
      case 'achievement': return 'text-green-600 bg-green-100'
      case 'contact': return 'text-indigo-600 bg-indigo-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {admin?.name}!</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className={`h-4 w-4 mr-1 ${
                    stat.changeType === 'positive' ? 'text-green-500' : 
                    stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.a
              key={index}
              href={action.href}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
            >
              <div className={`p-2 rounded-lg ${action.color} mr-3 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {action.title}
                </p>
              </div>
              <Plus className="h-4 w-4 text-gray-400 ml-auto group-hover:text-primary-600 transition-colors duration-200" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} mr-4`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} {activity.item}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Dashboard