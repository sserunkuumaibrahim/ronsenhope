import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { doc, getDoc, collection, query, where, limit, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { FiArrowLeft, FiUser, FiCalendar, FiClock, FiTag, FiShare2, FiMessageSquare, FiHeart, FiSend } from 'react-icons/fi';

export default function StoryDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [story, setStory] = useState(null);
  const [relatedStories, setRelatedStories] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likedComments, setLikedComments] = useState(new Set());

  const formatDate = (date) => {
    if (!date) return '';
    try {
      if (date.toDate && typeof date.toDate === 'function') {
        return date.toDate().toLocaleDateString();
      }
      return new Date(date).toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const storyDoc = await getDoc(doc(db, 'stories', id));
        if (storyDoc.exists()) {
          const storyData = { id: storyDoc.id, ...storyDoc.data() };
          storyData.publishDate = formatDate(storyData.publishDate);
          storyData.createdAt = formatDate(storyData.createdAt);
          setStory(storyData);
          
          // Fetch related stories
          const relatedQuery = query(
            collection(db, 'stories'),
            where('category', '==', storyData.category),
            where('__name__', '!=', id),
            limit(3)
          );
          const relatedSnapshot = await getDocs(relatedQuery);
          const related = relatedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            publishDate: formatDate(doc.data().publishDate),
            createdAt: formatDate(doc.data().createdAt)
          }));
          setRelatedStories(related);
          
          // Fetch comments
          const commentsQuery = query(
            collection(db, 'comments'),
            where('storyId', '==', id)
          );
          const commentsSnapshot = await getDocs(commentsQuery);
          const commentsData = commentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // Sort comments by createdAt in descending order
          commentsData.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
            const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
            return bTime - aTime;
          });
          setComments(commentsData);
        }
      } catch (error) {
        console.error('Error fetching story:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser || submittingComment) return;

    setSubmittingComment(true);
    try {
      await addDoc(collection(db, 'comments'), {
        storyId: id,
        content: newComment,
        authorName: currentUser.displayName || 'Anonymous',
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL,
        createdAt: new Date(),
        likes: 0
      });
      setNewComment('');
      // Refresh comments
      const commentsQuery = query(
        collection(db, 'comments'),
        where('storyId', '==', id)
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort comments by createdAt in descending order
      commentsData.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return bTime - aTime;
      });
      setComments(commentsData);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = (commentId) => {
    const newLikedComments = new Set(likedComments);
    if (likedComments.has(commentId)) {
      newLikedComments.delete(commentId);
    } else {
      newLikedComments.add(commentId);
    }
    setLikedComments(newLikedComments);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading story...</p>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!story) {
    return (
      <MainLayout>
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-white to-gray-100">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <FiMessageSquare className="w-10 h-10 text-gray-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Story Not Found</h1>
            <p className="text-gray-700 mb-8 leading-relaxed">The story you're looking for doesn't exist or has been removed. Let's get you back to our inspiring stories.</p>
            <Link to="/stories" className="btn btn-primary btn-lg gap-2">
              <FiArrowLeft className="w-4 h-4" />
              Back to Stories
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <Helmet>
        <title>{story.title} - Ronsen Hope Christian Foundation Uganda</title>
        <meta name="description" content={story.excerpt} />
        <meta property="og:title" content={`${story.title} - Ronsen Hope Christian Foundation Uganda`} />
        <meta property="og:description" content={story.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={story.image} />
        <meta property="article:published_time" content={story.publishDate} />
        <meta property="article:author" content={story.author} />
        {story.tags && story.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={`/stories/${story.id}`} />
      </Helmet>

      {/* Hero Section with Breadcrumb */}
      <section className="relative py-8 xs:py-10 sm:py-16 md:py-20 lg:py-32 overflow-hidden min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={story.imageUrl || story.image} 
            alt={story.title} 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Fade Black Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        <div className="container-custom relative z-10 px-3 xs:px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="flex items-center mb-4 xs:mb-5 sm:mb-6 md:mb-8">
              <Link 
                to="/stories" 
                className="inline-flex items-center gap-1.5 xs:gap-2 text-white/80 hover:text-white transition-all duration-300 hover:gap-3 group bg-white/10 backdrop-blur-sm rounded-full px-2.5 xs:px-3 py-1.5 xs:py-2 sm:px-4 border border-white/20"
              >
                <FiArrowLeft className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium text-xs xs:text-sm sm:text-base">Back to Stories</span>
              </Link>
            </div>
            
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 xs:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 xs:px-4 py-1.5 xs:py-2 sm:px-6 sm:py-3 border border-white/30"
                >
                  <FiTag className="text-pink-200 w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs xs:text-xs sm:text-sm font-medium">
                    {story.category === 'lindas-blog' ? "Linda's Blog" : 
                     story.category === 'stories-of-hope' ? 'Stories of Hope' : 
                     story.category === 'news' ? 'News' : story.category}
                  </span>
                </motion.div>
                
                <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 text-xs xs:text-xs sm:text-sm text-white/80">
                  <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <FiCalendar className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                    <span>{story.publishDate}</span>
                  </div>
                  <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <FiClock className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4" />
                    <span>{story.readTime ? `${story.readTime} min read` : '5 min read'}</span>
                  </div>
                </div>
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight mb-4 xs:mb-5 sm:mb-6 md:mb-8 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent"
              >
                {story.title}
              </motion.h1>
              
              {story.excerpt && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 leading-relaxed max-w-3xl mb-4 xs:mb-5 sm:mb-6 md:mb-8"
                >
                  {story.excerpt}
                </motion.p>
              )}
              
              {/* Author and Tags in Hero */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 sm:gap-6"
              >
                {/* Author */}
                <div className="flex items-center gap-2 xs:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 xs:px-4 py-1.5 xs:py-2 border border-white/20">
                  <FiUser className="w-3 h-3 xs:w-4 xs:h-4 text-white/80" />
                  <span className="text-xs xs:text-sm font-medium text-white">{story.author}</span>
                </div>
                
                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 xs:gap-2">
                    {story.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 xs:px-3 py-1 border border-white/20 text-xs font-medium text-white/90"
                      >
                        <FiTag className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                        {tag}
                      </span>
                    ))}
                    {story.tags.length > 3 && (
                      <span className="text-xs text-white/70">+{story.tags.length - 3} more</span>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Main Content */}
      <article className="py-20 bg-gradient-to-br from-white to-gray-50">
        <div className="container-custom">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            
            <div className="max-w-4xl mx-auto">
              {/* Author Info */}
              <motion.div 
                variants={itemVariants}
                className="group relative mb-8 xs:mb-10 sm:mb-12 md:mb-16"
              >
                <div className="absolute inset-0 bg-primary rounded-xl xs:rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-5"></div>
                <div className="relative bg-white rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 xs:gap-4 md:gap-6">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl xs:rounded-2xl bg-gradient-to-br from-primary to-orange-600 ring-2 xs:ring-3 sm:ring-4 ring-orange-100 group-hover:ring-orange-200 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white font-bold text-base xs:text-lg sm:text-xl md:text-2xl">
                          {story.author ? story.author.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 xs:-bottom-2 xs:-right-2 w-5 h-5 xs:w-6 xs:h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center">
                        <FiUser className="w-2.5 h-2.5 xs:w-3 xs:h-3 md:w-4 md:h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg xs:text-xl md:text-2xl font-bold text-gray-900 mb-1 xs:mb-2">{story.author}</h3>
                      <p className="text-sm xs:text-base text-gray-600 mb-1">
                        Story Author
                      </p>
                      <p className="text-xs xs:text-sm text-gray-500">
                        Published {story.publishDate}
                      </p>
                      <p className="text-xs xs:text-sm text-gray-700 leading-relaxed mt-2">
                        {story.authorBio || `${story.author} is a passionate writer sharing stories of hope and inspiration.`}
                      </p>
                    </div>
                    <div className="flex gap-1.5 xs:gap-2 md:gap-3 self-start sm:self-center">
                      <button className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 hover:bg-primary text-gray-600 hover:text-white rounded-lg xs:rounded-xl transition-all duration-300 flex items-center justify-center group/btn">
                        <FiShare2 className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 hover:bg-primary text-gray-600 hover:text-white rounded-lg xs:rounded-xl transition-all duration-300 flex items-center justify-center group/btn">
                        <FiHeart className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Story Content */}
              <motion.div 
                variants={itemVariants}
                className="mb-12 xs:mb-14 sm:mb-16"
              >
                <div className="bg-white rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-10 shadow-lg border border-gray-100">
                  <div className={`prose max-w-none ${
                    story.category === 'news' 
                      ? 'prose-sm xs:prose-base prose-gray columns-1 md:columns-2 gap-6 xs:gap-8 text-justify' 
                      : 'prose-base xs:prose-lg sm:prose-xl'
                  }`}>
                    <div 
                      className={`text-gray-800 ${
                        story.category === 'news' 
                          ? 'leading-relaxed text-sm xs:text-base md:text-base font-normal' 
                          : 'leading-relaxed font-medium text-base xs:text-lg sm:text-lg'
                      }`}
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }} 
                    />
                  </div>
                </div>
              </motion.div>
              
              {/* Tags */}
              {story.tags && story.tags.length > 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="mb-16"
                >
                  <h4 className="text-sm font-semibold text-gray-600 mb-6 uppercase tracking-wider">Tags</h4>
                  <div className="flex flex-wrap gap-3">
                    {story.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-2xl text-sm font-semibold hover:from-pink-200 hover:to-purple-200 transition-all duration-300 cursor-pointer transform hover:scale-105 shadow-sm"
                      >
                        <FiTag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </article>
      
      {/* Comments Section */}
      <div className="bg-gray-50 py-8 xs:py-10 sm:py-12">
        <div className="container-custom px-3 xs:px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants} className="mb-8 xs:mb-10 sm:mb-12">
              <div className="flex flex-col xs:flex-row xs:items-center gap-3 xs:gap-4 mb-6 xs:mb-7 sm:mb-8">
                <h2 className="text-2xl xs:text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 xs:gap-3">
                  <FiMessageSquare className="text-primary w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8" />
                  Comments
                </h2>
                <span className="px-3 xs:px-4 py-1.5 xs:py-2 bg-orange-100 text-orange-700 rounded-full text-xs xs:text-sm font-semibold">
                  {comments.length}
                </span>
              </div>
            </motion.div>
            
            {currentUser ? (
              <motion.div variants={itemVariants} className="mb-8 xs:mb-10 sm:mb-12">
                <div className="bg-white rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 shadow-lg border border-gray-100">
                  <h4 className="text-lg xs:text-xl font-bold mb-4 xs:mb-5 sm:mb-6 text-gray-900">Share Your Thoughts</h4>
                  <form onSubmit={handleCommentSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
                    <div className="flex flex-col xs:flex-row gap-4 xs:gap-5 sm:gap-6">
                      <div className="flex-shrink-0 self-start">
                        <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-xl xs:rounded-2xl overflow-hidden ring-2 xs:ring-3 sm:ring-4 ring-pink-100">
                            <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm xs:text-base sm:text-lg">
                              {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow space-y-3 xs:space-y-4">
                        <div className="relative">
                          <textarea 
                            className="w-full p-3 xs:p-4 sm:p-5 md:p-6 border-2 border-gray-200 rounded-xl xs:rounded-2xl focus:ring-2 xs:focus:ring-3 sm:focus:ring-4 focus:ring-pink-100 focus:border-pink-400 resize-none transition-all duration-300 text-gray-800 placeholder-gray-400 text-sm xs:text-base" 
                            placeholder="What's on your mind? Share your thoughts about this story..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={3}
                            required
                          />
                        </div>
                        <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3 xs:gap-0">
                          <p className="text-xs xs:text-sm text-gray-500">Be respectful and constructive in your comments</p>
                          <button 
                            type="submit" 
                            disabled={submittingComment}
                            className="flex items-center gap-2 xs:gap-3 px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl xs:rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm xs:text-base w-full xs:w-auto"
                          >
                            {submittingComment ? (
                              <>
                                <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span className="hidden xs:inline">Posting...</span>
                                <span className="xs:hidden">...</span>
                              </>
                            ) : (
                              <>
                                <FiSend className="w-4 h-4 xs:w-5 xs:h-5" />
                                Post Comment
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div variants={itemVariants} className="mb-8 xs:mb-10 sm:mb-12">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl xs:rounded-3xl p-6 xs:p-7 sm:p-8 border-2 border-orange-100 text-center">
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
                    <FiUser className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-orange-600" />
                  </div>
                  <h4 className="text-lg xs:text-xl font-bold text-gray-900 mb-2">Join the Conversation</h4>
                  <p className="text-sm xs:text-base text-gray-600 mb-4 xs:mb-5 sm:mb-6">Please log in to share your thoughts and connect with our community</p>
                  <Link 
                    to="/login" 
                    className="inline-flex items-center gap-2 px-6 xs:px-7 sm:px-8 py-3 xs:py-3.5 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl xs:rounded-2xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm xs:text-base"
                  >
                    <FiUser className="w-4 h-4 xs:w-5 xs:h-5" />
                    Log In to Comment
                  </Link>
                </div>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants} className="space-y-6 xs:space-y-7 sm:space-y-8">
              {comments.map((comment, index) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="flex flex-col xs:flex-row gap-4 xs:gap-5 sm:gap-6">
                    <div className="flex-shrink-0 self-start">
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-xl xs:rounded-2xl overflow-hidden ring-2 xs:ring-3 sm:ring-4 ring-gray-100 group-hover:ring-pink-100 transition-all duration-300">
                        <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold text-xs xs:text-sm">
                            {comment.authorName ? comment.authorName.charAt(0).toUpperCase() : 'A'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="bg-white rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group-hover:border-pink-200">
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between mb-3 xs:mb-4 gap-2 xs:gap-3">
                          <h4 className="font-bold text-gray-900 text-base xs:text-lg">{comment.authorName}</h4>
                          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3">
                            <span className="text-xs xs:text-sm text-gray-500 flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              {comment.createdAt?.toDate?.()?.toLocaleDateString() || 
                               new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                            <button 
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center gap-1 px-2 xs:px-3 py-1 rounded-full text-xs xs:text-sm transition-all duration-300 ${
                                likedComments.has(comment.id) 
                                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                                  : 'bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600'
                              }`}
                            >
                              <FiHeart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-current' : ''}`} />
                              {(comment.likes || 0) + (likedComments.has(comment.id) ? 1 : 0)}
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-800 leading-relaxed text-sm xs:text-base break-words">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {comments.length === 0 && (
                <motion.div 
                  variants={itemVariants}
                  className="text-center py-8 xs:py-10 sm:py-12"
                >
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 xs:mb-4">
                    <FiMessageSquare className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg xs:text-xl font-semibold text-gray-600 mb-2">No comments yet</h4>
                  <p className="text-sm xs:text-base text-gray-500">Be the first to share your thoughts about this story!</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="py-12 xs:py-14 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-pink-50">
          <div className="container-custom px-3 xs:px-4 sm:px-6 lg:px-8">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants} className="text-center mb-10 xs:mb-12 sm:mb-14 md:mb-16">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 mb-3 xs:mb-4">
                  Related Stories
                </h2>
                <p className="text-gray-600 text-sm xs:text-base sm:text-lg max-w-2xl mx-auto">
                  Discover more inspiring stories from our community
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-7 sm:gap-8">
                {relatedStories.map((relatedStory) => (
                  <motion.div 
                    key={relatedStory.id}
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl xs:rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img 
                          src={relatedStory.imageUrl || relatedStory.image} 
                          alt={relatedStory.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-5 xs:p-6 sm:p-7 md:p-8">
                        <h3 className="text-lg xs:text-xl font-bold text-gray-900 mb-2 xs:mb-3 group-hover:text-pink-600 transition-colors duration-300 line-clamp-2">
                          {relatedStory.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3 mb-3 xs:mb-4 leading-relaxed text-sm xs:text-base">
                          {relatedStory.excerpt}
                        </p>
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
                          <div className="flex items-center gap-2 text-gray-500 text-xs xs:text-sm">
                            <FiCalendar className="w-3 h-3 xs:w-4 xs:h-4" />
                            <span>{relatedStory.publishDate}</span>
                          </div>
                          <Link 
                            to={`/stories/${relatedStory.id}`} 
                            className="flex items-center gap-2 px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg xs:rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-md text-sm xs:text-base w-full xs:w-auto justify-center xs:justify-start"
                          >
                            Read More
                            <FiArrowLeft className="w-3 h-3 xs:w-4 xs:h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}