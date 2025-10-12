import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import MainLayout from '../components/layout/MainLayout';
import { FiHeart, FiUsers, FiGlobe, FiMail, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import { db } from '../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';


export default function Home() {
  // Dynamic carousel images from database
  const [carouselImages, setCarouselImages] = useState([]);

  // Carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // State for tooltip
  const [tooltip, setTooltip] = useState({
    visible: false,
    program: null,
    position: { left: 0, top: 0 },
    arrowClass: ''
  });

  // Ref for tooltip timeout
  const tooltipTimeoutRef = useRef(null);
  
  // Programs state
  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);
  
  // Stories state
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(true);
  
  // Quotes state
  const [currentQuote, setCurrentQuote] = useState(null);
  
  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Fetch quotes from Firebase
  const fetchQuotes = async () => {
    try {
      const quotesSnapshot = await getDocs(collection(db, 'quotes'));
      const quotesData = quotesSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(quote => quote.status === 'active' && (quote.location === 'homepage' || quote.location === 'general'));
      
      // Set a random quote or the first one
      if (quotesData.length > 0) {
        const randomQuote = quotesData[Math.floor(Math.random() * quotesData.length)];
        setCurrentQuote(randomQuote);
      } else {
        // Fallback quote if no quotes in database
        setCurrentQuote({
          content: 'The best way to find yourself is to lose yourself in the service of others.',
          author: 'Mahatma Gandhi'
        });
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      // Fallback quote on error
      setCurrentQuote({
        content: 'The best way to find yourself is to lose yourself in the service of others.',
        author: 'Mahatma Gandhi'
      });
    }
  };

  // Fetch carousel images from Firebase
  const fetchCarouselImages = async () => {
    try {
      const carouselSnapshot = await getDocs(collection(db, 'carousel'));
      const carouselData = carouselSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter active carousel items and sort by order
      const activeCarousel = carouselData
        .filter(item => item.status === 'active')
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(item => item.imageUrl)
        .filter(url => url); // Remove empty URLs
      
      // Only use network-fetched images from Firebase
      setCarouselImages(activeCarousel);
    } catch (error) {
      console.error('Error fetching carousel images:', error);
      // No fallback images - only use network-fetched images
      setCarouselImages([]);
    }
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
    setNewsletterSubmitting(true);
    try {
      // Save newsletter subscription to Firebase
      await addDoc(collection(db, 'newsletterSubscriptions'), {
        email: newsletterEmail.trim(),
        status: 'active',
        createdAt: serverTimestamp(),
        subscribedAt: new Date()
      });
      
      console.log('Newsletter subscription successful');
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      
      setTimeout(() => {
        setNewsletterSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      // You might want to show an error message to the user here
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  // Fetch programs and stories from Firebase
  useEffect(() => {
    const fetchPrograms = async () => {
      setProgramsLoading(true);
      try {
        const programsCollection = collection(db, 'programs');
        const programsSnapshot = await getDocs(programsCollection);
        const programsData = programsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate?.() || new Date()
        }));
        setPrograms(programsData.slice(0, 5)); // Show only first 5 programs
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setProgramsLoading(false);
      }
    };
    
    const fetchStories = async () => {
      setStoriesLoading(true);
      try {
        const storiesCollection = collection(db, 'stories');
        const storiesSnapshot = await getDocs(storiesCollection);
        const storiesData = storiesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date(),
          publishDate: doc.data().publishDate?.toDate?.() || doc.data().createdAt?.toDate?.() || new Date()
        }));
        // Sort by publish date and get latest 3 stories
        const sortedStories = storiesData.sort((a, b) => b.publishDate - a.publishDate);
        setStories(sortedStories.slice(0, 3));
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setStoriesLoading(false);
      }
    };

    fetchPrograms();
    fetchStories();
    fetchQuotes();
    fetchCarouselImages();
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (carouselImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Tooltip positioning function
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

  // Detect if device supports touch - more conservative approach
  const isTouchDevice = () => {
    // Only consider it a touch device if it's primarily touch-based (mobile/tablet)
    return (
      ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
      window.innerWidth < 1024 // Only treat as touch device if screen is smaller than desktop
    );
  };

  // Show tooltip
  const showTooltip = (program, triggerElement) => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    const position = calculateTooltipPosition(triggerElement);
    setTooltip({
      visible: true,
      program,
      position: { left: position.left, top: position.top },
      arrowClass: position.arrowClass
    });
  };

  // Hide tooltip
  const hideTooltip = () => {
    // Clear any existing timeout
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
      tooltipTimeoutRef.current = null;
    }
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  // Portal-based Tooltip Component
  const TooltipPortal = () => {
    if (!tooltip.visible || !tooltip.program) return null;

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
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
         )}
        
        <div className="flex items-start justify-between mb-6">
          <h5 className="text-xl md:text-2xl font-bold text-secondary">{tooltip.program.title}</h5>
          <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
            Active
          </span>
        </div>
        
        <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
          {tooltip.program.description}
        </p>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-500">Location:</span>
            <span className="font-semibold text-secondary">{tooltip.program.location}</span>
          </div>

        </div>
        
        <Link 
          to="/programs" 
          className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-white bg-primary hover:bg-primary/90 px-6 py-3 rounded-full transition-colors duration-300"
        >
          Learn More
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        </div>
      </>,
      document.body
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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

  return (
    <MainLayout>
      <Helmet>
        <title>Ronsen Hope - Transforming Lives Through Faith</title>
        <meta name="description" content="Ronsen Hope is dedicated to providing holistic care and support to vulnerable children, orphans, youths and elderly in Uganda through education, healthcare, and spiritual guidance." />
        <meta name="keywords" content="charity, NGO, nonprofit, community, education, children, orphans, Uganda, Christian foundation" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-100"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left text-white">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30"
              >
                <FiHeart className="text-primary" />
                <span className="text-sm font-medium">Creating Change Together</span>
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut"
                }}
                className="text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-lg"
              >
                Ronsen Hope - Transforming Lives Through Faith
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.05,
                  ease: "easeOut"
                }}
                className="text-md md:text-lg mb-10 text-white leading-relaxed max-w-3xl mx-auto lg:mx-0 drop-shadow-md"
              >
                Ronsen Hope is dedicated to providing holistic care and support to vulnerable children, orphans, youths and elderly in Uganda through education, healthcare, and spiritual guidance.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.15,
                  ease: "easeOut"
                }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto"
                >
                  <div dangerouslySetInnerHTML={{
                    __html: `
                      <a class="dbox-donation-button" style="background: rgb(249, 134, 33); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: flex; gap: 8px; width: fit-content; font-size: 16px; border-radius: 5px; line-height: 24px; padding: 8px 24px; border: 2px solid white;" href="https://paypal.me/RonsenHopeUgCanada"><img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="Donate with PayPal" style="height: 26px;" />Donate Now</a>
                    `
                  }} />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto"
                >
                  <Link to="/volunteer" className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm inline-flex items-center justify-center w-full sm:w-auto">
                    <FiUsers className="mr-2" />
                    Get Involved
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Only show carousel if there are network-fetched images */}
            {carouselImages.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 0.7, 
                  ease: "easeOut"
                }}
                className="relative h-[60vh] sm:h-[70vh] lg:h-[500px] min-h-[400px] w-full overflow-hidden rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm"
              >
                {/* Simple Image Carousel */}
                <div className="relative w-full h-full">
                  {carouselImages.map((image, index) => (
                    <motion.div
                      key={index}
                      className="absolute inset-0 w-full h-full"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: index === currentImageIndex ? 1 : 0,
                        scale: index === currentImageIndex ? 1 : 1.1
                      }}
                      transition={{ 
                        duration: 1,
                        ease: "easeInOut"
                      }}
                    >
                      <img
                        src={image}
                        alt={`Carousel image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </motion.div>
                  ))}
                  
                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white shadow-lg scale-110' 
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setCurrentImageIndex((prev) => 
                      prev === 0 ? carouselImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => setCurrentImageIndex((prev) => 
                      (prev + 1) % carouselImages.length
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32 bg-accent bg-mesh-gradient-2 bg-dot-pattern mt-[-1px]">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 apple-text tracking-tight">Our Mission</h2>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            ref={(el) => {
              if (el) {
                el.addEventListener('mousemove', (e) => {
                  const cards = el.querySelectorAll('.apple-card');
                  cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty('--x', `${x}%`);
                    card.style.setProperty('--y', `${y}%`);
                  });
                });
              }
            }}
          >
            <motion.div variants={itemVariants} className="apple-card">
              <div className="apple-card-body">
                <div className="apple-icon-container">
                  <FiHeart className="text-4xl text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4 apple-text tracking-tight">Our Mission</h2>
                <p className="apple-text opacity-80 leading-relaxed">To provide comprehensive support and resources to individuals and families affected by breast cancer, with a focus on emotional, educational, and practical assistance, to improve their quality of life and promote positive outcomes.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="apple-card">
              <div className="apple-card-body">
                <div className="apple-icon-container">
                  <FiUsers className="text-4xl text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4 apple-text tracking-tight">Our Community</h2>
                <p className="apple-text opacity-80 leading-relaxed">A diverse network of volunteers, donors, and partners working together to create meaningful and lasting positive change.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="apple-card">
              <div className="apple-card-body">
                <div className="apple-icon-container">
                  <FiGlobe className="text-4xl text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4 apple-text tracking-tight">Our Vision</h2>
                <p className="apple-text opacity-80 leading-relaxed">To be a safe space for women, men, caregivers, friends and more that are affected by the nightmare that is cancer. That the fear of the disease is dispelled, as one that can be effectively managed through comprehensive breast cancer support services and education, and that survivors can be inspired to live positive lives after diagnosis.  </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 md:py-32 bg-white bg-mesh-gradient-3 mt-[-1px]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-4 apple-text tracking-tight"
            >
              Our Programs
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg max-w-3xl mx-auto apple-text opacity-90"
            >
              We focus on sustainable futures beyond cancer.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative max-w-6xl mx-auto"
          >
            {/* Desktop Layout - Single Card with Diagonal Cut */}
            <div className="hidden md:block relative h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Our Programs" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
              </div>
              
              {/* Diagonal Cut Overlay with Programs List */}
               <div 
                  className="absolute inset-0 bg-white/95"
                  style={{
                    clipPath: 'polygon(45% 0%, 100% 0%, 100% 100%, 25% 100%)'
                  }}
                >
                  <div className="h-full flex flex-col justify-center py-12 max-w-full overflow-hidden" style={{ paddingLeft: '45%', paddingRight: '2rem' }}>
                    <motion.h3 
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-3xl font-bold mb-8 text-secondary"
                    >
                      Our Impact Areas
                    </motion.h3>
                    
                    {/* Twitter-style Programs List */}
                    <div className="flex flex-col lg:flex-row lg:flex-wrap gap-2 max-w-full">
                    {programsLoading ? (
                      <div className="flex justify-center items-center py-8 w-full">
                        <div className="text-center">
                          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="text-sm text-gray-600">Loading programs...</p>
                        </div>
                      </div>
                    ) : programs.length === 0 ? (
                      <div className="text-center py-8 w-full">
                        <p className="text-gray-600">No programs available</p>
                      </div>
                    ) : programs.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="relative group w-full lg:flex-shrink-0 lg:w-auto"
                        onMouseEnter={(e) => {
                          if (!isTouchDevice()) {
                            showTooltip(program, e.currentTarget);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isTouchDevice()) {
                            hideTooltip();
                          }
                        }}
                        onClick={(e) => {
                          if (isTouchDevice()) {
                            e.preventDefault();
                            if (tooltip.visible && tooltip.program?.id === program.id) {
                              hideTooltip();
                            } else {
                              showTooltip(program, e.currentTarget);
                              // Auto-hide after 5 seconds on touch devices
                              tooltipTimeoutRef.current = setTimeout(() => hideTooltip(), 5000);
                            }
                          } else {
                            // On non-touch devices, prevent click from interfering with hover
                            e.preventDefault();
                          }
                        }}
                      >
                        <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20 w-full">
                               <div className="flex items-center gap-2 min-w-0 flex-1">
                                 <div className="min-w-0 flex-1">
                                   <h4 className="font-semibold text-secondary group-hover:text-primary transition-colors text-sm truncate">
                                     {program.title}
                                   </h4>
                                   <p className="text-xs text-gray-600 truncate">{program.location}</p>
                                 </div>
                                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                   {Array.isArray(program.participants) ? program.participants.length.toLocaleString() : (program.participants || 0).toLocaleString()} participants
                                 </span>
                               </div>
                          
                          <div className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* View All Programs Link */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-8 pt-6 border-t border-gray-200"
                  >
                    <Link 
                      to="/programs" 
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      View all programs
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
              
              {/* Left side content overlay */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white z-10" style={{ maxWidth: '40%' }}>
                <motion.h3 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg"
                >
                  Creating Change
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base  md:text-lg opacity-90 drop-shadow-md leading-relaxed"
                >
                  Discover our comprehensive programs designed to create lasting positive impact in communities through improve in  education, health care, Patient support survivorship and advocacy.
                </motion.p>
              </div>
            </div>
            
            {/* Mobile Layout - Flex Column with Image on Top */}
            <div className="md:hidden flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Image Section */}
              <div className="relative h-64">
                <img 
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                  alt="Our Programs" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent"></div>
                
                {/* Mobile Header Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-6">
                  <motion.h3 
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-2xl font-bold mb-2 drop-shadow-lg"
                  >
                    Creating Change
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm opacity-90 drop-shadow-md leading-relaxed"
                  >
                    Discover our comprehensive programs
                  </motion.p>
                </div>
              </div>
              
              {/* Programs Section */}
              <div className="p-6">
                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-2xl font-bold mb-6 text-secondary"
                >
                  Our Impact Areas
                </motion.h3>
                
                {/* Mobile Programs List */}
                <div className="flex flex-col gap-2">
                {programsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs text-gray-600">Loading programs...</p>
                    </div>
                  </div>
                ) : programs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-gray-600">No programs available</p>
                  </div>
                ) : programs.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="relative group w-full"
                    onMouseEnter={(e) => {
                      if (!isTouchDevice()) {
                        showTooltip(program, e.currentTarget);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isTouchDevice()) {
                        hideTooltip();
                      }
                    }}
                    onClick={(e) => {
                      if (isTouchDevice()) {
                        e.preventDefault();
                        if (tooltip.visible && tooltip.program?.id === program.id) {
                          hideTooltip();
                        } else {
                          showTooltip(program, e.currentTarget);
                          // Auto-hide after 5 seconds on touch devices
                          tooltipTimeoutRef.current = setTimeout(() => hideTooltip(), 5000);
                        }
                      } else {
                        // On non-touch devices, prevent click from interfering with hover
                        e.preventDefault();
                      }
                    }}
                  >
                    <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 cursor-pointer border border-transparent hover:border-primary/20 w-full">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-secondary group-hover:text-primary transition-colors text-sm">
                            {program.title}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">{program.location}</p>
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {Array.isArray(program.participants) ? program.participants.length.toLocaleString() : (program.participants || 0).toLocaleString()} participants
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                </div>
                
                {/* Mobile View All Programs Link */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-6 pt-4 border-t border-gray-200"
                >
                  <Link 
                    to="/programs" 
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    View all programs
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-20 md:py-32 bg-accent bg-mesh-gradient-1 bg-dot-pattern mt-[-1px]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-6 md:mb-0 apple-text tracking-tight"
            >
              Latest Stories
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Link to="/stories" className="apple-button">
                View All Stories
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
            ref={(el) => {
              if (el) {
                el.addEventListener('mousemove', (e) => {
                  const cards = el.querySelectorAll('.apple-blog-card');
                  cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty('--x', `${x}%`);
                    card.style.setProperty('--y', `${y}%`);
                  });
                });
              }
            }}
          >
            {storiesLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div key={index} variants={itemVariants} className="apple-blog-card">
                  <div className="apple-blog-image">
                    <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                  </div>
                  <div className="apple-blog-content">
                    <div className="h-4 bg-gray-200 animate-pulse mb-2 w-24"></div>
                    <div className="h-6 bg-gray-200 animate-pulse mb-3 w-3/4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse mb-6 w-full"></div>
                    <div className="h-10 bg-gray-200 animate-pulse w-32"></div>
                  </div>
                </motion.div>
              ))
            ) : stories.length > 0 ? (
              stories.map((story) => (
                <motion.div key={story.id} variants={itemVariants} className="apple-blog-card">
                  <div className="apple-blog-image">
                    <img 
                      src={story.imageUrl || story.image || `https://source.unsplash.com/random/600x400/?${story.category || 'charity'}`} 
                      alt={story.title} 
                      loading="eager" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    {story.category && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                          {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="apple-blog-content">
                    <div className="apple-date">
                      {story.publishDate ? story.publishDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Recent'}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 apple-text tracking-tight">{story.title}</h3>
                    <p className="apple-text opacity-80 leading-relaxed mb-6">{story.excerpt}</p>
                    <Link to={`/stories/${story.id}`} className="apple-link-button">
                      Read Story
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              // No stories fallback
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No stories available at the moment.</p>
                <Link to="/stories" className="apple-button mt-4 inline-block">
                  Check Back Later
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Our Impact Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white text-secondary mt-[-1px]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-4 text-gray-800 font-serif"
            >
              Our Impact
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-lg max-w-3xl mx-auto text-gray-600 leading-relaxed"
              >
                See how our volunteers and supporters are making a difference around the world
              </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Larger Video Section - Takes 2/3 of the space */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-2"
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl bg-white border border-gray-200">
                 <div className="relative h-64 md:h-80 lg:h-[500px]">
                   <iframe 
                     className="w-full h-full" 
                     src="https://www.youtube.com/embed/dE-LPR7robw" 
                     title="Community Impact Video"
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                 </div>
               </div>
            </motion.div>
            
            {/* Classic Content Side - Takes 1/3 of the space */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 font-serif">Building Stronger Communities</h3>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-sm">
                    Our goal is to create a safe space for women, men, caregivers, friends, and more who are affected by the nightmare that is cancer. We do what we can to help, bring awareness, and be an emotional support while making the lives of those affected by it a little easier.
                  </p>
                  </div>
               </div>
             </motion.div>
           </div>
           

         </div>
       </section>

      {/* Inspirational Quote Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-orange-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {currentQuote ? (
              <div className="relative">
                <div className="absolute -top-8 -left-8 text-8xl text-primary font-serif opacity-50">"</div>
                <blockquote className="text-3xl md:text-4xl font-light text-gray-800 leading-relaxed mb-8 italic">
                  {currentQuote.content}
                </blockquote>
                <div className="absolute -bottom-8 -right-8 text-8xl text-primary font-serif opacity-50">"</div>
                <cite className="text-xl text-primary font-semibold not-italic">
                  {currentQuote.author ? `- ${currentQuote.author}` : ''}
                </cite>
                {currentQuote.context && (
                  <p className="text-sm text-gray-500 mt-2 italic">{currentQuote.context}</p>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Working together with amazing organizations to create lasting impact.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
          >
            {[
              { name: 'CAO', logo: '/partners/CAO.jpg' },
              { name: 'CC', logo: '/partners/CC.jpg' },
              { name: 'CISSU', logo: '/partners/CISSU.jpg' },
              { name: 'Golden Tulip', logo: '/partners/Golden Tulip.jpg' },
              { name: 'Nama', logo: '/partners/Nama.jpg' },
              { name: 'Oakwood', logo: '/partners/Oakwood.jpg' },
              { name: 'TWICE', logo: '/partners/TWICE.jpg' },
              { name: 'UWACASO', logo: '/partners/UWACASO.jpg' }
            ].map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Follow Our Journey</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay connected with us on social media for updates, stories, and ways to get involved.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center space-x-6"
          >
            {[
              { icon: FiFacebook, name: 'Facebook', color: 'hover:bg-blue-600', link: 'https://www.facebook.com/100082882375342' },
              { icon: FiTwitter, name: 'Twitter', color: 'hover:bg-blue-400', link: 'https://twitter.com/RonsenHopeUg' },
              { icon: FiInstagram, name: 'Instagram', color: 'hover:bg-primary', link: 'https://www.instagram.com/ronsenhopefoundation/' },
              { icon: FiLinkedin, name: 'LinkedIn', color: 'hover:bg-blue-700', link: 'https://www.linkedin.com/company/lumps-away-foundatin/?viewAsMember=true' },
              { icon: FiYoutube, name: 'YouTube', color: 'hover:bg-red-600', link: 'https://www.youtube.com/@Ronsenministry' },
              { icon: SiTiktok, name: 'TikTok', color: 'hover:bg-black', link: 'https://tiktok.com/@ronsenministry' }
            ].map((social, index) => (
              <motion.a
                key={social.name}
                href={social.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className={`w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${social.color} hover:text-white group`}
              >
                <social.icon className="text-xl text-gray-600 group-hover:text-white transition-colors duration-300" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-orange-600">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto text-white"
          >
            <div className="mb-8">
              <FiMail className="text-5xl mx-auto mb-6 text-white/90" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Stay Updated</h2>
              <p className="text-xl text-white/90 leading-relaxed">
                Subscribe to our newsletter and be the first to know about our latest projects, success stories, and ways to make a difference.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              {newsletterSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiMail className="text-2xl text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
                    <p className="text-white/90">
                      You've successfully subscribed to our newsletter. We'll keep you updated with our latest news and stories.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      required
                      disabled={newsletterSubmitting}
                      className="flex-1 px-6 py-4 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 disabled:opacity-50"
                    />
                    <button 
                      type="submit"
                      disabled={newsletterSubmitting || !newsletterEmail.trim()}
                      className="px-8 py-4 bg-white text-primary rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:bg-white"
                    >
                      {newsletterSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  <p className="text-sm text-white/70 mt-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 md:py-36 bg-white text-secondary bg-mesh-gradient-3 bg-dot-pattern mt-[-1px]">
        <div className="container-custom text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold mb-8 apple-text tracking-tight"
          >
            Join Our Community
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto apple-text opacity-90 leading-relaxed"
          >
We’d like to be a place for all affected by the nightmare that is cancer – patients, survivors and families. Share, Laugh, Give tips to help others.          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="inline-block apple-focus"
            ref={(el) => {
              if (el) {
                el.addEventListener('mousemove', (e) => {
                  const rect = el.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  el.style.setProperty('--x', `${x}%`);
                  el.style.setProperty('--y', `${y}%`);
                });
              }
            }}
          >
            <Link to="/forum" className="apple-button text-lg px-10 py-4 inline-block">
              Join the Conversation
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Portal-based Tooltip */}
      <TooltipPortal />
    </MainLayout>
  );
}