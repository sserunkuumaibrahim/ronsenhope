import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiMessageSquare, FiUser, FiCalendar, FiTag, FiHeart, FiMessageCircle, FiFilter, FiPlus, FiAlertCircle } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp, where, limit, startAfter, doc, updateDoc, increment } from 'firebase/firestore';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
  
  const topicsPerPage = 10;
  
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        
        // Create a query to get topics ordered by sticky status and creation date
        const topicsRef = collection(db, 'forumTopics');
        const topicsQuery = query(
          topicsRef,
          orderBy('isSticky', 'desc'),
          orderBy('createdAt', 'desc'),
          limit(topicsPerPage)
        );
        
        const querySnapshot = await getDocs(topicsQuery);
        
        if (!querySnapshot.empty) {
          // Get the last document for pagination
          const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastVisible(lastDoc);
          
          // Convert the documents to topic objects
          const topicsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            lastActivity: doc.data().lastActivity?.toDate().toISOString().split('T')[0] || doc.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
          }));
          
          setTopics(topicsData);
          setFilteredTopics(topicsData);
        } else {
          // If no topics found in Firebase, use sample data
          const sampleTopicsData = [
        {
          id: 1,
          title: 'How can I get involved in local community projects?',
          author: 'Sarah Johnson',
          authorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          date: '2023-06-15',
          category: 'volunteering',
          content: 'I\'m looking to volunteer in my local community but not sure where to start. Does anyone have suggestions for how to find opportunities that match my skills?',
          replies: 12,
          views: 145,
          likes: 8,
          isSticky: true,
          lastActivity: '2023-06-18'
        },
        {
          id: 2,
          title: 'Fundraising ideas for small nonprofits',
          author: 'Michael Brown',
          authorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          date: '2023-06-10',
          category: 'fundraising',
          content: 'Our small nonprofit is looking for creative fundraising ideas that don\'t require a lot of upfront investment. What has worked well for other small organizations?',
          replies: 8,
          views: 102,
          likes: 5,
          isSticky: false,
          lastActivity: '2023-06-17'
        },
        {
          id: 3,
          title: 'Best practices for water conservation projects',
          author: 'Emma Williams',
          authorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
          date: '2023-06-08',
          category: 'environment',
          content: 'We\'re planning a water conservation initiative in a drought-prone area. I\'d love to hear about successful approaches and lessons learned from similar projects.',
          replies: 15,
          views: 189,
          likes: 12,
          isSticky: false,
          lastActivity: '2023-06-16'
        },
        {
          id: 4,
          title: 'Resources for teaching financial literacy to youth',
          author: 'David Wilson',
          authorAvatar: 'https://randomuser.me/api/portraits/men/46.jpg',
          date: '2023-06-05',
          category: 'education',
          content: 'I\'m developing a program to teach financial literacy to teenagers in underserved communities. Does anyone have recommendations for age-appropriate resources or curriculum?',
          replies: 6,
          views: 78,
          likes: 4,
          isSticky: false,
          lastActivity: '2023-06-14'
        },
        {
          id: 5,
          title: 'Strategies for engaging corporate partners',
          author: 'Jennifer Lee',
          authorAvatar: 'https://randomuser.me/api/portraits/women/56.jpg',
          date: '2023-06-03',
          category: 'partnerships',
          content: 'What strategies have worked for others in securing and maintaining corporate partnerships? Looking for approaches beyond traditional sponsorships.',
          replies: 9,
          views: 112,
          likes: 7,
          isSticky: false,
          lastActivity: '2023-06-15'
        },
        {
          id: 6,
          title: 'Mental health support for disaster relief volunteers',
          author: 'Robert Taylor',
          authorAvatar: 'https://randomuser.me/api/portraits/men/62.jpg',
          date: '2023-05-30',
          category: 'health',
          content: 'Our volunteers often work in stressful disaster situations. What resources or programs can we implement to support their mental health and prevent burnout?',
          replies: 11,
          views: 134,
          likes: 9,
          isSticky: false,
          lastActivity: '2023-06-12'
        },
        {
          id: 7,
          title: 'Effective methods for measuring program impact',
          author: 'Lisa Anderson',
          authorAvatar: 'https://randomuser.me/api/portraits/women/72.jpg',
          date: '2023-05-28',
          category: 'impact',
          content: 'We\'re trying to improve how we measure and communicate the impact of our programs. What tools or frameworks have others found useful for impact assessment?',
          replies: 7,
          views: 95,
          likes: 6,
          isSticky: false,
          lastActivity: '2023-06-10'
        },
        {
          id: 8,
          title: 'Inclusive design for community spaces',
          author: 'James Martin',
          authorAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
          date: '2023-05-25',
          category: 'community',
          content: 'We\'re redesigning a community center and want to ensure it\'s accessible and welcoming to people of all abilities and backgrounds. Looking for inclusive design principles and examples.',
          replies: 5,
          views: 82,
          likes: 3,
          isSticky: false,
          lastActivity: '2023-06-08'
        },
        {
          id: 9,
          title: 'Grant writing tips for new nonprofits',
          author: 'Patricia White',
          authorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
          date: '2023-05-22',
          category: 'fundraising',
          content: 'Our organization is new to grant writing. What advice do you have for first-time grant applicants? Any common pitfalls to avoid?',
          replies: 14,
          views: 167,
          likes: 11,
          isSticky: false,
          lastActivity: '2023-06-05'
        },
        {
          id: 10,
          title: 'Sustainable agriculture training programs',
          author: 'Thomas Clark',
          authorAvatar: 'https://randomuser.me/api/portraits/men/91.jpg',
          date: '2023-05-20',
          category: 'environment',
          content: 'We\'re looking to develop a training program for small-scale farmers on sustainable agriculture practices. Has anyone implemented similar programs and willing to share their experience?',
          replies: 10,
          views: 128,
          likes: 8,
          isSticky: false,
          lastActivity: '2023-06-02'
        },
        {
          id: 11,
          title: 'Digital literacy programs for seniors',
          author: 'Mary Rodriguez',
          authorAvatar: 'https://randomuser.me/api/portraits/women/36.jpg',
          date: '2023-05-18',
          category: 'education',
          content: 'We\'re starting a digital literacy program for seniors in our community. Looking for curriculum ideas and best practices for teaching technology to older adults.',
          replies: 9,
          views: 105,
          likes: 7,
          isSticky: false,
          lastActivity: '2023-05-30'
        },
        {
          id: 12,
          title: 'Volunteer retention strategies',
          author: 'John Davis',
          authorAvatar: 'https://randomuser.me/api/portraits/men/15.jpg',
          date: '2023-05-15',
          category: 'volunteering',
          content: 'We\'ve been struggling with volunteer turnover. What strategies have worked for others in keeping volunteers engaged and committed long-term?',
          replies: 13,
          views: 142,
          likes: 10,
          isSticky: false,
          lastActivity: '2023-05-28'
        },
        {
          id: 13,
          title: 'Navigating cross-cultural partnerships',
          author: 'Sophia Kim',
          authorAvatar: 'https://randomuser.me/api/portraits/women/50.jpg',
          date: '2023-05-12',
          category: 'partnerships',
          content: 'Our organization is developing partnerships with groups in different countries. What advice do you have for building effective cross-cultural relationships and avoiding misunderstandings?',
          replies: 8,
          views: 98,
          likes: 6,
          isSticky: false,
          lastActivity: '2023-05-25'
        },
        {
          id: 14,
          title: 'Youth leadership development programs',
          author: 'Daniel Martinez',
          authorAvatar: 'https://randomuser.me/api/portraits/men/55.jpg',
          date: '2023-05-10',
          category: 'youth',
          content: 'We\'re designing a leadership program for youth from marginalized communities. Looking for innovative approaches to building confidence, skills, and opportunities.',
          replies: 7,
          views: 89,
          likes: 5,
          isSticky: false,
          lastActivity: '2023-05-22'
        },
        {
          id: 15,
          title: 'Community needs assessment methods',
          author: 'Elizabeth Thompson',
          authorAvatar: 'https://randomuser.me/api/portraits/women/82.jpg',
          date: '2023-05-08',
          category: 'community',
          content: 'We\'re planning to conduct a community needs assessment to guide our future programming. What methods have others found most effective for gathering meaningful input from diverse community members?',
          replies: 6,
          views: 76,
          likes: 4,
          isSticky: false,
          lastActivity: '2023-05-20'
        }
          ];
          
          setTopics(sampleTopicsData);
          setFilteredTopics(sampleTopicsData);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast.error('Failed to load forum topics');
        
        // Fallback to sample data if Firebase fetch fails
        const sampleTopicsData = topics.length > 0 ? topics : [
          // Sample data would be here, but we're using the existing data
          // from the original code for brevity
        ];
        
        setTopics(sampleTopicsData);
        setFilteredTopics(sampleTopicsData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTopics();
  }, []);
  
  useEffect(() => {
    const filterTopics = async () => {
      try {
        if (searchTerm || selectedCategory !== 'all') {
          setLoading(true);
          
          // If we're filtering, we need to query Firebase
          let topicsQuery;
          const topicsRef = collection(db, 'forumTopics');
          
          if (selectedCategory !== 'all') {
            // Filter by category
            topicsQuery = query(
              topicsRef,
              where('category', '==', selectedCategory),
              orderBy('isSticky', 'desc'),
              orderBy('createdAt', 'desc'),
              limit(50) // Get more results for client-side filtering
            );
          } else {
            // Just get all topics for text search
            topicsQuery = query(
              topicsRef,
              orderBy('isSticky', 'desc'),
              orderBy('createdAt', 'desc'),
              limit(50) // Get more results for client-side filtering
            );
          }
          
          const querySnapshot = await getDocs(topicsQuery);
          
          let results = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
            lastActivity: doc.data().lastActivity?.toDate().toISOString().split('T')[0] || doc.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
          }));
          
          // Client-side text search if needed
          if (searchTerm) {
            results = results.filter(topic => 
              topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (topic.content && topic.content.toLowerCase().includes(searchTerm.toLowerCase()))
            );
          }
          
          setFilteredTopics(results);
          setHasMore(false); // Disable pagination when filtering
        } else {
          // If no filters, restore the original topics
          setFilteredTopics(topics);
          setHasMore(topics.length >= topicsPerPage);
        }
      } catch (error) {
        console.error('Error filtering topics:', error);
        toast.error('Failed to filter topics');
        
        // Fallback to client-side filtering if Firebase query fails
        let results = topics;
        
        // Filter by search term
        if (searchTerm) {
          results = results.filter(topic => 
            topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (topic.content && topic.content.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        
        // Filter by category
        if (selectedCategory !== 'all') {
          results = results.filter(topic => topic.category === selectedCategory);
        }
        
        setFilteredTopics(results);
      } finally {
        setLoading(false);
        setCurrentPage(1); // Reset to first page when filters change
      }
    };
    
    filterTopics();
  }, [searchTerm, selectedCategory, topics]);
  
  // Get current topics for pagination
  const indexOfLastTopic = currentPage * topicsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - topicsPerPage;
  const currentTopics = filteredTopics.slice(indexOfFirstTopic, indexOfLastTopic);
  const totalPages = Math.ceil(filteredTopics.length / topicsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
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
  
  const loadMoreTopics = async () => {
    if (!lastVisible || !hasMore || loadingMore) return;
    
    try {
      setLoadingMore(true);
      
      const topicsRef = collection(db, 'forumTopics');
      const topicsQuery = query(
        topicsRef,
        orderBy('isSticky', 'desc'),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisible),
        limit(topicsPerPage)
      );
      
      const querySnapshot = await getDocs(topicsQuery);
      
      if (!querySnapshot.empty) {
        // Get the last document for pagination
        const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastVisible(lastDoc);
        
        // Convert the documents to topic objects
        const newTopics = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          lastActivity: doc.data().lastActivity?.toDate().toISOString().split('T')[0] || doc.data().createdAt?.toDate().toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
        }));
        
        setTopics(prevTopics => [...prevTopics, ...newTopics]);
        setFilteredTopics(prevTopics => [...prevTopics, ...newTopics]);
        setHasMore(querySnapshot.docs.length === topicsPerPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more topics:', error);
      toast.error('Failed to load more topics');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleNewTopicSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('You must be logged in to create a topic');
      navigate('/login', { state: { from: '/forum' } });
      return;
    }
    
    if (!newTopic.title.trim() || !newTopic.content.trim() || !newTopic.category) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Create a new topic document in Firestore
      const topicData = {
        title: newTopic.title,
        content: newTopic.content,
        category: newTopic.category,
        authorId: currentUser.uid,
        authorName: currentUser.displayName || 'Anonymous User',
        authorAvatar: currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
        createdAt: serverTimestamp(),
        lastActivity: serverTimestamp(),
        replies: 0,
        views: 0,
        likes: [],
        isSticky: false,
        isLocked: false,
        reports: []
      };
      
      const docRef = await addDoc(collection(db, 'forumTopics'), topicData);
      
      // Add the new topic to the local state
      const newTopicWithId = {
        id: docRef.id,
        ...topicData,
        date: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0]
      };
      
      setTopics([newTopicWithId, ...topics]);
      setFilteredTopics([newTopicWithId, ...filteredTopics]);
      setNewTopic({ title: '', content: '', category: '' });
      setShowNewTopicModal(false);
      
      toast.success('Topic created successfully');
      
      // Navigate to the new topic
      navigate(`/forum/${docRef.id}`);
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
    } finally {
      setSubmitting(false);
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

  return (
    <MainLayout>
      <Helmet>
        <title>Community Forum - Charity NGO</title>
        <meta name="description" content="Join our community forum to connect with like-minded individuals, share ideas, and participate in meaningful discussions about causes that matter." />
      </Helmet>
      
      <div className="container-custom py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Community Forum</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Connect with like-minded individuals, share ideas, and participate in meaningful discussions about causes that matter.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center"
        >
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-base-content/70" />
            </div>
            <input 
              type="text" 
              className="input input-bordered w-full pl-10" 
              placeholder="Search topics..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {categories.map(category => (
              <button
                key={category.id}
                className={`btn btn-sm ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          <button 
              className="btn btn-primary w-full md:w-auto gap-2"
              onClick={() => {
                if (!currentUser) {
                  toast.info('You must be logged in to create a topic');
                  navigate('/login', { state: { from: '/forum' } });
                  return;
                }
                setShowNewTopicModal(true);
              }}
            >
              <FiPlus /> New Topic
            </button>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th className="hidden md:table-cell">Category</th>
                    <th className="hidden md:table-cell">Author</th>
                    <th className="hidden md:table-cell">Replies</th>
                    <th className="hidden md:table-cell">Views</th>
                    <th>Last Activity</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTopics.length > 0 ? (
                    currentTopics.map(topic => (
                      <tr key={topic.id} className={topic.isSticky ? 'bg-base-200' : ''}>
                        <td>
                          <div className="flex flex-col">
                            <Link 
                              to={`/forum/${topic.id}`} 
                              className="font-medium hover:text-primary transition-colors flex items-center gap-2"
                              onClick={async () => {
                                // Update view count when clicking on a topic
                                try {
                                  const topicRef = doc(db, 'forumTopics', topic.id);
                                  await updateDoc(topicRef, {
                                    views: increment(1)
                                  });
                                } catch (error) {
                                  console.error('Error updating view count:', error);
                                }
                              }}
                            >
                              {topic.isSticky && <span className="badge badge-sm badge-primary">Sticky</span>}
                              {topic.isLocked && <span className="badge badge-sm badge-error ml-1">Locked</span>}
                              {topic.title}
                            </Link>
                            <div className="text-xs text-base-content/70 mt-1 md:hidden">
                              <span className={`badge badge-sm ${getCategoryBadgeColor(topic.category)} mr-2`}>{topic.category}</span>
                              <span className="mr-2"><FiUser className="inline mr-1" size={12} /> {topic.authorName || topic.author}</span>
                              <span><FiMessageSquare className="inline mr-1" size={12} /> {topic.replies}</span>
                            </div>
                          </div>
                        </td>
                        <td className="hidden md:table-cell">
                          <span className={`badge ${getCategoryBadgeColor(topic.category)}`}>{topic.category}</span>
                        </td>
                        <td className="hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="avatar">
                              <div className="w-8 rounded-full">
                                {topic.authorAvatar ? (
                                  <img src={topic.authorAvatar} alt={topic.authorName || topic.author} />
                                ) : (
                                  <div className="bg-primary text-white flex items-center justify-center h-full">
                                    {(topic.authorName || topic.author || '?').charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <span>{topic.authorName || topic.author}</span>
                          </div>
                        </td>
                        <td className="hidden md:table-cell">{topic.replies}</td>
                        <td className="hidden md:table-cell">{topic.views}</td>
                        <td>
                          <div className="flex flex-col">
                            <span>{topic.lastActivity ? new Date(topic.lastActivity).toLocaleDateString() : 'N/A'}</span>
                            <span className="text-xs text-base-content/70">{Array.isArray(topic.likes) ? topic.likes.length : (topic.likes || 0)} likes</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        No topics found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Load More Button */}
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
            
            {/* Pagination for filtered results */}
            {(searchTerm || selectedCategory !== 'all') && totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="join">
                  <button 
                    className="join-item btn"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                  
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => paginate(number + 1)}
                      className={`join-item btn ${currentPage === number + 1 ? 'btn-active' : ''}`}
                    >
                      {number + 1}
                    </button>
                  ))}
                  
                  <button 
                    className="join-item btn"
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* New Topic Modal */}
      {showNewTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h3 className="font-bold text-lg mb-4">Create New Topic</h3>
            
            <form onSubmit={handleNewTopicSubmit}>
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input 
                  type="text" 
                  name="title"
                  className="input input-bordered w-full" 
                  placeholder="Enter topic title"
                  value={newTopic.title}
                  onChange={handleNewTopicChange}
                  required
                />
              </div>
              
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Category</span>
                </label>
                <select 
                  name="category"
                  className="select select-bordered w-full"
                  value={newTopic.category}
                  onChange={handleNewTopicChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea 
                  name="content"
                  className="textarea textarea-bordered w-full" 
                  placeholder="Write your topic content here..."
                  rows="6"
                  value={newTopic.content}
                  onChange={handleNewTopicChange}
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-ghost"
                  onClick={() => setShowNewTopicModal(false)}
                >
                  Cancel
                </button>
                <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Creating...
                  </>
                ) : (
                  'Create Topic'
                )}
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
}