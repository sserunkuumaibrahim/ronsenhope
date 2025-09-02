import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiMessageSquare, FiUser, FiCalendar, FiTag, FiHeart, FiMessageCircle, FiFilter, FiPlus, FiAlertCircle, FiX, FiFlag } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ForumGuidelinesModal from '../components/forum/ForumGuidelinesModal';
import { realtimeDb, db } from '../firebase/config';
import { ref, push, set, onValue, off, serverTimestamp, update, query, orderByChild, limitToLast, get } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';

export default function Forum() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: ''
  });
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likedTopics, setLikedTopics] = useState([]);
  const [reportedTopics, setReportedTopics] = useState([]);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [checkingGuidelines, setCheckingGuidelines] = useState(true);
  
  const topicsPerPage = 10;
  
  useEffect(() => {
    // Set up real-time listener for topics
    const setupTopicsListener = () => {
      try {
        setLoading(true);
        const topicsRef = ref(realtimeDb, 'forumTopics');
        const topicsQuery = query(topicsRef, orderByChild('lastActivity'), limitToLast(50));
        
        const unsubscribe = onValue(topicsQuery, (snapshot) => {
          const topicsData = [];
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).forEach((key) => {
              const topic = data[key];
              topicsData.push({
                id: key,
                ...topic,
                createdAt: topic.createdAt ? new Date(topic.createdAt) : new Date(),
                lastActivity: topic.lastActivity ? new Date(topic.lastActivity) : new Date()
              });
            });
            
            // Sort by sticky first, then by last activity
            topicsData.sort((a, b) => {
              if (a.isSticky && !b.isSticky) return -1;
              if (!a.isSticky && b.isSticky) return 1;
              return new Date(b.lastActivity) - new Date(a.lastActivity);
            });
          }
          
          setTopics(topicsData);
          setFilteredTopics(topicsData);
          setLoading(false);
        }, (error) => {
          console.error('Error listening to topics:', error);
          toast.error('Failed to load forum topics');
          setLoading(false);
        });
        
        return () => off(topicsRef, 'value', unsubscribe);
      } catch (error) {
        console.error('Error setting up topics listener:', error);
        toast.error('Failed to set up real-time updates');
        setLoading(false);
        return () => {};
      }
    };
    
    const unsubscribe = setupTopicsListener();
    
    return unsubscribe;
  }, []);
  
  // Show guidelines modal only for first-time users
  useEffect(() => {
    const checkGuidelinesStatus = async () => {
      try {
        // Check localStorage first for quick response
        const hasSeenGuidelines = localStorage.getItem('hasSeenForumGuidelines');
        
        if (hasSeenGuidelines === 'true') {
          setShowGuidelinesModal(false);
          setCheckingGuidelines(false);
          return;
        }
        
        // If user is logged in, also check their Firebase profile
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().hasReadForumGuidelines) {
            // User has read guidelines before, update localStorage and don't show modal
            localStorage.setItem('hasSeenForumGuidelines', 'true');
            setShowGuidelinesModal(false);
            setCheckingGuidelines(false);
            return;
          }
        }
        
        // First-time user, show the guidelines modal
        setShowGuidelinesModal(true);
        setCheckingGuidelines(false);
      } catch (error) {
        console.error('Error checking guidelines status:', error);
        // On error, show guidelines to be safe
        setShowGuidelinesModal(true);
        setCheckingGuidelines(false);
      }
    };
    
    checkGuidelinesStatus();
  }, [currentUser]);
  
  // Add new topic function
  const handleNewTopicSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Please log in to create a topic');
      return;
    }

    try {
      setSubmitting(true);
      
      const topicData = {
        title: newTopic.title,
        content: newTopic.content,
        category: newTopic.category,
        author: currentUser.displayName || currentUser.email,
        authorId: currentUser.uid,
        authorAvatar: currentUser.photoURL || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        createdAt: Date.now(),
        lastActivity: Date.now(),
        replies: 0,
        views: 0,
        likes: 0,
        isSticky: false
      };

      const topicsRef = ref(realtimeDb, 'forumTopics');
      await push(topicsRef, topicData);
      
      toast.success('Topic created successfully!');
      setShowNewTopicModal(false);
      setNewTopic({ title: '', content: '', category: '' });
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter topics based on search and category
  useEffect(() => {
    let filtered = topics;

    if (searchTerm) {
      filtered = filtered.filter(topic => 
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(topic => topic.category === selectedCategory);
    }

    setFilteredTopics(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, topics]);

  // Pagination
  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = filteredTopics.slice(indexOfFirstTopic, indexOfLastTopic);
  const totalPages = Math.ceil(filteredTopics.length / topicsPerPage);

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleNewTopicChange = (e) => {
    const { name, value } = e.target;
    setNewTopic(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle like functionality
  const handleLikeTopic = async (topicId) => {
    if (!currentUser) {
      toast.error('Please log in to like topics');
      return;
    }

    try {
      const topicRef = ref(realtimeDb, `forumTopics/${topicId}`);
      const topicSnap = await get(topicRef);
      const topicData = topicSnap.val();
      
      const isLiked = likedTopics.includes(topicId);
      const currentLikes = topicData.likes || 0;
      const increment = isLiked ? -1 : 1;
      
      await update(topicRef, {
        likes: currentLikes + increment
      });
      
      if (isLiked) {
        setLikedTopics(prev => prev.filter(id => id !== topicId));
        toast.success('Removed like');
      } else {
        setLikedTopics(prev => [...prev, topicId]);
        toast.success('Liked topic');
      }
    } catch (error) {
      console.error('Error liking topic:', error);
      toast.error('Failed to like topic');
    }
  };

  // Handle report functionality
  const handleReportTopic = async (topicId) => {
    console.log('handleReportTopic called with topicId:', topicId);
    console.log('currentUser:', currentUser);
    
    if (!currentUser) {
      console.log('No current user, showing login prompt');
      toast.error('Please log in to report topics');
      return;
    }

    if (reportedTopics.includes(topicId)) {
      console.log('Topic already reported');
      toast.info('You have already reported this topic');
      return;
    }

    try {
      console.log('Creating report data...');
      const reportData = {
        reporterId: currentUser.uid,
        reporterName: currentUser.displayName || currentUser.email,
        topicId: topicId,
        reason: 'Inappropriate content',
        timestamp: Date.now(),
        status: 'pending'
      };
      
      console.log('Report data:', reportData);
      console.log('Firebase realtimeDb:', realtimeDb);
      
      // Test Firebase connection first
      const testRef = ref(realtimeDb, 'test');
      console.log('Testing Firebase write access...');
      await set(testRef, { test: 'value', timestamp: Date.now() });
      console.log('Test write successful');
      
      const reportsRef = ref(realtimeDb, 'reports/topics');
      console.log('Pushing to Firebase...');
      await push(reportsRef, reportData);
      
      console.log('Report saved successfully, updating state...');
      setReportedTopics(prev => [...prev, topicId]);
      toast.success('Topic reported successfully');
    } catch (error) {
      console.error('Error reporting topic:', error);
      console.error('Error details:', error.code, error.message);
      toast.error(`Failed to report topic: ${error.message}`);
    }
  };

  const loadMoreTopics = async () => {
    if (!hasMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, 'forumTopics'),
        orderBy('isSticky', 'desc'),
        orderBy('lastActivity', 'desc'),
        startAfter(lastVisible),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const newTopics = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        newTopics.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || new Date(),
          lastActivity: data.lastActivity?.toDate?.() || new Date()
        });
      });
      
      if (newTopics.length > 0) {
        setTopics(prev => [...prev, ...newTopics]);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
      
      if (newTopics.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more topics:', error);
      toast.error('Failed to load more topics');
    } finally {
      setLoadingMore(false);
    }
  };

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

  const getCategoryBadgeColor = (category) => {
    const colors = {
      volunteering: 'bg-blue-100 text-blue-800',
      fundraising: 'bg-green-100 text-green-800',
      environment: 'bg-emerald-100 text-emerald-800',
      education: 'bg-purple-100 text-purple-800',
      partnerships: 'bg-orange-100 text-orange-800',
      health: 'bg-red-100 text-red-800',
      impact: 'bg-indigo-100 text-indigo-800',
      community: 'bg-pink-100 text-pink-800',
      youth: 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Community Forum - Lumps Away Foundation</title>
        <meta name="description" content="Join our community forum to connect with like-minded individuals, share ideas, and participate in meaningful discussions about causes that matter." />
      </Helmet>

      <div className="bg-accent bg-mesh-gradient-2 py-12 min-h-screen">
        <div className="container-custom">

        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-secondary tracking-tight">Community Forum</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto text-secondary/90 leading-relaxed">
            Connect with like-minded individuals, share ideas, and participate in meaningful discussions about causes that matter.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex justify-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              <span className="text-secondary/80 text-sm font-medium">Join the conversation • Share your voice • Make an impact</span>
            </div>
          </motion.div>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">

              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <FiSearch className="text-gray-400 text-lg" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-gray-700 placeholder-gray-400" 
                  placeholder="Search topics, discussions, or keywords..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              

              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 w-full lg:w-auto justify-center"
                onClick={() => {
                  if (!currentUser) {
                    navigate('/login');
                    return;
                  }
                  setShowNewTopicModal(true);
                }}
              >
                <FiPlus className="text-lg" /> New Topic
              </motion.button>
            </div>
            

            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {(loading || checkingGuidelines) ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >

            <div className="space-y-4">
              {currentTopics.length > 0 ? (
                currentTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8 hover:shadow-xl transition-all duration-300 group"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start gap-4">
                      <img 
                        src={topic.authorAvatar} 
                        alt={topic.author}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <Link 
                              to={`/forum/${topic.id}`}
                              className="block group-hover:text-primary transition-colors duration-200"
                            >
                              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                {topic.isSticky && <span className="text-primary mr-2">📌</span>}
                                {topic.title}
                              </h3>
                            </Link>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-1">
                                <FiUser className="text-xs" />
                                <span>{topic.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiCalendar className="text-xs" />
                                <span>{topic.createdAt?.toLocaleDateString?.() || 'Unknown date'}</span>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeColor(topic.category)}`}>
                                {categories.find(cat => cat.id === topic.category)?.name || topic.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2">{topic.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FiMessageCircle className="text-sm" />
                              <span>{`${topic.replies ? (typeof topic.replies === 'object' ? Object.keys(topic.replies).length : topic.replies) : 0}`} replies</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleLikeTopic(topic.id);
                              }}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                                likedTopics.includes(topic.id)
                                  ? 'bg-red-50 text-red-600 border border-red-200'
                                  : 'hover:bg-gray-100 text-gray-500 hover:text-red-600'
                              }`}
                            >
                              <FiHeart className={`text-sm ${likedTopics.includes(topic.id) ? 'fill-current' : ''}`} />
                              <span>{`${topic.likes ? (typeof topic.likes === 'object' ? Object.keys(topic.likes).length : topic.likes) : 0}`} likes</span>
                            </motion.button>
                            <div className="flex items-center gap-1">
                              <span>{topic.views || 0} views</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Report button clicked for topic:', topic.id);
                                handleReportTopic(topic.id);
                              }}
                              className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 ${
                                reportedTopics.includes(topic.id)
                                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                  : 'hover:bg-gray-100 text-gray-500 hover:text-orange-600'
                              }`}
                            >
                              <FiFlag className="text-sm" />
                              <span className="text-xs">{reportedTopics.includes(topic.id) ? 'Reported' : 'Report'}</span>
                            </motion.button>
                          </div>
                          
                          <Link 
                            to={`/forum/${topic.id}`}
                            className="text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-200"
                          >
                            Join Discussion →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <FiAlertCircle className="mx-auto text-4xl text-gray-400 mb-4" />
                  <p className="text-lg text-gray-600">No topics found matching your criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search or category filter.</p>
                </div>
              )}
            </div>
            

            {!searchTerm && selectedCategory === 'all' && hasMore && (
              <div className="flex justify-center mt-8">
                <button 
                  className="btn btn-outline btn-wide"
                  onClick={loadMoreTopics}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Loading...
                    </>
                  ) : (
                    'Load More Topics'
                  )}
                </button>
              </div>
            )}
            

            {(searchTerm || selectedCategory !== 'all') && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex justify-center mt-12"
              >
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-4">
                  <div className="flex items-center gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </motion.button>
                    
                    <div className="flex items-center gap-1 mx-4">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <motion.button
                            key={pageNum}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                              currentPage === pageNum
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        </div>
      </div>


      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Create New Topic</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowNewTopicModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FiX className="text-xl text-gray-500" />
                </motion.button>
              </div>
              
              <form onSubmit={handleNewTopicSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic Title
                  </label>
                  <input 
                    type="text" 
                    name="title"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-gray-700" 
                    placeholder="Enter a descriptive title for your topic..."
                    value={newTopic.title}
                    onChange={handleNewTopicChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select 
                    name="category"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-gray-700"
                    value={newTopic.category}
                    onChange={handleNewTopicChange}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.slice(1).map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea 
                    name="content"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-gray-700 resize-none" 
                    rows="6"
                    placeholder="Share your thoughts, ask questions, or start a discussion..."
                    value={newTopic.content}
                    onChange={handleNewTopicChange}
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <motion.button 
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                    onClick={() => setShowNewTopicModal(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating...
                      </span>
                    ) : (
                      'Create Topic'
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Forum Guidelines Modal */}
      <ForumGuidelinesModal
        isOpen={showGuidelinesModal}
        onClose={() => setShowGuidelinesModal(false)}
        onAccept={() => setShowGuidelinesModal(false)}
      />
    </MainLayout>
  );
}