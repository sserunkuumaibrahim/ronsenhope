import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHeart, FiTarget, FiUsers, FiAward, FiGlobe, FiCalendar } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function About() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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

  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Executive Director',
      bio: 'Sarah has over 15 years of experience in nonprofit management and international development. She previously worked with UNICEF and Oxfam.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Michael Brown',
      role: 'Programs Director',
      bio: 'Michael oversees all our program implementation and has a background in public health and community development.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      name: 'Emma Williams',
      role: 'Finance Director',
      bio: 'Emma ensures our financial accountability and transparency. She has an MBA and previously worked in corporate finance.',
      image: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      name: 'David Wilson',
      role: 'Partnerships Manager',
      bio: 'David builds and maintains our relationships with corporate partners, foundations, and government agencies.',
      image: 'https://randomuser.me/api/portraits/men/46.jpg'
    },
    {
      name: 'Jennifer Lee',
      role: 'Communications Manager',
      bio: 'Jennifer leads our communications strategy and has a background in journalism and digital marketing.',
      image: 'https://randomuser.me/api/portraits/women/56.jpg'
    },
    {
      name: 'Robert Taylor',
      role: 'Volunteer Coordinator',
      bio: 'Robert manages our global volunteer network and has extensive experience in community organizing.',
      image: 'https://randomuser.me/api/portraits/men/62.jpg'
    }
  ];

  // Timeline events
  const timelineEvents = [
    {
      year: '2005',
      title: 'Foundation',
      description: 'Charity NGO was founded by a group of passionate individuals committed to making a difference in underserved communities.'
    },
    {
      year: '2008',
      title: 'First Major Project',
      description: 'Launched our first major clean water initiative in East Africa, providing access to safe drinking water for over 10,000 people.'
    },
    {
      year: '2012',
      title: 'Expansion',
      description: 'Expanded operations to Asia and Latin America, focusing on education and healthcare programs.'
    },
    {
      year: '2015',
      title: 'Award Recognition',
      description: 'Received the Global Humanitarian Award for our innovative approach to sustainable development.'
    },
    {
      year: '2018',
      title: 'Strategic Partnerships',
      description: 'Formed strategic partnerships with major corporations and foundations to scale our impact.'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Embraced digital technologies to enhance program delivery and connect our global community of supporters.'
    },
    {
      year: '2023',
      title: 'Today',
      description: 'Currently operating in 25 countries with over 100 active programs and thousands of volunteers worldwide.'
    }
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>About Us - Charity NGO</title>
        <meta name="description" content="Learn about Charity NGO's mission, vision, team, and history. Discover how we're making a difference in communities around the world." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="bg-base-200 py-16 md:py-24">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Charity NGO</h1>
            <p className="text-xl mb-8">
              We are a global nonprofit organization dedicated to creating sustainable solutions to poverty, inequality, and environmental challenges.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
                alt="Charity NGO team" 
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Mission and Vision */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <motion.div variants={itemVariants} className="bg-primary text-primary-content p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">
                <FiHeart />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg">
                To empower communities through sustainable development initiatives that address critical social, economic, and environmental challenges, creating lasting positive change in the lives of vulnerable populations worldwide.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-secondary text-secondary-content p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">
                <FiTarget />
              </div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg">
                A world where all people have access to the resources, opportunities, and support they need to thrive, regardless of their circumstances or location, and where communities are resilient, sustainable, and self-sufficient.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-16 bg-base-200">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl max-w-3xl mx-auto">
              These principles guide our work and define our organizational culture.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl text-primary mb-4">
                  <FiUsers />
                </div>
                <h3 className="card-title text-2xl">Community-Centered</h3>
                <p>We believe in the wisdom and agency of local communities and work alongside them as partners rather than saviors.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl text-primary mb-4">
                  <FiAward />
                </div>
                <h3 className="card-title text-2xl">Excellence & Innovation</h3>
                <p>We strive for the highest standards in our work and continuously seek innovative solutions to complex challenges.</p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="text-4xl text-primary mb-4">
                  <FiGlobe />
                </div>
                <h3 className="card-title text-2xl">Sustainability</h3>
                <p>We design programs that create lasting impact and empower communities to maintain progress independently.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Meet the dedicated professionals who guide our organization's strategy and operations.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div key={index} variants={itemVariants} className="card bg-base-100 shadow-xl">
                <figure className="px-10 pt-10">
                  <img src={member.image} alt={member.name} className="rounded-full w-32 h-32 object-cover" />
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-xl">{member.name}</h3>
                  <div className="badge badge-primary">{member.role}</div>
                  <p className="mt-2">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Our History */}
      <section className="py-16 bg-base-200">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl max-w-3xl mx-auto">
              From humble beginnings to global impact, explore the key milestones in our organization's history.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-10"
            >
              {timelineEvents.map((event, index) => (
                <motion.div 
                  key={index} 
                  variants={itemVariants}
                  className={`flex items-center mb-12 ${index % 2 === 0 ? 'justify-start md:justify-end' : 'justify-start'}`}
                >
                  <div className={`relative ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} w-full md:w-1/2`}>
                    <div className="bg-base-100 p-6 rounded-lg shadow-lg">
                      <div className="flex items-center mb-2">
                        <FiCalendar className="text-primary mr-2" />
                        <span className="font-bold text-xl">{event.year}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p>{event.description}</p>
                    </div>
                    
                    {/* Timeline dot */}
                    <div className="absolute top-6 bg-primary rounded-full w-6 h-6 flex items-center justify-center shadow-lg
                      ${index % 2 === 0 ? 'md:-right-3 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0' : 'md:-left-3 left-1/2 md:left-auto -translate-x-1/2 md:translate-x-0'}">
                      <div className="bg-white rounded-full w-2 h-2"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Impact Stats */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container-custom">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Through the dedication of our team and the generosity of our supporters, we've achieved significant results.
            </p>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={itemVariants} className="p-6 rounded-lg bg-primary-focus">
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-xl">Countries</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="p-6 rounded-lg bg-primary-focus">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-xl">Active Programs</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="p-6 rounded-lg bg-primary-focus">
              <div className="text-4xl font-bold mb-2">5M+</div>
              <div className="text-xl">Lives Impacted</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="p-6 rounded-lg bg-primary-focus">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-xl">Volunteers</div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16">
        <div className="container-custom text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl mb-8">
              There are many ways to get involved and support our work. Whether you donate, volunteer, or spread the word, you can help us create positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/donate" className="btn btn-primary btn-lg">Donate Now</a>
              <a href="/volunteer" className="btn btn-outline btn-lg">Volunteer</a>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}