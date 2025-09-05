import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { SEOHelmet } from '../components/SEOHelmet';
import { useApi } from '../hooks/useApi';
import { useNotification } from '../contexts/NotificationContext';
import { SearchInput } from '../components/SearchInput';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { apiCall } = useApi();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await apiCall('/auth/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      showError('Failed to load users');
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        user.role.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      setLoading(true);
      await apiCall(`/auth/users/${userId}/role`, {
        method: 'PATCH',
        data: { role: newRole }
      });
      
      showSuccess('User role updated successfully');
      loadUsers();
      setShowModal(false);
    } catch (error) {
      showError('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, isActive) => {
    try {
      await apiCall(`/auth/users/${userId}/status`, {
        method: 'PATCH',
        data: { isActive: !isActive }
      });
      
      showSuccess(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (error) {
      showError('Failed to update user status');
    }
  };

  const getUserInitials = (user) => {
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <>
      <SEOHelmet 
        title="User Management - T-Shirt Admin"
        description="Manage user accounts and permissions"
      />
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions ({filteredUsers.length} users)</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="w-full max-w-md">
              <SearchInput
                onSearch={handleSearch}
                placeholder="Search users by name, email, role..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-neutral-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-semibold text-sm">
                              {getUserInitials(user)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">ID: {user._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit Role
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className={`${
                            user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && searchTerm && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        <div className="text-4xl mb-2">🔍</div>
                        <p>No users found matching "{searchTerm}"</p>
                        <button
                          onClick={() => handleSearch('')}
                          className="mt-2 text-primary-600 hover:text-primary-500 text-sm"
                        >
                          Clear search
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Role Change Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Change User Role</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-primary-600 font-semibold text-xl">
                      {getUserInitials(selectedUser)}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p className="text-gray-600">{selectedUser.email}</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                  {['customer', 'employee', 'admin'].map((role) => (
                    <button
                      key={role}
                      onClick={() => updateUserRole(selectedUser._id, role)}
                      disabled={loading || selectedUser.role === role}
                      className={`w-full p-3 text-left rounded-lg border transition-colors ${
                        selectedUser.role === role
                          ? 'bg-primary-50 border-primary-200 text-primary-700'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      } disabled:opacity-50`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium capitalize">{role}</div>
                          <div className="text-sm text-gray-500">
                            {role === 'admin' && 'Full access to all features'}
                            {role === 'employee' && 'Manage products and orders'}
                            {role === 'customer' && 'Browse and purchase products'}
                          </div>
                        </div>
                        {selectedUser.role === role && (
                          <span className="text-primary-600">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout>
    </>
  );
};

export default UserManagement;