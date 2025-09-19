import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Trophy,
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

const Toppers = () => {
  const [toppers, setToppers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTopper, setEditingTopper] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterYear, setFilterYear] = useState('All')
  const [imagePreview, setImagePreview] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm()

  const currentYear = new Date().getFullYear()
  const years = ['All', ...Array.from({ length: 10 }, (_, i) => currentYear - i)]

  useEffect(() => {
    fetchToppers()
  }, [])

  const fetchToppers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/toppers?limit=100')
      setToppers(response.data.data.toppers || [])
    } catch (error) {
      toast.error('Failed to fetch toppers')
      console.error('Error fetching toppers:', error)
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
        if (key !== 'photo') {
          formData.append(key, data[key])
        }
      })

      // Append image if selected
      const imageFile = data.photo?.[0]
      if (imageFile) {
        formData.append('photo', imageFile)
      }

      let response
      if (editingTopper) {
        response = await api.put(`/toppers/${editingTopper._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Topper updated successfully!')
      } else {
        response = await api.post('/toppers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Topper created successfully!')
      }

      fetchToppers()
      handleCloseModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save topper')
      console.error('Error saving topper:', error)
    }
  }

  const handleEdit = (topper) => {
    setEditingTopper(topper)
    
    // Populate form with topper data
    Object.keys(topper).forEach(key => {
      if (key !== 'photo' && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
        setValue(key, topper[key])
      }
    })
    
    setImagePreview(topper.photo)
    setShowModal(true)
  }

  const handleDelete = async (topperId) => {
    if (window.confirm('Are you sure you want to delete this topper?')) {
      try {
        await api.delete(`/toppers/${topperId}`)
        toast.success('Topper deleted successfully!')
        fetchToppers()
      } catch (error) {
        toast.error('Failed to delete topper')
        console.error('Error deleting topper:', error)
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingTopper(null)
    setImagePreview(null)
    reset()
  }

  const filteredToppers = toppers.filter(topper => {
    const matchesSearch = topper.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topper.achievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topper.exam.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = filterYear === 'All' || topper.year.toString() === filterYear
    return matchesSearch && matchesYear
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Toppers Management</h1>
          <p className="text-gray-600">Manage your academy's star performers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Topper
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
                placeholder="Search toppers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Toppers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredToppers.map((topper, index) => (
          <motion.div
            key={topper._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={topper.photo}
                    alt={topper.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {topper.featured && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{topper.name}</h3>
                  <p className="text-primary-600 font-medium text-sm">{topper.achievement}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Exam:</span>
                  <span className="font-medium text-gray-900">{topper.exam}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Year:</span>
                  <span className="font-medium text-gray-900">{topper.year}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Score:</span>
                  <span className="font-medium text-gray-900">{topper.score}</span>
                </div>
                {topper.rank && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Rank:</span>
                    <span className="font-medium text-gray-900">{topper.rank}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Course:</span>
                  <span className="font-medium text-gray-900">{topper.course}</span>
                </div>
              </div>

              {topper.testimonial && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">"{topper.testimonial}"</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(topper)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(topper._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  {topper.featured && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    topper.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {topper.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredToppers.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No toppers found</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first topper.</p>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Topper
          </button>
        </div>
      )}

      {/* Topper Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal} />
            
            <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTopper ? 'Edit Topper' : 'Add New Topper'}
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
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter student name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Achievement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievement *
                    </label>
                    <input
                      type="text"
                      {...register('achievement', { required: 'Achievement is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., AIR 15 in JEE Advanced"
                    />
                    {errors.achievement && (
                      <p className="text-red-500 text-sm mt-1">{errors.achievement.message}</p>
                    )}
                  </div>

                  {/* Exam */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Exam *
                    </label>
                    <input
                      type="text"
                      {...register('exam', { required: 'Exam is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., JEE Advanced 2023"
                    />
                    {errors.exam && (
                      <p className="text-red-500 text-sm mt-1">{errors.exam.message}</p>
                    )}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <select
                      {...register('year', { required: 'Year is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select year</option>
                      {years.slice(1).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {errors.year && (
                      <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
                    )}
                  </div>

                  {/* Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Score *
                    </label>
                    <input
                      type="text"
                      {...register('score', { required: 'Score is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 324/360, 95.2%"
                    />
                    {errors.score && (
                      <p className="text-red-500 text-sm mt-1">{errors.score.message}</p>
                    )}
                  </div>

                  {/* Rank */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rank
                    </label>
                    <input
                      type="text"
                      {...register('rank')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., AIR 15, State Rank 1"
                    />
                  </div>

                  {/* Course */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Course *
                    </label>
                    <input
                      type="text"
                      {...register('course', { required: 'Course is required' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., JEE Main & Advanced"
                    />
                    {errors.course && (
                      <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>
                    )}
                  </div>
                </div>

                {/* Testimonial */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial
                  </label>
                  <textarea
                    {...register('testimonial')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Student's testimonial about the academy"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        {...register('photo')}
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    {imagePreview && (
                      <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
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
                        {editingTopper ? 'Update Topper' : 'Create Topper'}
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

export default Toppers