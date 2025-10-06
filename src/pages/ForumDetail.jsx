import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowLeft, FiUser, FiCalendar, FiTag, FiHeart, FiMessageCircle, FiSend, FiFlag, FiAlertCircle, FiX } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { realtimeDb } from '../firebase/config';
import { ref, get, push, onValue, update } from 'firebase/database';

export default function ForumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [likedReplies, setLikedReplies] = useState([]);
  const [hasLikedTopic, setHasLikedTopic] = useState(false);
  const [taggedReplies, setTaggedReplies] = useState({});
  const [isTagging, setIsTagging] = useState(false);
  const [reportedReplies, setReportedReplies] = useState([]);
  const [hasReportedTopic, setHasReportedTopic] = useState(false);
  
  useEffect(() => {
    const fetchTopicAndSetupRepliesListener = async () => {
    try {
      setLoading(true);
      
      // Fetch topic from Firebase (one-time)
      const topicRef = ref(realtimeDb, `forumTopics/${id}`);
      const topicSnap = await get(topicRef);
      
      if (!topicSnap.exists()) {
        setError('Topic not found');
        toast.error('Topic not found');
        setLoading(false);
        return null;
      }
      
      const topicData = {
        id: id,
        ...topicSnap.val(),
        date: new Date(topicSnap.val().createdAt).toLocaleDateString(),
        lastActivity: new Date(topicSnap.val().lastActivity).toLocaleDateString()
      };
      
      setTopic(topicData);
      
      // Increment view count
      const currentViews = topicData.views || 0;
      await update(topicRef, {
        views: currentViews + 1
      });
      
      // Set up real-time listener for replies
      const repliesRef = ref(realtimeDb, `forumTopics/${id}/replies`);
      
      const unsubscribe = onValue(repliesRef, (repliesSnap) => {
        if (repliesSnap.exists()) {
          const repliesData = Object.entries(repliesSnap.val()).map(([key, value]) => ({
            id: key,
            ...value,
            date: new Date(value.createdAt).toLocaleDateString()
          })).sort((a, b) => a.createdAt - b.createdAt);
          
          setReplies(repliesData);
        } else {
          setReplies([]);
        }
        setLoading(false);
      }, (error) => {
        console.error('Error listening to replies:', error);
        toast.error('Failed to load replies');
        setLoading(false);
      });
      
      return unsubscribe;
      
    } catch (error) {
      console.error('Error loading topic:', error);
      toast.error('Failed to load the topic');
      setError('Failed to load the topic. Please try again later.');
      setLoading(false);
      return null;
    }
  };
    
    if (id) {
      const setupListener = async () => {
        const unsubscribe = await fetchTopicAndSetupRepliesListener();
        return unsubscribe;
      };
      
      let unsubscribePromise = setupListener();
      
      return () => {
        unsubscribePromise.then(unsubscribe => {
          if (unsubscribe && typeof unsubscribe === 'function') {
            unsubscribe();
          }
        });
      };
    }
  }, [id]);
  
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.info('Please log in to post a reply');
      navigate('/login', { state: { from: `/forum/${id}` } });
      return;
    }
    
    if (!newReply.trim()) {
      setError('Reply cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      const replyData = {
        author: currentUser.displayName || 'Anonymous User',
        authorAvatar: currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
        authorId: currentUser.uid,
        content: newReply.trim(),
        likes: 0,
        createdAt: Date.now(),
        lastModified: Date.now()
      };
      
      // First create a new reply reference
      const topicRef = ref(realtimeDb, `forumTopics/${id}`);
      const repliesRef = ref(realtimeDb, `forumTopics/${id}/replies`);
      
      // Get a new reply key
      const newReplyRef = push(repliesRef);
      
      // Get current topic data
      const topicSnap = await get(topicRef);
      const topicData = topicSnap.val();
      const currentReplies = (topicData.replyCount || 0) + 1;
      
      // Create a batch update object
      const updates = {
        [`forumTopics/${id}/replies/${newReplyRef.key}`]: replyData,
        [`forumTopics/${id}/replyCount`]: currentReplies,
        [`forumTopics/${id}/lastActivity`]: Date.now()
      };
      
      // Perform the batch update
      await update(ref(realtimeDb), updates);
      
      setNewReply('');
      toast.success('Reply posted successfully!');
      
      // Update local topic state
      setTopic(prev => ({
        ...prev,
        replyCount: currentReplies,
        lastActivity: new Date().toLocaleDateString()
      }));
      
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
      setError('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLike = async (type, itemId) => {
    if (!currentUser) {
      toast.info('Please log in to like posts');
      navigate('/login', { state: { from: `/forum/${id}` } });
      return;
    }
    
    try {
      if (type === 'topic') {
        const topicRef = ref(realtimeDb, `forumTopics/${id}`);
        const increment_value = hasLikedTopic ? -1 : 1;
        const currentLikes = topic.likes || 0;
        
        await update(topicRef, {
          likes: currentLikes + increment_value
        });
        
        setHasLikedTopic(!hasLikedTopic);
        setTopic(prev => ({
          ...prev,
          likes: (prev.likes || 0) + increment_value
        }));
        toast.success(hasLikedTopic ? 'Removed like' : 'Liked topic');
        
      } else if (type === 'reply') {
        const isLiked = likedReplies.includes(itemId);
        const increment_value = isLiked ? -1 : 1;
        const reply = replies.find(r => r.id === itemId);
        const currentLikes = reply?.likes || 0;
        
        const replyRef = ref(realtimeDb, `forumTopics/${id}/replies/${itemId}`);
        await update(replyRef, {
          likes: currentLikes + increment_value
        });
        
        if (isLiked) {
          setLikedReplies(prev => prev.filter(id => id !== itemId));
        } else {
          setLikedReplies(prev => [...prev, itemId]);
        }
        
        setReplies(prev => prev.map(reply => 
          reply.id === itemId 
            ? { ...reply, likes: (reply.likes || 0) + increment_value }
            : reply
        ));
        
        toast.success(isLiked ? 'Removed like' : 'Liked reply');
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleReport = async (type, itemId = null) => {
    console.log('handleReport called with type:', type, 'itemId:', itemId);
    console.log('currentUser:', currentUser);
    
    if (!currentUser) {
      console.log('No current user, redirecting to login');
      toast.error('Please log in to report content');
      navigate('/login', { state: { from: `/forum/${id}` } });
      return;
    }

    try {
      if (type === 'topic') {
        console.log('Reporting topic, hasReportedTopic:', hasReportedTopic);
        if (hasReportedTopic) {
          console.log('Topic already reported');
          toast.info('You have already reported this topic');
          return;
        }

        console.log('Creating topic report data...');
        const reportData = {
          reporterId: currentUser.uid,
          reporterName: currentUser.displayName || currentUser.email,
          topicId: id,
          reason: 'Inappropriate content',
          timestamp: Date.now(),
          status: 'pending'
        };
        
        console.log('Topic report data:', reportData);
        const reportsRef = ref(realtimeDb, 'reports/topics');
        console.log('Pushing topic report to Firebase...');
        await push(reportsRef, reportData);
        
        console.log('Topic report saved successfully');
        setHasReportedTopic(true);
        toast.success('Topic reported successfully');
        
      } else if (type === 'reply') {
        if (reportedReplies.includes(itemId)) {
          toast.info('You have already reported this reply');
          return;
        }

        const reportData = {
          reporterId: currentUser.uid,
          reporterName: currentUser.displayName || currentUser.email,
          topicId: id,
          replyId: itemId,
          reason: 'Inappropriate content',
          timestamp: Date.now(),
          status: 'pending'
        };
        
        const reportsRef = ref(realtimeDb, 'reports/replies');
        await push(reportsRef, reportData);
        
        setReportedReplies(prev => [...prev, itemId]);
        toast.success('Reply reported successfully');
      }
    } catch (error) {
      console.error('Error reporting content:', error);
      toast.error('Failed to report content');
    }
  };

  const handleTag = (replyId) => {
    if (!currentUser) {
      toast.info('Please log in to tag replies');
      navigate('/login', { state: { from: `/forum/${id}` } });
      return;
    }
    
    if (isTagging) return; // Prevent double-clicking
    
    setIsTagging(true);
    setTaggedReplies(prev => {
      const currentTags = prev[replyId] || 0;
      if (currentTags > 0) {
        // If already tagged, remove the tag
        const newState = { ...prev };
        delete newState[replyId];
        toast.success('Reply untagged!');
        return newState;
      } else {
        // If not tagged, add a tag
        toast.success('Reply tagged!');
        return {
          ...prev,
          [replyId]: 1
        };
      }
    });
    
    // Reset tagging state after a short delay
    setTimeout(() => setIsTagging(false), 500);
  };

  const removeTag = (replyId) => {
    setTaggedReplies(prev => {
      const newState = { ...prev };
      delete newState[replyId];
      toast.success('Tag removed!');
      return newState;
    });
  };

  const getCategoryBadgeColor = (category) => {
    const categoryColors = {
      volunteering: 'badge-primary',
      fundraising: 'badge-secondary',
      environment: 'badge-accent',
      education: 'badge-info',
      partnerships: 'badge-success',
      health: 'badge-warning',
      impact: 'badge-error',
      community: 'badge-neutral',
      youth: 'badge-ghost'
    };
    
    return categoryColors[category] || 'badge-outline';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }
  
  if (error && !topic) {
    return (
      <MainLayout>
        <div className="container-custom py-12 text-center">
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
          <Link to="/forum" className="btn btn-primary mt-4">Back to Forum</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>{topic?.title} - Forum - Ronsen Hope Christian Foundation Uganda</title>
        <meta name="description" content={`Join the discussion: ${topic?.title}`} />
      </Helmet>
      
      <div className="bg-accent bg-mesh-gradient-2 min-h-screen flex flex-col">
        <div className="container-custom flex-1 py-12 pb-80">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link 
              to="/forum" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 text-gray-700 hover:bg-white hover:shadow-xl transition-all duration-300 group"
            >
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300" /> 
              <span className="font-medium">Back to Forum</span>
            </Link>
          </motion.div>
          
          {/* Topic Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Topic Header */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-8 border-b border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight mb-4">
                      {topic?.title}
                    </h1>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryBadgeColor(topic?.category)} bg-opacity-20`}>
                        <FiTag className="mr-1" size={14} />
                        {topic?.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center overflow-hidden">
                      {topic?.authorAvatar ? (
                        <img src={topic?.authorAvatar} alt={topic?.author} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {(topic?.authorName || topic?.author || '?').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{topic?.authorName || topic?.author}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar size={14} />
                        <span>{new Date(topic?.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Topic Content */}
              <div className="p-8">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {topic?.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
                
                {/* Topic Stats */}
                <div className="flex items-center gap-6 mt-8 pt-6 border-t border-gray-100">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      hasLikedTopic 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    }`}
                    onClick={() => handleLike('topic', topic?.id)}
                  >
                    <FiHeart className={hasLikedTopic ? "fill-current" : ""} size={18} /> 
                    <span className="font-medium">{Array.isArray(topic?.likes) ? topic?.likes.length : 0} Likes</span>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      hasReportedTopic 
                        ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                    }`}
                    onClick={() => handleReport('topic', topic?.id)}
                  >
                    <FiFlag size={18} /> 
                    <span className="font-medium">{hasReportedTopic ? 'Reported' : 'Report'}</span>
                  </motion.button>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiMessageCircle size={18} />
                    <span className="font-medium">{replies.length} Replies</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Replies Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <FiMessageCircle className="text-primary" />
                  Replies ({replies.length})
                </h2>
              </div>
              
              <div className="p-6">
                {replies.length > 0 ? (
                  <div className="space-y-6">
                    {replies.map((reply, index) => (
                      <motion.div 
                        key={reply.id}
                        id={`reply-${reply.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gray-50/50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleTag(reply.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {reply.authorAvatar ? (
                              <img src={reply.authorAvatar} alt={reply.author} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white font-bold text-lg">
                                {(reply.authorName || reply.author || '?').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                              <div className="font-semibold text-gray-800">{reply.authorName || reply.author}</div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FiCalendar size={14} />
                                <span>{new Date(reply.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <div className="text-gray-700 leading-relaxed mb-4">
                              {reply.content}
                            </div>
                            
                            <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                  likedReplies.includes(reply.id)
                                    ? 'bg-red-50 text-red-600 border border-red-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                }`}
                                onClick={() => handleLike('reply', reply.id)}
                              >
                                <FiHeart className={likedReplies.includes(reply.id) ? "fill-current" : ""} size={14} /> 
                                <span className="font-medium">{Array.isArray(reply.likes) ? reply.likes.length : 0}</span>
                              </motion.button>
                              
                              <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                  reportedReplies.includes(reply.id)
                                    ? 'bg-orange-50 text-orange-600 border border-orange-200'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                                }`}
                                onClick={() => handleReport('reply', reply.id)}
                              >
                                <FiFlag size={14} /> 
                                <span className="text-xs">{reportedReplies.includes(reply.id) ? 'Reported' : 'Report'}</span>
                              </motion.button>
                              
                              <button 
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-300 ${
                                  taggedReplies[reply.id] 
                                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                                    : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'
                                }`}
                                onClick={() => handleTag(reply.id)}
                              >
                                <FiTag size={14} /> 
                                <span>{taggedReplies[reply.id] ? 'Untag' : 'Tag'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiMessageCircle className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-lg text-gray-600 mb-2">No replies yet</p>
                    <p className="text-sm text-gray-500">Be the first to join the conversation!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
        </div>
        
        {/* Fixed Reply Form */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-white/20 shadow-2xl z-50">
          <div className="container-custom py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-3">
                    <FiSend className="text-primary" />
                    Leave a Reply
                  </h3>
                </div>
                
                <div className="p-4">
              
                  {!currentUser && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-3">
                        <FiAlertCircle className="text-blue-600 flex-shrink-0" size={18} />
                        <p className="text-blue-800 text-sm">
                          Please <Link to="/login" className="font-bold hover:underline text-blue-600">log in</Link> to post a reply.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-3">
                        <FiAlertCircle className="text-red-600 flex-shrink-0" size={18} />
                        <p className="text-red-800 text-sm">{error}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Tagged Messages Reference */}
                  {Object.keys(taggedReplies).length > 0 && (
                    <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                        <FiTag size={14} />
                        Tagged Messages ({Object.keys(taggedReplies).length})
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {Object.entries(taggedReplies).map(([replyId, tagCount]) => {
                          const taggedReply = replies.find(r => r.id.toString() === replyId);
                          if (!taggedReply) return null;
                          return (
                            <div 
                              key={replyId} 
                              className="text-xs bg-white/50 p-2 rounded border transition-colors relative group"
                            >
                              <div 
                                className="cursor-pointer hover:bg-white/80 transition-colors rounded pr-6"
                                onClick={() => {
                                  const element = document.getElementById(`reply-${replyId}`);
                                  if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    element.classList.add('ring-2', 'ring-primary/50', 'bg-primary/5');
                                    setTimeout(() => {
                                      element.classList.remove('ring-2', 'ring-primary/50', 'bg-primary/5');
                                    }, 3000);
                                  }
                                }}
                              >
                                <div className="font-medium text-gray-700">{taggedReply.author}</div>
                                <div className="text-gray-600 truncate">{taggedReply.content.substring(0, 100)}...</div>
                                <div className="text-primary font-medium">{tagCount} tags</div>
                              </div>
                              <button
                                className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeTag(replyId);
                                }}
                                title="Remove tag"
                              >
                                <FiX size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleReplySubmit} className="space-y-4">
                    <div>
                      <textarea 
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed" 
                        placeholder="Share your thoughts and join the conversation..."
                        rows="3"
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        disabled={!currentUser}
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <motion.button 
                        type="submit" 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-6 py-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                        disabled={!currentUser || submitting || !newReply.trim()}
                      >
                        {submitting ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span>Posting...</span>
                          </>
                        ) : (
                          <>
                            <FiSend size={16} /> 
                            <span>Post Reply</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}