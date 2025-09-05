import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit3, FiSave, FiX, FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { useApi } from '../hooks/useApi'
import SEOHelmet from '../components/SEOHelmet'
import { useTheme } from '../contexts/ThemeContext'

const Profile = () => {
  const { isDark } = useTheme()
  const { user, updateUser } = useAuth()
  const { showSuccess, showError } = useNotification()
  const { apiCall } = useApi()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  })

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiCall(`/auth/profile/${user._id}`, {
        method: 'PUT',
        data: formData
      })

      updateUser(response.data)
      showSuccess('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      showError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      }
    })
    setIsEditing(false)
  }

  const getUserInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <>
      <SEOHelmet 
        title="My Profile"
        description="Manage your account information and preferences"
      />

      <div className={`min-h-screen pt-16 lg:pt-20 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                My Profile
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing
                    ? isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                {isEditing ? (
                  <>
                    <FiX className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FiEdit3 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className={`p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    {user?.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center border-4 border-primary-100">
                        <span className="text-white font-bold text-3xl">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user?.email}
                  </p>
                  
                  <div className="space-y-3">
                    <div className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <FiUser className="w-4 h-4" />
                      <span className="capitalize">{user?.role}</span>
                    </div>
                    <div className={`flex items-center justify-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Information */}
              <div className={`lg:col-span-2 p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Personal Information
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        First Name
                      </label>
                      <div className="relative">
                        <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                          }`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      <div className="relative">
                        <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                          }`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Email
                      </label>
                      <div className="relative">
                        <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                          }`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone
                      </label>
                      <div className="relative">
                        <FiPhone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          disabled={!isEditing}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      <FiMapPin className="w-4 h-4" />
                      Address
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.address.street}
                          onChange={(e) => setFormData({
                            ...formData,
                            address: {...formData.address, street: e.target.value}
                          })}
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                          }`}
                          placeholder="Enter your street address"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => setFormData({
                              ...formData,
                              address: {...formData.address, city: e.target.value}
                            })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                              isDark 
                                ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                            }`}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            State
                          </label>
                          <input
                            type="text"
                            value={formData.address.state}
                            onChange={(e) => setFormData({
                              ...formData,
                              address: {...formData.address, state: e.target.value}
                            })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                              isDark 
                                ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                            }`}
                            placeholder="State"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            value={formData.address.zipCode}
                            onChange={(e) => setFormData({
                              ...formData,
                              address: {...formData.address, zipCode: e.target.value}
                            })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                              isDark 
                                ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                            }`}
                            placeholder="ZIP Code"
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.address.country}
                            onChange={(e) => setFormData({
                              ...formData,
                              address: {...formData.address, country: e.target.value}
                            })}
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 ${
                              isDark 
                                ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                                : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                            }`}
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className={`flex-1 py-3 px-6 border rounded-lg font-medium transition-colors ${
                          isDark 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          'Saving...'
                        ) : (
                          <>
                            <FiSave className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`mt-8 p-6 rounded-xl shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate('/orders')}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-2">📦</div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>View Orders</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Track your purchases</div>
                </button>
                
                <button
                  onClick={() => navigate('/wishlist')}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-2">❤️</div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Wishlist</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Your saved items</div>
                </button>
                
                <button
                  onClick={() => navigate('/products')}
                  className={`p-4 rounded-lg text-left transition-colors ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-2xl mb-2">🛍️</div>
                  <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Continue Shopping</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Browse our products</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile