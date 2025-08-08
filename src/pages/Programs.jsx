import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';
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

      <div className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Our Programs</h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Discover the various initiatives we're undertaking to create positive change in communities around the world.
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                <FiSearch className="text-lg" />
              </span>
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-outline gap-2">
                <FiFilter /> Filter
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {categories.map(category => (
                  <li key={category.id}>
                    <a 
                      className={activeFilter === category.id ? 'active' : ''}
                      onClick={() => setActiveFilter(category.id)}
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`btn btn-sm ${activeFilter === category.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {filteredPrograms.length === 0 ? (
          <div className="text-center py-16 bg-base-200 rounded-lg">
            <h3 className="text-2xl font-semibold mb-2">No programs found</h3>
            <p className="text-base-content/70 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card bg-base-200 shadow-xl overflow-hidden"
              >
                <figure className="h-48 relative">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 badge badge-primary">{program.category}</div>
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{program.title}</h2>
                  <p className="text-base-content/70">{program.description}</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm">
                      <FiMapPin className="mr-2" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiCalendar className="mr-2" />
                      <span>Started: {program.startDate}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FiUsers className="mr-2" />
                      <span>{program.participants.toLocaleString()} participants</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm mb-1">Program Progress</p>
                    <div className="w-full bg-base-300 rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${program.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-right text-xs mt-1">{program.progress}% complete</p>
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                    <Link to={`/programs/${program.id}`} className="btn btn-primary btn-sm gap-2">
                      Learn More <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 bg-base-200 p-8 rounded-lg shadow-lg text-center"
        >
          <h2 className="text-2xl font-semibold mb-4">Want to Support Our Programs?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Your contribution can make a significant difference in the lives of those we serve. Consider donating or volunteering today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/donate" className="btn btn-primary gap-2">
              Donate Now
            </Link>
            <Link to="/volunteer" className="btn btn-outline gap-2">
              Volunteer
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}