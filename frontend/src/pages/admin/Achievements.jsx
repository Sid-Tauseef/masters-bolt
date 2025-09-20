import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Star,
  Calendar,
  Award,
  X,
  Save,
  Upload
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import api from '../../utils/api'

const Achievements = () => {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [imagePreview, setImagePreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm()

  const categories = ['All', 'Academic Excellence', 'Student Achievement', 'Institute Recognition', 'Awards', 'Certifications', 'Other']

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const response = await api.get('/achievements?limit=100')
      setAchievements(response.data.data.achievements || [])
    } catch (error) {
      toast.error('Failed to fetch achievements')
      console.error('Error fetching achievements:', error)
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
      
      // Append all form fields
      Object.keys(data).forEach(key => {
        if (key === 'relatedStudents') {
          // Handle related students array
          const students = data[key] ? data[key].split('\n').filter(s => s.trim()).map(s => ({ 
            name: s.trim(),
            class: '',
            achievement: ''
          })) : []
          formData.append(key, JSON.stringify(students))
        } else if (key !== 'image') {
          formData.append(key, data[key])
        }
      })

      // Append image if selected
      const imageFile = data.image?.[0]
      if (imageFile) {
        formData.append('image', imageFile)
      }

      let response
      if (editingAchievement) {
        response = await api.put(`/achievements/${editingAchievement._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Achievement updated successfully!')
      } else {
        response = await api.post('/achievements', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Achievement created successfully!')
      }

      fetchAchievements()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save achievement')
      console.error('Error saving achievement:', error)
    }
  }

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement)
    
    // Populate form with achievement data
    Object.keys(achievement).forEach(key => {
      if (key === 'relatedStudents') {
        const studentsText = achievement[key]?.map(s => s.name).join('\n') || ''
        setValue(key, studentsText)
      } else if (key === 'date') {
        setValue(key, new Date(achievement[key]).toISOString().split('T')[0])
      } else if (key !== 'image' && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        setValue(key, achievement[key])
      }
    })
    
    setImagePreview(achievement.image)
    setShowModal(true)
  }

  const handleDelete = async (achievementId) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await api.delete(`/achievements/${achievementId}`)
        toast.success('Achievement deleted successfully!')
        fetchAchievements()
      } catch (error) {
        toast.error('Failed to delete achievement')
        console.error('Error deleting achievement:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingAchievement(null)
    setImagePreview(null)
    reset()
  }

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'All' || achievement.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
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
          <h1 className="text-2xl font-bold text-gray-900">Achievements Management</h1>
          <p className="text-gray-600">Manage your academy's achievements and recognitions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Achievement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <motion.div
            key={achievement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative">
              <img
                src={achievement.image}
                alt={achievement.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {achievement.category}
                </span>
              </div>
              {achievement.featured && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </span>
                </div>
              )}
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

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {achievement.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {achievement.description}
              </p>

              {achievement.details && (
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                  {achievement.details}
                </p>
              )}

              {achievement.relatedStudents && achievement.relatedStudents.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Related Students:</h4>
                  <div className="text-xs text-gray-600">
                    {achievement.relatedStudents.slice(0, 2).map((student, idx) => (
                      <div key={idx}>{student.name}</div>
                    ))}
                    {achievement.relatedStudents.length > 2 && (
                      <div className="text-gray-500">+{achievement.relatedStudents.length - 2} more</div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(achievement._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  achievement.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {achievement.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first achievement.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Achievement
          </button>
        </div>
      )}

      {/* Achievement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal} />
            
            <div className="inline-block w-full max-w-3xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
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
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievement Title *
                    </label>
                    <input
                      type="text"
                      {...register('title', { required: 'Title is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter achievement title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievement Date *
                    </label>
                    <input
                      type="date"
                      {...register('date', { required: 'Date is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      {...register('priority')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="0">Normal</option>
                      <option value="1">High</option>
                      <option value="2">Very High</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Brief description of the achievement"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Information
                  </label>
                  <textarea
                    {...register('details')}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Detailed information about the achievement"
                  />
                </div>

                {/* Related Students */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Students
                  </label>
                  <textarea
                    {...register('relatedStudents')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter student names (one per line)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter each student name on a new line</p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achievement Image
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

                {/* Status Checkboxes */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Active (visible to public)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('featured')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Featured (highlight on homepage)
                    </label>
                  </div>
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
                        {editingAchievement ? 'Update Achievement' : 'Create Achievement'}
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

export default Achievements