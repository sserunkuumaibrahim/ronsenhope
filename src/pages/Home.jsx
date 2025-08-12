import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import MainLayout from '../components/layout/MainLayout';
import { FiHeart, FiUsers, FiGlobe } from 'react-icons/fi';


export default function Home() {
  // Carousel images
  const carouselImages = [
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&h=600&fit=crop&crop=center'
  ];

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

  // Autoplay functionality
  useEffect(() => {
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
            <span className="text-gray-500">Locations:</span>
            <span className="font-semibold text-secondary">{tooltip.program.stats.locations}</span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-500">Impact:</span>
            <span className="font-semibold text-primary">{tooltip.program.stats.impact}</span>
          </div>
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-500">Investment:</span>
            <span className="font-semibold text-secondary">{tooltip.program.stats.budget}</span>
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
        <title>Charity NGO - Making a Difference</title>
        <meta name="description" content="We are a charity NGO dedicated to making a positive impact through community engagement, education, and sustainable development." />
        <meta name="keywords" content="charity, NGO, nonprofit, community, education, sustainability" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-accent text-secondary py-16 md:py-24 bg-mesh-gradient-1 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Dotted thread pattern */}
          <svg 
            className="absolute inset-0 w-full h-full opacity-20" 
            viewBox="0 0 800 600" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M50 100 Q200 50 350 120 T650 80" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="8,12"
            />
            <path 
              d="M100 200 Q300 150 500 220 T750 180" 
              stroke="rgba(255,255,255,0.25)" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="6,10"
            />
            <path 
              d="M0 300 Q150 250 300 320 T600 280" 
              stroke="rgba(255,255,255,0.2)" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="6,10"
            />
            <path 
              d="M150 400 Q350 350 550 420 T800 380" 
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="8,12"
            />
            <circle cx="120" cy="80" r="2" fill="rgba(255,255,255,0.15)"/>
            <circle cx="280" cy="160" r="1.5" fill="rgba(255,255,255,0.12)"/>
            <circle cx="450" cy="240" r="2" fill="rgba(255,255,255,0.15)"/>
            <circle cx="620" cy="320" r="1.5" fill="rgba(255,255,255,0.12)"/>
            <circle cx="180" cy="440" r="2" fill="rgba(255,255,255,0.15)"/>
            <circle cx="520" cy="520" r="1.5" fill="rgba(255,255,255,0.12)"/>
          </svg>
          
          {/* Paper doves */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ 
              opacity: [0.4, 0.6, 0.4],
              x: [-50, -30, -50],
              y: [20, 10, 20]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-24 h-16"
          >
            <svg 
              className="w-full h-full" 
              viewBox="0 0 120 80" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="60" cy="45" rx="25" ry="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <circle cx="45" cy="35" r="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <path d="M37 35 L32 33 L37 37 Z" fill="rgba(255,255,255,0.06)"/>
              <path d="M50 40 Q70 25 95 35 Q85 45 70 50 Q60 45 50 40 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <path d="M55 45 Q75 30 100 40 Q90 50 75 55 Q65 50 55 45 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <path d="M85 50 Q95 55 105 45 Q100 60 90 55 Q85 52 85 50 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <circle cx="42" cy="32" r="1.5" fill="rgba(255,255,255,0.1)"/>
            </svg>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              x: [100, 80, 100],
              y: [-20, -30, -20]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-32 right-20 w-20 h-14"
            style={{ transform: 'scaleX(-1)' }}
          >
            <svg 
              className="w-full h-full" 
              viewBox="0 0 120 80" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="60" cy="45" rx="25" ry="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <circle cx="45" cy="35" r="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <path d="M37 35 L32 33 L37 37 Z" fill="rgba(255,255,255,0.06)"/>
              <path d="M50 40 Q70 25 95 35 Q85 45 70 50 Q60 45 50 40 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <path d="M55 45 Q75 30 100 40 Q90 50 75 55 Q65 50 55 45 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <path d="M85 50 Q95 55 105 45 Q100 60 90 55 Q85 52 85 50 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <circle cx="42" cy="32" r="1.5" fill="rgba(255,255,255,0.1)"/>
            </svg>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50, y: 50 }}
            animate={{ 
              opacity: [0.2, 0.4, 0.2],
              x: [50, 70, 50],
              y: [50, 40, 50]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
            className="absolute bottom-40 left-1/3 w-16 h-12"
          >
            <svg 
              className="w-full h-full" 
              viewBox="0 0 120 80" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="60" cy="45" rx="25" ry="15" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <circle cx="45" cy="35" r="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <path d="M37 35 L32 33 L37 37 Z" fill="rgba(255,255,255,0.06)"/>
              <path d="M50 40 Q70 25 95 35 Q85 45 70 50 Q60 45 50 40 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <path d="M55 45 Q75 30 100 40 Q90 50 75 55 Q65 50 55 45 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <path d="M85 50 Q95 55 105 45 Q100 60 90 55 Q85 52 85 50 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
              <circle cx="42" cy="32" r="1.5" fill="rgba(255,255,255,0.1)"/>
            </svg>
          </motion.div>
        </div>
        
        <div className="container-custom max-w-screen-2xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left text-secondary">
              <motion.h1 
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  ease: "easeOut"
                }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Making a Difference Together
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.05,
                  ease: "easeOut"
                }}
                className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto lg:mx-0"
              >
                Join us in our mission to create positive change through community engagement, education, and sustainable development.
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
                  <Link to="/donate" className="btn btn-lg bg-primary text-accent hover:opacity-80 w-full sm:w-auto">
                    Donate Now
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="w-full sm:w-auto"
                >
                  <Link to="/volunteer" className="btn btn-lg btn-outline border-primary text-primary hover:bg-primary hover:text-accent w-full sm:w-auto">
                    Volunteer
                  </Link>
                </motion.div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ 
                duration: 0.7, 
                ease: "easeOut"
              }}
              className="relative h-[60vh] sm:h-[70vh] lg:h-[500px] w-full overflow-hidden"
            >
              {/* Grid Layer with Image in Each Div */}
              {(() => {
                // Responsive grid configuration
                const getGridConfig = () => {
                  if (typeof window !== 'undefined') {
                    const width = window.innerWidth;
                    if (width < 640) return { cols: 15, rows: 12 }; // Mobile: 180 pieces
                    if (width < 768) return { cols: 20, rows: 15 }; // Tablet: 300 pieces
                    if (width < 1024) return { cols: 25, rows: 18 }; // Small desktop: 450 pieces
                    return { cols: 30, rows: 20 }; // Large desktop: 600 pieces
                  }
                  return { cols: 25, rows: 18 }; // Default fallback
                };
                
                const { cols: gridCols, rows: gridRows } = getGridConfig();
                const totalPieces = gridCols * gridRows;
                
                // Create grid with image pieces
                const imageGrid = (
                  <div 
                    className="absolute inset-0 w-full h-full grid gap-0"
                    style={{
                      gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                      gridTemplateRows: `repeat(${gridRows}, 1fr)`,
                      backgroundColor: 'transparent',
                      padding: '1px',
                    }}
                  >
                    {Array.from({ length: totalPieces }, (_, i) => {
                      const col = i % gridCols;
                      const row = Math.floor(i / gridCols);
                      
                      // Calculate the exact portion of the image this piece should show
                      const imageOffsetX = -(col * (100 / gridCols));
                      const imageOffsetY = -(row * (100 / gridRows));
                      
                      // Calculate random wind-blown entrance animation
                      const randomDelay = Math.random() * 2; // 0-2 seconds delay
                      const randomRotation = (Math.random() - 0.5) * 360; // -180 to 180 degrees
                      const randomX = (Math.random() - 0.5) * 200; // -100 to 100px
                      const randomY = (Math.random() - 0.5) * 200; // -100 to 100px
                      const randomScale = 0.3 + Math.random() * 0.4; // 0.3 to 0.7 scale

                      return (
                        <motion.div
                          key={i}
                          initial={{
                            opacity: 0,
                            scale: randomScale,
                            rotate: randomRotation,
                            x: randomX,
                            y: randomY,
                            filter: "blur(5px)"
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            rotate: [0, Math.sin(i * 0.1) * 2, 0], // Gentle rotation based on position
                            x: [0, Math.sin(i * 0.05) * 1, 0], // Subtle horizontal float
                            y: [0, Math.cos(i * 0.07) * 1, 0], // Subtle vertical float
                            filter: "blur(0px)"
                          }}
                          transition={{
                            duration: 1.5 + Math.random() * 1, // Initial entrance
                            delay: randomDelay,
                            ease: [0.25, 0.46, 0.45, 0.94],
                            type: "spring",
                            stiffness: 60 + Math.random() * 40,
                            damping: 15 + Math.random() * 10,
                            // Continuous floating animation
                            rotate: {
                              duration: 4 + Math.random() * 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            },
                            x: {
                              duration: 3 + Math.random() * 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            },
                            y: {
                              duration: 3.5 + Math.random() * 2,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }
                          }}
                          whileHover={{
                            scale: 1.08,
                            rotate: Math.random() * 15 - 7.5, // -7.5 to 7.5 degrees
                            transition: { duration: 0.3 }
                          }}
                          className="border border-white rounded-md overflow-hidden relative shadow-sm"
                          style={{
                            gridColumn: col + 1,
                            gridRow: row + 1,
                            backgroundColor: 'white',
                          }}
                        >
                          <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
                            style={{
                              backgroundImage: `url(${carouselImages[currentImageIndex]})`,
                              backgroundPosition: `${(col / (gridCols - 1)) * 100}% ${(row / (gridRows - 1)) * 100}%`,
                              backgroundSize: `${gridCols * 100}% ${gridRows * 100}%`,
                            }}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                );
                
                return imageGrid;
              })()}
            </motion.div>
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
            <p className="text-lg max-w-3xl mx-auto apple-text opacity-90">We're committed to creating meaningful change through these core principles</p>
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
                <p className="apple-text opacity-80 leading-relaxed">To empower communities through sustainable development initiatives that address critical social, economic, and environmental challenges.</p>
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
                <h2 className="text-2xl font-bold mb-4 apple-text tracking-tight">Our Impact</h2>
                <p className="apple-text opacity-80 leading-relaxed">Measurable improvements in education, healthcare, environmental sustainability, and community development worldwide.</p>
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
              We focus on sustainable development through these key program areas
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
                    {[
                      {
                        id: 1,
                        title: "🎓 Education",
                        subtitle: "Quality learning for all",
                        followers: "12K+ beneficiaries",
                        description: "Providing access to quality education and learning resources for underserved communities. Building schools, training teachers, and implementing digital learning solutions.",
                        stats: { locations: "25 countries", impact: "95% literacy rate", budget: "$2.5M invested" }
                      },
                      {
                        id: 2,
                        title: "🏥 Healthcare",
                        subtitle: "Medical care & wellness",
                        followers: "8.5K+ patients",
                        description: "Mobile clinics and healthcare services for remote communities. Training local healthcare workers and providing essential medical equipment.",
                        stats: { locations: "18 countries", impact: "80% health improvement", budget: "$1.8M invested" }
                      },
                      {
                        id: 3,
                        title: "🌱 Environment",
                        subtitle: "Sustainable future",
                        followers: "50K+ trees planted",
                        description: "Reforestation projects, clean energy initiatives, and waste management systems. Creating sustainable solutions for environmental challenges.",
                        stats: { locations: "30 countries", impact: "2M trees planted", budget: "$3.2M invested" }
                      },
                      {
                        id: 4,
                        title: "👥 Community",
                        subtitle: "Building stronger societies",
                        followers: "25K+ families",
                        description: "Infrastructure development, economic opportunities, and social programs. Empowering communities through sustainable development initiatives.",
                        stats: { locations: "22 countries", impact: "85% employment rate", budget: "$4.1M invested" }
                      },
                      {
                        id: 5,
                        title: "🚨 Emergency Relief",
                        subtitle: "Rapid response support",
                        followers: "15K+ rescued",
                        description: "Immediate disaster response and long-term recovery support. Providing emergency supplies, shelter, and rebuilding assistance.",
                        stats: { locations: "Global", impact: "72 hours response time", budget: "$2.8M emergency fund" }
                      }
                    ].map((program, index) => (
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
                                   <p className="text-xs text-gray-600 truncate">{program.subtitle}</p>
                                 </div>
                                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                                   {program.followers}
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
                  className="text-base md:text-lg opacity-90 drop-shadow-md leading-relaxed"
                >
                  Discover our comprehensive programs designed to create lasting positive impact in communities worldwide.
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
                {[
                  {
                    id: 1,
                    title: "🎓 Education",
                    subtitle: "Quality learning for all",
                    followers: "12K+ beneficiaries",
                    description: "Providing access to quality education and learning resources for underserved communities. Building schools, training teachers, and implementing digital learning solutions.",
                    stats: { locations: "25 countries", impact: "95% literacy rate", budget: "$2.5M invested" }
                  },
                  {
                    id: 2,
                    title: "🏥 Healthcare",
                    subtitle: "Medical care & wellness",
                    followers: "8.5K+ patients",
                    description: "Mobile clinics and healthcare services for remote communities. Training local healthcare workers and providing essential medical equipment.",
                    stats: { locations: "18 countries", impact: "80% health improvement", budget: "$1.8M invested" }
                  },
                  {
                    id: 3,
                    title: "🌱 Environment",
                    subtitle: "Sustainable future",
                    followers: "50K+ trees planted",
                    description: "Reforestation projects, clean energy initiatives, and waste management systems. Creating sustainable solutions for environmental challenges.",
                    stats: { locations: "30 countries", impact: "2M trees planted", budget: "$3.2M invested" }
                  },
                  {
                    id: 4,
                    title: "👥 Community",
                    subtitle: "Building stronger societies",
                    followers: "25K+ families",
                    description: "Infrastructure development, economic opportunities, and social programs. Empowering communities through sustainable development initiatives.",
                    stats: { locations: "22 countries", impact: "85% employment rate", budget: "$4.1M invested" }
                  },
                  {
                    id: 5,
                    title: "🚨 Emergency Relief",
                    subtitle: "Rapid response support",
                    followers: "15K+ rescued",
                    description: "Immediate disaster response and long-term recovery support. Providing emergency supplies, shelter, and rebuilding assistance.",
                    stats: { locations: "Global", impact: "72 hours response time", budget: "$2.8M emergency fund" }
                  }
                ].map((program, index) => (
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
                          <p className="text-xs text-gray-500 truncate">{program.subtitle}</p>
                        </div>
                        <div className="text-xs text-gray-400 whitespace-nowrap">
                          {program.followers}
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
              Latest Blog Posts
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Link to="/blog" className="apple-button">
                View All Posts
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
            {[
              {
                title: "The Impact of Clean Water Initiatives",
                excerpt: "Exploring how access to clean water transforms communities and improves public health outcomes.",
                date: "June 15, 2023",
                image: "https://source.unsplash.com/random/600x400/?water"
              },
              {
                title: "Education in Remote Communities",
                excerpt: "How digital learning tools are bridging the education gap in remote and underserved areas.",
                date: "May 28, 2023",
                image: "https://source.unsplash.com/random/600x400/?school"
              },
              {
                title: "Sustainable Farming Practices",
                excerpt: "Implementing eco-friendly farming techniques to improve food security and protect the environment.",
                date: "April 10, 2023",
                image: "https://source.unsplash.com/random/600x400/?farming"
              }
            ].map((blog, index) => (
              <motion.div key={index} variants={itemVariants} className="apple-blog-card">
                <div className="apple-blog-image">
                  <img src={blog.image} alt={blog.title} loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="apple-blog-content">
                  <div className="apple-date">{blog.date}</div>
                  <h3 className="text-2xl font-bold mb-3 apple-text tracking-tight">{blog.title}</h3>
                  <p className="apple-text opacity-80 leading-relaxed mb-6">{blog.excerpt}</p>
                  <Link to={`/blog/${index + 1}`} className="apple-link-button">
                    Read Article
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
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
              Our Community Impact
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
                     src="https://www.youtube.com/embed/668nUCeBHyY" 
                     title="Community Impact Video"
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                 </div>
               </div>
              
              {/* Video Caption */}
              <div className="mt-6 text-center">
                <h4 className="text-xl font-semibold text-gray-800 mb-2 font-serif">Stories of Change</h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Watch how our community initiatives are transforming lives and building stronger, more resilient communities worldwide.
                </p>
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
                    Our community of volunteers, donors, and partners work tirelessly to create positive change in communities around the world.
                  </p>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <p className="text-gray-600 italic text-sm leading-relaxed">
                      "From building schools and clean water systems to providing disaster relief and healthcare services, we're making a tangible difference in people's lives."
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h5 className="font-semibold text-gray-800 text-sm">Global Reach</h5>
                        <p className="text-gray-600 text-xs">Operating in 45+ countries worldwide</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h5 className="font-semibold text-gray-800 text-sm">Community-Led</h5>
                        <p className="text-gray-600 text-xs">Local solutions for local challenges</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h5 className="font-semibold text-gray-800 text-sm">Sustainable Impact</h5>
                        <p className="text-gray-600 text-xs">Long-term solutions that last</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                     <Link 
                       to="/forum" 
                       className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors duration-300 text-center block"
                     >
                       Join Our Community
                     </Link>
                   </div>
                 </div>
               </div>
             </motion.div>
           </div>
           
           {/* Impact by Numbers - Moved below the section */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.7, delay: 0.4 }}
             className="mt-16 max-w-4xl mx-auto"
           >
             <h4 className="text-2xl font-bold text-gray-800 mb-8 font-serif text-center">Impact by Numbers</h4>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               <div>
                 <div className="text-3xl md:text-4xl font-bold text-primary mb-2">250K+</div>
                 <div className="text-sm text-gray-600 font-medium">Lives Impacted</div>
               </div>
               <div>
                 <div className="text-3xl md:text-4xl font-bold text-primary mb-2">45+</div>
                 <div className="text-sm text-gray-600 font-medium">Countries</div>
               </div>
               <div>
                 <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,200+</div>
                 <div className="text-sm text-gray-600 font-medium">Volunteers</div>
               </div>
               <div>
                 <div className="text-3xl md:text-4xl font-bold text-primary mb-2">150+</div>
                 <div className="text-sm text-gray-600 font-medium">Projects</div>
               </div>
             </div>
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
            Join Our Community Forum
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto apple-text opacity-90 leading-relaxed"
          >
            Connect with like-minded individuals, share ideas, and participate in meaningful discussions about causes that matter.
          </motion.p>
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