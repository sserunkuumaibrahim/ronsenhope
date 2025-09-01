import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import MainLayout from '../components/layout/MainLayout';
import { FiCamera, FiHeart, FiUsers, FiCalendar, FiMapPin, FiX } from 'react-icons/fi';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export default function Gallery() {
  // State for tooltip
  const [tooltip, setTooltip] = useState({
    visible: false,
    image: null,
    position: { left: 0, top: 0 },
    arrowClass: ''
  });
  
  // State for gallery data
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Ref for tooltip timeout
  const tooltipTimeoutRef = useRef(null);
  
  // Ref for grid container
  const gridRef = useRef(null);
  
  // Fetch photos from Firebase
  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const photosCollection = collection(db, 'gallery');
        const photosSnapshot = await getDocs(photosCollection);
        
        // Log raw data from Firestore
        console.log('Raw Firestore data:', photosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const photosData = photosSnapshot.docs.map(doc => {
          // Get the data with proper date conversion
          const data = doc.data();
          console.log(`Processing photo ${doc.id}:`, data);
          
          // Check for missing imageUrl
          if (!data.imageUrl) {
            console.error(`Photo ${doc.id} is missing imageUrl:`, data);
          }
          
          // Ensure we have proper date conversion
          const uploadDate = data.uploadDate?.toDate ? data.uploadDate.toDate() : new Date(data.uploadDate || Date.now());
          // Ensure tags is always an array
          const tags = Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []);
          
          return {
            id: doc.id,
            ...data,
            uploadDate,
            tags,
            // Provide a fallback for imageUrl
            imageUrl: data.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'
          };
        });
        
        console.log('Processed photos data:', photosData); // Debug log
        setPhotos(photosData);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);
  
  // Group photos by category
  const groupedPhotos = photos.reduce((acc, photo) => {
    const category = photo.category || 'community';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(photo);
    return acc;
  }, {});
  
  // Filter photos based on selected category
  console.log('Photos before filtering:', photos);
  const filteredPhotos = selectedCategory === 'all' ? photos : photos.filter(photo => photo.category === selectedCategory);
  console.log('Filtered photos after category selection:', filteredPhotos);
  
  // Get unique categories
  const categories = ['all', ...new Set(photos.map(photo => photo.category || 'community'))];

  // Category display configuration
  const categoryConfig = {
    all: { title: 'All Photos', description: 'Browse all our gallery photos' },
    community: { title: 'Community', description: 'Community events and gatherings' },
    water: { title: 'Water Projects', description: 'Clean water initiatives' },
    education: { title: 'Education', description: 'Educational programs and workshops' },
    healthcare: { title: 'Healthcare', description: 'Health awareness and medical support' },
    relief: { title: 'Relief Efforts', description: 'Emergency and disaster relief' },
    training: { title: 'Training', description: 'Volunteer and skills training' },
    environment: { title: 'Environment', description: 'Environmental conservation projects' },
    housing: { title: 'Housing', description: 'Housing and shelter initiatives' }
  };
  
  // Get category info
  const getCategoryInfo = (category) => {
    return categoryConfig[category] || { title: category, description: '' };
  };
  
  // Handle image load for better performance
  const handleImageLoad = () => {
    // Optional: Add any image load handling here
  };

  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Tooltip positioning function (same as Home page)
  const calculateTooltipPosition = (triggerElement) => {
    const rect = triggerElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Responsive tooltip width based on viewport
    let tooltipWidth;
    if (viewportWidth < 768) { // mobile
      tooltipWidth = Math.min(320, viewportWidth - 40); // w-80 with 20px margin on each side
    } else if (viewportWidth < 1024) { // tablet
      tooltipWidth = 384; // w-96
    } else { // desktop
      tooltipWidth = 448; // w-[28rem]
    }
    
    const tooltipHeight = 400; // approximate height
    const margin = 20;
    
    let left, top, arrowClass;
    
    // On mobile, prefer bottom or top positioning for better UX
    if (viewportWidth < 768) {
      // Check if tooltip fits on the bottom
      if (rect.bottom + tooltipHeight + margin <= viewportHeight) {
        left = Math.max(margin, Math.min(rect.left + rect.width/2 - tooltipWidth/2, viewportWidth - tooltipWidth - margin));
        top = rect.bottom + margin;
        arrowClass = "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white";
      }
      // Default to top for mobile
      else {
        left = Math.max(margin, Math.min(rect.left + rect.width/2 - tooltipWidth/2, viewportWidth - tooltipWidth - margin));
        top = Math.max(margin, rect.top - tooltipHeight - margin);
        arrowClass = "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white";
      }
    } else {
      // Desktop/tablet logic - prefer right/left positioning
      // Check if tooltip fits on the right
      if (rect.right + tooltipWidth + margin <= viewportWidth) {
        left = rect.right + margin;
        top = Math.max(margin, Math.min(rect.top + rect.height/2 - tooltipHeight/2, viewportHeight - tooltipHeight - margin));
        arrowClass = "absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white";
      }
      // Check if tooltip fits on the left
      else if (rect.left - tooltipWidth - margin >= 0) {
        left = rect.left - tooltipWidth - margin;
        top = Math.max(margin, Math.min(rect.top + rect.height/2 - tooltipHeight/2, viewportHeight - tooltipHeight - margin));
        arrowClass = "absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white";
      }
      // Check if tooltip fits on the bottom
      else if (rect.bottom + tooltipHeight + margin <= viewportHeight) {
        left = Math.max(margin, Math.min(rect.left + rect.width/2 - tooltipWidth/2, viewportWidth - tooltipWidth - margin));
        top = rect.bottom + margin;
        arrowClass = "absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white";
      }
      // Default to top
      else {
        left = Math.max(margin, Math.min(rect.left + rect.width/2 - tooltipWidth/2, viewportWidth - tooltipWidth - margin));
        top = Math.max(margin, rect.top - tooltipHeight - margin);
        arrowClass = "absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white";
      }
    }
    
    return { left, top, arrowClass };
  };

  // Detect if device supports touch
  const isTouchDevice = () => {
    return (
      ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth < 1024
    );
  };

  // Show tooltip
  const showTooltip = (image, triggerElement) => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    const position = calculateTooltipPosition(triggerElement);
    setTooltip({
      visible: true,
      image,
      position: { left: position.left, top: position.top },
      arrowClass: position.arrowClass
    });
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Portal-based Tooltip Component
  const TooltipPortal = () => {
    if (!tooltip.visible || !tooltip.image) return null;

    return createPortal(
      <>
        {/* Mobile backdrop for click-to-dismiss */}
        {isTouchDevice() && window.innerWidth < 768 && (
          <div 
            className="fixed inset-0 bg-black/20"
            style={{ zIndex: 9999 }}
            onClick={hideTooltip}
            onTouchEnd={hideTooltip}
          />
        )}
        
        <div 
          className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-6 md:p-8 transition-opacity duration-300 pointer-events-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          style={{
            left: tooltip.position.left,
            top: tooltip.position.top,
            zIndex: 10000,
            opacity: tooltip.visible ? 1 : 0,
            width: window.innerWidth < 768 ? `${Math.min(320, window.innerWidth - 40)}px` : 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={tooltip.arrowClass}></div>
          
          {/* Close button for mobile */}
          {isTouchDevice() && window.innerWidth < 768 && (
            <button
              onClick={hideTooltip}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close tooltip"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-start justify-between mb-4">
            <h5 className="text-xl md:text-2xl font-bold text-secondary pr-4">{tooltip.image.title}</h5>
            <div className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
              <FiCamera className="text-xs" />
              Photo
            </div>
          </div>
          
          <p className="text-base md:text-lg text-gray-600 mb-4 leading-relaxed">
            {tooltip.image.description}
          </p>
          
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="flex items-center justify-between text-sm md:text-base">
              <span className="flex items-center gap-2 text-gray-500">
                <FiCalendar className="text-primary" />
                Date:
              </span>
              <span className="font-medium text-gray-700">{tooltip.image.date}</span>
            </div>
            <div className="flex items-center justify-between text-sm md:text-base">
              <span className="flex items-center gap-2 text-gray-500">
                <FiMapPin className="text-primary" />
                Location:
              </span>
              <span className="font-medium text-gray-700">{tooltip.image.location}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
            <FiHeart className="text-red-500" />
            <span>Part of our community impact initiatives</span>
          </div>
        </div>
      </>,
      document.body
    );
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Gallery - Lumps Away Foundation</title>
        <meta name="description" content="Photo gallery showcasing our charitable work and community impact." />
      </Helmet>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .masonry-grid {
            columns: 1;
            column-gap: 24px;
            width: 100%;
          }
          
          .gallery-item {
            break-inside: avoid;
            margin-bottom: 24px;
            display: inline-block;
            width: 100%;
          }
          
          @media (min-width: 640px) {
            .masonry-grid {
              columns: 2;
            }
          }
          
          @media (min-width: 1024px) {
            .masonry-grid {
              columns: 3;
            }
          }
          
          @media (min-width: 1280px) {
            .masonry-grid {
              columns: 4;
            }
          }
          
          @media (min-width: 1536px) {
            .masonry-grid {
              columns: 5;
            }
          }
        `
      }} />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto text-white"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30"
            >
              <FiCamera className="text-pink-200" />
              <span className="text-sm font-medium">Visual Stories of Impact</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Our Gallery
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
              Capturing moments of hope, healing, and community impact through our visual journey of transformation.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <button 
                className="group relative px-8 py-4 bg-white text-pink-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  document.getElementById('gallery-content').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10">Explore Gallery</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">Explore Gallery</span>
              </button>
              <button 
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300 backdrop-blur-sm"
                onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
              >
                Contact Us
              </button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Community gallery moments" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Gallery Content */}
      <div id="gallery-content" className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 md:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {/* Gallery Content */}
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Our Visual Journey
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Explore moments of impact, community stories, and the transformative work we do together.
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => {
                const categoryInfo = getCategoryInfo(category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-primary/30'
                    }`}
                  >
                    {categoryInfo.title}
                  </button>
                );
              })}
            </div>
            
            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading gallery...</p>
              </div>
            )}
            
            {/* Empty State */}
            {!loading && filteredPhotos.length === 0 && (
              <div className="text-center py-20">
                <FiCamera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No photos found</h3>
                <p className="text-gray-500">There are no photos in this category yet.</p>
              </div>
            )}

            {/* CSS Masonry Grid for all items */}
             {!loading && filteredPhotos.length > 0 && (
               <div ref={gridRef} className="masonry-grid">
                 {/* Display photos from Firebase */}
                 {console.log('Rendering filteredPhotos:', filteredPhotos)}
                 {filteredPhotos.map((photo, index) => {
                    // Check if photo has valid data
                    if (!photo || !photo.id) {
                      console.error('Invalid photo object:', photo);
                      return null;
                    }
                    
                    return (
                      <motion.div
                        key={photo.id}
                        variants={itemVariants}
                        className="gallery-item group relative"
                        onMouseEnter={(e) => {
                          if (!isTouchDevice()) {
                            showTooltip(photo, e.currentTarget);
                          }
                        }}
                      >
                       <div className="absolute inset-0 bg-pink-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
                       <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                       onMouseLeave={() => {
                         if (!isTouchDevice()) {
                           hideTooltip();
                         }
                       }}
                       onClick={(e) => {
                         if (isTouchDevice()) {
                           e.preventDefault();
                           showTooltip(photo, e.currentTarget);
                         }
                       }}
                     >
                       <div className="relative overflow-hidden">
                         <img
                           src={photo.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                           alt={photo.title || 'Gallery image'}
                           className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                           loading="lazy"
                           onLoad={handleImageLoad}
                           onError={(e) => {
                             console.error('Image failed to load:', photo.imageUrl);
                             e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                             e.target.onerror = null; // Prevent infinite error loop
                           }}
                           style={{
                             aspectRatio: 'auto',
                             minHeight: '200px',
                             maxHeight: '500px'
                           }}
                         />
                         
                         {/* Image overlay */}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                         
                         {/* Image info overlay */}
                         <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                           <h3 className="font-semibold text-sm mb-1 line-clamp-1">{photo.title}</h3>
                           <p className="text-xs text-white/80 line-clamp-2">{photo.description}</p>
                         </div>
                         
                         {/* Hover indicator */}
                         <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <FiCamera className="text-white text-sm" />
                         </div>
                       </div>
                       
                       {/* Card content below image */}
                       <div className="p-4">
                         <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{photo.title}</h3>
                         <p className="text-sm text-gray-600 mb-3 line-clamp-3">{photo.description}</p>
                         <div className="flex items-center justify-between text-xs text-gray-500">
                           <div className="flex items-center gap-1">
                             <FiCalendar className="text-primary" />
                             <span>{photo.uploadDate ? photo.uploadDate.toLocaleDateString() : 'N/A'}</span>
                           </div>
                           <div className="flex items-center gap-1">
                             <FiMapPin className="text-primary" />
                             <span className="truncate max-w-20">{photo.location || 'N/A'}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                     </motion.div>
                   );
                  })}
                </div>
             )}
             </motion.div>
        </div>
      </div>

      {/* Tooltip Portal */}
      <TooltipPortal />
    </MainLayout>
  );
}