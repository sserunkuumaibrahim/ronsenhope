import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUser, FiTag, FiClock, FiArrowRight } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const navigate = useNavigate();

  // Sample data as fallback
  const postsData = [
    {
      id: 1,
      title: "Building Wells in Rural Communities",
      excerpt: "Our latest water project brings clean drinking water to over 500 families in remote villages.",
      content: "Full article content here...",
      author: "Sarah Johnson",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "water",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      tags: ["water", "community", "development"]
    },
    {
      id: 2,
      title: "Education Program Reaches 1000 Children",
      excerpt: "Our education initiative has successfully enrolled over 1000 children in schools across three countries.",
      content: "Full article content here...",
      author: "Michael Chen",
      authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      date: "March 10, 2024",
      readTime: "7 min read",
      category: "education",
      image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop",
      tags: ["education", "children", "schools"]
    },
    {
      id: 3,
      title: "Emergency Relief Efforts in Crisis Areas",
      excerpt: "Rapid response teams provide immediate aid to families affected by natural disasters.",
      content: "Full article content here...",
      author: "Emily Rodriguez",
      authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      date: "March 8, 2024",
      readTime: "6 min read",
      category: "emergency",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop",
      tags: ["emergency", "relief", "disaster"]
    },
    {
      id: 4,
      title: "Healthcare Mobile Clinics Expand Reach",
      excerpt: "New mobile health units bring medical care to underserved communities in remote areas.",
      content: "Full article content here...",
      author: "Dr. James Wilson",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      date: "March 5, 2024",
      readTime: "8 min read",
      category: "healthcare",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      tags: ["healthcare", "mobile", "clinics"]
    },
    {
      id: 5,
      title: "Sustainable Agriculture Training Programs",
      excerpt: "Teaching farmers sustainable practices to improve crop yields and protect the environment.",
      content: "Full article content here...",
      author: "Maria Santos",
      authorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      date: "March 1, 2024",
      readTime: "6 min read",
      category: "agriculture",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
      tags: ["agriculture", "sustainability", "training"]
    },
    {
      id: 6,
      title: "Women's Empowerment Through Microfinance",
      excerpt: "Small loans create big opportunities for women entrepreneurs in developing communities.",
      content: "Full article content here...",
      author: "Aisha Patel",
      authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      date: "February 28, 2024",
      readTime: "5 min read",
      category: "empowerment",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop",
      tags: ["women", "microfinance", "empowerment"]
    }
  ];

  const categories = ['all', 'water', 'education', 'healthcare', 'emergency', 'agriculture', 'empowerment'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const postsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(postsData.length > 0 ? postsData : postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts(postsData);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <MainLayout>
      <Helmet>
        <title>Blog - Lumps Away Foundation</title>
        <meta name="description" content="Stay updated with the latest news, stories, and insights from our breast cancer support work in Uganda." />
        <meta property="og:title" content="Blog - Lumps Away Foundation" />
        <meta property="og:description" content="Stay updated with the latest news, stories, and insights from our breast cancer support work in Uganda." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/blog" />
      </Helmet>

      <div className="bg-accent bg-mesh-gradient-2 min-h-screen">
        <div className="container-custom py-12 md:py-20">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 text-secondary"
            >
              Our Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-8 text-secondary/80 leading-relaxed"
            >
              Stay updated with the latest news, stories, and insights from our breast cancer support work in Uganda.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="inline-block px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-secondary/70 font-medium"
            >
              ✨ Discover inspiring stories and updates
            </motion.div>
          </motion.div>

          {/* Search & Filter Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
              {/* Search Bar */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex-grow max-w-md"
              >
                <input 
                  type="text" 
                  placeholder="Search articles, authors, topics..." 
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-secondary placeholder-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300" 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/50 text-xl" />
              </motion.div>
              
              {/* Category Filter */}
              <motion.select 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 min-w-[200px]" 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category} className="bg-white text-gray-800">
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </motion.select>
            </div>

            {/* Category Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-wrap gap-2 justify-center mt-6"
            >
              {categories.slice(0, 6).map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/10 backdrop-blur-md text-secondary/70 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Content Section */}
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-20"
            >
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </motion.div>
          ) : filteredPosts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <h2 className="text-3xl font-bold mb-4 text-secondary">No posts found</h2>
              <p className="text-secondary/70 text-lg">Try adjusting your search criteria or check back later for new content.</p>
            </motion.div>
          ) : (
            <>
              {/* Blog Posts Grid */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {currentPosts.map((post, index) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group cursor-pointer"
                    onClick={() => window.location.href = `/blog/${post.id}`}
                  >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden h-full flex flex-col transition-all duration-500 group-hover:bg-white/20 group-hover:border-white/30 group-hover:shadow-2xl group-hover:shadow-primary/10">
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-secondary/60 mb-3">
                          <div className="flex items-center gap-1">
                            <FiCalendar size={14} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiClock size={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-xl font-bold mb-3 text-secondary group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h2>
                        
                        {/* Excerpt */}
                        <p className="text-secondary/70 mb-6 line-clamp-3 flex-grow leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        {/* Author & Read More */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 group-hover:ring-primary/30 transition-all duration-300">
                              <img src={post.authorImage} alt={post.author} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-secondary">{post.author}</p>
                              <div className="flex gap-1">
                                {post.tags?.slice(0, 2).map((tag, tagIndex) => (
                                  <span key={tagIndex} className="text-xs text-secondary/50">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-1 text-primary font-medium text-sm group-hover:text-primary transition-colors duration-300"
                          >
                            Read more <FiArrowRight size={16} />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                  className="flex justify-center mt-16"
                >
                  <div className="flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-white/10 text-secondary hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      ←
                    </motion.button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          currentPage === index + 1 
                            ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                            : 'bg-white/10 text-secondary hover:bg-white/20'
                        }`}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </motion.button>
                    ))}
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-xl bg-white/10 text-secondary hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}