import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Upload,
  Home as HomeIcon,
  Eye,
  Target,
  BarChart3,
  MessageSquare,
  Megaphone
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const HomeContent = () => {
  const [homeSections, setHomeSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm()

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section', icon: HomeIcon, description: 'Main banner with call-to-action' },
    { value: 'about', label: 'About Section', icon: MessageSquare, description: 'About the academy' },
    { value: 'vision', label: 'Vision', icon: Eye, description: 'Academy vision statement' },
    { value: 'mission', label: 'Mission', icon: Target, description: 'Academy mission statement' },
    { value: 'stats', label: 'Statistics', icon: BarChart3, description: 'Key statistics and numbers' },
    { value: 'testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Student testimonials' },
    { value: 'announcements', label: 'Announcements', icon: Megaphone, description: 'Important announcements' }
  ]

  const selectedSectionType = watch('section')

  useEffect(() => {
    fetchHomeSections()
  }, [])

  const fetchHomeSections = async () => {
    try {
      setLoading(true)
      const response = await api.get('/home')
      setHomeSections(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch home sections')
      console.error('Error fetching home sections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      
      // Handle different section types
      if (data.section === 'stats' && data.statsData) {
        const stats = data.statsData.split('\n').filter(s => s.trim()).map(stat => {
          const [label, value, icon] = stat.split('|').map(s => s.trim())
          return { label, value, icon: icon || 'users' }
        })
        formData.append('stats', JSON.stringify(stats))
        delete data.statsData
      } else {
        formData.append('stats', JSON.stringify([]))
      }

      if (data.section === 'testimonials' && data.testimonialsData) {
        const testimonials = data.testimonialsData.split('\n---\n').filter(t => t.trim()).map(testimonial => {
          const lines = testimonial.split('\n').filter(l => l.trim())
          return {
            name: lines[0] || '',
            designation: lines[1] || '',
            content: lines[2] || '',
            image: lines[3] || '',
            rating: 5
          }
        })
        formData.append('testimonials', JSON.stringify(testimonials))
        delete data.testimonialsData
      } else {
        formData.append('testimonials', JSON.stringify([]))
      }

      if (data.section === 'announcements' && data.announcementsData) {
        const announcements = data.announcementsData.split('\n---\n').filter(a => a.trim()).map(announcement => {
          const lines = announcement.split('\n').filter(l => l.trim())
          return {
            title: lines[0] || '',
            content: lines[1] || '',
            date: new Date(),
            priority: lines[2] || 'Medium',
            isActive: true
          }
        })
        formData.append('announcements', JSON.stringify(announcements))
        delete data.announcementsData
      } else {
        formData.append('announcements', JSON.stringify([]))
      }

      // Append remaining form fields
      Object.keys(data).forEach(key => {
        if (key !== 'image' && key !== 'statsData' && key !== 'testimonialsData' && key !== 'announcementsData') {
          formData.append(key, data[key])
        }
      })

      // Append image if selected
      const imageFile = data.image?.[0]
      if (imageFile) {
        formData.append('image', imageFile)
      }

      let response
      if (editingSection) {
        response = await api.put(`/home/${editingSection.section}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Home section updated successfully!')
      } else {
        response = await api.post('/home', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Home section created successfully!')
      }

      fetchHomeSections()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save home section')
      console.error('Error saving home section:', error)
    }
  }

  const handleEdit = (section) => {
    setEditingSection(section)
    
    // Populate form with section data
    Object.keys(section).forEach(key => {
      if (key === 'stats') {
        const statsText = section[key]?.map(s => `${s.label}|${s.value}|${s.icon}`).join('\n') || ''
        setValue('statsData', statsText)
      } else if (key === 'testimonials') {
        const testimonialsText = section[key]?.map(t => `${t.name}\n${t.designation}\n${t.content}\n${t.image || ''}`).join('\n---\n') || ''
        setValue('testimonialsData', testimonialsText)
      } else if (key === 'announcements') {
        const announcementsText = section[key]?.map(a => `${a.title}\n${a.content}\n${a.priority}`).join('\n---\n') || ''
        setValue('announcementsData', announcementsText)
      } else if (key !== 'image' && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        setValue(key, section[key])
      }
    })
    
    setImagePreview(section.image)
    setShowModal(true)
  }

  const handleDelete = async (sectionName) => {
    if (window.confirm('Are you sure you want to delete this home section?')) {
      try {
        await api.delete(`/home/${sectionName}`)
        toast.success('Home section deleted successfully!')
        fetchHomeSections()
      } catch (error) {
        toast.error('Failed to delete home section')
        console.error('Error deleting home section:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSection(null)
    setImagePreview(null)
    reset()
  }

  const getSectionIcon = (sectionType) => {
    const section = sectionTypes.find(s => s.value === sectionType)
    return section ? section.icon : HomeIcon
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
          <h1 className="text-2xl font-bold text-gray-900">Home Content Management</h1>
          <p className="text-gray-600">Manage your homepage sections and content</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Section
        </button>
      </div>

      {/* Available Section Types */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Available Section Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionTypes.map((type) => {
            const Icon = type.icon
            const existingSection = homeSections.find(s => s.section === type.value)
            return (
              <div
                key={type.value}
                className={`p-4 border rounded-lg ${
                  existingSection 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-2">
                  <Icon className="h-5 w-5 text-primary-600 mr-2" />
                  <span className="font-medium text-gray-900">{type.label}</span>
                  {existingSection && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Home Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {homeSections.map((section, index) => {
          const Icon = getSectionIcon(section.section)
          return (
            <motion.div
              key={section._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {section.image && (
                <div className="relative h-48">
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
                      {section.section}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Icon className="h-6 w-6 text-primary-600 mr-3" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-500 capitalize">{section.section} Section</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      section.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {section.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {section.subtitle && (
                  <p className="text-sm text-primary-600 font-medium mb-2">{section.subtitle}</p>
                )}

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {section.content}
                </p>

                {section.buttonText && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                      Button: {section.buttonText}
                    </span>
                  </div>
                )}

                {/* Special content for different section types */}
                {section.section === 'stats' && section.stats && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Statistics:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {section.stats.slice(0, 4).map((stat, idx) => (
                        <div key={idx} className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-primary-600">{stat.value}</div>
                          <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section.section === 'testimonials' && section.testimonials && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Testimonials: {section.testimonials.length}
                    </h4>
                  </div>
                )}

                {section.section === 'announcements' && section.announcements && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Announcements: {section.announcements.length}
                    </h4>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(section)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(section.section)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    Order: {section.order || 0}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {homeSections.length === 0 && (
        <div className="text-center py-12">
          <HomeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No home sections found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first home section.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Section
          </button>
        </div>
      )}

      {/* Home Section Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal} />
            
            <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingSection ? 'Edit Home Section' : 'Add New Home Section'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Section Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Type *
                    </label>
                    <select
                      {...register('section', { required: 'Section type is required' })}
                      disabled={editingSection}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                    >
                      <option value="">Select section type</option>
                      {sectionTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {errors.section && (
                      <p className="text-red-500 text-sm mt-1">{errors.section.message}</p>
                    )}
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      {...register('order')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter section title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                {/* Subtitle (for hero section) */}
                {selectedSectionType === 'hero' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      {...register('subtitle')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter subtitle"
                    />
                  </div>
                )}

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    {...register('content', { required: 'Content is required' })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter section content"
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                  )}
                </div>

                {/* Button Text and Link (for hero section) */}
                {selectedSectionType === 'hero' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        {...register('buttonText')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Get Started"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Link
                      </label>
                      <input
                        type="text"
                        {...register('buttonLink')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., /courses"
                      />
                    </div>
                  </div>
                )}

                {/* Stats Data (for stats section) */}
                {selectedSectionType === 'stats' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statistics Data
                    </label>
                    <textarea
                      {...register('statsData')}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter stats in format: Label|Value|Icon (one per line)&#10;Example:&#10;Students Enrolled|5000+|users&#10;Success Rate|95%|trophy&#10;Expert Faculty|50+|user-check"
                    />
                    <p className="text-xs text-gray-500 mt-1">Format: Label|Value|Icon (one per line)</p>
                  </div>
                )}

                {/* Testimonials Data (for testimonials section) */}
                {selectedSectionType === 'testimonials' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonials Data
                    </label>
                    <textarea
                      {...register('testimonialsData')}
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter testimonials separated by ---&#10;Format for each:&#10;Name&#10;Designation&#10;Content&#10;Image URL (optional)&#10;---&#10;Next testimonial..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate testimonials with --- and use 4 lines per testimonial</p>
                  </div>
                )}

                {/* Announcements Data (for announcements section) */}
                {selectedSectionType === 'announcements' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Announcements Data
                    </label>
                    <textarea
                      {...register('announcementsData')}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter announcements separated by ---&#10;Format for each:&#10;Title&#10;Content&#10;Priority (High/Medium/Low)&#10;---&#10;Next announcement..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate announcements with --- and use 3 lines per announcement</p>
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    {imagePreview && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active (visible on homepage)
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary inline-flex items-center disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingSection ? 'Update Section' : 'Create Section'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeContent