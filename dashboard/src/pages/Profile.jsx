import { useState, useEffect, useRef } from "react";
import { Layout } from "../components/Layout";
import { SEOHelmet } from "../components/SEOHelmet";
import { useAuth } from "../contexts/AuthContext";
import { useNotification } from "../contexts/NotificationContext";
import { useApi } from "../hooks/useApi";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";

const Profile = () => {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { apiCall } = useApi();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    preferences: {
      newsletter: true,
      notifications: true,
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "",
        },
        preferences: {
          newsletter: user.preferences?.newsletter ?? true,
          notifications: user.preferences?.notifications ?? true,
        },
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("folder", `T-Shirt/Profiles/${user.email}`);
      data.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        data
      );

      setProfileImage(response.data.secure_url);
      showSuccess("Profile image uploaded successfully");
    } catch (error) {
      showError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        profileImage,
      };

      await apiCall(`/auth/profile/${user._id}`, {
        method: "PUT",
        data: updateData,
      });

      // Update user in context
      updateUser({ ...user, ...updateData });
      
      showSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      showError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    return `${user?.firstName?.[0] || ""}${
      user?.lastName?.[0] || ""
    }`.toUpperCase();
  };

  return (
    <>
      <SEOHelmet
        title="Profile - T-Shirt"
        description="Manage your profile and account settings"
      />
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Image Section */}
            <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <div className="text-center">
                <div className="relative inline-block">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-32 w-32 rounded-full object-cover border-4 border-primary-100"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center border-4 border-primary-100">
                      <span className="text-white font-bold text-3xl">
                        {getUserInitials()}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-primary-400 text-white rounded-full p-2 hover:bg-primary-500 transition-colors"
                    >
                      📷
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                <h3 className="text-xl font-semibold text-gray-900 mt-4">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{user?.email}</p>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800 mt-2">
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Profile Information */}
            <div className={`lg:col-span-2 rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-200'}`}>
              <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 transition-colors ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 transition-colors ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 transition-colors ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                    }`}
                    placeholder="Enter your phone number"
                  />
                </div>

                {/* Address */}
                <div>
                  <h4 className={`text-md font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Address
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Street
                      </label>
                      <input
                        type="text"
                        value={formData.address.street}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: {
                              ...formData.address,
                              street: e.target.value,
                            },
                          })
                        }
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-400 transition-colors ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-white disabled:bg-gray-600 disabled:text-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 disabled:bg-gray-50'
                        }`}
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.address.city}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                city: e.target.value,
                              },
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 disabled:bg-gray-50"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={formData.address.state}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                state: e.target.value,
                              },
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 disabled:bg-gray-50"
                          placeholder="State"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={formData.address.zipCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                zipCode: e.target.value,
                              },
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 disabled:bg-gray-50"
                          placeholder="Zip code"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.address.country}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: {
                                ...formData.address,
                                country: e.target.value,
                              },
                            })
                          }
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 disabled:bg-gray-50"
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Preferences
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.preferences.newsletter}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              newsletter: e.target.checked,
                            },
                          })
                        }
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Subscribe to newsletter
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={formData.preferences.notifications}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferences: {
                              ...formData.preferences,
                              notifications: e.target.checked,
                            },
                          })
                        }
                        disabled={!isEditing}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-700">
                        Email notifications
                      </span>
                    </label>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary-400 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-500 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Password</h4>
                  <p className="text-sm text-gray-600">
                    Last updated 30 days ago
                  </p>
                </div>
                <button
                  onClick={() => (window.location.href = "/change-password")}
                  className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors text-sm"
                >
                  Change Password
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </h4>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security
                  </p>
                </div>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  Enable 2FA
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Login Sessions</h4>
                  <p className="text-sm text-gray-600">
                    Manage your active sessions
                  </p>
                </div>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                  View Sessions
                </button>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account ID
                </label>
                <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded">
                  {user?._id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Status
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800 capitalize">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
