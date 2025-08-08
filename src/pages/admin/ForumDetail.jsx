import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { collection, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import AdminLayout from '../../components/layout/AdminLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaArrowLeft, FaTrash, FaEdit, FaEye, FaThumbsUp, FaThumbsDown, FaFlag } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const ForumDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(''); // 'topic' or 'message'
  const [deleteId, setDeleteId] = useState('');

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const topicRef = doc(db, 'forumTopics', id);
        const topicSnap = await getDoc(topicRef);
        
        if (topicSnap.exists()) {
          setTopic({ id: topicSnap.id, ...topicSnap.data() });
          
          // Fetch messages for this topic
          const messagesQuery = query(
            collection(db, 'forumMessages'),
            where('topicId', '==', id),
            orderBy('createdAt', 'asc')
          );
          
          const messagesSnap = await getDocs(messagesQuery);
          const messagesData = messagesSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setMessages(messagesData);
        } else {
          toast.error('Topic not found');
          navigate('/admin/forum');
        }
      } catch (error) {
        console.error('Error fetching topic:', error);
        toast.error('Failed to load topic details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopic();
  }, [id, navigate]);

  const handleToggleSticky = async () => {
    try {
      const topicRef = doc(db, 'forumTopics', id);
      await updateDoc(topicRef, {
        isSticky: !topic.isSticky
      });
      
      setTopic(prev => ({ ...prev, isSticky: !prev.isSticky }));
      toast.success(`Topic ${topic.isSticky ? 'unstickied' : 'stickied'} successfully`);
    } catch (error) {
      console.error('Error updating sticky status:', error);
      toast.error('Failed to update sticky status');
    }
  };

  const handleToggleLocked = async () => {
    try {
      const topicRef = doc(db, 'forumTopics', id);
      await updateDoc(topicRef, {
        isLocked: !topic.isLocked
      });
      
      setTopic(prev => ({ ...prev, isLocked: !prev.isLocked }));
      toast.success(`Topic ${topic.isLocked ? 'unlocked' : 'locked'} successfully`);
    } catch (error) {
      console.error('Error updating lock status:', error);
      toast.error('Failed to update lock status');
    }
  };

  const confirmDelete = (type, id) => {
    setDeleteType(type);
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      if (deleteType === 'topic') {
        // Delete all messages first
        const messagesQuery = query(
          collection(db, 'forumMessages'),
          where('topicId', '==', id)
        );
        
        const messagesSnap = await getDocs(messagesQuery);
        const deletePromises = messagesSnap.docs.map(doc => 
          deleteDoc(doc.ref)
        );
        
        await Promise.all(deletePromises);
        
        // Then delete the topic
        await deleteDoc(doc(db, 'forumTopics', id));
        toast.success('Topic deleted successfully');
        navigate('/admin/forum');
      } else if (deleteType === 'message') {
        await deleteDoc(doc(db, 'forumMessages', deleteId));
        setMessages(prev => prev.filter(message => message.id !== deleteId));
        toast.success('Message deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(`Failed to delete ${deleteType}`);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleViewUserProfile = (userId) => {
    // Navigate to user profile or show user details
    navigate(`/admin/users?id=${userId}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Forum Topic Management | Admin Dashboard</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link to="/admin/forum" className="mr-4 text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="inline mr-2" /> Back to Forum Management
            </Link>
            <h1 className="text-2xl font-bold">Forum Topic Management</h1>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={handleToggleSticky}
              className={`px-4 py-2 rounded ${topic?.isSticky ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-200 hover:bg-gray-300'} text-white`}
            >
              {topic?.isSticky ? 'Unsticky Topic' : 'Sticky Topic'}
            </button>
            
            <button 
              onClick={handleToggleLocked}
              className={`px-4 py-2 rounded ${topic?.isLocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
            >
              {topic?.isLocked ? 'Unlock Topic' : 'Lock Topic'}
            </button>
            
            <button 
              onClick={() => confirmDelete('topic', id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              <FaTrash className="inline mr-2" /> Delete Topic
            </button>
          </div>
        </div>
        
        {topic && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{topic.title}</h2>
                <p className="text-gray-600">
                  Category: <span className="font-medium">{topic.category}</span>
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div>
                  <FaEye className="inline mr-1" /> {topic.views || 0} views
                </div>
                <div>
                  <FaThumbsUp className="inline mr-1" /> {topic.likes?.length || 0} likes
                </div>
                <div>
                  <FaFlag className="inline mr-1 text-red-500" /> {topic.reports?.length || 0} reports
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  {topic.authorName?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium">
                    {topic.authorName || 'Unknown User'}
                    <button 
                      onClick={() => handleViewUserProfile(topic.authorId)}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">
                    Posted {topic.createdAt?.toDate ? formatDistanceToNow(topic.createdAt.toDate(), { addSuffix: true }) : 'some time ago'}
                  </p>
                </div>
              </div>
              
              <div className="text-sm">
                <span className={`px-2 py-1 rounded ${topic.isSticky ? 'bg-yellow-100 text-yellow-800' : 'hidden'} mr-2`}>
                  Sticky
                </span>
                <span className={`px-2 py-1 rounded ${topic.isLocked ? 'bg-red-100 text-red-800' : 'hidden'}`}>
                  Locked
                </span>
              </div>
            </div>
            
            <div className="prose max-w-none mb-4">
              <div dangerouslySetInnerHTML={{ __html: topic.content }} />
            </div>
          </motion.div>
        )}
        
        <h3 className="text-xl font-bold mb-4">Messages ({messages.length})</h3>
        
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <motion.div 
                key={message.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                      {message.authorName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">
                        {message.authorName || 'Unknown User'}
                        <button 
                          onClick={() => handleViewUserProfile(message.authorId)}
                          className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                        >
                          View Profile
                        </button>
                      </p>
                      <p className="text-xs text-gray-500">
                        {message.createdAt?.toDate ? formatDistanceToNow(message.createdAt.toDate(), { addSuffix: true }) : 'some time ago'}
                      </p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => confirmDelete('message', message.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Message"
                  >
                    <FaTrash />
                  </button>
                </div>
                
                <div className="prose max-w-none mt-2">
                  <div dangerouslySetInnerHTML={{ __html: message.content }} />
                </div>
                
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <div className="mr-4">
                    <FaThumbsUp className="inline mr-1" /> {message.likes?.length || 0}
                  </div>
                  <div>
                    <FaThumbsDown className="inline mr-1" /> {message.dislikes?.length || 0}
                  </div>
                  {message.isReported && (
                    <div className="ml-4 text-red-500">
                      <FaFlag className="inline mr-1" /> Reported
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">No messages in this topic yet.</p>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              Confirm Delete
            </h3>
            <p className="mb-6">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ForumDetail;