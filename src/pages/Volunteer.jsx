import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiHeart, FiStar, FiUser, FiMail, FiPhone, FiMessageSquare, FiDollarSign } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { realtimeDb } from '../firebase/config';
import { ref, onValue, off } from 'firebase/database';

export default function Volunteer() {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    opportunity: '',
    interests: [],
    availability: [],
    experience: '',
    message: ''
  });
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Volunteer opportunities data
  const [opportunities, setOpportunities] = useState([
    {
      id: 1,
      title: 'Community Health Educator',
      location: 'Multiple Locations',
      commitment: '5-10 hours/week',
      duration: '3+ months',
      description: 'Educate communities about preventive health measures, nutrition, and hygiene practices to reduce the spread of preventable diseases.',
      skills: ['Teaching', 'Healthcare Knowledge', 'Communication'],
      category: 'Health'
    },
    {
      id: 2,
      title: 'Clean Water Project Assistant',
      location: 'Rural Communities',
      commitment: '10-15 hours/week',
      duration: '6+ months',
      description: 'Assist in the implementation of clean water projects, including water source protection, filtration system installation, and community education.',
      skills: ['Engineering', 'Project Management', 'Community Outreach'],
      category: 'Environment'
    },
    {
      id: 3,
      title: 'Youth Mentor',
      location: 'Urban Centers',
      commitment: '4-8 hours/week',
      duration: 'Ongoing',
      description: 'Provide guidance, support, and positive role modeling for at-risk youth through educational activities, career counseling, and life skills development.',
      skills: ['Mentoring', 'Patience', 'Active Listening'],
      category: 'Education'
    },
    {
      id: 4,
      title: 'Digital Skills Trainer',
      location: 'Community Centers',
      commitment: '3-6 hours/week',
      duration: '2+ months',
      description: 'Teach basic to intermediate digital skills to adults and seniors, helping them navigate technology for job searching, communication, and daily tasks.',
      skills: ['Technology', 'Teaching', 'Patience'],
      category: 'Education'
    },
    {
      id: 5,
      title: 'Disaster Response Volunteer',
      location: 'Various (On-call)',
      commitment: 'Variable',
      duration: 'Ongoing',
      description: 'Join our emergency response team to provide assistance during natural disasters, including distribution of supplies, shelter support, and community outreach.',
      skills: ['Crisis Management', 'First Aid', 'Adaptability'],
      category: 'Emergency'
    },
    {
      id: 6,
      title: 'Social Media Advocate',
      location: 'Remote',
      commitment: '2-5 hours/week',
      duration: 'Flexible',
      description: 'Help amplify our message by creating content, managing social media campaigns, and engaging with our online community.',
      skills: ['Social Media', 'Content Creation', 'Communication'],
      category: 'Marketing'
    }
  ]);

  // Fetch opportunities from Firebase Realtime Database
  useEffect(() => {
    const opportunitiesRef = ref(realtimeDb, 'opportunities');
    
    const unsubscribe = onValue(opportunitiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const opportunitiesList = Object.keys(data)
          .map(key => ({
            id: key,
            ...data[key]
          }))
          .filter(opp => opp.isActive); // Only show active opportunities
        setOpportunities(opportunitiesList);
      } else {
        setOpportunities([]);
      }
      setLoadingOpportunities(false);
    });

    return () => off(opportunitiesRef, 'value', unsubscribe);
  }, []);

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'James Wilson',
      role: 'Clean Water Project Volunteer',
      image: 'https://randomuser.me/api/portraits/men/41.jpg',
      quote: 'Volunteering with Charity NGO has been one of the most rewarding experiences of my life. Seeing the direct impact of our work on communities that now have access to clean water is incredibly fulfilling.'
    },
    {
      id: 2,
      name: 'Maria Rodriguez',
      role: 'Youth Mentor',
      image: 'https://randomuser.me/api/portraits/women/63.jpg',
      quote: 'The relationships I\'ve built with the youth I mentor have changed my perspective on life. It\'s amazing to see their growth and know that I played a small part in helping them realize their potential.'
    },
    {
      id: 3,
      name: 'David Chen',
      role: 'Digital Skills Trainer',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      quote: 'Teaching digital skills to seniors has been so rewarding. The moment when someone sends their first email to a grandchild or successfully applies for a job online is priceless.'
    }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes for multi-select fields
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        [field]: [...formData[field], value]
      });
    } else {
      setFormData({
        ...formData,
        [field]: formData[field].filter(item => item !== value)
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save application to Firebase
      await addDoc(collection(db, 'applications'), {
        ...formData,
        status: 'pending',
        submittedAt: new Date(),
        createdAt: new Date()
      });
      
      console.log('Application submitted successfully');
      setFormSubmitted(true);
      
      // Reset form after submission
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          opportunity: '',
          interests: [],
          availability: [],
          experience: '',
          message: ''
        });
      }, 5000);
    } catch (error) {
      console.error('Error submitting application:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Volunteer - Charity NGO</title>
        <meta name="description" content="Join our volunteer program and make a direct impact in communities around the world. Find opportunities that match your skills and interests." />
      </Helmet>
      
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
              <FiHeart className="text-pink-200" />
              <span className="text-sm font-medium">Make a Difference Today</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              How Can You Help
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed">
              Join our global community of volunteers and use your skills to make a lasting difference in the lives of others.
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
                  setActiveTab('application');
                  document.getElementById('application-section').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10">Apply Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">Apply Now</span>
              </button>
              <button 
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300 backdrop-blur-sm"
                onClick={() => {
                  setActiveTab('opportunities');
                  document.getElementById('opportunities-section').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Opportunities
              </button>
              <div dangerouslySetInnerHTML={{
                __html: `
                  <script type="text/javascript" defer src="https://donorbox.org/install-popup-button.js"></script>
                  <a class="dbox-donation-button" style="background: rgb(223, 24, 167); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: flex; gap: 8px; width: fit-content; font-size: 16px; border-radius: 5px; line-height: 24px; padding: 8px 24px;" href="https://donorbox.org/survive-and-thrive-804282?"><img src="https://donorbox.org/images/white_logo.svg" alt="Donate with DonorBox"/>Donate Now</a>
                `
              }} />
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Volunteers working together" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      
      {/* Why Volunteer Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 rounded-full px-6 py-3 mb-6 font-medium"
            >
              <FiStar className="text-pink-500" />
              <span>Why Choose Us</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Why Volunteer With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Volunteering with Charity NGO offers unique opportunities to make a real difference while developing new skills and connections.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="group relative">
              <div className="absolute inset-0 bg-pink-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiHeart className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Make a Direct Impact</h3>
                <p className="text-gray-600 leading-relaxed">Our volunteer programs are designed to create meaningful, measurable change in the communities we serve.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="group relative">
              <div className="absolute inset-0 bg-pink-500 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300 opacity-10"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiStar className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Develop New Skills</h3>
                <p className="text-gray-600 leading-relaxed">Gain valuable experience, enhance your resume, and develop both professional and personal skills.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="group relative">
              <div className="absolute inset-0 bg-pink-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FiUsers className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Join a Global Community</h3>
                <p className="text-gray-600 leading-relaxed">Connect with like-minded individuals from around the world who share your passion for creating positive change.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Volunteer Opportunities Section */}
      <section id="opportunities-section" className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-2xl p-2 inline-flex gap-2">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'opportunities' 
                    ? 'bg-white text-pink-600 shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
                onClick={() => setActiveTab('opportunities')}
              >
                Opportunities
              </button>
              <button 
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'testimonials' 
                    ? 'bg-white text-pink-600 shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
                onClick={() => setActiveTab('testimonials')}
              >
                Testimonials
              </button>
              <button 
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === 'application' 
                    ? 'bg-white text-pink-600 shadow-lg transform scale-105' 
                    : 'text-gray-600 hover:text-pink-600'
                }`}
                onClick={() => setActiveTab('application')}
              >
                Apply
              </button>
            </div>
          </div>
          
          {activeTab === 'opportunities' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 rounded-full px-6 py-3 mb-6 font-medium"
                >
                  <FiUsers className="text-pink-500" />
                  <span>Join Our Team</span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                  Current Volunteer Opportunities
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Browse our current openings and find a role that matches your skills and interests.
                </p>
              </div>
              
              {loadingOpportunities ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No volunteer opportunities available at the moment.</p>
                  <p className="text-gray-500 mt-2">Please check back later for new opportunities.</p>
                </div>
              ) : (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {opportunities.map((opportunity, index) => {
                  
                  return (
                    <motion.div key={opportunity.id} variants={itemVariants} className="group relative">
                      <div className="absolute inset-0 bg-pink-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
                      <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <FiHeart className="text-white text-xl" />
                          </div>
                          <span className="px-3 py-1 bg-pink-500 text-white text-sm font-medium rounded-full">
                            {opportunity.category}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 text-gray-800">{opportunity.title}</h3>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <FiMapPin className="mr-3 text-blue-500" />
                            <span>{opportunity.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiClock className="mr-3 text-green-500" />
                            <span>{opportunity.commitment}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiCalendar className="mr-3 text-purple-500" />
                            <span>{opportunity.duration}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{opportunity.description}</p>
                        
                        <div className="mb-6">
                          <div className="text-sm font-semibold mb-2 text-gray-800">Skills Needed:</div>
                          <div className="flex flex-wrap gap-2">
                            {opportunity.skills.map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          className="w-full py-3 bg-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 hover:bg-pink-600"
                          onClick={() => {
                            setActiveTab('application');
                            document.getElementById('application-section').scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'testimonials' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-16">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 rounded-full px-6 py-3 mb-6 font-medium"
                  >
                    <FiStar className="text-pink-500" />
                    <span>Success Stories</span>
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                    Testimonials
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Hear from our volunteers about their experiences and the impact they've made.
                  </p>
                </div>
                
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {testimonials.map((testimonial, index) => {
                    
                    return (
                      <motion.div key={testimonial.id} variants={itemVariants} className="group relative">
                        <div className="absolute inset-0 bg-pink-500 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-10"></div>
                        <div className="relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                          <div className="flex items-center mb-6">
                            <div className="relative">
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name} 
                                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                              />
                              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                <FiHeart className="text-white text-xs" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h3 className="font-bold text-gray-800 text-lg">{testimonial.name}</h3>
                              <div className="text-sm text-gray-500 font-medium">{testimonial.role}</div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="text-4xl text-pink-500 absolute -top-4 -left-2 opacity-50">
                              &ldquo;
                            </div>
                            <p className="italic text-gray-600 leading-relaxed pl-6 pr-6">{testimonial.quote}</p>
                            <div className="text-4xl text-pink-500 absolute -bottom-8 -right-2 opacity-50">
                              &rdquo;
                            </div>
                          </div>
                          <div className="flex justify-center mt-6">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} className={`text-lg ${i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
            
            {activeTab === 'application' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                id="application-section"
              >
                <div className="text-center mb-16">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 rounded-full px-6 py-3 mb-6 font-medium"
                  >
                    <FiHeart className="text-pink-500" />
                    <span>Join Us Today</span>
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                    Volunteer Application
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Ready to make a difference? Fill out the form below to join our volunteer team.
                  </p>
                </div>
                
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-pink-500 rounded-3xl transform rotate-1 opacity-10"></div>
                    <div className="relative bg-white p-12 rounded-3xl text-center max-w-2xl mx-auto shadow-2xl border border-gray-100">
                      <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <div className="text-3xl text-white">✓</div>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-gray-800">Application Submitted!</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">Thank you for your interest in volunteering with us. We'll review your application and contact you within 3-5 business days.</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div className="relative max-w-4xl mx-auto">
                    <div className="absolute inset-0 bg-pink-500 rounded-3xl transform rotate-1 opacity-5"></div>
                    <motion.form 
                      onSubmit={handleSubmit}
                      className="relative bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <motion.div variants={itemVariants} className="form-control relative group">
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          placeholder=" "
                          className="peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 pt-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg border-gray-200 hover:border-gray-300"
                          required 
                        />
                        <label className="pointer-events-none absolute left-4 -top-2 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:left-6 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                          Full Name
                        </label>
                        <div className="absolute right-6 top-5 transition-colors duration-300">
                          <FiUser className="text-xl text-gray-400 group-hover:text-primary" />
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="form-control relative group">
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder=" "
                          className="peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 pt-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg border-gray-200 hover:border-gray-300"
                          required 
                        />
                        <label className="pointer-events-none absolute left-4 -top-2 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:left-6 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                          Email Address
                        </label>
                        <div className="absolute right-6 top-5 transition-colors duration-300">
                          <FiMail className="text-xl text-gray-400 group-hover:text-primary" />
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="form-control relative group">
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder=" "
                          className="peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 pt-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg border-gray-200 hover:border-gray-300"
                        />
                        <label className="pointer-events-none absolute left-4 -top-2 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:left-6 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                          Phone Number
                        </label>
                        <div className="absolute right-6 top-5 transition-colors duration-300">
                          <FiPhone className="text-xl text-gray-400 group-hover:text-primary" />
                        </div>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="form-control relative group">
                        <select 
                          name="opportunity" 
                          value={formData.opportunity} 
                          onChange={handleInputChange} 
                          className="peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg border-gray-200 hover:border-gray-300 appearance-none"
                          required
                        >
                          <option value="">Select an opportunity</option>
                          {opportunities.map((opportunity) => (
                            <option key={opportunity.id} value={opportunity.title}>
                              {opportunity.title} - {opportunity.location}
                            </option>
                          ))}
                        </select>
                        <label className="absolute left-4 -top-2 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-300 peer-focus:text-primary">
                          Volunteer Opportunity
                        </label>
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="form-control relative group">
                        <select 
                          name="experience" 
                          value={formData.experience} 
                          onChange={handleInputChange} 
                          className="peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg border-gray-200 hover:border-gray-300 appearance-none"
                          required
                        >
                          <option value="">Select experience level</option>
                          <option value="none">No previous experience</option>
                          <option value="some">Some experience (1-2 years)</option>
                          <option value="experienced">Experienced (3+ years)</option>
                        </select>
                        <label className="absolute left-4 -top-2 bg-white px-2 text-sm font-medium text-gray-600 transition-all duration-300 peer-focus:text-primary">
                          Previous Volunteer Experience
                        </label>
                      </motion.div>
                    </div>
                    
                    <motion.div variants={itemVariants} className="form-control mb-6">
                      <label className="label">
                        <span className="label-text">Areas of Interest (Select all that apply)</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Health', 'Education', 'Environment', 'Emergency', 'Marketing', 'Administration'].map((interest) => (
                          <label key={interest} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              value={interest} 
                              checked={formData.interests.includes(interest)} 
                              onChange={(e) => handleCheckboxChange(e, 'interests')} 
                              className="checkbox checkbox-primary checkbox-sm" 
                            />
                            <span>{interest}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="form-control mb-6">
                      <label className="label">
                        <span className="label-text">Availability (Select all that apply)</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekend mornings', 'Weekend afternoons', 'Weekend evenings'].map((time) => (
                          <label key={time} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              value={time} 
                              checked={formData.availability.includes(time)} 
                              onChange={(e) => handleCheckboxChange(e, 'availability')} 
                              className="checkbox checkbox-primary checkbox-sm" 
                            />
                            <span>{time}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="form-control mb-6 relative group">
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        placeholder=" "
                        className="peer h-32 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 pt-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg border-gray-200 hover:border-gray-300 resize-none"
                        required
                      ></textarea>
                      <label className="pointer-events-none absolute left-4 -top-2 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:left-6 peer-placeholder-shown:bg-transparent peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                        Why do you want to volunteer with us?
                      </label>
                      <div className="absolute right-6 top-5 transition-colors duration-300">
                        <FiMessageSquare className="text-xl text-gray-400 group-hover:text-primary" />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="mt-8">
                      <button 
                        type="submit" 
                        className="w-full py-4 bg-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:bg-pink-600"
                      >
                        Submit Application
                      </button>
                    </motion.div>
                  </motion.form>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
       
      </section>

      {/* Mobile Money Donation Section */}
      <section className="py-20 bg-gradient-to-br from-white to-pink-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-6">
              <FiDollarSign className="text-xl" />
              Quick and Secure Donations
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">Support Via Mobile Money</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make a difference today through our secure mobile money channels. Every contribution helps us support more cancer patients.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* MTN Mobile Money */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-yellow-100 group"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img src="/payment-logos/mtn-logo.png" alt="MTN Logo" className="w-12 h-12 object-contain" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">MTN Mobile Money</h3>
                  <p className="text-yellow-600 font-medium">Account Details</p>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6 mb-4">
                <div className="mb-2">
                  <p className="text-sm text-yellow-700 mb-1">Account Name</p>
                  <p className="text-xl font-bold text-gray-800">Lumps Away Foundation</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-700 mb-1">Phone Number</p>
                  <p className="text-3xl font-bold text-yellow-600 font-mono tracking-wider">0784 012 345</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">*MTN Mobile Money charges may apply</p>
            </motion.div>

            {/* Airtel Money */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-red-100 group"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img src="/payment-logos/airtel-logo.png" alt="Airtel Logo" className="w-12 h-12 object-contain" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Airtel Money</h3>
                  <p className="text-red-600 font-medium">Account Details</p>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-6 mb-4">
                <div className="mb-2">
                  <p className="text-sm text-red-700 mb-1">Account Name</p>
                  <p className="text-xl font-bold text-gray-800">Lumps Away Foundation</p>
                </div>
                <div>
                  <p className="text-sm text-red-700 mb-1">Phone Number</p>
                  <p className="text-3xl font-bold text-red-600 font-mono tracking-wider">0755 012 345</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">*Airtel Money charges may apply</p>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 max-w-2xl mx-auto">
              After sending your donation, you'll receive a confirmation message. For donations above UGX 500,000, 
              please contact us for a receipt at <a href="mailto:donations@lumpsaway.org" className="text-primary hover:underline">donations@lumpsaway.org</a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30">
              <FiHeart className="text-pink-300" />
              <span className="text-sm font-medium">Start Your Journey</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-pink-100 leading-relaxed max-w-3xl mx-auto">
              Join our community of volunteers today and help us create lasting change around the world.
            </p>
            <button 
              className="group relative px-10 py-5 bg-white text-pink-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              onClick={() => {
                setActiveTab('application');
                document.getElementById('application-section').scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">Apply Now</span>
              <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">Apply Now</span>
            </button>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Volunteers making a difference" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </MainLayout>
  );
}