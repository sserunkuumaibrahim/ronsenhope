import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiCalendar, FiUsers, FiArrowRight, FiTarget, FiTrendingUp, FiGlobe, FiHeart } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Programs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample program data
  const programs = [
    {
      id: 1,
      title: 'Clean Water Initiative',
      category: 'environment',
      location: 'East Africa',
      participants: 5000,
      startDate: 'January 2023',
      description: 'Providing clean and safe drinking water to communities in need through sustainable water solutions.',
      image: 'https://images.unsplash.com/photo-1541252260730-0412e8e2108e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      progress: 75
    },
    {
      id: 2,
      title: 'Education for All',
      category: 'education',
      location: 'South Asia',
      participants: 12000,
      startDate: 'March 2022',
      description: 'Ensuring access to quality education for underprivileged children through school building and teacher training.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      progress: 60
    },
    {
      id: 3,
      title: 'Healthcare Outreach',
      category: 'health',
      location: 'Latin America',
      participants: 8500,
      startDate: 'June 2022',
      description: 'Mobile clinics and healthcare services for remote communities with limited access to medical facilities.',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      progress: 80
    },
    {
      id: 4,
      title: 'Sustainable Farming',
      category: 'environment',
      location: 'Southeast Asia',
      participants: 3200,
      startDate: 'April 2023',
      description: 'Teaching sustainable agricultural practices to improve food security and economic stability in rural areas.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      progress: 40
    },
    {
      id: 5,
      title: 'Women Empowerment',
      category: 'social',
      location: 'Global',
      participants: 15000,
      startDate: 'February 2022',
      description: 'Skills training and microfinance opportunities for women to achieve economic independence and leadership roles.',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      progress: 65
    },
    {
      id: 6,
      title: 'Youth Development',
      category: 'education',
      location: 'Urban Centers',
      participants: 7800,
      startDate: 'September 2022',
      description: 'Mentorship, leadership training, and educational support for at-risk youth in urban communities.',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      progress: 55
    }
  ];

  const categories = [
    { id: 'all', name: 'All Programs' },
    { id: 'education', name: 'Education' },
    { id: 'health', name: 'Healthcare' },
    { id: 'environment', name: 'Environment' },
    { id: 'social', name: 'Social Impact' }
  ];

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeFilter === 'all' || program.category === activeFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <Helmet>
        <title>Our Programs - Charity NGO</title>
        <meta name="description" content="Explore our various programs and initiatives aimed at creating positive change in communities around the world." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        <div className="absolute inset-0 bg-[url('/src/assets/dot-pattern.svg')] opacity-20"></div>
        
        <div className="container-custom relative py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <FiGlobe className="w-4 h-4" />
              Global Impact Programs
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              Our Programs
            </h1>
            
            <p className="text-xl md:text-2xl text-base-content/70 max-w-4xl mx-auto leading-relaxed">
              Discover the various initiatives we're undertaking to create positive change in communities around the world. Each program is designed with purpose, passion, and measurable impact.
            </p>
            
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiTarget className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-base-content/60">Lives Impacted</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiTrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-secondary mb-2">25+</div>
                <div className="text-base-content/60">Active Programs</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiGlobe className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">15</div>
                <div className="text-base-content/60">Countries Served</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white">
        <div className="container-custom py-16 md:py-24">

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          {/* Glass morphism container */}
          <div className="bg-white backdrop-blur-sm border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              {/* Search Input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50">
                  <FiSearch className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-base-content placeholder-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                  placeholder="Search programs by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Filter Dropdown */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-outline border-gray-300 hover:bg-gray-100 hover:border-gray-400 gap-2 px-6">
                  <FiFilter className="w-4 h-4" /> 
                  Filter by Category
                </label>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100/95 backdrop-blur-sm rounded-xl w-56 border border-white/20">
                  {categories.map(category => (
                    <li key={category.id}>
                      <a 
                        className={`rounded-lg transition-all duration-200 ${activeFilter === category.id ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}`}
                        onClick={() => setActiveFilter(category.id)}
                      >
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-3">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                     activeFilter === category.id 
                       ? 'bg-primary text-primary-content shadow-lg shadow-primary/25' 
                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-800 border border-gray-300'
                   }`}
                  onClick={() => setActiveFilter(category.id)}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
            
            {/* Results count */}
            <div className="mt-6 text-center">
              <p className="text-base-content/60">
                Showing <span className="font-semibold text-primary">{filteredPrograms.length}</span> of <span className="font-semibold">{programs.length}</span> programs
              </p>
            </div>
          </div>
        </motion.div>

        {filteredPrograms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-white backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <FiSearch className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl font-bold mb-4">No programs found</h3>
            <p className="text-lg text-base-content/70 mb-8 max-w-md mx-auto">
              Try adjusting your search or filter criteria to discover our amazing programs
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium hover:from-primary/90 hover:to-secondary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
            >
              <FiTarget className="w-5 h-5" />
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-pink-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
                <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image Section - 40% height */}
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                      program.category === 'education' ? 'bg-sky-500/90 text-white' :
                      program.category === 'health' ? 'bg-green-500/90 text-white' :
                      program.category === 'environment' ? 'bg-orange-500/90 text-white' :
                      program.category === 'social' ? 'bg-purple-500/90 text-white' : 'bg-blue-500/90 text-white'
                    }`}>
                      {program.category === 'education' && <FiUsers className="text-sm" />}
                      {program.category === 'health' && <FiTarget className="text-sm" />}
                      {program.category === 'environment' && <FiGlobe className="text-sm" />}
                      {program.category === 'social' && <FiHeart className="text-sm" />}
                    </div>
                  </div>
                  
                  {/* Progress Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                      {program.progress}%
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6">
                
                {/* Title and Description */}
                 <h3 className="text-2xl font-bold text-secondary mb-4">{program.title}</h3>
                 <p className="text-gray-600 leading-relaxed mb-6">{program.description}</p>
                 
                 {/* Key Information */}
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-3">
                     <FiMapPin className="w-5 h-5 text-primary" />
                     <span className="text-gray-600">{program.location}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <FiCalendar className="w-5 h-5 text-primary" />
                     <span className="text-gray-600">Started {program.startDate}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <FiUsers className="w-5 h-5 text-primary" />
                     <span className="text-gray-600">{program.participants.toLocaleString()} participants</span>
                   </div>
                 </div>

                  
                  {/* Action Button */}
                  <Link 
                    to={`/programs/${program.id}`} 
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Learn More
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 relative overflow-hidden"
        >
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"></div>
          <div className="absolute inset-0 bg-[url('/src/assets/wave-divider.svg')] opacity-10"></div>
          
          <div className="relative bg-white backdrop-blur-sm border border-gray-200 rounded-3xl p-8 md:p-12 shadow-2xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <FiHeart className="w-4 h-4" />
              Make a Difference Today
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
              Want to Support Our Programs?
            </h2>
            
            <p className="text-lg md:text-xl text-base-content/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Your contribution can make a significant difference in the lives of those we serve. Join our mission to create lasting positive change in communities worldwide.
            </p>
            
            {/* Impact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiHeart className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">$2.5M+</div>
                <div className="text-sm text-base-content/60">Funds Raised</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiUsers className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-secondary mb-1">1,200+</div>
                <div className="text-sm text-base-content/60">Active Volunteers</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiTrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-accent mb-1">98%</div>
                <div className="text-sm text-base-content/60">Impact Rate</div>
              </div>
            </motion.div>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/donate" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-lg hover:from-primary/90 hover:to-secondary/90 hover:shadow-xl hover:shadow-primary/25 transition-all duration-300"
              >
                <FiHeart className="w-5 h-5" />
                Donate Now
              </Link>
              <Link 
                to="/volunteer" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <FiUsers className="w-5 h-5" />
                Volunteer With Us
              </Link>
            </motion.div>
            
            {/* Additional Info */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-sm text-base-content/50 mt-6"
            >
              Every contribution, no matter the size, creates ripples of positive change
            </motion.p>
          </div>
        </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}