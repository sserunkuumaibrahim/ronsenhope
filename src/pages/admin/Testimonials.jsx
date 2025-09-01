import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiFilter, FiEye, FiX, FiUser, FiStar, FiMessageSquare, FiUpload, FiCheck } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { storage } from '../../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, testimonials, quotes
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('testimonials'); // testimonials, quotes
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    organization: '',
    content: '',
    rating: 5,
    status: 'active',
    type: 'testimonial', // testimonial, quote
    location: '', // for quotes: where it appears on site
    author: '', // for quotes
    context: '' // for quotes: additional context
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch testimonials
      const testimonialsSnapshot = await getDocs(collection(db, 'testimonials'));
      const testimonialsData = testimonialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'testimonial'
      }));
      setTestimonials(testimonialsData);

      // Fetch quotes
      const quotesSnapshot = await getDocs(collection(db, 'quotes'));
      const quotesData = quotesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'quote'
      }));
      setQuotes(quotesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (file) => {
    try {
      setUploading(true);
      const timestamp = Date.now();
      const fileName = `testimonials/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading to Firebase Storage:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.content || (formData.type === 'testimonial' && !formData.name)) {
      alert('Please fill in all required fields');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
      }

      const itemData = {
        ...formData,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const collectionName = formData.type === 'testimonial' ? 'testimonials' : 'quotes';
      
      if (editingItem) {
        await updateDoc(doc(db, collectionName, editingItem.id), {
          ...itemData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, collectionName), itemData);
      }

      await fetchData();
      resetForm();
      setShowCreateModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      role: item.role || '',
      organization: item.organization || '',
      content: item.content || '',
      rating: item.rating || 5,
      status: item.status || 'active',
      type: item.type || 'testimonial',
      location: item.location || '',
      author: item.author || '',
      context: item.context || ''
    });
    setImageFile(null);
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const collectionName = itemToDelete.type === 'testimonial' ? 'testimonials' : 'quotes';
      await deleteDoc(doc(db, collectionName, itemToDelete.id));
      await fetchData();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      organization: '',
      content: '',
      rating: 5,
      status: 'active',
      type: activeTab === 'testimonials' ? 'testimonial' : 'quote',
      location: '',
      author: '',
      context: ''
    });
    setImageFile(null);
    setEditingItem(null);
  };

  // Filter data based on search and filters
  const getFilteredData = () => {
    let data = [];
    if (activeTab === 'testimonials') {
      data = testimonials;
    } else if (activeTab === 'quotes') {
      data = quotes;
    } else {
      data = [...testimonials, ...quotes];
    }

    return data.filter(item => {
      const matchesSearch = 
        (item.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.content?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.author?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.organization?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const filteredData = getFilteredData();

  return (
    <AdminLayout>
      <Helmet>
        <title>Testimonials & Quotes Management - Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Testimonials & Quotes</h1>
            <p className="text-gray-600">Manage testimonials and quotes across the website</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setFormData(prev => ({ ...prev, type: activeTab === 'testimonials' ? 'testimonial' : 'quote' }));
              setShowCreateModal(true);
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FiPlus className="w-4 h-4" />
            Add {activeTab === 'testimonials' ? 'Testimonial' : 'Quote'}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'testimonials', label: 'Testimonials', count: testimonials.length },
              { id: 'quotes', label: 'Site Quotes', count: quotes.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="testimonial">Testimonials</option>
              <option value="quote">Quotes</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredData.length} of {activeTab === 'testimonials' ? testimonials.length : activeTab === 'quotes' ? quotes.length : testimonials.length + quotes.length} items
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab} found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new {activeTab === 'testimonials' ? 'testimonial' : 'quote'}.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {activeTab === 'testimonials' ? 'Person' : 'Quote'}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Content
                      </th>
                      {activeTab === 'testimonials' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Rating
                        </th>
                      )}
                      {activeTab === 'quotes' && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                      )}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {item.imageUrl && (
                              <img
                                className="h-10 w-10 rounded-full object-cover mr-3"
                                src={item.imageUrl}
                                alt={item.name || item.author}
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {item.name || item.author || 'Anonymous'}
                              </div>
                              {item.role && (
                                <div className="text-sm text-gray-500">{item.role}</div>
                              )}
                              {item.organization && (
                                <div className="text-sm text-gray-500">{item.organization}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {item.content}
                          </div>
                        </td>
                        {activeTab === 'testimonials' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (item.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">{item.rating || 0}/5</span>
                            </div>
                          </td>
                        )}
                        {activeTab === 'quotes' && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.location || 'General'}</div>
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setItemToDelete(item);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800 transition-colors"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingItem ? 'Edit' : 'Create'} {formData.type === 'testimonial' ? 'Testimonial' : 'Quote'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="testimonial">Testimonial</option>
                    <option value="quote">Quote</option>
                  </select>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'testimonial' ? 'Testimonial' : 'Quote'} Content *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder={`Enter the ${formData.type} content...`}
                  />
                </div>

                {/* Conditional Fields for Testimonials */}
                {formData.type === 'testimonial' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Person's name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          placeholder="Job title or role"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.organization}
                        onChange={(e) => setFormData({...formData, organization: e.target.value})}
                        placeholder="Company or organization"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.rating}
                        onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Conditional Fields for Quotes */}
                {formData.type === 'quote' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={formData.author}
                          onChange={(e) => setFormData({...formData, author: e.target.value})}
                          placeholder="Quote author"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location on Site</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                        >
                          <option value="">Select location</option>
                          <option value="homepage">Homepage</option>
                          <option value="about">About Page</option>
                          <option value="programs">Programs Page</option>
                          <option value="stories">Stories Page</option>
                          <option value="footer">Footer</option>
                          <option value="general">General Use</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Context</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        value={formData.context}
                        onChange={(e) => setFormData({...formData, context: e.target.value})}
                        placeholder="Additional context or description"
                      />
                    </div>
                  </>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formData.type === 'testimonial' ? 'Profile' : 'Author'} Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  {imageFile && (
                    <p className="text-sm text-gray-600 mt-1">Selected: {imageFile.name}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      {editingItem ? 'Update' : 'Create'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete {itemToDelete?.type === 'testimonial' ? 'Testimonial' : 'Quote'}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setItemToDelete(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}