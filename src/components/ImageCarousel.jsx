import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const images = [
  {
    url: 'https://source.unsplash.com/random/600x400/?africa,transport',
    title: 'Community Transport',
    description: 'Supporting local transportation initiatives'
  },
  {
    url: 'https://source.unsplash.com/random/600x400/?africa,education',
    title: 'Education Programs',
    description: 'Building brighter futures through learning'
  },
  {
    url: 'https://source.unsplash.com/random/600x400/?africa,healthcare',
    title: 'Healthcare Access',
    description: 'Bringing medical services to remote areas'
  },
  {
    url: 'https://source.unsplash.com/random/600x400/?africa,community',
    title: 'Community Building',
    description: 'Strengthening local connections'
  },
  {
    url: 'https://source.unsplash.com/random/600x400/?africa,water',
    title: 'Clean Water',
    description: 'Providing access to safe drinking water'
  }
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsRef = useRef([]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e, card) => {
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      card.style.setProperty('--x', `${x}%`);
      card.style.setProperty('--y', `${y}%`);
    };
    
    const cards = cardsRef.current;
    
    cards.forEach(card => {
      if (!card) return;
      
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
    });
    
    return () => {
      cards.forEach(card => {
        if (!card) return;
        card.removeEventListener('mousemove', handleMouseMove);
      });
    };
  }, [currentIndex]);
  
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/10 backdrop-blur-sm z-10 rounded-2xl"></div>
      <div className="absolute -inset-0.5 bg-primary/10 rounded-2xl blur-md z-0"></div>
      
      <div className="relative z-20 h-full flex flex-col justify-center items-center p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full h-full">
          <AnimatePresence mode="wait">
            {images.map((image, index) => {
              // Show current image and the next one (or first if at the end)
              const isVisible = index === currentIndex || index === (currentIndex + 1) % images.length;
              if (!isVisible) return null;
              
              return (
                <motion.div
                  key={index}
                  ref={el => {
                    if (el && !cardsRef.current.includes(el)) {
                      cardsRef.current[index] = el;
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="glassmorphic-card h-full group relative z-10 overflow-hidden apple-focus"
                  whileHover={{ scale: 1.03, boxShadow: '0 10px 40px rgba(31, 38, 135, 0.3)' }}
                >
                  <div className="relative overflow-hidden w-full h-56">
                    <img 
                      src={image.url} 
                      alt={image.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="glassmorphic-content">
                    <h3 className="text-2xl font-bold apple-text tracking-tight">{image.title}</h3>
                    <p className="text-base mt-2 apple-text opacity-90 leading-snug">{image.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center space-x-4 mt-8">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-primary scale-125 shadow-lg' : 'bg-white/40'} hover:bg-primary/60 focus:outline-none`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}