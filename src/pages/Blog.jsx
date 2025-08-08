import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiCalendar, FiUser, FiTag, FiClock, FiArrowRight } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let postsQuery;
      
      if (selectedCategory === 'all') {
        postsQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      } else {
        postsQuery = query(
          collection(db, 'blogs'), 
          where('category', '==', selectedCategory),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(postsQuery);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) || 'Unknown date'
      }));
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Fallback to sample data if Firebase fetch fails
      const postsData = [
        {
          id: 1,
          title: 'Clean Water Initiative Reaches 10,000 People',
          excerpt: 'Our clean water initiative has successfully provided access to clean drinking water for over 10,000 people in rural communities.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><h2>The Impact</h2><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><ul><li>Improved health outcomes</li><li>Reduced waterborne diseases</li><li>Increased school attendance</li><li>Economic benefits for communities</li></ul>',
          author: 'Sarah Johnson',
          authorImage: 'https://randomuser.me/api/portraits/women/12.jpg',
          date: 'March 15, 2023',
          readTime: '5 min read',
          category: 'water',
          image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['water', 'health', 'community']
        },
        {
          id: 2,
          title: 'Education Program Expands to 5 New Schools',
          excerpt: 'Our education initiative is expanding to 5 new schools, providing quality education to hundreds more children in underserved areas.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Michael Chen',
          authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
          date: 'March 8, 2023',
          readTime: '4 min read',
          category: 'education',
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['education', 'children', 'schools']
        },
        {
          id: 3,
          title: 'Annual Fundraising Gala Raises Record $2 Million',
          excerpt: 'This year\'s annual fundraising gala was our most successful yet, raising over $2 million to support our global initiatives.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Emily Rodriguez',
          authorImage: 'https://randomuser.me/api/portraits/women/23.jpg',
          date: 'February 28, 2023',
          readTime: '3 min read',
          category: 'events',
          image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['fundraising', 'events', 'charity']
        },
        {
          id: 4,
          title: 'Healthcare Clinic Opens in Rural Community',
          excerpt: 'We\'ve opened a new healthcare clinic that will provide essential medical services to over 5,000 people in a remote rural area.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Dr. James Wilson',
          authorImage: 'https://randomuser.me/api/portraits/men/45.jpg',
          date: 'February 20, 2023',
          readTime: '6 min read',
          category: 'healthcare',
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['healthcare', 'medical', 'rural']
        },
        {
          id: 5,
          title: 'Volunteer Spotlight: Meet Maria',
          excerpt: 'Maria has dedicated over 500 hours to our organization. Learn about her journey and the impact she\'s made in communities worldwide.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Jessica Taylor',
          authorImage: 'https://randomuser.me/api/portraits/women/45.jpg',
          date: 'February 15, 2023',
          readTime: '4 min read',
          category: 'volunteer',
          image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['volunteer', 'spotlight', 'community']
        },
        {
          id: 6,
          title: 'Environmental Conservation Project Saves 500 Acres',
          excerpt: 'Our latest environmental initiative has successfully protected 500 acres of critical forest habitat from deforestation.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'David Nguyen',
          authorImage: 'https://randomuser.me/api/portraits/men/67.jpg',
          date: 'February 10, 2023',
          readTime: '5 min read',
          category: 'environment',
          image: 'https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['environment', 'conservation', 'forest']
        },
        {
          id: 7,
          title: 'New Partnership Announced with Global Health Initiative',
          excerpt: 'We\'re excited to announce our new partnership with the Global Health Initiative to expand healthcare access in developing regions.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Robert Kim',
          authorImage: 'https://randomuser.me/api/portraits/men/52.jpg',
          date: 'February 5, 2023',
          readTime: '3 min read',
          category: 'partnerships',
          image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['partnerships', 'healthcare', 'global']
        },
        {
          id: 8,
          title: 'Community Development Program Transforms Local Village',
          excerpt: 'See how our community development program has transformed a local village through infrastructure improvements and economic opportunities.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Sophia Martinez',
          authorImage: 'https://randomuser.me/api/portraits/women/64.jpg',
          date: 'January 30, 2023',
          readTime: '7 min read',
          category: 'community',
          image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['community', 'development', 'economic']
        },
        {
          id: 9,
          title: 'Corporate Partnership Program Launches with 10 New Companies',
          excerpt: 'Our corporate partnership program has launched with 10 new companies committed to supporting our mission through funding and volunteer work.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Thomas Lee',
          authorImage: 'https://randomuser.me/api/portraits/men/22.jpg',
          date: 'February 8, 2023',
          readTime: '4 min read',
          category: 'partnerships',
          image: 'https://images.unsplash.com/photo-1556484687-30636164638b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['partnerships', 'collaboration', 'impact']
        },
        {
          id: 10,
          title: 'Youth Leadership in Community Development',
          excerpt: 'See how we\'re empowering young people to take leadership roles in driving positive change in their communities.',
          content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
          author: 'Amina Kofi',
          authorImage: 'https://randomuser.me/api/portraits/women/33.jpg',
          date: 'January 25, 2023',
          readTime: '6 min read',
          category: 'youth',
          image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          tags: ['youth', 'leadership', 'development']
        }
      ];
      
      setPosts(postsData);
    } finally {
      setLoading(false);
    }
  };

  // Get all unique categories from posts
  const categories = ['all', ...new Set(posts.map(post => post.category))];

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
        <title>Blog - Charity NGO</title>
        <meta name="description" content="Stay updated with the latest news, stories, and insights from our charity work around the world." />
        <meta property="og:title" content="Blog - Charity NGO" />
        <meta property="og:description" content="Stay updated with the latest news, stories, and insights from our charity work around the world." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/blog" />
      </Helmet>

      <div className="bg-base-200 py-12 md:py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-lg mb-8">Stay updated with the latest news, stories, and insights from our charity work around the world.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <div className="relative flex-grow max-w-md">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="input input-bordered w-full pr-10" 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
                  }}
                />
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50" />
              </div>
              
              <select 
                className="select select-bordered w-full sm:w-auto" 
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1); // Reset to first page on category change
                }}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4">No posts found</h2>
              <p className="text-base-content/70">Try adjusting your search criteria or check back later for new content.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                {currentPosts.map((post, index) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="card bg-base-100 shadow-md h-full flex flex-col">
                      <figure className="h-48">
                        <img 
                          src={post.image} 
                          alt={post.title} 
                          className="w-full h-full object-cover"
                        />
                      </figure>
                      <div className="card-body flex flex-col">
                        <div className="flex flex-wrap gap-2 text-sm text-base-content/70 mb-2">
                          <div className="flex items-center">
                            <FiCalendar className="mr-1" size={14} />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-1" size={14} />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        
                        <h2 className="card-title hover:text-primary transition-colors">
                          <Link to={`/blog/${post.id}`}>{post.title}</Link>
                        </h2>
                        
                        <p className="text-base-content/80 mb-4">{post.excerpt}</p>
                        
                        <div className="flex items-center mt-auto">
                          <div className="avatar mr-3">
                            <div className="w-8 h-8 rounded-full">
                              <img src={post.authorImage} alt={post.author} />
                            </div>
                          </div>
                          <span className="text-sm font-medium">{post.author}</span>
                        </div>
                        
                        <div className="card-actions justify-end mt-4">
                          <Link to={`/blog/${post.id}`} className="btn btn-sm btn-ghost gap-1">
                            Read more <FiArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="join">
                    <button 
                      className="join-item btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      «
                    </button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`join-item btn ${currentPage === index + 1 ? 'btn-active' : ''}`}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button 
                      className="join-item btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}