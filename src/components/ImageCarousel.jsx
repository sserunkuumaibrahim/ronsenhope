import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Sample data for the carousel - replace with your actual data
const carouselData = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
    name: 'Sarah Johnson',
    role: 'Community Leader',
    location: 'Kenya',
    description: 'Leading education initiatives in rural communities, impacting over 500 children.',
    achievements: '3 schools built, 500+ students educated'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face',
    name: 'Michael Chen',
    role: 'Healthcare Volunteer',
    location: 'Philippines',
    description: 'Providing medical care and health education in underserved areas.',
    achievements: '1000+ patients treated, 5 clinics established'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=400&fit=crop&crop=face',
    name: 'Amara Okafor',
    role: 'Environmental Activist',
    location: 'Nigeria',
    description: 'Championing sustainable farming and clean water initiatives.',
    achievements: '50 wells dug, 200 families supported'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face',
    name: 'David Rodriguez',
    role: 'Disaster Relief Coordinator',
    location: 'Guatemala',
    description: 'Coordinating emergency response and rebuilding efforts.',
    achievements: '15 communities rebuilt, 2000+ lives impacted'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face',
    name: 'Priya Sharma',
    role: 'Women\'s Rights Advocate',
    location: 'India',
    description: 'Empowering women through education and economic opportunities.',
    achievements: '300 women trained, 50 businesses started'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=400&fit=crop&crop=face',
    name: 'James Wilson',
    role: 'Youth Mentor',
    location: 'South Africa',
    description: 'Mentoring at-risk youth and providing educational support.',
    achievements: '150 youth mentored, 80% graduation rate'
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face',
    name: 'Elena Vasquez',
    role: 'Nutrition Specialist',
    location: 'Peru',
    description: 'Fighting malnutrition through community nutrition programs.',
    achievements: '1000+ children fed, 20 nutrition centers'
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face',
    name: 'Ahmed Hassan',
    role: 'Infrastructure Developer',
    location: 'Egypt',
    description: 'Building essential infrastructure in remote communities.',
    achievements: '25 bridges built, 100km roads constructed'
  }
];

