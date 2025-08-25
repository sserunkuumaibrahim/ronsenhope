import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiFilter, FiEye, FiX, FiCalendar, FiUser, FiHeart, FiMessageCircle, FiUsers, FiClock, FiStar, FiLock, FiUnlock, FiFlag, FiMessageSquare } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { realtimeDb } from '../../firebase/config';
import { ref, get, push, set, onValue, off, update, remove, query, orderByChild, orderByKey } from 'firebase/database';
import { toast } from 'react-hot-toast';

export default function Forum() {
  const [topics, setTopics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('topic'); // 'topic' or 'message'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('topics');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    status: ''
  });

  useEffect(() => {
    const setupForumListeners = () => {
      setLoading(true);
      const unsubscribers = [];
      
      try {
        // Set up real-time listener for topics
        const topicsRef = ref(realtimeDb, 'forumTopics');
        
        const topicsUnsubscribe = onValue(topicsRef, (topicsSnapshot) => {
          if (topicsSnapshot.exists()) {
            const topicsData = Object.entries(topicsSnapshot.val()).map(([key, value]) => ({
              id: key,
              ...value,
              createdAt: new Date(value.createdAt).toLocaleDateString(),
              lastActivity: new Date(value.lastActivity).toLocaleDateString(),
              isPinned: value.isSticky || false,
              isLocked: value.isLocked || false,
              status: value.isSticky ? 'pinned' : (value.isLocked ? 'locked' : 'active')
            })).sort((a, b) => {
              // Sort by sticky first, then by last activity
              if (a.isSticky && !b.isSticky) return -1;
              if (!a.isSticky && b.isSticky) return 1;
              return b.lastActivity - a.lastActivity;
            });
            
            setTopics(topicsData);
            
            // Set up listeners for replies from all topics
            let pendingReplies = topicsData.length;
            
            if (topicsData.length === 0) {
              setMessages([]);
              setLoading(false);
              return;
            }
            
            topicsData.forEach((topic) => {
              const repliesRef = ref(realtimeDb, `forumTopics/${topic.id}/replies`);
              
              const repliesUnsubscribe = onValue(repliesRef, (repliesSnapshot) => {
                let topicReplies = [];
                if (repliesSnapshot.exists()) {
                  topicReplies = Object.entries(repliesSnapshot.val()).map(([key, value]) => ({
                    id: key,
                    topicId: topic.id,
                    ...value,
                    createdAt: new Date(value.createdAt).toISOString(),
                    isReported: value.isReported || false,
                    reportCount: value.reportCount || 0
                  })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                }
                
                // Update messages for this specific topic
                setMessages(prevMessages => {
                  const filteredMessages = prevMessages.filter(msg => msg.topicId !== topic.id);
                  return [...filteredMessages, ...topicReplies];
                });
                
                pendingReplies--;
                if (pendingReplies === 0) {
                  setLoading(false);
                }
              }, (error) => {
                console.error(`Error listening to replies for topic ${topic.id}:`, error);
                pendingReplies--;
                if (pendingReplies === 0) {
                  setLoading(false);
                }
              });
              
              unsubscribers.push(() => off(repliesRef, 'value', repliesUnsubscribe));
            });
          } else {
            setTopics([]);
            setMessages([]);
            setLoading(false);
          }
          
        }, (error) => {
          console.error('Error listening to topics:', error);
          toast.error('Failed to load forum data');
          setLoading(false);
        });
        
        unsubscribers.push(() => off(topicsRef, 'value', topicsUnsubscribe));
        
      } catch (error) {
        console.error('Error setting up forum listeners:', error);
        toast.error('Failed to set up real-time updates');
        setLoading(false);
      }
      
      return () => {
        unsubscribers.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
      };
    };
    
    const cleanup = setupForumListeners();
    
    return cleanup;
  }, []);

  // Handle topic deletion
  const handleDeleteTopic = async (topicId) => {
    try {
      const topicRef = ref(realtimeDb, `forumTopics/${topicId}`);
      await remove(topicRef);
      setTopics(topics.filter(topic => topic.id !== topicId));
      toast.success('Topic deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Failed to delete topic');
    }
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId, topicId) => {
    try {
      const messageRef = ref(realtimeDb, `forumTopics/${topicId}/replies/${messageId}`);
      await remove(messageRef);
      setMessages(messages.filter(message => message.id !== messageId));
      toast.success('Message deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  // Handle topic lock/unlock
  const handleToggleLock = async (topicId, isLocked) => {
    try {
      const topicRef = ref(realtimeDb, `forumTopics/${topicId}`);
      await update(topicRef, {
        isLocked: !isLocked
      });
      
      setTopics(topics.map(topic => 
        topic.id === topicId 
          ? { ...topic, isLocked: !isLocked, status: !isLocked ? 'locked' : 'active' }
          : topic
      ));
      
      toast.success(`Topic ${!isLocked ? 'locked' : 'unlocked'} successfully`);
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast.error('Failed to update topic');
    }
  };

  // Handle topic pin/unpin
  const handleTogglePin = async (topicId, isPinned) => {
    try {
      const topicRef = ref(realtimeDb, `forumTopics/${topicId}`);
      await update(topicRef, {
        isSticky: !isPinned
      });
      
      setTopics(topics.map(topic => 
        topic.id === topicId 
          ? { ...topic, isPinned: !isPinned, status: !isPinned ? 'pinned' : 'active' }
          : topic
      ));
      
      toast.success(`Topic ${!isPinned ? 'pinned' : 'unpinned'} successfully`);
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update topic');
    }
  };

  // Filter topics based on search and filters
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || topic.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Filter messages based on search
  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getCategoryBadgeColor = (category) => {
    const categoryColors = {
      general: 'badge-primary',
      volunteer: 'badge-secondary',
      programs: 'badge-accent',
      fundraising: 'badge-info',
      environment: 'badge-success',
      health: 'badge-warning',
      education: 'badge-error'
    };
    return categoryColors[category] || 'badge-outline';
  };

  const getStatusBadgeColor = (status) => {
    const statusColors = {
      active: 'badge-success',
      pinned: 'badge-warning',
      locked: 'badge-error'
    };
    return statusColors[status] || 'badge-outline';
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
        <title>Forum Management - Admin Dashboard</title>
        <meta name="description" content="Manage community forum topics and messages with admin privileges." />
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
              Forum Management
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Community Forum
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Manage forum topics, moderate discussions, and maintain a healthy community environment.
            </motion.p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FiMessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Topics</p>
                  <p className="text-2xl font-bold text-gray-900">{topics.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <FiMessageCircle className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{messages.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FiStar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pinned Topics</p>
                  <p className="text-2xl font-bold text-gray-900">{topics.filter(t => t.isPinned).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <FiFlag className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reported Items</p>
                  <p className="text-2xl font-bold text-gray-900">{messages.filter(m => m.isReported).length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('topics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'topics'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Topics ({topics.length})
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Messages ({messages.length})
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search topics or messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="volunteer">Volunteer</option>
                <option value="programs">Programs</option>
                <option value="fundraising">Fundraising</option>
                <option value="environment">Environment</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
              </select>

              {/* Status Filter */}
              {activeTab === 'topics' && (
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pinned">Pinned</option>
                  <option value="locked">Locked</option>
                </select>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'topics' ? (
            <div className="space-y-4">
              {filteredTopics.length === 0 ? (
                <div className="text-center py-12">
                  <FiMessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No topics found</h3>
                  <p className="text-gray-500">No forum topics match your current filters.</p>
                </div>
              ) : (
                filteredTopics.map((topic) => (
                  <div key={topic.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{topic.title}</h3>
                          <div className="flex gap-2">
                            <span className={`badge ${getCategoryBadgeColor(topic.category)} badge-sm`}>
                              {topic.category}
                            </span>
                            <span className={`badge ${getStatusBadgeColor(topic.status)} badge-sm`}>
                              {topic.status}
                            </span>
                            {topic.isPinned && <FiStar className="w-4 h-4 text-yellow-500" />}
                            {topic.isLocked && <FiLock className="w-4 h-4 text-red-500" />}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{topic.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            <span>{topic.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{topic.createdAt}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMessageCircle className="w-4 h-4" />
                            <span>{typeof topic.replies === 'object' ? Object.keys(topic.replies).length : topic.replyCount || 0} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiEye className="w-4 h-4" />
                            <span>{typeof topic.views === 'number' ? topic.views : 0} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiHeart className="w-4 h-4" />
                            <span>{typeof topic.likes === 'number' ? topic.likes : 0} likes</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          to={`/forum/${topic.id}`}
                          className="btn btn-sm btn-outline"
                        >
                          <FiEye className="w-4 h-4" />
                          View
                        </Link>
                        
                        <button
                          onClick={() => handleTogglePin(topic.id, topic.isPinned)}
                          className={`btn btn-sm ${topic.isPinned ? 'btn-warning' : 'btn-outline'}`}
                        >
                          <FiStar className="w-4 h-4" />
                          {topic.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                        
                        <button
                          onClick={() => handleToggleLock(topic.id, topic.isLocked)}
                          className={`btn btn-sm ${topic.isLocked ? 'btn-error' : 'btn-outline'}`}
                        >
                          {topic.isLocked ? <FiUnlock className="w-4 h-4" /> : <FiLock className="w-4 h-4" />}
                          {topic.isLocked ? 'Unlock' : 'Lock'}
                        </button>
                        
                        <button
                          onClick={() => {
                            setItemToDelete(topic.id);
                            setDeleteType('topic');
                            setShowDeleteModal(true);
                          }}
                          className="btn btn-sm btn-error btn-outline"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12">
                  <FiMessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
                  <p className="text-gray-500">No forum messages match your current filters.</p>
                </div>
              ) : (
                filteredMessages.map((message) => (
                  <div key={message.id} className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{message.author}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiCalendar className="w-4 h-4" />
                            <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                          {message.isReported && (
                            <span className="badge badge-error badge-sm">
                              <FiFlag className="w-3 h-3 mr-1" />
                              Reported ({message.reportCount})
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-700 mb-3">{message.content}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <FiHeart className="w-4 h-4" />
                            <span>{typeof message.likes === 'number' ? message.likes : 0} likes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMessageCircle className="w-4 h-4" />
                            <span>{typeof message.replies === 'object' ? Object.keys(message.replies).length : message.replyCount || 0} replies</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          to={`/forum/${message.topicId}`}
                          className="btn btn-sm btn-outline"
                        >
                          <FiEye className="w-4 h-4" />
                          View Topic
                        </Link>
                        
                        <button
                          onClick={() => {
                            setItemToDelete(message.id);
                            setSelectedTopic(message.topicId);
                            setDeleteType('message');
                            setShowDeleteModal(true);
                          }}
                          className="btn btn-sm btn-error btn-outline"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete {deleteType === 'topic' ? 'Topic' : 'Message'}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteType === 'topic') {
                    handleDeleteTopic(itemToDelete);
                  } else {
                    handleDeleteMessage(itemToDelete, selectedTopic);
                  }
                }}
                className="btn btn-error"
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