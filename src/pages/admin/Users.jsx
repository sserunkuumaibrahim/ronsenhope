import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiUserPlus, FiFilter, FiDownload, FiMail, FiCheck, FiX, FiUsers, FiShield, FiClock, FiEye, FiUpload, FiPlus } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'volunteer',
    location: '',
    phone: ''
  });
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkUsers, setBulkUsers] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [bulkCreating, setBulkCreating] = useState(false);

  // Function to get user initials
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Function to get avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
      'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Fetch users from Firebase
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => ({
         id: doc.id,
         ...doc.data(),
         // Ensure status field exists
         status: doc.data().status || 'active',
         // Convert Firestore timestamps to readable dates
         joined: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
         lastLogin: doc.data().lastLogin ? new Date(doc.data().lastLogin.seconds * 1000).toISOString().split('T')[0] : 'Never'
       }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roles = ['all', 'admin', 'moderator', 'volunteer', 'user'];
  const statuses = ['all', 'active', 'inactive', 'suspended'];

  const filteredUsers = users.filter(user => {
    const userName = user.displayName || user.name || '';
    const userEmail = user.email || '';
    const matchesSearch = userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'users', userToDelete.id));
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  const handleCreateUser = () => {
    setFormData({
      name: '',
      email: '',
      role: 'volunteer',
      location: '',
      phone: ''
    });
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setFormData({
      name: user.displayName || user.name || '',
      email: user.email || '',
      role: user.role || 'user',
      location: user.location || '',
      phone: user.phone || ''
    });
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // Update existing user
        const userRef = doc(db, 'users', editingUser.id);
        await updateDoc(userRef, {
          displayName: formData.name,
          email: formData.email,
          role: formData.role,
          location: formData.location || '',
          phone: formData.phone || ''
        });
        
        // Update local state
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? {
                ...u,
                displayName: formData.name,
                email: formData.email,
                role: formData.role,
                location: formData.location || '',
                phone: formData.phone || ''
              }
            : u
        ));
        setShowEditModal(false);
        setEditingUser(null);
      } else {
        // Create new user document in Firestore
         const newUserData = {
           displayName: formData.name,
           email: formData.email,
           role: formData.role,
           location: formData.location || '',
           phone: formData.phone || '',
           status: 'active',
           createdAt: serverTimestamp(),
           lastLogin: null
         };
        
        const docRef = await addDoc(collection(db, 'users'), newUserData);
        
        // Add to local state
         const newUser = {
           id: docRef.id,
           ...newUserData,
           status: 'active',
           joined: new Date().toISOString().split('T')[0],
           lastLogin: 'Never'
         };
        setUsers([...users, newUser]);
        setShowCreateModal(false);
      }
      
      setFormData({
        name: '',
        email: '',
        role: 'volunteer',
        location: '',
        phone: ''
      });
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle CSV file upload
  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csv = event.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const users = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const user = {};
            headers.forEach((header, index) => {
              user[header.toLowerCase()] = values[index] || '';
            });
            if (user.name && user.email) {
              users.push({
                name: user.name,
                email: user.email,
                role: user.role || 'volunteer',
                location: user.location || '',
                phone: user.phone || ''
              });
            }
          }
        }
        setBulkUsers(users);
      };
      reader.readAsText(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  // Add manual user to bulk list
  const addManualUser = () => {
    setBulkUsers([...bulkUsers, {
      name: '',
      email: '',
      role: 'volunteer',
      location: '',
      phone: ''
    }]);
  };

  // Update bulk user data
  const updateBulkUser = (index, field, value) => {
    const updatedUsers = [...bulkUsers];
    updatedUsers[index][field] = value;
    setBulkUsers(updatedUsers);
  };

  // Remove user from bulk list
  const removeBulkUser = (index) => {
    setBulkUsers(bulkUsers.filter((_, i) => i !== index));
  };

  // Create bulk users
  const handleBulkCreate = async () => {
    if (bulkUsers.length === 0) {
      alert('Please add users to create');
      return;
    }

    setBulkCreating(true);
    const createdUsers = [];
    const errors = [];

    for (let i = 0; i < bulkUsers.length; i++) {
      const userData = bulkUsers[i];
      if (!userData.name || !userData.email) {
        errors.push(`User ${i + 1}: Name and email are required`);
        continue;
      }

      try {
        const newUserData = {
          displayName: userData.name,
          email: userData.email,
          role: userData.role || 'volunteer',
          location: userData.location || '',
          phone: userData.phone || '',
          status: 'active',
          createdAt: serverTimestamp(),
          lastLogin: null
        };

        const docRef = await addDoc(collection(db, 'users'), newUserData);
        
        const newUser = {
          id: docRef.id,
          ...newUserData,
          status: 'active',
          joined: new Date().toISOString().split('T')[0],
          lastLogin: 'Never'
        };
        
        createdUsers.push(newUser);
      } catch (error) {
        console.error(`Error creating user ${userData.name}:`, error);
        errors.push(`User ${userData.name}: ${error.message}`);
      }
    }

    // Update local state with created users
    setUsers([...users, ...createdUsers]);
    
    setBulkCreating(false);
    setShowBulkModal(false);
    setBulkUsers([]);
    setCsvFile(null);

    // Show results
    if (createdUsers.length > 0) {
      alert(`Successfully created ${createdUsers.length} users${errors.length > 0 ? ` with ${errors.length} errors` : ''}`);
    }
    if (errors.length > 0) {
      console.error('Bulk creation errors:', errors);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-purple-100 text-purple-800',
      volunteer: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FiShield className="w-4 h-4" />;
      case 'moderator':
        return <FiShield className="w-4 h-4" />;
      case 'volunteer':
        return <FiUsers className="w-4 h-4" />;
      default:
        return <FiUsers className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Users Management - Admin Dashboard</title>
        <meta name="description" content="Manage and oversee all users and their roles." />
      </Helmet>

      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl mb-8">
        <div className="absolute inset-0 bg-[url('/src/assets/dot-pattern.svg')] opacity-20"></div>
        
        <div className="relative p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <FiUsers className="w-4 h-4" />
              User Management
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
              Manage Users
            </h1>
            
            <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
              Oversee and manage all users, their roles, and permissions. Monitor user activity and maintain community standards.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCreateUser}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FiUserPlus className="w-5 h-5" />
                Add New User
              </button>
              <button
                onClick={() => setShowBulkModal(true)}
                className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FiUpload className="w-5 h-5" />
                Bulk Add Users
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{users.length}</div>
              <div className="text-sm text-base-content/60">Total Users</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{users.filter(u => u.status === 'active').length}</div>
              <div className="text-sm text-base-content/60">Active Users</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{users.filter(u => u.role === 'admin' || u.role === 'moderator').length}</div>
              <div className="text-sm text-base-content/60">Staff Members</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{users.filter(u => u.role === 'volunteer').length}</div>
              <div className="text-sm text-base-content/60">Volunteers</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Role Filter */}
            <select
              className="px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              className="px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Users Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>

              {/* Avatar and Basic Info */}
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div
                    className={`w-20 h-20 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-2xl ${getAvatarColor(user.displayName || user.name || 'User')}`}
                  >
                    {getUserInitials(user.displayName || user.name || 'User')}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1 bg-white rounded-full shadow-lg">
                    {getRoleIcon(user.role)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1">{user.displayName || user.name || 'User'}</h3>
                <p className="text-gray-600 text-sm mb-3">{user.email}</p>
                
                {/* Role Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* User Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiMail className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiClock className="w-4 h-4" />
                  <span>Joined {new Date(user.joined).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCheck className="w-4 h-4" />
                  <span>Last login {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditUser(user)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(user)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUsers className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300"
          >
            <FiUserPlus className="w-5 h-5" />
            Add First User
          </button>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete User</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{userToDelete?.name}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-700" />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4"
                />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedUser.name}</h2>
                <p className="text-gray-600 mb-4">{selectedUser.email}</p>
                
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-medium">{selectedUser.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Phone</div>
                  <div className="font-medium">{selectedUser.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Joined Date</div>
                  <div className="font-medium">{new Date(selectedUser.joined).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Last Login</div>
                  <div className="font-medium">{new Date(selectedUser.lastLogin).toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    handleEditUser(selectedUser);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit User
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    handleDeleteUser(selectedUser);
                  }}
                  className="px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="volunteer">Volunteer</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Bulk Create Users Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Bulk Create Users</h3>
                <button
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkUsers([]);
                    setCsvFile(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* CSV Upload Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-lg font-semibold mb-3">Option 1: Upload CSV File</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a CSV file with columns: name, email, role, location, phone
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {csvFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ File uploaded: {csvFile.name} ({bulkUsers.length} users found)
                  </p>
                )}
              </div>

              {/* Manual Entry Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold">Option 2: Manual Entry</h4>
                  <button
                    onClick={addManualUser}
                    className="inline-flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors duration-200"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add User
                  </button>
                </div>

                {/* Users List */}
                {bulkUsers.length > 0 && (
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {bulkUsers.map((user, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          placeholder="Name"
                          value={user.name}
                          onChange={(e) => updateBulkUser(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={user.email}
                          onChange={(e) => updateBulkUser(index, 'email', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <select
                          value={user.role}
                          onChange={(e) => updateBulkUser(index, 'role', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="volunteer">Volunteer</option>
                          <option value="admin">Admin</option>
                          <option value="moderator">Moderator</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Location"
                          value={user.location}
                          onChange={(e) => updateBulkUser(index, 'location', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          value={user.phone}
                          onChange={(e) => updateBulkUser(index, 'phone', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          onClick={() => removeBulkUser(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBulkModal(false);
                    setBulkUsers([]);
                    setCsvFile(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkCreate}
                  disabled={bulkUsers.length === 0 || bulkCreating}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bulkCreating ? 'Creating...' : `Create ${bulkUsers.length} Users`}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}