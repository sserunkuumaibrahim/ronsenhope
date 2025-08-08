import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiHeart, FiStar } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Volunteer() {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: [],
    availability: [],
    experience: '',
    message: ''
  });
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

  // Volunteer opportunities data
  const opportunities = [
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
  ];

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
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    // Reset form after submission
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interests: [],
        availability: [],
        experience: '',
        message: ''
      });
    }, 5000);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Volunteer - Charity NGO</title>
        <meta name="description" content="Join our volunteer program and make a direct impact in communities around the world. Find opportunities that match your skills and interests." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-content py-16 md:py-24 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Volunteer With Us</h1>
            <p className="text-xl mb-8">
              Join our global community of volunteers and use your skills to make a lasting difference in the lives of others.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button 
                className="btn bg-white text-primary hover:bg-gray-100"
                onClick={() => {
                  setActiveTab('application');
                  document.getElementById('application-section').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Apply Now
              </button>
              <button 
                className="btn btn-outline border-white text-white hover:bg-white hover:text-primary"
                onClick={() => {
                  setActiveTab('opportunities');
                  document.getElementById('opportunities-section').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Opportunities
              </button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Volunteers working together" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      
      {/* Why Volunteer Section */}
      <section className="py-16 bg-base-100">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Volunteer With Us?</h2>
            <p className="text-xl max-w-3xl mx-auto">
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
            <motion.div variants={itemVariants} className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="text-4xl text-primary mb-4">
                  <FiHeart />
                </div>
                <h3 className="card-title text-2xl">Make a Direct Impact</h3>
                <p>Our volunteer programs are designed to create meaningful, measurable change in the communities we serve.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="text-4xl text-primary mb-4">
                  <FiStar />
                </div>
                <h3 className="card-title text-2xl">Develop New Skills</h3>
                <p>Gain valuable experience, enhance your resume, and develop both professional and personal skills.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card bg-base-200 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="text-4xl text-primary mb-4">
                  <FiUsers />
                </div>
                <h3 className="card-title text-2xl">Join a Global Community</h3>
                <p>Connect with like-minded individuals from around the world who share your passion for creating positive change.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Volunteer Opportunities Section */}
      <section id="opportunities-section" className="py-16 bg-base-200">
        <div className="container-custom">
          <div className="tabs tabs-boxed mb-8 justify-center">
            <a 
              className={`tab ${activeTab === 'opportunities' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('opportunities')}
            >
              Opportunities
            </a>
            <a 
              className={`tab ${activeTab === 'testimonials' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('testimonials')}
            >
              Volunteer Stories
            </a>
            <a 
              className={`tab ${activeTab === 'application' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('application')}
            >
              Apply
            </a>
          </div>
          
          {activeTab === 'opportunities' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Current Volunteer Opportunities</h2>
                <p className="text-xl max-w-3xl mx-auto">
                  Browse our current openings and find a role that matches your skills and interests.
                </p>
              </div>
              
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {opportunities.map((opportunity) => (
                  <motion.div key={opportunity.id} variants={itemVariants} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title text-xl">{opportunity.title}</h3>
                      <div className="badge badge-primary mb-2">{opportunity.category}</div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center">
                          <FiMapPin className="mr-2 text-primary" />
                          <span>{opportunity.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-primary" />
                          <span>{opportunity.commitment}</span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-primary" />
                          <span>{opportunity.duration}</span>
                        </div>
                      </div>
                      
                      <p className="mb-4">{opportunity.description}</p>
                      
                      <div className="mb-4">
                        <div className="text-sm font-semibold mb-1">Skills Needed:</div>
                        <div className="flex flex-wrap gap-1">
                          {opportunity.skills.map((skill, index) => (
                            <span key={index} className="badge badge-outline">{skill}</span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="card-actions justify-end">
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setActiveTab('application');
                            document.getElementById('application-section').scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
          
          {activeTab === 'testimonials' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Volunteer Stories</h2>
                <p className="text-xl max-w-3xl mx-auto">
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
                {testimonials.map((testimonial) => (
                  <motion.div key={testimonial.id} variants={itemVariants} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-center mb-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-16 h-16 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <h3 className="font-bold">{testimonial.name}</h3>
                          <div className="text-sm text-base-content/70">{testimonial.role}</div>
                        </div>
                      </div>
                      <div className="relative">
                          <div className="text-4xl text-primary/20 absolute -top-4 -left-2">
                            &ldquo;
                          </div>
                          <p className="italic">{testimonial.quote}</p>
                          <div className="text-4xl text-primary/20 absolute -bottom-8 -right-2">
                            &rdquo;
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Volunteer Application</h2>
                  <p className="text-xl max-w-3xl mx-auto">
                    Ready to make a difference? Fill out the form below to join our volunteer team.
                  </p>
                </div>
                
                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-success/20 p-8 rounded-lg text-center max-w-2xl mx-auto"
                  >
                    <div className="text-5xl text-success mb-4">✓</div>
                    <h3 className="text-2xl font-bold mb-2">Application Submitted!</h3>
                    <p className="mb-4">Thank you for your interest in volunteering with us. We'll review your application and contact you within 3-5 business days.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit}
                    className="bg-base-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <motion.div variants={itemVariants} className="form-control">
                        <label className="label">
                          <span className="label-text">Full Name</span>
                        </label>
                        <input 
                          type="text" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          className="input input-bordered" 
                          required 
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="form-control">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          className="input input-bordered" 
                          required 
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="form-control">
                        <label className="label">
                          <span className="label-text">Phone Number</span>
                        </label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          className="input input-bordered" 
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="form-control">
                        <label className="label">
                          <span className="label-text">Previous Volunteer Experience</span>
                        </label>
                        <select 
                          name="experience" 
                          value={formData.experience} 
                          onChange={handleInputChange} 
                          className="select select-bordered w-full"
                        >
                          <option value="">Select experience level</option>
                          <option value="none">No previous experience</option>
                          <option value="some">Some experience (1-2 years)</option>
                          <option value="experienced">Experienced (3+ years)</option>
                        </select>
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
                    
                    <motion.div variants={itemVariants} className="form-control mb-6">
                      <label className="label">
                        <span className="label-text">Why do you want to volunteer with us?</span>
                      </label>
                      <textarea 
                        name="message" 
                        value={formData.message} 
                        onChange={handleInputChange} 
                        className="textarea textarea-bordered h-32" 
                        required
                      ></textarea>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="form-control mt-6">
                      <button type="submit" className="btn btn-primary">Submit Application</button>
                    </motion.div>
                  </motion.form>
                )}
              </motion.div>
            )}
          </div>
       
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-base-100">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Have questions about volunteering with us? Find answers to common questions below.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" checked /> 
              <div className="collapse-title text-xl font-medium">
                Do I need special qualifications to volunteer?
              </div>
              <div className="collapse-content">
                <p>Most of our volunteer opportunities don't require specific qualifications. We value enthusiasm, commitment, and a willingness to learn. For specialized roles (like medical volunteers), relevant qualifications may be necessary.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                How much time do I need to commit?
              </div>
              <div className="collapse-content">
                <p>We offer flexible volunteering opportunities to accommodate different schedules. Some roles require as little as 2-3 hours per week, while others may need a more substantial commitment. Each opportunity listing specifies the expected time commitment.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                Can I volunteer remotely?
              </div>
              <div className="collapse-content">
                <p>Yes! We offer several remote volunteering opportunities, including social media management, content creation, grant writing, and virtual mentoring. These roles allow you to make an impact from anywhere in the world.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                Will I receive training?
              </div>
              <div className="collapse-content">
                <p>Absolutely! All volunteers receive orientation and role-specific training. We're committed to ensuring you have the knowledge and resources needed to be effective and confident in your volunteer role.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                Can I volunteer as a group or team?
              </div>
              <div className="collapse-content">
                <p>Yes, we welcome group volunteering! Whether it's a corporate team, school group, or community organization, we can arrange meaningful volunteer experiences for groups of various sizes. Please contact us directly to discuss group volunteering options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of volunteers today and help us create lasting change around the world.
          </p>
          <button 
            className="btn bg-white text-primary hover:bg-gray-100 btn-lg"
            onClick={() => {
              setActiveTab('application');
              document.getElementById('application-section').scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Apply Now
          </button>
        </div>
      </section>
    </MainLayout>
  );
}