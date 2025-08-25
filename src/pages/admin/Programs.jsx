import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiFilter, FiDownload, FiEye, FiCheck, FiX, FiCalendar, FiMapPin, FiUsers, FiTarget, FiTrendingUp, FiGlobe, FiUpload } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollingProgram, setEnrollingProgram] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'education',
    location: '',
    description: '',
    budget: '',
    startDate: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  


  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const programsCollection = collection(db, 'programs');
        const programsSnapshot = await getDocs(programsCollection);
        const programsData = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
        }));
        setPrograms(programsData);
      } catch (error) {
        console.error('Error fetching programs:', error);
        alert('Failed to fetch programs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Sample user data for enrollment
  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = [
        {
          id: 1,
          name: 'John Smith',
          email: 'john.smith@email.com',
          role: 'volunteer',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          role: 'coordinator',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: 3,
          name: 'Michael Brown',
          email: 'michael.brown@email.com',
          role: 'volunteer',
          avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: 4,
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          role: 'specialist',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: 5,
          name: 'David Wilson',
          email: 'david.wilson@email.com',
          role: 'volunteer',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      ];
      setAvailableUsers(usersData);
    };

    fetchUsers();
  }, []);

  const categories = ['all', 'environment', 'education', 'health', 'community'];
  const statuses = ['all', 'active', 'planned', 'completed'];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || program.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProgram = (program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'programs', programToDelete.id));
      setPrograms(programs.filter(p => p.id !== programToDelete.id));
      setShowDeleteModal(false);
      setProgramToDelete(null);
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program. Please try again.');
    }
  };

  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (file) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const fileName = `programs/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading to Firebase Storage:', error);
      throw new Error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      environment: 'bg-green-100 text-green-800',
      education: 'bg-blue-100 text-blue-800',
      health: 'bg-red-100 text-red-800',
      community: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateProgram = () => {
    setFormData({
      title: '',
      category: 'education',
      location: '',
      description: '',
      budget: '',
      startDate: '',
      image: ''
    });
    setShowCreateModal(true);
  };

  const handleEditProgram = (program) => {
    setFormData({
      title: program.title,
      category: program.category,
      location: program.location,
      description: program.description,
      budget: program.budget.toString(),
      startDate: program.startDate,
      image: program.image
    });
    setEditingProgram(program);
    setShowEditModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      // Upload image to Contentful if a new file is selected
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
      }
      
      const programData = {
        ...formData,
        budget: parseInt(formData.budget),
        image: imageUrl,
        updatedAt: serverTimestamp()
      };
      
      if (editingProgram) {
        // Update existing program
        await updateDoc(doc(db, 'programs', editingProgram.id), programData);
        setPrograms(programs.map(p => 
          p.id === editingProgram.id 
            ? {
                ...p,
                ...programData,
                participants: p.participants, // Keep existing participants
                progress: p.progress, // Keep existing progress
                raised: p.raised // Keep existing raised amount
              }
            : p
        ));
        setShowEditModal(false);
        setEditingProgram(null);
      } else {
        // Create new program
        const newProgramData = {
          ...programData,
          participants: 0,
          progress: 0,
          status: 'planned',
          raised: 0,
          enrolledUsers: [],
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, 'programs'), newProgramData);
        setPrograms([...programs, { id: docRef.id, ...newProgramData }]);
        setShowCreateModal(false);
      }
      
      // Reset form
      setFormData({
        title: '',
        category: 'education',
        location: '',
        description: '',
        budget: '',
        startDate: '',
        image: ''
      });
      setImageFile(null);
      
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program. Please try again.');
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // User enrollment functions
  const handleEnrollUsers = (program) => {
    setEnrollingProgram(program);
    setShowEnrollModal(true);
    setSelectedUsers([]);
    setUserSearchTerm('');
  };

  const handleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, { ...user, isActive: true }];
      }
    });
  };

  const handleUserStatusToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  const confirmEnrollment = () => {
    if (enrollingProgram && selectedUsers.length > 0) {
      setPrograms(prev => 
        prev.map(program => 
          program.id === enrollingProgram.id 
            ? { 
                ...program, 
                enrolledUsers: [...(program.enrolledUsers || []), ...selectedUsers],
                participants: program.participants + selectedUsers.length
              }
            : program
        )
      );
      setShowEnrollModal(false);
      setEnrollingProgram(null);
      setSelectedUsers([]);
    }
  };

  const removeUserFromProgram = (programId, userId) => {
    setPrograms(prev => 
      prev.map(program => 
        program.id === programId 
          ? { 
              ...program, 
              enrolledUsers: program.enrolledUsers.filter(user => user.id !== userId),
              participants: Math.max(0, program.participants - 1)
            }
          : program
      )
    );
  };

  const toggleUserActiveStatus = (programId, userId) => {
    setPrograms(prev => 
      prev.map(program => 
        program.id === programId 
          ? { 
              ...program, 
              enrolledUsers: program.enrolledUsers.map(user => 
                user.id === userId ? { ...user, isActive: !user.isActive } : user
              )
            }
          : program
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      planned: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <title>Programs Management - Admin Dashboard</title>
        <meta name="description" content="Manage and oversee all programs and initiatives." />
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
              <FiGlobe className="w-4 h-4" />
              Programs Management
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
              Manage Programs
            </h1>
            
            <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
              Oversee and manage all programs and initiatives. Create, edit, and monitor the impact of your organization's work.
            </p>

            {/* Action Button */}
            <button
              onClick={handleCreateProgram}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              Create New Program
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTarget className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{programs.length}</div>
              <div className="text-sm text-base-content/60">Total Programs</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{programs.filter(p => p.status === 'active').length}</div>
              <div className="text-sm text-base-content/60">Active Programs</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{programs.reduce((sum, p) => sum + p.participants, 0).toLocaleString()}</div>
              <div className="text-sm text-base-content/60">Total Participants</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{Math.round(programs.reduce((sum, p) => sum + p.progress, 0) / programs.length)}%</div>
              <div className="text-sm text-base-content/60">Avg Progress</div>
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
                placeholder="Search programs by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Category Filter */}
            <select
              className="px-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
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

      {/* Programs Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredPrograms.map((program, index) => (
          <motion.div
            key={program.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                  {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                </span>
              </div>

              {/* Admin Actions */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => setSelectedProgram(program)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                  title="View Details"
                >
                  <FiEye className="w-4 h-4 text-gray-700" />
                </button>
                <button
                  onClick={() => handleEnrollUsers(program)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                  title="Enroll Users"
                >
                  <FiUsers className="w-4 h-4 text-green-600" />
                </button>
                <button
                  onClick={() => handleEditProgram(program)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                  title="Edit Program"
                >
                  <FiEdit className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => handleDeleteProgram(program)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                  title="Delete Program"
                >
                  <FiTrash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Category Badge */}
              <div className="mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(program.category)}`}>
                  {program.category.charAt(0).toUpperCase() + program.category.slice(1)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                {program.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {program.description}
              </p>

              {/* Meta Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiMapPin className="w-4 h-4" />
                  <span>{program.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiUsers className="w-4 h-4" />
                  <span>{program.participants.toLocaleString()} participants</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiCalendar className="w-4 h-4" />
                  <span>Started {program.startDate}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-medium text-gray-700">{program.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${program.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Budget Info */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Budget: ${program.budget.toLocaleString()}</span>
                <span className="text-green-600 font-medium">Raised: ${program.raised.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredPrograms.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiTarget className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <Link
            to="/admin/programs/create"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300"
          >
            <FiPlus className="w-5 h-5" />
            Create First Program
          </Link>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Program</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{programToDelete?.title}"? This action cannot be undone.
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

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <img
                src={selectedProgram.image}
                alt={selectedProgram.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedProgram.category)}`}>
                  {selectedProgram.category.charAt(0).toUpperCase() + selectedProgram.category.slice(1)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedProgram.status)}`}>
                  {selectedProgram.status.charAt(0).toUpperCase() + selectedProgram.status.slice(1)}
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedProgram.title}</h2>
              <p className="text-gray-600 mb-6">{selectedProgram.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-medium">{selectedProgram.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Participants</div>
                  <div className="font-medium">{selectedProgram.participants.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Start Date</div>
                  <div className="font-medium">{selectedProgram.startDate}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Progress</div>
                  <div className="font-medium">{selectedProgram.progress}%</div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                  <span className="text-sm font-medium text-gray-700">
                    ${selectedProgram.raised.toLocaleString()} / ${selectedProgram.budget.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                    style={{ width: `${(selectedProgram.raised / selectedProgram.budget) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Enrolled Users Section */}
              {selectedProgram.enrolledUsers && selectedProgram.enrolledUsers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Enrolled Users ({selectedProgram.enrolledUsers.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedProgram.enrolledUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                              {user.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleUserActiveStatus(selectedProgram.id, user.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => removeUserFromProgram(selectedProgram.id, user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Remove from program"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    handleEnrollUsers(selectedProgram);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <FiUsers className="w-4 h-4" />
                  Enroll Users
                </button>
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    handleEditProgram(selectedProgram);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Program
                </button>
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    handleDeleteProgram(selectedProgram);
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

      {/* Create/Edit Program Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProgram ? 'Edit Program' : 'Create New Program'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    setEditingProgram(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter program title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="education">Education</option>
                      <option value="health">Health</option>
                      <option value="environment">Environment</option>
                      <option value="community">Community</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget ($)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Enter budget amount"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="text"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., January 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Program Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      {formData.image && (
                        <div className="relative">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                              <div className="flex items-center gap-2 text-white">
                                <FiUpload className="w-5 h-5 animate-pulse" />
                                <span>Uploading...</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter program description"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setEditingProgram(null);
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    {editingProgram ? 'Update Program' : 'Create Program'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Enrollment Modal */}
      {showEnrollModal && enrollingProgram && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Enroll Users</h2>
                  <p className="text-gray-600 mt-1">Add users to "{enrollingProgram.title}"</p>
                </div>
                <button
                  onClick={() => {
                    setShowEnrollModal(false);
                    setEnrollingProgram(null);
                    setSelectedUsers([]);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Search Users */}
              <div className="mb-6">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Available Users */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Users</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                  {availableUsers
                    .filter(user => 
                      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                    )
                    .filter(user => 
                      !enrollingProgram.enrolledUsers?.some(enrolled => enrolled.id === user.id)
                    )
                    .map(user => {
                      const isSelected = selectedUsers.find(u => u.id === user.id);
                      return (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelection(user)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary bg-primary/5' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{user.name}</h4>
                              <p className="text-sm text-gray-600">{user.email}</p>
                              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                                {user.role}
                              </span>
                            </div>
                            {isSelected && (
                              <FiCheck className="w-5 h-5 text-primary" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Selected Users ({selectedUsers.length})
                  </h3>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {selectedUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={user.isActive}
                              onChange={() => handleUserStatusToggle(user.id)}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                          </label>
                          <button
                            onClick={() => handleUserSelection(user)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEnrollModal(false);
                    setEnrollingProgram(null);
                    setSelectedUsers([]);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEnrollment}
                  disabled={selectedUsers.length === 0}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Enroll {selectedUsers.length} User{selectedUsers.length !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}