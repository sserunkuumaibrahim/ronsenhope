import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiClock, FiTag, FiArrowLeft, FiShare2, FiMessageSquare } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { doc, getDoc, collection, query, where, limit, getDocs, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import DOMPurify from 'dompurify';

export default function BlogDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Helper function to safely convert date
          const formatDate = (dateField) => {
            if (!dateField) return null;
            
            // If it's a Firestore Timestamp
            if (dateField.toDate && typeof dateField.toDate === 'function') {
              return dateField.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
            
            // If it's a string date
            if (typeof dateField === 'string') {
              return new Date(dateField).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
            
            return null;
          };
          
          const postData = {
            id: docSnap.id,
            ...data,
            date: formatDate(data.createdAt) || 'Unknown date'
          };
          
          setPost(postData);
          setComments(postData.comments || []);
          
          // Update view count
          await updateDoc(docRef, {
            viewCount: increment(1)
          });
          
          // Fetch related posts
          fetchRelatedPosts(postData.category, docSnap.id);
        } else {
          console.error('No such document!');
          // Fallback to sample data if post not found
          setPost({
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
            tags: ['water', 'health', 'community'],
            comments: [
              {
                id: '1',
                user: 'John Doe',
                userImage: 'https://randomuser.me/api/portraits/men/1.jpg',
                date: 'March 16, 2023',
                text: 'This is amazing work! I\'m so glad to see the impact this initiative is having.'
              },
              {
                id: '2',
                user: 'Jane Smith',
                userImage: 'https://randomuser.me/api/portraits/women/2.jpg',
                date: 'March 17, 2023',
                text: 'I\'d love to know more about how I can support this project. Is there a way to donate specifically to this initiative?'
              }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);
  
  const fetchRelatedPosts = async (category, currentPostId) => {
    try {
      const relatedPostsQuery = query(
        collection(db, 'blogs'),
        where('category', '==', category),
        limit(3)
      );
      
      // Helper function to safely convert date
      const formatDate = (dateField) => {
        if (!dateField) return null;
        
        // If it's a Firestore Timestamp
        if (dateField.toDate && typeof dateField.toDate === 'function') {
          return dateField.toDate().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        
        // If it's a string date
        if (typeof dateField === 'string') {
          return new Date(dateField).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
        
        return null;
      };
      
      const querySnapshot = await getDocs(relatedPostsQuery);
      const relatedPostsData = querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: formatDate(data.createdAt) || 'Unknown date'
          };
        })
        .filter(post => post.id !== currentPostId);
      
      setRelatedPosts(relatedPostsData);
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Please log in to comment');
      return;
    }
    
    if (!comment.trim()) return;
    
    try {
      const newComment = {
        id: Date.now().toString(),
        user: currentUser.displayName || 'Anonymous User',
        userImage: currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg',
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        text: comment.trim(),
        userId: currentUser.uid
      };
      
      const postRef = doc(db, 'blogs', id);
      await updateDoc(postRef, {
        comments: arrayUnion(newComment)
      });
      
      setComments([...comments, newComment]);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container-custom py-16 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!post) {
    return (
      <MainLayout>
        <div className="container-custom py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="btn btn-primary">
            Back to Blog
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Helmet>
        <title>{post.title} - Lumps Away Foundation</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={`${post.title} - Lumps Away Foundation`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
        <meta property="article:published_time" content={post.createdAt?.toDate?.().toISOString()} />
        <meta property="article:author" content={post.author} />
        {post.tags?.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={`/blog/${post.id}`} />
      </Helmet>

      <div className="bg-base-200 py-8">
        <div className="container-custom">
          <div className="flex items-center mb-4">
            <Link to="/blog" className="flex items-center text-base-content/70 hover:text-primary transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
      
      <article className="container-custom py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-8 text-base-content/70">
              <div className="flex items-center">
                <div className="avatar mr-2">
                  <div className="w-8 h-8 rounded-full">
                    <img src={post.authorImage} alt={post.author} />
                  </div>
                </div>
                <span>{post.author}</span>
              </div>
              
              <div className="flex items-center">
                <FiCalendar className="mr-1" size={16} />
                <span>{post.date}</span>
              </div>
              
              <div className="flex items-center">
                <FiClock className="mr-1" size={16} />
                <span>{post.readTime}</span>
              </div>
              
              <div className="badge badge-primary">
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full max-h-[500px] object-cover rounded-lg"
            />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            />
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag, index) => (
                  <div key={index} className="badge badge-outline">
                    <FiTag className="mr-1" size={12} />
                    {tag}
                  </div>
                ))}
              </div>
            )}
            
            <div className="divider"></div>
            
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="avatar mr-4">
                  <div className="w-12 h-12 rounded-full">
                    <img src={post.authorImage} alt={post.author} />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold">{post.author}</h3>
                  <p className="text-sm text-base-content/70">Author</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="btn btn-circle btn-outline">
                  <FiShare2 />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </article>
      
      <div className="bg-base-200 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FiMessageSquare className="mr-2" />
              Comments ({comments.length})
            </h2>
            
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <div className="flex gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full">
                      <img 
                        src={currentUser.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                        alt={currentUser.displayName || 'User'} 
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <textarea 
                      className="textarea textarea-bordered w-full" 
                      placeholder="Add a comment..."
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button type="submit" className="btn btn-primary">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="alert mb-8">
                <div>
                  <span>Please <Link to="/login" className="font-bold text-primary">log in</Link> to leave a comment.</span>
                </div>
              </div>
            )}
            
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full">
                        <img src={comment.userImage} alt={comment.user} />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold">{comment.user}</h4>
                        <span className="text-sm text-base-content/70">{comment.date}</span>
                      </div>
                      <p>{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/70">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {relatedPosts.length > 0 && (
        <div className="container-custom py-12">
          <h2 className="text-2xl font-bold mb-8">Related Posts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <div key={relatedPost.id} className="card bg-base-100 shadow-md h-full relative group">
                <div className="absolute inset-0 bg-pink-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
                <figure className="h-48 relative">
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title} 
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="card-body relative">
                  <h3 className="card-title hover:text-primary transition-colors">
                    <Link to={`/blog/${relatedPost.id}`}>{relatedPost.title}</Link>
                  </h3>
                  <p className="text-base-content/80">{relatedPost.excerpt.substring(0, 100)}...</p>
                  <div className="card-actions justify-end mt-4">
                    <Link to={`/blog/${relatedPost.id}`} className="btn btn-sm btn-ghost gap-1">
                      Read more <FiArrowLeft className="rotate-180" size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </MainLayout>
  );
}