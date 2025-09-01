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
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [editingUpdateIndex, setEditingUpdateIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('basic');

  // Form state for comprehensive program data
  const [newTeamMember, setNewTeamMember] = useState({
    name: '',
    role: '',
    image: '',
    experience: '',
    email: '',
    specialties: '',
    education: '',
    bio: '',
    imageFile: null
  });
  const [newUpdate, setNewUpdate] = useState({
    date: '',
    title: '',
    content: ''
  });
  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: ''
  });
  const [newGoal, setNewGoal] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    location: '',
    budget: '',
    raised: 0,
    progress: 0,
    startDate: '',
    endDate: '',
    image: '',
    description: '',
    longDescription: '',
    goals: [],
    impact: [],
    gallery: [],
    teamMembers: [],
    updates: [],
    faqs: [],
    participants: [],
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      website: ''
    }
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch programs from Firebase
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
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  // Fetch available users for enrollment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAvailableUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const categories = [
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Healthcare' },
    { id: 'environment', name: 'Environment' },
    { id: 'social', name: 'Social Impact' }
  ];

  const statuses = [
    { id: 'active', name: 'Active' },
    { id: 'completed', name: 'Completed' },
    { id: 'paused', name: 'Paused' },
    { id: 'planning', name: 'Planning' }
  ];

  // Filter programs based on search and filters
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         program.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || program.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || program.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return null;
    
    setUploading(true);
    try {
      const storageRef = ref(storage, `programs/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle gallery upload
  const handleGalleryUpload = async (files) => {
    const uploadPromises = Array.from(files).map(async (file) => {
      const url = await handleImageUpload(file);
      return url;
    });
    
    const urls = await Promise.all(uploadPromises);
    return urls.filter(url => url !== null);
  };

  // Gallery management functions
  const addGalleryImage = async () => {
    if (newGalleryImage) {
      try {
        let imageUrl;
        if (typeof newGalleryImage === 'string') {
          imageUrl = newGalleryImage;
        } else {
          // Upload file to Firebase Storage
          const imageRef = ref(storage, `programs/gallery/${Date.now()}_${newGalleryImage.name}`);
          await uploadBytes(imageRef, newGalleryImage);
          imageUrl = await getDownloadURL(imageRef);
        }
        
        setFormData({
          ...formData,
          gallery: [...formData.gallery, imageUrl]
        });
        setNewGalleryImage('');
      } catch (error) {
        console.error('Error uploading gallery image:', error);
        alert('Error uploading image. Please try again.');
      }
    }
  };

  const removeGalleryImage = (index) => {
    setFormData({
      ...formData,
      gallery: formData.gallery.filter((_, i) => i !== index)
    });
  };

  // Updates management functions
  const addUpdate = () => {
    if (newUpdate.title.trim() && newUpdate.content.trim()) {
      const updateToAdd = {
        ...newUpdate,
        date: newUpdate.date || new Date().toISOString().split('T')[0],
        id: Date.now().toString()
      };
      
      if (editingUpdateIndex >= 0) {
        // Edit existing update
        const updatedUpdates = [...formData.updates];
        updatedUpdates[editingUpdateIndex] = updateToAdd;
        setFormData({ ...formData, updates: updatedUpdates });
        setEditingUpdateIndex(-1);
      } else {
        // Add new update
        setFormData({
          ...formData,
          updates: [...formData.updates, updateToAdd]
        });
      }
      
      setNewUpdate({ title: '', content: '', date: '' });
    }
  };

  const editUpdate = (index) => {
    setNewUpdate(formData.updates[index]);
    setEditingUpdateIndex(index);
  };

  const cancelEditUpdate = () => {
    setNewUpdate({ title: '', content: '', date: '' });
    setEditingUpdateIndex(-1);
  };

  // Remove update
  const removeUpdate = (id) => {
    setFormData({
      ...formData,
      updates: formData.updates.filter((update, index) => update.id !== id && index !== id)
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image;
      
      // Upload main image if new file selected
      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }
      
      // Upload gallery images
      let galleryUrls = formData.gallery || [];
      if (galleryFiles.length > 0) {
        const newGalleryUrls = await handleGalleryUpload(galleryFiles);
        galleryUrls = [...galleryUrls, ...newGalleryUrls];
      }
      
      const programData = {
        ...formData,
        image: imageUrl,
        gallery: galleryUrls,
        progress: Math.round((formData.raised / formData.budget) * 100) || 0,
        participants: formData.participants || [],
        status: formData.status || 'active',
        updatedAt: serverTimestamp()
      };
      
      if (editingProgram) {
        // Update existing program
        await updateDoc(doc(db, 'programs', editingProgram.id), programData);
      } else {
        // Create new program
        await addDoc(collection(db, 'programs'), {
          ...programData,
          createdAt: serverTimestamp()
        });
      }
      
      // Reset form and close modal
      resetForm();
      setShowCreateModal(false);
      setShowEditModal(false);
      
      // Refresh programs list
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
      console.error('Error saving program:', error);
    } finally {
      setUploading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      location: '',
      budget: '',
      raised: 0,
      progress: 0,
      startDate: '',
      endDate: '',
      image: '',
      description: '',
      longDescription: '',
      goals: [],
      impact: [],
      gallery: [],
      teamMembers: [],
      updates: [],
      faqs: [],
      participants: [],
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        website: ''
      }
    });
    setImageFile(null);
    setGalleryFiles([]);
    setActiveTab('basic');
    setEditingProgram(null);
    setNewGalleryImage('');
    setNewUpdate({ title: '', content: '', date: '' });
    setEditingUpdateIndex(-1);
    setNewGoal('');
    setNewImpact('');
    setNewTeamMember({
      name: '',
      role: '',
      image: '',
      experience: '',
      email: '',
      specialties: '',
      education: '',
      bio: '',
      imageFile: null
    });
    setNewFaq({ question: '', answer: '' });
  };

  // Handle delete
  const handleDelete = async () => {
    if (!programToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'programs', programToDelete.id));
      setPrograms(programs.filter(p => p.id !== programToDelete.id));
      setShowDeleteModal(false);
      setProgramToDelete(null);
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  // Handle edit
  const handleEdit = (program) => {
    setFormData({
      title: program.title || '',
      category: program.category || '',
      location: program.location || '',
      budget: program.budget || '',
      raised: program.raised || 0,
      progress: program.progress || 0,
      startDate: program.startDate || '',
      endDate: program.endDate || '',
      image: program.image || '',
      description: program.description || '',
      longDescription: program.longDescription || '',
      goals: program.goals || [],
      impact: program.impact || [],
      gallery: program.gallery || [],
      teamMembers: program.teamMembers || program.team || [],
      updates: program.updates || [],
      faqs: program.faqs || [],
      participants: program.participants || [],
      socialLinks: program.socialLinks || {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        website: ''
      }
    });
    setEditingProgram(program);
    setShowEditModal(true);
  };

  // Add team member
  const addTeamMember = async () => {
    if (newTeamMember.name && newTeamMember.role) {
      let imageUrl = '';
      
      // Upload image if provided
      if (newTeamMember.imageFile) {
        try {
          const imageRef = ref(storage, `team-members/${Date.now()}-${newTeamMember.imageFile.name}`);
          const snapshot = await uploadBytes(imageRef, newTeamMember.imageFile);
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error('Error uploading team member image:', error);
          alert('Error uploading image. Please try again.');
          return;
        }
      }
      
      const teamMember = {
        ...newTeamMember,
        image: imageUrl,
        id: Date.now()
      };
      delete teamMember.imageFile;
      
      setFormData({
        ...formData,
        teamMembers: [...(formData.teamMembers || []), teamMember]
      });
      setNewTeamMember({
        name: '',
        role: '',
        image: '',
        experience: '',
        email: '',
        specialties: '',
        education: '',
        bio: '',
        imageFile: null
      });
    }
  };

  // Remove team member
  const removeTeamMember = (id) => {
    setFormData({
      ...formData,
      teamMembers: (formData.teamMembers || []).filter(member => member.id !== id)
    });
  };



  // Add FAQ
  const addFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFormData({
        ...formData,
        faqs: [...formData.faqs, { ...newFaq, id: Date.now() }]
      });
      setNewFaq({ question: '', answer: '' });
    }
  };

  // Remove FAQ
  const removeFaq = (id) => {
    setFormData({
      ...formData,
      faqs: formData.faqs.filter(faq => faq.id !== id)
    });
  };

  // Add goal
  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({
        ...formData,
        goals: [...formData.goals, newGoal.trim()]
      });
      setNewGoal('');
    }
  };

  // Remove goal
  const removeGoal = (index) => {
    setFormData({
      ...formData,
      goals: formData.goals.filter((_, i) => i !== index)
    });
  };

  // Add impact
  const addImpact = () => {
    if (newImpact.trim()) {
      setFormData({
        ...formData,
        impact: [...(formData.impact || []), newImpact.trim()]
      });
      setNewImpact('');
    }
  };

  // Remove impact
  const removeImpact = (index) => {
    setFormData({
      ...formData,
      impact: (formData.impact || []).filter((_, i) => i !== index)
    });
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

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              Create New Program
            </button>
          </motion.div>

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
              <div className="text-2xl font-bold text-secondary mb-1">{programs.filter(p => p.status === 'active').length}</div>
              <div className="text-sm text-base-content/60">Active Programs</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-accent mb-1">{programs.reduce((acc, p) => acc + (Array.isArray(p.participants) ? p.participants.length : p.participants || 0), 0).toLocaleString()}</div>
              <div className="text-sm text-base-content/60">Total Participants</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{Math.round(programs.reduce((acc, p) => acc + (p.progress || 0), 0) / programs.length) || 0}%</div>
              <div className="text-sm text-base-content/60">Avg Progress</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50">
              <FiSearch className="w-5 h-5" />
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
              placeholder="Search programs by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <select
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          
          {/* Status Filter */}
          <select
            className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {statuses.map(status => (
              <option key={status.id} value={status.id}>{status.name}</option>
            ))}
          </select>
        </div>
        
        {/* Results count */}
        <div className="text-center">
          <p className="text-base-content/60">
            Showing <span className="font-semibold text-primary">{filteredPrograms.length}</span> of <span className="font-semibold">{programs.length}</span> programs
          </p>
        </div>
      </div>

      {/* Programs List */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <FiSearch className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-4">No programs found</h3>
          <p className="text-lg text-base-content/70 mb-8 max-w-md mx-auto">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img className="h-12 w-12 rounded-lg object-cover" src={program.image || '/api/placeholder/48/48'} alt={program.title} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{program.title}</div>
                          <div className="text-sm text-gray-500">{program.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        program.category === 'education' ? 'bg-blue-100 text-blue-800' :
                        program.category === 'health' ? 'bg-green-100 text-green-800' :
                        program.category === 'environment' ? 'bg-orange-100 text-orange-800' :
                        program.category === 'social' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {categories.find(c => c.id === program.category)?.name || program.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        program.status === 'active' ? 'bg-green-100 text-green-800' :
                        program.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        program.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                        program.status === 'planning' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {statuses.find(s => s.id === program.status)?.name || program.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${program.progress || 0}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-600">{program.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Array.isArray(program.participants) ? program.participants.length.toLocaleString() : (program.participants || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProgram(program)}
                          className="text-primary hover:text-primary/80 transition-colors duration-200"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(program)}
                          className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          title="Edit Program"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProgramToDelete(program);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          title="Delete Program"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Program</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{programToDelete?.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
       )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Program Details</h3>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProgram.image || '/api/placeholder/400/300'}
                    alt={selectedProgram.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h4 className="text-2xl font-bold mb-2">{selectedProgram.title}</h4>
                  <p className="text-gray-600 mb-4">{selectedProgram.description}</p>
                  <div className="space-y-2">
                    <p><span className="font-semibold">Category:</span> {categories.find(c => c.id === selectedProgram.category)?.name}</p>
                    <p><span className="font-semibold">Status:</span> {statuses.find(s => s.id === selectedProgram.status)?.name}</p>
                    <p><span className="font-semibold">Location:</span> {selectedProgram.location}</p>
                    <p><span className="font-semibold">Participants:</span> {Array.isArray(selectedProgram.participants) ? selectedProgram.participants.length.toLocaleString() : (selectedProgram.participants || 0).toLocaleString()}</p>
                    <p><span className="font-semibold">Progress:</span> {selectedProgram.progress || 0}%</p>
                  </div>
                </div>
                <div>
                  <h5 className="text-lg font-semibold mb-3">Additional Information</h5>
                  <div className="space-y-4">
                    {selectedProgram.longDescription && (
                      <div>
                        <h6 className="font-medium mb-1">Long Description</h6>
                        <p className="text-gray-600 text-sm">{selectedProgram.longDescription}</p>
                      </div>
                    )}
                    {selectedProgram.goals && selectedProgram.goals.length > 0 && (
                      <div>
                        <h6 className="font-medium mb-1">Goals</h6>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                          {selectedProgram.goals.map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedProgram.impact && selectedProgram.impact.length > 0 && (
                      <div>
                        <h6 className="font-medium mb-1">Impact</h6>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                          {selectedProgram.impact.map((impact, index) => (
                            <li key={index}>{impact}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedProgram.budget && (
                      <div>
                        <h6 className="font-medium mb-1">Budget Information</h6>
                        <p className="text-gray-600 text-sm">Budget: ${selectedProgram.budget?.toLocaleString()}</p>
                        <p className="text-gray-600 text-sm">Raised: ${(selectedProgram.raised || 0).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Program Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">{showEditModal ? 'Edit Program' : 'Create New Program'}</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'basic'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Basic Information
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'gallery'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('updates')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'updates'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Updates
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('team')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'team'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Team
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('faqs')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'faqs'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  FAQs
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Basic Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                    <textarea
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.longDescription}
                      onChange={(e) => setFormData({...formData, longDescription: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        {statuses.map(status => (
                          <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Additional Information</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFormData({...formData, imageFile: file, image: URL.createObjectURL(file)});
                        }
                      }}
                    />
                    {formData.image && (
                      <div className="mt-2">
                        <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participants</label>
                      <div className="relative">
                        <select
                          multiple
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]"
                          value={formData.participants.map(p => p.id || p)}
                          onChange={(e) => {
                            const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                            const selectedParticipants = availableUsers.filter(user => selectedIds.includes(user.id));
                            setFormData({...formData, participants: selectedParticipants});
                          }}
                        >
                          {availableUsers.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.displayName || user.name || user.email}
                            </option>
                          ))}
                        </select>
                        <div className="text-xs text-gray-500 mt-1">
                           Hold Ctrl/Cmd to select multiple participants
                         </div>
                       </div>
                       
                       {/* Selected Participants Display */}
                       {formData.participants.length > 0 && (
                         <div className="mt-2">
                           <div className="text-xs font-medium text-gray-700 mb-1">Selected Participants ({formData.participants.length}):</div>
                           <div className="flex flex-wrap gap-1">
                             {formData.participants.map((participant, index) => (
                               <span
                                 key={participant.id || index}
                                 className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                               >
                                 {participant.displayName || participant.name || participant.email}
                                 <button
                                   type="button"
                                   onClick={() => {
                                     const updatedParticipants = formData.participants.filter((_, i) => i !== index);
                                     setFormData({...formData, participants: updatedParticipants});
                                   }}
                                   className="ml-1 text-primary hover:text-red-500"
                                 >
                                   <FiX className="w-3 h-3" />
                                 </button>
                               </span>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>
                    
                    {/* Funding Tracking Section */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <h5 className="font-medium text-gray-900">Funding Tracking</h5>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Goal ($)</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={formData.budget}
                            onChange={(e) => {
                              const budget = parseInt(e.target.value) || 0;
                              const progress = budget > 0 ? Math.round((formData.raised / budget) * 100) : 0;
                              setFormData({...formData, budget, progress});
                            }}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount Raised ($)</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={formData.raised}
                            onChange={(e) => {
                              const raised = parseInt(e.target.value) || 0;
                              const progress = formData.budget > 0 ? Math.round((raised / formData.budget) * 100) : 0;
                              setFormData({...formData, raised, progress});
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Progress Visualization */}
                      {formData.budget > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                            <span className="text-sm text-gray-600">{formData.progress}% ({formData.raised.toLocaleString()} / {formData.budget.toLocaleString()})</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-primary h-3 rounded-full transition-all duration-300" 
                              style={{ width: `${Math.min(formData.progress, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>$0</span>
                            <span>${formData.budget.toLocaleString()}</span>
                          </div>
                          {formData.progress >= 100 && (
                            <div className="flex items-center gap-2 text-green-600 text-sm">
                              <FiCheck className="w-4 h-4" />
                              <span>Funding goal achieved!</span>
                            </div>
                          )}
                          {formData.raised > formData.budget && (
                            <div className="text-blue-600 text-sm">
                              <span>Exceeded goal by ${(formData.raised - formData.budget).toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Funding Statistics */}
                      {formData.budget > 0 && (
                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">${formData.raised.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Raised</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">${(formData.budget - formData.raised).toLocaleString()}</div>
                            <div className="text-xs text-gray-500">Remaining</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-primary">{formData.progress}%</div>
                            <div className="text-xs text-gray-500">Complete</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    />
                  </div>
                  
                  {/* Goals Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Goals</label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a new goal"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={newGoal}
                          onChange={(e) => setNewGoal(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                        />
                        <button
                          type="button"
                          onClick={addGoal}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {formData.goals && formData.goals.length > 0 && (
                        <div className="space-y-2">
                          {formData.goals.map((goal, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm">{goal}</span>
                              <button
                                type="button"
                                onClick={() => removeGoal(index)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Impact Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Impact</label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a new impact statement"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={newImpact}
                          onChange={(e) => setNewImpact(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addImpact()}
                        />
                        <button
                          type="button"
                          onClick={addImpact}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {formData.impact && formData.impact.length > 0 && (
                        <div className="space-y-2">
                          {formData.impact.map((impact, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <span className="text-sm">{impact}</span>
                              <button
                                type="button"
                                onClick={() => removeImpact(index)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              >
                                <FiX className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Social Media Links */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Social Media Links</label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Facebook</label>
                        <input
                          type="url"
                          placeholder="https://facebook.com/yourpage"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={formData.socialLinks?.facebook || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: {
                              ...formData.socialLinks,
                              facebook: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Twitter</label>
                        <input
                          type="url"
                          placeholder="https://twitter.com/yourhandle"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={formData.socialLinks?.twitter || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: {
                              ...formData.socialLinks,
                              twitter: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Instagram</label>
                        <input
                          type="url"
                          placeholder="https://instagram.com/yourprofile"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={formData.socialLinks?.instagram || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            socialLinks: {
                              ...formData.socialLinks,
                              instagram: e.target.value
                            }
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Gallery Tab */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold">Gallery Management</h4>
                  
                  {/* Add New Gallery Image */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Add New Image</h5>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setNewGalleryImage(file);
                          }
                        }}
                      />
                      {newGalleryImage && (
                        <div className="flex items-center gap-3">
                          <img 
                            src={typeof newGalleryImage === 'string' ? newGalleryImage : URL.createObjectURL(newGalleryImage)} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded-lg" 
                          />
                          <button
                            type="button"
                            onClick={addGalleryImage}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                          >
                            <FiPlus className="w-4 h-4 mr-2" />
                            Add to Gallery
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Images List */}
                  <div className="space-y-3">
                    <h5 className="font-medium">Current Gallery Images</h5>
                    {formData.gallery && formData.gallery.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.gallery.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No gallery images added yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* Updates Tab */}
              {activeTab === 'updates' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold">Program Updates</h4>
                  
                  {/* Add New Update */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">
                      {editingUpdateIndex >= 0 ? 'Edit Update' : 'Add New Update'}
                    </h5>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="date"
                          placeholder="Date"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={newUpdate.date}
                          onChange={(e) => setNewUpdate({ ...newUpdate, date: e.target.value })}
                        />
                        <input
                          type="text"
                          placeholder="Update Title"
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={newUpdate.title}
                          onChange={(e) => setNewUpdate({ ...newUpdate, title: e.target.value })}
                        />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Update Content"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={newUpdate.content}
                        onChange={(e) => setNewUpdate({ ...newUpdate, content: e.target.value })}
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={addUpdate}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                        >
                          {editingUpdateIndex >= 0 ? 'Update' : 'Add Update'}
                        </button>
                        {editingUpdateIndex >= 0 && (
                          <button
                            type="button"
                            onClick={cancelEditUpdate}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Updates List */}
                  <div className="space-y-3">
                    <h5 className="font-medium">Current Updates</h5>
                    {formData.updates && formData.updates.length > 0 ? (
                      <div className="space-y-3">
                        {formData.updates.map((update, index) => (
                          <div key={update.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h6 className="font-medium">{update.title}</h6>
                                <p className="text-sm text-gray-500">{update.date}</p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => editUpdate(index)}
                                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                >
                                  <FiEdit className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeUpdate(update.id || index)}
                                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{update.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No updates added yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === 'team' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold">Team Members</h4>
                  
                  {/* Add New Team Member */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Add New Team Member</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={newTeamMember.name}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Role/Position"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={newTeamMember.role}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={newTeamMember.email}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Years of Experience"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={newTeamMember.experience}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, experience: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Education Background"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 md:col-span-2"
                        value={newTeamMember.education}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, education: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Specialties (comma-separated)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 md:col-span-2"
                        value={newTeamMember.specialties}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, specialties: e.target.value })}
                      />
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setNewTeamMember({ ...newTeamMember, imageFile: file });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Bio/Description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 md:col-span-2"
                        value={newTeamMember.bio}
                        onChange={(e) => setNewTeamMember({ ...newTeamMember, bio: e.target.value })}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addTeamMember}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                    >
                      Add Team Member
                    </button>
                  </div>

                  {/* Team Members List */}
                  <div className="space-y-3">
                    <h5 className="font-medium">Current Team Members</h5>
                    {formData.teamMembers && formData.teamMembers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.teamMembers.map((member, index) => (
                          <div key={member.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              {member.image && (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-16 h-16 rounded-full object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h6 className="font-medium">{member.name}</h6>
                                    <p className="text-sm text-gray-600">{member.role}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeTeamMember(member.id || index)}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                {member.email && (
                                  <p className="text-sm text-gray-600 mb-1">{member.email}</p>
                                )}
                                {member.experience && (
                                  <p className="text-sm text-gray-600 mb-1">{member.experience} years experience</p>
                                )}
                                {member.specialties && (
                                  <p className="text-sm text-gray-600 mb-2">{member.specialties}</p>
                                )}
                                {member.bio && (
                                  <p className="text-sm text-gray-700">{member.bio}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No team members added yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* FAQs Tab */}
              {activeTab === 'faqs' && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold">Frequently Asked Questions</h4>
                  
                  {/* Add New FAQ */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium mb-3">Add New FAQ</h5>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Question"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={newFaq.question}
                        onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                      />
                      <textarea
                        rows={3}
                        placeholder="Answer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={newFaq.answer}
                        onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={addFaq}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                      >
                        Add FAQ
                      </button>
                    </div>
                  </div>

                  {/* FAQs List */}
                  <div className="space-y-3">
                    <h5 className="font-medium">Current FAQs</h5>
                    {formData.faqs && formData.faqs.length > 0 ? (
                      <div className="space-y-3">
                        {formData.faqs.map((faq, index) => (
                          <div key={faq.id || index} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="font-medium">{faq.question}</h6>
                              <button
                                type="button"
                                onClick={() => removeFaq(faq.id || index)}
                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                              >
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-gray-700 text-sm">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No FAQs added yet</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (showEditModal ? 'Update Program' : 'Create Program')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     </AdminLayout>
   );
 }