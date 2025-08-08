import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiFilter, FiEye, FiMessageSquare, FiAlertCircle, FiCheck } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { db } from '../../firebase/config';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, where, limit, startAfter, getDoc } from 'firebase/firestore';

export default function ForumManagement() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [firstVisible, setFirstVisible] = useState(null);
  const [pageSize] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionStatus, setActionStatus] = useState({ type: '', message: '' });
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'volunteering', name: 'Volunteering' },
    { id: 'fundraising', name: 'Fundraising' },
    { id: 'environment', name: 'Environment' },
    { id: 'education', name: 'Education' },
    { id: 'partnerships', name: 'Partnerships' },
    { id: 'health', name: 'Health' },
    { id: 'impact', name: 'Impact Measurement' },
    { id: 'community', name: 'Community Development' },
    { id: 'youth', name: 'Youth Programs' }
  ];

  // Fetch topics on component mount
  useEffect(() => {
    fetchTopics();
  }, [currentPage, filterCategory]);

  // Fetch topics from Firestore
  const fetchTopics = async () => {
    try {
      setLoading(true);
      let topicsQuery;

      // Base query
      if (filterCategory === 'all') {
        topicsQuery = query(
          collection(db, 'forumTopics'),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      } else {
        topicsQuery = query(
          collection(db, 'forumTopics'),
          where('category', '==', filterCategory),
          orderBy('createdAt', 'desc'),
          limit(pageSize)
        );
      }

      // If not the first page and we have a last document
      if (currentPage > 1 && lastVisible) {
        if (filterCategory === 'all') {
          topicsQuery = query(
            collection(db, 'forumTopics'),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(pageSize)
          );
        } else {
          topicsQuery = query(
            collection(db, 'forumTopics'),
            where('category', '==', filterCategory),
            orderBy('createdAt', 'desc'),
            startAfter(lastVisible),
            limit(pageSize)
          );
        }
      }

      const snapshot = await getDocs(topicsQuery);
      
      // Get total count for pagination
      const totalQuery = filterCategory === 'all' 
        ? query(collection(db, 'forumTopics'))
        : query(collection(db, 'forumTopics'), where('category', '==', filterCategory));
      
      const totalSnapshot = await getDocs(totalQuery);
      const totalCount = totalSnapshot.size;
      setTotalPages(Math.ceil(totalCount / pageSize));

      // Set pagination cursors
      if (!snapshot.empty) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        setFirstVisible(snapshot.docs[0]);
      }

      const topicsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastActivityAt: doc.data().lastActivityAt?.toDate() || new Date()
      }));

      setTopics(topicsData);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setActionStatus({
        type: 'error',
        message: 'Failed to load forum topics. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Filter topics locally based on search term
    // In a real app with many topics, you might want to use Firestore queries instead
    fetchTopics();
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setFilterCategory(category);
    setCurrentPage(1); // Reset to first page when changing filters
    setLastVisible(null);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handle topic deletion
  const handleDeleteTopic = async (topicId) => {
    try {
      // First, check if there are messages associated with this topic
      const messagesQuery = query(
        collection(db, 'forumMessages'),
        where('topicId', '==', topicId)
      );
      const messagesSnapshot = await getDocs(messagesQuery);
      
      // Delete all messages first
      const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Then delete the topic
      await deleteDoc(doc(db, 'forumTopics', topicId));
      
      // Update UI
      setTopics(topics.filter(topic => topic.id !== topicId));
      setDeleteConfirm(null);
      setActionStatus({
        type: 'success',
        message: 'Topic and all associated messages deleted successfully.'
      });
      
      // Refresh topics if the current page is now empty
      if (topics.length === 1) {
        handlePrevPage();
      } else {
        fetchTopics();
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      setActionStatus({
        type: 'error',
        message: 'Failed to delete topic. Please try again.'
      });
    }
  };

  // Handle topic sticky/unsticky
  const handleToggleSticky = async (topicId, isCurrentlySticky) => {
    try {
      const topicRef = doc(db, 'forumTopics', topicId);
      await updateDoc(topicRef, {
        isSticky: !isCurrentlySticky
      });
      
      // Update UI
      setTopics(topics.map(topic => 
        topic.id === topicId 
          ? { ...topic, isSticky: !isCurrentlySticky } 
          : topic
      ));
      
      setActionStatus({
        type: 'success',
        message: `Topic ${!isCurrentlySticky ? 'pinned' : 'unpinned'} successfully.`
      });
    } catch (error) {
      console.error('Error updating topic:', error);
      setActionStatus({
        type: 'error',
        message: 'Failed to update topic. Please try again.'
      });
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Forum Management - Admin Dashboard</title>
      </Helmet>

      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold">Forum Management</h1>
            <p className="text-base-content/70">Manage forum topics and discussions</p>
          </div>
          
          <Link to="/forum" className="btn btn-outline btn-sm gap-2">
            <FiEye /> View Public Forum
          </Link>
        </motion.div>
      </div>

      {/* Action Status Message */}
      {actionStatus.message && (
        <div className={`alert ${actionStatus.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
          <div className="flex-1">
            {actionStatus.type === 'success' ? <FiCheck className="mr-2" /> : <FiAlertCircle className="mr-2" />}
            <span>{actionStatus.message}</span>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-base-100 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="form-control flex-1">
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Search topics..." 
                className="input input-bordered w-full" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square" onClick={handleSearch}>
                <FiSearch />
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <select 
              className="select select-bordered w-full" 
              value={filterCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Topics Table */}
      <div className="bg-base-100 rounded-lg shadow-md overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : topics.length > 0 ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Category</th>
                <th>Author</th>
                <th>Created</th>
                <th>Activity</th>
                <th>Messages</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topics.map(topic => (
                <tr key={topic.id} className={topic.isSticky ? 'bg-base-200' : ''}>
                  <td className="max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      {topic.isSticky && (
                        <span className="badge badge-sm badge-primary">Pinned</span>
                      )}
                      <span className="font-medium">{topic.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">{topic.category}</span>
                  </td>
                  <td>{topic.creatorName || 'Unknown'}</td>
                  <td>{formatDate(topic.createdAt)}</td>
                  <td>{formatDate(topic.lastActivityAt)}</td>
                  <td>{topic.messageCount || 0}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleToggleSticky(topic.id, topic.isSticky)}
                        title={topic.isSticky ? 'Unpin topic' : 'Pin topic'}
                      >
                        {topic.isSticky ? 'Unpin' : 'Pin'}
                      </button>
                      <button 
                        className="btn btn-sm btn-error btn-outline"
                        onClick={() => setDeleteConfirm(topic.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center">
            <FiMessageSquare className="mx-auto text-4xl mb-4 text-base-content/30" />
            <p>No forum topics found.</p>
            {filterCategory !== 'all' && (
              <p className="mt-2">
                Try changing your filter or <button className="text-primary" onClick={() => handleCategoryChange('all')}>view all topics</button>.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && topics.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-base-content/70">
            Page {currentPage} of {totalPages}
          </div>
          <div className="join">
            <button 
              className="join-item btn btn-sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="join-item btn btn-sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this topic? This will also delete all messages in this topic. This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button 
                className="btn btn-ghost"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={() => handleDeleteTopic(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}