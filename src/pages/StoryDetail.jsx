import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import { FiArrowLeft, FiUser, FiCalendar, FiClock, FiTag, FiShare2, FiMessageSquare } from 'react-icons/fi';

export default function StoryDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [story, setStory] = useState(null);
  const [relatedStories, setRelatedStories] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

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
            where('storyId', '==', id),
            orderBy('createdAt', 'desc')
          );
          const commentsSnapshot = await getDocs(commentsQuery);
          const commentsData = commentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
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
    if (!newComment.trim() || !currentUser) return;

    try {
      await addDoc(collection(db, 'comments'), {
        storyId: id,
        content: newComment,
        authorName: currentUser.displayName || 'Anonymous',
        authorEmail: currentUser.email,
        authorPhoto: currentUser.photoURL,
        createdAt: new Date()
      });
      setNewComment('');
      // Refresh comments
      const commentsQuery = query(
        collection(db, 'comments'),
        where('storyId', '==', id),
        orderBy('createdAt', 'desc')
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const commentsData = commentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
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
        <title>{story.title} - Lumps Away Foundation</title>
        <meta name="description" content={story.excerpt} />
        <meta property="og:title" content={`${story.title} - Lumps Away Foundation`} />
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
      <div className={`relative py-12 ${
        story.category === 'news' 
          ? 'bg-gradient-to-br from-blue-50 via-white to-blue-100 border-b-2 border-blue-200' 
          : 'bg-gradient-to-br from-primary/5 via-white to-secondary/5'
      }`}>
        <div className="absolute inset-0 opacity-50">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <Link 
                to="/stories" 
                className="inline-flex items-center gap-2 text-base-content/70 hover:text-primary transition-all duration-300 hover:gap-3 group"
              >
                <FiArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium">Back to Stories</span>
              </Link>
            </div>
            
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  story.category === 'news' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-primary/10 text-primary'
                }`}>
                  <FiTag className="w-3 h-3" />
                  {story.category === 'lindas-blog' ? "Linda's Blog" : 
                   story.category === 'stories-of-hope' ? 'Stories of Hope' : 
                   story.category === 'news' ? 'News' : story.category}
                </span>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{story.publishDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>{story.readTime ? `${story.readTime} min read` : '5 min read'}</span>
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {story.title}
              </h1>
              
              {story.excerpt && (
                <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">
                  {story.excerpt}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <article className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Featured Image */}
            <div className={`relative mb-12 md:mb-16 ${
              story.category === 'news' ? 'mb-8 md:mb-10' : ''
            }`}>
              <div className={`overflow-hidden shadow-2xl ${
                story.category === 'news' 
                  ? 'aspect-video rounded-lg border border-gray-200' 
                  : 'aspect-video md:aspect-[21/9] rounded-2xl'
              }`}>
                <img 
                  src={story.imageUrl || story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              {story.category !== 'news' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              )}
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Author Info */}
              <div className={`flex items-center gap-4 mb-12 ${
                story.category === 'news' 
                  ? 'p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 mb-8' 
                  : 'p-6 bg-gray-50 rounded-2xl border border-gray-200'
              }`}>
                <div className="avatar">
                  <div className={`rounded-full ${
                    story.category === 'news' 
                      ? 'w-12 h-12 ring-2 ring-blue-200' 
                      : 'w-16 h-16 ring-2 ring-primary/20'
                  }`}>
                    <img src={story.authorImage || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt={story.author} />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-gray-900 ${
                    story.category === 'news' ? 'text-base' : 'text-lg'
                  }`}>{story.author}</h3>
                  <p className={`text-gray-600 ${
                    story.category === 'news' ? 'text-sm' : ''
                  }`}>
                    {story.category === 'news' ? 'News Reporter' : 'Story Author'}
                  </p>
                  {story.category === 'news' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Published {story.publishDate}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-circle btn-ghost btn-sm hover:btn-primary transition-all duration-300">
                    <FiShare2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Story Content */}
              <div className={`prose max-w-none mb-12 ${
                story.category === 'news' 
                  ? 'prose-base prose-gray columns-1 md:columns-2 gap-8 text-justify' 
                  : 'prose-lg prose-base'
              }`}>
                <div 
                  className={`text-gray-800 ${
                    story.category === 'news' 
                      ? 'leading-relaxed text-sm md:text-base font-normal' 
                      : 'leading-relaxed'
                  }`}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.content) }} 
                />
              </div>
              
              {/* Tags */}
              {story.tags && story.tags.length > 0 && (
                <div className="mb-12">
                  <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wider">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {story.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-primary/10 text-gray-700 hover:text-primary rounded-full text-sm transition-all duration-300 cursor-pointer"
                      >
                        <FiTag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </article>
      
      {/* Comments Section */}
      <div className="bg-gray-50 py-12">
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
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button type="submit" className="btn btn-primary btn-sm">
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="mb-4">Please log in to leave a comment.</p>
                <Link to="/login" className="btn btn-primary">
                  Log In
                </Link>
              </div>
            )}
            
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full">
                      <img 
                        src={comment.authorPhoto || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                        alt={comment.authorName} 
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{comment.authorName}</h4>
                        <span className="text-sm text-gray-600">
                          {comment.createdAt?.toDate?.()?.toLocaleDateString() || 
                           new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className={`py-12 bg-white ${
          story.category === 'news' ? 'border-t border-gray-200' : ''
        }`}>
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className={`font-bold mb-8 ${
                story.category === 'news' ? 'text-xl text-blue-700' : 'text-2xl'
              }`}>
                {story.category === 'news' ? 'More News' : 'Related Stories'}
              </h2>
              <div className={`gap-6 ${
                story.category === 'news' 
                  ? 'grid md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid md:grid-cols-3'
              }`}>
                {relatedStories.map((relatedStory) => (
                  <div key={relatedStory.id} className={`card bg-base-100 transition-shadow ${
                    story.category === 'news' 
                      ? 'shadow-md hover:shadow-lg border border-gray-200' 
                      : 'shadow-xl hover:shadow-2xl'
                  }`}>
                    <figure className={story.category === 'news' ? 'aspect-[4/3]' : 'aspect-video'}>
                      <img 
                        src={relatedStory.imageUrl || relatedStory.image} 
                        alt={relatedStory.title} 
                        className="w-full h-full object-cover"
                      />
                    </figure>
                    <div className={`card-body ${
                      story.category === 'news' ? 'p-4' : ''
                    }`}>
                      <h3 className={`card-title ${
                        story.category === 'news' ? 'text-base' : 'text-lg'
                      }`}>{relatedStory.title}</h3>
                      <p className={`text-gray-700 line-clamp-3 ${
                        story.category === 'news' ? 'text-xs' : 'text-sm'
                      }`}>{relatedStory.excerpt}</p>
                      <div className={`flex items-center gap-2 text-gray-600 mt-2 ${
                        story.category === 'news' ? 'text-xs' : 'text-xs'
                      }`}>
                        <FiCalendar size={12} />
                        <span>{relatedStory.publishDate}</span>
                      </div>
                      <div className={`card-actions justify-end ${
                        story.category === 'news' ? 'mt-3' : 'mt-4'
                      }`}>
                        <Link to={`/stories/${relatedStory.id}`} className="btn btn-sm btn-ghost gap-1">
                          Read more <FiArrowLeft className="rotate-180" size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}