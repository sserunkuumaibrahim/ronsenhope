import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiMessageSquare, FiUser, FiCalendar, FiTag, FiHeart, FiMessageCircle, FiFilter, FiPlus, FiAlertCircle, FiX } from 'react-icons/fi';
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
      
      <div className="bg-accent bg-mesh-gradient-2 py-12 min-h-screen">
        <div className="container-custom">
        {/* Hero Section */}
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
        
        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
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
              
              {/* New Topic Button */}
              <motion.button 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white px-6 py-4 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 w-full lg:w-auto justify-center"
                onClick={() => {
                  if (!currentUser) {
                    toast.info('You must be logged in to create a topic');
                    navigate('/login', { state: { from: '/forum' } });
                    return;
                  }
                  setShowNewTopicModal(true);
                }}
              >
                <FiPlus className="text-lg" /> New Topic
              </motion.button>
            </div>
            
            {/* Category Filter Pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
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
            {/* Topics Grid */}
            <div className="space-y-4">
              {currentTopics.length > 0 ? (
                currentTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 cursor-pointer"
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
                      // Navigate to the topic
                      navigate(`/forum/${topic.id}`);
                    }}
                  >
                    <div className="p-6 group-hover:bg-gradient-to-r group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Topic Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {topic.isSticky && (
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                📌 Sticky
                              </span>
                            )}
                            {topic.isLocked && (
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full group-hover:bg-red-200 transition-colors duration-300">
                                🔒 Locked
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 ${getCategoryBadgeColor(topic.category)}`}>
                              {topic.category}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
                            {topic.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center text-xs font-medium group-hover:scale-110 transition-transform duration-300">
                                {(topic.authorName || topic.author || '?').charAt(0).toUpperCase()}
                              </div>
                              <span>by {topic.authorName || topic.author}</span>
                            </div>
                            <span>•</span>
                            <span>{topic.date}</span>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-6 lg:gap-8">
                          <div className="flex items-center gap-4">
                            <div className="text-center group-hover:scale-105 transition-transform duration-300">
                              <div className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">{topic.replies}</div>
                              <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Replies</div>
                            </div>
                            <div className="text-center group-hover:scale-105 transition-transform duration-300">
                              <div className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">{topic.views}</div>
                              <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Views</div>
                            </div>
                            <div className="text-center group-hover:scale-105 transition-transform duration-300">
                              <div className="text-lg font-bold text-gray-800 group-hover:text-primary transition-colors duration-300">{Array.isArray(topic.likes) ? topic.likes.length : (topic.likes || 0)}</div>
                              <div className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Likes</div>
                            </div>
                          </div>
                          
                          {/* Last Activity */}
                          <div className="hidden lg:flex flex-col items-center text-center min-w-[120px] group-hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 text-white flex items-center justify-center text-xs font-medium">
                                {(topic.authorName || topic.author || '?').charAt(0).toUpperCase()}
                              </div>
                              <span className="text-xs text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                                {topic.authorName || topic.author}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                              {topic.lastActivity ? new Date(topic.lastActivity).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
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
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </motion.button>
                    
                    {[...Array(totalPages).keys()].map(number => (
                      <motion.button
                        key={number + 1}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => paginate(number + 1)}
                        className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                          currentPage === number + 1 
                            ? 'bg-primary text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {number + 1}
                      </motion.button>
                    ))}
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
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
      
      {/* New Topic Modal */}
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
                    {categories.filter(cat => cat.id !== 'all').map(category => (
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
    </MainLayout>
  );
}