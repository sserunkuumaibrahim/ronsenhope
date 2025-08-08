import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUser, FiCalendar, FiTag, FiHeart, FiMessageCircle, FiSend, FiFlag, FiAlertCircle } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, query, where, orderBy, serverTimestamp, increment, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
  
  useEffect(() => {
    const fetchTopicAndReplies = async () => {
      try {
        setLoading(true);
        
        // Get the topic document from Firestore
        const topicRef = doc(db, 'forumTopics', id);
        const topicSnap = await getDoc(topicRef);
        
        if (topicSnap.exists()) {
          // Update view count
          await updateDoc(topicRef, {
            views: increment(1)
          });
          
          // Format the topic data
          const topicData = {
            id: topicSnap.id,
            ...topicSnap.data(),
            date: topicSnap.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            lastActivity: topicSnap.data().lastActivity?.toDate().toISOString().split('T')[0] || topicSnap.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
          };
          
          setTopic(topicData);
          
          // Check if current user has liked this topic
          if (currentUser && topicData.likes && Array.isArray(topicData.likes)) {
            setHasLikedTopic(topicData.likes.includes(currentUser.uid));
          }
          
          // Set up real-time listener for replies
          const messagesRef = collection(db, 'forumMessages');
          const q = query(
            messagesRef,
            where('topicId', '==', id),
            orderBy('createdAt', 'asc')
          );
          
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesData = querySnapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                date: data.createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
              };
            });
            
            setReplies(messagesData);
            
            // Update liked replies state
            if (currentUser) {
              const userLikedReplies = messagesData
                .filter(reply => reply.likes && Array.isArray(reply.likes) && reply.likes.includes(currentUser.uid))
                .map(reply => reply.id);
              setLikedReplies(userLikedReplies);
            }
            
            setLoading(false);
          });
          
          // Clean up the listener when component unmounts
          return () => unsubscribe();
        } else {
          // If topic not found in Firebase, use sample data
          const sampleTopicData = {
            id: id,
            title: 'How can I get involved in local community projects?',
            authorName: 'Sarah Johnson',
            authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            date: '2023-06-15',
            category: 'volunteering',
            content: 'I\'m looking to volunteer in my local community but not sure where to start. Does anyone have suggestions for how to find opportunities that match my skills? I have experience in graphic design and social media management, but I\'m open to trying new things as well. I\'d prefer something that I can do on weekends or evenings after work.\n\nI\'ve tried looking at some websites like VolunteerMatch, but I\'m wondering if there are other resources I should be checking out. Also, if anyone has personal experience with local volunteering, I\'d love to hear about what worked for you and what to expect.',
            replies: 12,
            views: 145,
            likes: [],
            isSticky: true,
            lastActivity: '2023-06-18'
          };
          
          setTopic(sampleTopicData);
          
          // Sample replies data
          const sampleRepliesData = [
          {
            id: 1,
            author: 'Michael Brown',
            authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            date: '2023-06-15',
            content: 'I\'ve had great experiences volunteering with local food banks. They often need help with all kinds of skills, from food sorting to administration and marketing. Check out Feeding America\'s website to find food banks near you.',
            likes: 5
          },
          {
            id: 2,
            author: 'Emma Williams',
            authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            date: '2023-06-16',
            content: 'Local libraries and schools are always looking for volunteers with graphic design skills! You could help with creating posters for events, redesigning newsletters, or even teaching basic design skills to students. I volunteer at my neighborhood library once a month and it\'s been really rewarding.',
            likes: 3
          },
          {
            id: 3,
            author: 'David Wilson',
            authorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
            date: '2023-06-16',
            content: 'Have you tried reaching out to small local nonprofits directly? Many don\'t have the budget for professional design work but would greatly benefit from your skills. Look for causes you care about and send them an email offering your services. I\'ve found that direct approach works well for specialized skills like yours.',
            likes: 4
          },
          {
            id: 4,
            author: 'Jennifer Lee',
            authorAvatar: 'https://randomuser.me/api/portraits/women/56.jpg',
            date: '2023-06-17',
            content: 'Check out Catchafire.org - it\'s a platform that matches professionals with nonprofits that need specific skills. You can find virtual volunteer opportunities that fit your schedule, and they have lots of graphic design and social media projects.',
            likes: 7
          },
          {
            id: 5,
            author: 'Robert Taylor',
            authorAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
            date: '2023-06-17',
            content: 'Don\'t forget about community centers and local arts organizations! They often need help with promotional materials and social media. I volunteer at a community theater and they\'re always grateful for help with designing posters and programs.',
            likes: 2
          },
          {
            id: 6,
            author: 'Lisa Anderson',
            authorAvatar: 'https://randomuser.me/api/portraits/women/72.jpg',
            date: '2023-06-18',
            content: 'I\'d recommend checking your city\'s official website too. Many cities have volunteer coordination offices or lists of local organizations seeking help. Also, neighborhood social media groups (Facebook, Nextdoor) often have posts about local volunteer needs.',
            likes: 3
          }
          ];
          
          setReplies(sampleRepliesData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching topic:', error);
        toast.error('Failed to load the topic');
        setError('Failed to load the topic. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTopicAndReplies();
  }, [id, currentUser]);
  
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
      
      // Create a new message document in Firestore
      const messageData = {
        topicId: id,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous User',
        authorAvatar: currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
        content: newReply,
        createdAt: serverTimestamp(),
        likes: [],
        reports: []
      };
      
      // Add the message to Firestore
      await addDoc(collection(db, 'forumMessages'), messageData);
      
      // Update the topic's reply count and last activity
      const topicRef = doc(db, 'forumTopics', id);
      await updateDoc(topicRef, {
        replies: increment(1),
        lastActivity: serverTimestamp()
      });
      
      // Clear the reply input
      setNewReply('');
      toast.success('Reply posted successfully');
    } catch (error) {
      console.error('Error posting reply:', error);
      setError('Failed to post reply. Please try again.');
      toast.error('Failed to post reply');
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
        const topicRef = doc(db, 'forumTopics', id);
        
        if (hasLikedTopic) {
          // Unlike the topic
          await updateDoc(topicRef, {
            likes: arrayRemove(currentUser.uid)
          });
          setHasLikedTopic(false);
          
          // Update local state
          setTopic(prev => ({
            ...prev,
            likes: Array.isArray(prev.likes) 
              ? prev.likes.filter(uid => uid !== currentUser.uid)
              : []
          }));
        } else {
          // Like the topic
          await updateDoc(topicRef, {
            likes: arrayUnion(currentUser.uid)
          });
          setHasLikedTopic(true);
          
          // Update local state
          setTopic(prev => ({
            ...prev,
            likes: Array.isArray(prev.likes) 
              ? [...prev.likes, currentUser.uid]
              : [currentUser.uid]
          }));
        }
      } else if (type === 'reply') {
        const messageRef = doc(db, 'forumMessages', itemId);
        
        if (likedReplies.includes(itemId)) {
          // Unlike the reply
          await updateDoc(messageRef, {
            likes: arrayRemove(currentUser.uid)
          });
          setLikedReplies(prev => prev.filter(id => id !== itemId));
          
          // Update local state
          setReplies(prev => 
            prev.map(reply => 
              reply.id === itemId 
                ? { 
                    ...reply, 
                    likes: Array.isArray(reply.likes) 
                      ? reply.likes.filter(uid => uid !== currentUser.uid)
                      : []
                  } 
                : reply
            )
          );
        } else {
          // Like the reply
          await updateDoc(messageRef, {
            likes: arrayUnion(currentUser.uid)
          });
          setLikedReplies(prev => [...prev, itemId]);
          
          // Update local state
          setReplies(prev => 
            prev.map(reply => 
              reply.id === itemId 
                ? { 
                    ...reply, 
                    likes: Array.isArray(reply.likes) 
                      ? [...reply.likes, currentUser.uid]
                      : [currentUser.uid]
                  } 
                : reply
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('Failed to update like');
    }
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
        <title>{topic?.title} - Forum - Charity NGO</title>
        <meta name="description" content={`Join the discussion: ${topic?.title}`} />
      </Helmet>
      
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/forum" className="btn btn-ghost gap-2 mb-4">
            <FiArrowLeft /> Back to Forum
          </Link>
          
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{topic?.title}</h1>
              <span className={`badge ${getCategoryBadgeColor(topic?.category)}`}>{topic?.category}</span>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img src={topic?.authorAvatar} alt={topic?.author} />
                </div>
              </div>
              <div>
                <div className="font-medium">{topic?.authorName || topic?.author}</div>
                <div className="text-sm text-base-content/70 flex items-center gap-2">
                  <FiCalendar size={14} />
                  <span>{new Date(topic?.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              {topic?.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className="btn btn-sm btn-ghost gap-2"
                onClick={() => handleLike('topic', topic?.id)}
              >
                <FiHeart className={hasLikedTopic ? "text-error fill-error" : "text-error"} /> 
                {Array.isArray(topic?.likes) ? topic?.likes.length : 0} Likes
              </button>
              <div className="flex items-center gap-2 text-base-content/70">
                <FiMessageCircle />
                <span>{replies.length} Replies</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Replies</h2>
          
          <div className="space-y-6 mb-8">
            {replies.map((reply) => (
              <div key={reply.id} className="bg-base-100 rounded-lg shadow p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img src={reply.authorAvatar} alt={reply.author} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{reply.authorName || reply.author}</div>
                      <div className="text-sm text-base-content/70">
                        {new Date(reply.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-3">
                      {reply.content}
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                      <button 
                        className="btn btn-xs btn-ghost gap-1"
                        onClick={() => handleLike('reply', reply.id)}
                      >
                        <FiHeart className={likedReplies.includes(reply.id) ? "text-error fill-error" : "text-error"} /> 
                        {Array.isArray(reply.likes) ? reply.likes.length : 0}
                      </button>
                      <button className="btn btn-xs btn-ghost gap-1">
                        <FiFlag /> Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-base-100 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Leave a Reply</h3>
            
            {!currentUser && (
              <div className="alert alert-info mb-4">
                <p>Please <Link to="/login" className="font-bold hover:underline">log in</Link> to post a reply.</p>
              </div>
            )}
            
            {error && (
              <div className="alert alert-error mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleReplySubmit}>
              <div className="form-control mb-4">
                <textarea 
                  className="textarea textarea-bordered w-full" 
                  placeholder="Write your reply here..."
                  rows="4"
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  disabled={!currentUser}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  className="btn btn-primary gap-2"
                  disabled={!currentUser || submitting}
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <FiSend /> Post Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}