export default function ImageCarousel() {
  const [rotation, setRotation] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, rotation: 0 });
  const carouselRef = useRef(null);
  const animationRef = useRef(null);
  const tooltipRef = useRef(null);

  const itemCount = carouselData.length;
  const angleStep = 180 / (itemCount - 1); // Spread across 180 degrees for ox-bow curve
  const radius = 350; // Radius of the carousel
  const maxAngle = 90; // Maximum angle from center (creates ox-bow shape)

  // Auto-rotation animation
  const animate = useCallback(() => {
    if (!isHovered && !isDragging) {
      setRotation(prev => {
        const newRotation = prev + 0.5;
        // Keep rotation within ox-bow range
        return newRotation > maxAngle ? -maxAngle : newRotation;
      });
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isHovered, isDragging, maxAngle]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Handle mouse/touch drag
  const handleDragStart = useCallback((e) => {
    setIsDragging(true);
    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    setDragStart({ x: clientX, rotation });
  }, [rotation]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = clientX - dragStart.x;
    const rotationDelta = deltaX * 0.3; // Adjust sensitivity
    const newRotation = dragStart.rotation + rotationDelta;
    
    // Constrain rotation within ox-bow curve range
    const constrainedRotation = Math.max(-maxAngle, Math.min(maxAngle, newRotation));
    setRotation(constrainedRotation);
  }, [isDragging, dragStart, maxAngle]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mouse events
  useEffect(() => {
    const handleMouseMove = (e) => handleDragMove(e);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Touch events
  useEffect(() => {
    const handleTouchMove = (e) => handleDragMove(e);
    const handleTouchEnd = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Handle tooltip positioning
  const handleItemHover = useCallback((item, e) => {
    if (isDragging) return;
    
    setHoveredItem(item);
    setIsHovered(true);
    
    const rect = carouselRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Ensure tooltip stays within viewport
      const tooltipWidth = 320;
      const tooltipHeight = 200;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let adjustedX = x + rect.left;
      let adjustedY = y + rect.top - tooltipHeight - 20;
      
      // Adjust horizontal position
      if (adjustedX + tooltipWidth > viewportWidth) {
        adjustedX = viewportWidth - tooltipWidth - 20;
      }
      if (adjustedX < 20) {
        adjustedX = 20;
      }
      
      // Adjust vertical position
      if (adjustedY < 20) {
        adjustedY = y + rect.top + 20;
      }
      
      setTooltipPosition({ x: adjustedX, y: adjustedY });
    }
  }, [isDragging]);

  const handleItemLeave = useCallback(() => {
    if (!isDragging) {
      setHoveredItem(null);
      setIsHovered(false);
    }
  }, [isDragging]);

  return (
     <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
       {/* Rail/Track Indicator */}
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <svg 
           width="100%" 
           height="100%" 
           viewBox="0 0 800 600" 
           className="absolute inset-0"
         >
           <defs>
             <linearGradient id="railGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="rgba(156, 163, 175, 0.1)" />
               <stop offset="50%" stopColor="rgba(156, 163, 175, 0.3)" />
               <stop offset="100%" stopColor="rgba(156, 163, 175, 0.1)" />
             </linearGradient>
           </defs>
           <path
             d="M 150 300 Q 400 150 650 300"
             stroke="url(#railGradient)"
             strokeWidth="3"
             fill="none"
             strokeDasharray="10,5"
             className="opacity-50"
           />
         </svg>
       </div>

       {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: '1000px' }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        {/* Carousel Items */}
         <div
           className="relative w-full h-full"
           style={{
             transformStyle: 'preserve-3d',
           }}
         >
           {carouselData.map((item, index) => {
             // Create ox-bow curve: items spread from -90 to +90 degrees
             const baseAngle = (index * angleStep) - maxAngle; // Center the curve
             const totalAngle = baseAngle + rotation; // Add rotation offset
             
             // Calculate position along the ox-bow curve
             const x = Math.sin((totalAngle * Math.PI) / 180) * radius;
             const z = Math.cos((totalAngle * Math.PI) / 180) * radius;
             
             // Calculate depth-based scaling and opacity for perspective effect
             const normalizedZ = (z + radius) / (2 * radius); // Normalize z to 0-1
             const scale = 0.7 + (normalizedZ * 0.3); // Scale from 0.7 to 1.0
             const opacity = 0.4 + (normalizedZ * 0.6); // Opacity from 0.4 to 1.0
             
             return (
               <motion.div
                 key={item.id}
                 className="absolute top-1/2 left-1/2 w-48 h-64 cursor-pointer"
                 style={{
                   transform: `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px)`,
                   transformStyle: 'preserve-3d',
                   opacity: opacity,
                   zIndex: Math.round(normalizedZ * 100), // Items closer to front have higher z-index
                 }}
                 animate={{ 
                   scale: scale,
                 }}
                 whileHover={{ scale: scale * 1.1 }}
                 transition={{ 
                   type: "spring", 
                   stiffness: 300, 
                   damping: 30,
                   scale: { duration: 0.3 }
                 }}
                 onMouseEnter={(e) => handleItemHover(item, e)}
                 onMouseMove={(e) => handleItemHover(item, e)}
                 onMouseLeave={handleItemLeave}
               >
                {/* Card */}
                <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">
                      {item.role}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {item.location}
                    </p>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 hover:from-blue-400/10 hover:via-purple-400/10 hover:to-pink-400/10 transition-all duration-300 rounded-2xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            }}
          >
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 p-6 max-w-sm">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={hoveredItem.image}
                    alt={hoveredItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    {hoveredItem.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {hoveredItem.role}
                  </p>
                  <p className="text-xs text-gray-500">
                    📍 {hoveredItem.location}
                  </p>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {hoveredItem.description}
              </p>
              
              {/* Achievements */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-1">
                  Key Achievements:
                </p>
                <p className="text-sm text-gray-800">
                  {hoveredItem.achievements}
                </p>
              </div>
              
              {/* Arrow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
          Drag to rotate • Hover to learn more
        </p>
      </div>
    </div>
  );
}