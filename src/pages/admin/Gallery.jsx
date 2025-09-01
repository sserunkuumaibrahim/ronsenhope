import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiFilter, FiDownload, FiImage, FiEye, FiX, FiUpload, FiCalendar, FiTag, FiHeart } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'community',
    photographer: '',
    location: '',
    tags: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  


  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const photosCollection = collection(db, 'gallery');
        const photosSnapshot = await getDocs(photosCollection);
        const photosData = photosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          tags: doc.data().tags || [],
          uploadDate: doc.data().uploadDate?.toDate ? doc.data().uploadDate.toDate() : new Date(doc.data().uploadDate)
        }));
        setPhotos(photosData);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (file) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const fileName = `gallery/${timestamp}_${file.name}`;
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

  // Handle photo upload
  const handleUploadPhoto = async (e) => {
    if (e) e.preventDefault();
    if (!imageFiles || imageFiles.length === 0) return;

    try {
      setLoading(true);
      
      // Upload all selected images
      for (const file of imageFiles) {
        // Upload image to Firebase Storage
        const imageUrl = await uploadImageToFirebase(file);
        
        // Prepare tags array from comma-separated string
        const tagsArray = formData.tags
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : [];
        
        // Save photo data to Firebase
        await addDoc(collection(db, 'gallery'), {
          ...formData,
          tags: tagsArray,
          imageUrl,
          uploadDate: serverTimestamp(),
          createdAt: serverTimestamp(),
          likes: 0
        });
      }
      
      // Refresh photos list
      const photosCollection = collection(db, 'gallery');
      const photosSnapshot = await getDocs(photosCollection);
      const photosData = photosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tags: doc.data().tags || [],
        uploadDate: doc.data().uploadDate?.toDate ? doc.data().uploadDate.toDate() : new Date(doc.data().uploadDate)
      }));
      setPhotos(photosData);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'community',
        photographer: '',
        location: '',
        tags: ''
      });
      setImageFiles([]);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'community', 'water', 'education', 'healthcare', 'relief', 'training', 'environment', 'housing'];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (Array.isArray(photo.tags) 
                           ? photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
                           : (photo.tags || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDeletePhoto = (photo) => {
    setPhotoToDelete(photo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'gallery', photoToDelete.id));
      setPhotos(photos.filter(p => p.id !== photoToDelete.id));
      setShowDeleteModal(false);
      setPhotoToDelete(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    }
  };

  const handleEditPhoto = (photo) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description,
      category: photo.category,
      photographer: photo.photographer || '',
      location: photo.location || '',
      tags: photo.tags || []
    });
    setShowEditModal(true);
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'gallery', editingPhoto.id), {
        ...formData,
        updatedAt: serverTimestamp()
      });
      
      // Refresh photos list
      const photosCollection = collection(db, 'gallery');
      const photosSnapshot = await getDocs(photosCollection);
      const photosData = photosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadDate: doc.data().uploadDate?.toDate ? doc.data().uploadDate.toDate() : new Date(doc.data().uploadDate)
      }));
      setPhotos(photosData);
      
      setShowEditModal(false);
      setEditingPhoto(null);
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo. Please try again.');
    }
  };

  const handleCreatePhoto = () => {
    setFormData({
      title: '',
      description: '',
      category: 'community',
      photographer: '',
      location: '',
      tags: ''
    });
    setImageFiles([]);
    setShowUploadModal(true);
  };

  const getCategoryColor = (category) => {
    const colors = {
      community: 'bg-pink-100 text-pink-800',
      water: 'bg-blue-100 text-blue-800',
      education: 'bg-green-100 text-green-800',
      healthcare: 'bg-red-100 text-red-800',
      relief: 'bg-orange-100 text-orange-800',
      training: 'bg-purple-100 text-purple-800',
      environment: 'bg-emerald-100 text-emerald-800',
      housing: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
        <title>Gallery Management - Admin Dashboard</title>
        <meta name="description" content="Manage and organize photo gallery content." />
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
              <FiImage className="w-4 h-4" />
              Photo Gallery
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 leading-tight">
              Gallery Management
            </h1>
            
            <p className="text-lg md:text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed mb-8">
              Organize and showcase impactful moments from our programs and initiatives. Manage photo collections that tell our story.
            </p>

            {/* Action Button */}
            <button
              onClick={handleCreatePhoto}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FiUpload className="w-5 h-5" />
              Upload Photos
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
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiImage className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{photos.length}</div>
              <div className="text-sm text-base-content/60">Total Photos</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiTag className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{categories.length - 1}</div>
              <div className="text-sm text-base-content/60">Categories</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiHeart className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">{photos.reduce((sum, photo) => sum + photo.likes, 0)}</div>
              <div className="text-sm text-base-content/60">Total Likes</div>
            </div>
            <div className="text-center bg-white/50 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{new Date().getMonth() + 1}</div>
              <div className="text-sm text-base-content/60">This Month</div>
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
                placeholder="Search photos by title, description, or tags..."
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
          </div>
        </div>
      </motion.div>

      {/* Photos Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
          >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                  <button
                    onClick={() => setSelectedPhoto(photo)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                  >
                    <FiEye className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleEditPhoto(photo)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                  >
                    <FiEdit className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors duration-200"
                  >
                    <FiTrash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getCategoryColor(photo.category)}`}>
                  {photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}
                </span>
              </div>
              
              {/* Likes */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                <FiHeart className="w-3 h-3 text-white" />
                <span className="text-xs text-white">{photo.likes}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{photo.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{photo.description}</p>
              
              {/* Meta Info */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-3 h-3" />
                  <span>{new Date(photo.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{photo.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📸</span>
                  <span>{photo.photographer}</span>
                </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {(() => {
                  const tagsArray = Array.isArray(photo.tags) 
                    ? photo.tags 
                    : (photo.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag);
                  return (
                    <>
                      {tagsArray.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {tagsArray.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{tagsArray.length - 3}
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredPhotos.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiImage className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria.</p>
          <button
            onClick={handleCreatePhoto}
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all duration-300"
          >
            <FiUpload className="w-5 h-5" />
            Upload First Photo
          </button>
        </motion.div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Upload Photos</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop photos here, or click to browse</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200 cursor-pointer inline-block"
                >
                  Choose Files
                </label>
                {imageFiles.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {imageFiles.length} file(s) selected
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Photo title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows="3"
                  placeholder="Photo description"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Photo location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photographer</label>
                  <input
                    type="text"
                    value={formData.photographer}
                    onChange={(e) => setFormData({...formData, photographer: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Photographer name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter tags separated by commas"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUploadPhoto}
                  disabled={!imageFiles.length || loading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload Photos'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Photo</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{photoToDelete?.title}"? This action cannot be undone.
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

      {/* Photo Details Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="relative">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors duration-200"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
              
              <div className="aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPhoto.title}</h2>
                  <p className="text-gray-600">{selectedPhoto.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getCategoryColor(selectedPhoto.category)}`}>
                  {selectedPhoto.category.charAt(0).toUpperCase() + selectedPhoto.category.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Upload Date</div>
                  <div className="font-medium">{new Date(selectedPhoto.uploadDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Location</div>
                  <div className="font-medium">{selectedPhoto.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Photographer</div>
                  <div className="font-medium">{selectedPhoto.photographer}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Likes</div>
                  <div className="font-medium flex items-center gap-1">
                    <FiHeart className="w-4 h-4 text-red-500" />
                    {selectedPhoto.likes}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const tagsArray = Array.isArray(selectedPhoto.tags) 
                      ? selectedPhoto.tags 
                      : (selectedPhoto.tags || '').split(',').map(tag => tag.trim()).filter(tag => tag);
                    return tagsArray.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
                      >
                        #{tag}
                      </span>
                    ));
                  })()}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    handleEditPhoto(selectedPhoto);
                    setSelectedPhoto(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  <FiEdit className="w-4 h-4" />
                  Edit Photo
                </button>
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    handleDeletePhoto(selectedPhoto);
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
    </AdminLayout>
  );
}