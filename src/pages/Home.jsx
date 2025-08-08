import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousel';
import MainLayout from '../components/layout/MainLayout';
import { FiHeart, FiUsers, FiGlobe } from 'react-icons/fi';

export default function Home() {
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
      <section className="relative bg-accent text-secondary py-16 md:py-24 bg-mesh-gradient-1">
        <div className="container-custom max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left text-secondary">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Making a Difference Together
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto lg:mx-0"
              >
                Join us in our mission to create positive change through community engagement, education, and sustainable development.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/donate" className="btn btn-lg bg-primary text-accent hover:opacity-80">
                  Donate Now
                </Link>
                <Link to="/volunteer" className="btn btn-lg btn-outline border-primary text-primary hover:bg-primary hover:text-accent">
                  Volunteer
                </Link>
              </motion.div>
            </div>
            
            <div className="h-[500px] w-full">
              <ImageCarousel />
            </div>
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
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            ref={(el) => {
              if (el) {
                el.addEventListener('mousemove', (e) => {
                  const cards = el.querySelectorAll('.apple-program-card');
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
                title: "Education",
                description: "Providing access to quality education and learning resources for underserved communities.",
                image: "https://source.unsplash.com/random/300x200/?education"
              },
              {
                title: "Healthcare",
                description: "Improving access to essential healthcare services and promoting public health awareness.",
                image: "https://source.unsplash.com/random/300x200/?healthcare"
              },
              {
                title: "Environment",
                description: "Implementing sustainable practices and conservation efforts to protect our planet.",
                image: "https://source.unsplash.com/random/300x200/?environment"
              },
              {
                title: "Community Development",
                description: "Building stronger communities through infrastructure, economic opportunities, and social programs.",
                image: "https://source.unsplash.com/random/300x200/?community"
              },
              {
                title: "Disaster Relief",
                description: "Providing immediate assistance and long-term recovery support to communities affected by disasters.",
                image: "https://source.unsplash.com/random/300x200/?disaster"
              },
              {
                title: "Women Empowerment",
                description: "Supporting women's rights, education, and economic independence to create gender equality.",
                image: "https://source.unsplash.com/random/300x200/?women"
              }
            ].map((program, index) => (
              <motion.div key={index} variants={itemVariants} className="apple-program-card">
                <div className="apple-program-image">
                  <img src={program.image} alt={program.title} loading="eager" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="apple-program-content">
                  <h3 className="text-2xl font-bold mb-3 apple-text tracking-tight">{program.title}</h3>
                  <p className="apple-text opacity-80 leading-relaxed mb-6">{program.description}</p>
                  <Link to={`/programs/${program.title.toLowerCase()}`} className="apple-button text-sm">
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
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
      <section className="py-20 md:py-32 bg-white text-secondary bg-mesh-gradient-2 mt-[-1px]">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-3xl md:text-5xl font-bold mb-4 apple-text tracking-tight"
            >
              Our Community Impact
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg max-w-3xl mx-auto apple-text opacity-90"
            >
              See how our volunteers and supporters are making a difference around the world
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="apple-focus"
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    className="w-full h-full" 
                    src="https://www.youtube.com/embed/668nUCeBHyY" 
                    title="Community Impact Video"
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-6 apple-text tracking-tight">Building Stronger Communities Together</h3>
              <p className="apple-text opacity-80 leading-relaxed mb-6">
                Our community of volunteers, donors, and partners work tirelessly to create positive change in communities around the world. From building schools and clean water systems to providing disaster relief and healthcare services, we're making a tangible difference in people's lives.
              </p>
              <p className="apple-text opacity-80 leading-relaxed mb-8">
                Join our growing community of change-makers and help us expand our impact. Whether you contribute your time, skills, or resources, you'll be part of a global movement dedicated to creating a more equitable and sustainable world.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="apple-focus rounded-2xl overflow-hidden shadow-lg"
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
                  <img 
                    src="https://source.unsplash.com/random/600x400/?community-volunteer" 
                    alt="Community Volunteers" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                </div>
                <div className="apple-focus rounded-2xl overflow-hidden shadow-lg"
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
                  <img 
                    src="https://source.unsplash.com/random/600x400/?community-project" 
                    alt="Community Project" 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    loading="eager"
                  />
                </div>
              </div>
              
              <Link to="/forum" className="apple-button inline-block">
                Join Our Community
              </Link>
            </motion.div>
          </div>
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
    </MainLayout>
  );
}