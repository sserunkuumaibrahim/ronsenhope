import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHeart, FiTarget, FiUsers, FiAward, FiGlobe, FiCalendar, FiShield, FiStar, FiArrowRight, FiMessageCircle, FiUser, FiBookOpen, FiActivity, FiDollarSign, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Team members from boi.md
  const teamMembers = [
    {
      name: 'Fiona Kirabo',
      role: 'Board Chair',
      image: '/Fiona Kirabo Photo .jpg',
      icon: FiUser,
      description: 'Passionate through personal experience with both her sister, Linda, and a close friend who passed away from breast cancer. Has worked in business advisory services and strategic innovation for 15 years across global organizations and Africa.',
      expertise: 'Management, Talent Leadership, Team Resource & Risk Implementation'
    },
    {
       name: 'Justus Amanyire',
       role: 'Legal',
       image: '/Justus Amanyire Photo.jpg',
       icon: FiBookOpen,
      description: 'Lawyer by profession and businessman in real estate development. Believes everyone has interacted with cancer through family and friends, and hopes for Lumps Away to fill the gap in service delivery.',
      expertise: 'Legal Affairs & Real Estate Development'
    },
    {
      name: 'Dr. Alfred Jatho',
      role: 'Technical',
      image: '/Alfred Jatho Photo.jpg',
      icon: FiActivity,
      description: 'Works at Uganda Cancer Institute (UCI) and heads the Department of Community Health Services. Part of the National Cancer Control Secretariat team developing the National Cancer Control Plan.',
      expertise: 'Cancer Control, Population Health & Community Engagement'
    },
    {
      name: 'Winnie Birungi',
      role: 'Finance',
      image: '/Winnie Birungi Photo.jpg',
      icon: FiDollarSign,
      description: 'Senior Consultant and Finance Lead for EYDCD Program. Over 8 years of experience serving as Finance Lead for HIV, CDC PEPFA and USAID programs under the Ministry of Health.',
      expertise: 'Financial Management & Project Accounting'
    }
  ];

  // Carol's story timeline
  const carolTimeline = [
    {
      year: "2016",
      title: "First Symptoms",
      description: "Carol noticed a small lump in her breast but initially dismissed it due to financial constraints and fear. Like many women in Uganda, she hoped it would go away on its own.",
      achievements: ["Recognized early warning signs", "Sought initial consultation"],
      challenges: "Financial barriers, fear, limited health knowledge",
      icon: FiAlertTriangle,
      color: "bg-primary/90 text-primary"
    },
    {
      year: "2017",
      title: "Delayed Diagnosis",
      description: "After months of delay, Carol finally sought medical attention when the lump grew larger. Initial misdiagnosis and lack of proper screening facilities prolonged her journey to proper care.",
      achievements: ["Overcame fear to seek medical help", "Persisted despite initial misdiagnosis"],
      challenges: "Misdiagnosis, inadequate screening facilities, mounting medical costs",
      icon: FiTarget,
      color: "bg-primary/80 text-primary"
    },
    {
      year: "2018",
      title: "Proper Diagnosis & Treatment Begins",
      description: "Carol was finally properly diagnosed with breast cancer at Uganda Cancer Institute. The diagnosis was devastating, but she learned that treatment would be completely free.",
      achievements: ["Received accurate diagnosis", "Started chemotherapy treatment", "Connected with support groups"],
      challenges: "Emotional trauma, treatment side effects, family concerns",
      icon: FiActivity,
      color: "bg-primary/70 text-primary"
    },
    {
      year: "2019",
      title: "Surgery & Recovery",
      description: "Carol underwent mastectomy surgery followed by radiotherapy. The free treatment at UCI saved her life, but the emotional and physical recovery was challenging.",
      achievements: ["Successful surgery completion", "Completed radiotherapy", "Maintained positive outlook"],
      challenges: "Physical recovery, body image concerns, ongoing treatment effects",
      icon: FiShield,
      color: "bg-primary/60 text-primary"
    },
    {
      year: "2020",
      title: "Finding Purpose in Helping Others",
      description: "During the pandemic, Carol began volunteering with UWOCASO, providing support to other cancer patients. She found healing through helping others navigate their cancer journey.",
      achievements: ["Joined UWOCASO as volunteer", "Supported 20+ patients", "Developed peer counseling skills"],
      challenges: "Pandemic restrictions, emotional burden of supporting others",
      icon: FiHeart,
      color: "bg-primary/50 text-primary"
    },
    {
      year: "2021",
      title: "Advocacy & Awareness",
      description: "Carol became an active advocate for cancer awareness and early detection. She shared her story publicly to encourage other women to seek timely medical attention.",
      achievements: ["Spoke at 10+ awareness events", "Reached 500+ women with her message", "Collaborated with health organizations"],
      challenges: "Public speaking fears, reliving trauma, balancing advocacy with personal life",
      icon: FiUsers,
      color: "bg-primary/40 text-primary"
    },
    {
      year: "2022",
      title: "Expanding Support Networks",
      description: "Carol helped establish support groups in rural areas and trained other survivors to become peer counselors. Her work expanded beyond Kampala to reach underserved communities.",
      achievements: ["Established 3 rural support groups", "Trained 15 peer counselors", "Reached remote communities"],
      challenges: "Transportation to rural areas, language barriers, limited resources",
      icon: FiGlobe,
      color: "bg-primary/30 text-primary"
    },
    {
      year: "2023",
      title: "Recognition & Leadership",
      description: "Carol's work was recognized nationally. She was invited to join policy discussions about cancer care and became a voice for patient rights and accessible treatment.",
      achievements: ["Received national recognition", "Joined policy advisory committee", "Influenced healthcare policy"],
      challenges: "Balancing multiple responsibilities, policy complexity, representing diverse patient needs",
      icon: FiAward,
      color: "bg-primary/20 text-primary"
    },
    {
      year: "2024+",
      title: "Inspiring the Future",
      description: "Today, Carol continues her advocacy work while maintaining her health. Her story inspired the creation of Lumps Away Foundation, ensuring her impact reaches even more people.",
      achievements: ["Inspired Lumps Away Foundation", "Continues supporting patients", "Maintains excellent health"],
      challenges: "Sustaining long-term impact, ensuring continuity of support programs",
      icon: FiStar,
      color: "bg-primary/10 text-primary"
    }
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>About Us - Lumps Away Foundation</title>
        <meta name="description" content="Learn about our mission to support cancer patients through Carol's inspiring story of survival and hope." />
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
              <span className="text-sm font-medium">Our Story of Hope</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              About Lumps Away Foundation
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Transforming cancer care in Uganda through accessible treatment, community support, and inspiring stories of hope.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                className="group relative px-8 py-4 bg-white text-pink-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10">Learn Our Story</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">Learn Our Story</span>
              </button>
              <button 
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300 backdrop-blur-sm"
                onClick={() => {
                  window.location.href = '/contact';
                }}
              >
                Get Involved
              </button>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-15">
          <img 
            src="/partners/LAF Logos/logo 7.png" 
            alt="Lumps Away Foundation background" 
            className="w-full h-full object-contain scale-150"
          />
        </div>
      </section>



      {/* Our Team Section */}
      <section className="py-20 bg-accent">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Our Leadership Team</h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Meet the dedicated professionals who guide our mission to transform cancer care in Uganda.
            </p>
          </motion.div>

          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative group flex flex-col lg:flex-row gap-12 items-center p-8 rounded-3xl ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* White background overlay */}
                <div className="absolute inset-0 bg-white rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300 opacity-90 shadow-lg"></div>
                {/* Large Image */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative overflow-hidden rounded-2xl shadow-xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-96 lg:h-[500px] object-contain hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="w-full lg:w-1/2 space-y-6 relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary/10 rounded-full text-primary">
                      <member.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-secondary">{member.name}</h3>
                      <p className="text-xl text-primary font-semibold">{member.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-lg text-black leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div className="bg-primary/5 p-6 rounded-xl">
                    <h4 className="font-bold text-secondary mb-3 text-lg">Key Expertise:</h4>
                    <p className="text-primary font-semibold text-lg">{member.expertise}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Carol's Story Introduction */}
      <section id="carol-story" className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Carol's Inspiring Journey</h2>
            <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
              A story of resilience, hope, and the power of community support in the face of adversity.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMessageCircle className="text-2xl text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary mb-2">Meet Carol</h3>
                    <p className="text-black">31-year-old breast cancer survivor</p>
                  </div>
                </div>
                <p className="text-lg text-black leading-relaxed mb-6">
                  Carol lives in Kamwokya with her 15-year-old daughter, who dreams of making the world a better place. 
                  Before her diagnosis, she was a nursery school teacher earning just UGX 200,000 (USD 53) per month.
                </p>
                <p className="text-lg text-black leading-relaxed">
                  Today, Carol channels her passion for helping others by volunteering with the Uganda Women's Cancer 
                  Support Organization (UWOCASO) and providing support to patients at the Uganda Cancer Institute.
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hope and resilience" 
                  className="w-full h-80 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">8+</div>
                    <div className="text-sm text-gray-600">Years of Journey</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Carol's Timeline */}
      <section className="py-20 bg-accent">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Journey of Courage</h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Follow Carol's eight-year journey from initial symptoms to becoming a beacon of hope for others.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-accent hidden md:block"></div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {carolTimeline.map((event, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:space-x-8`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} mb-8 md:mb-0`}>
                    <div className="bg-accent p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 border-l-4 border-primary">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${event.color} mb-4`}>
                        <event.icon className="text-xl" />
                      </div>
                      <div className="text-lg font-semibold text-primary mb-2">{event.year}</div>
                      <h3 className="text-2xl font-bold text-secondary mb-4">{event.title}</h3>
                      <p className="text-black leading-relaxed mb-6">{event.description}</p>
                      
                      {event.achievements && (
                        <div className="mb-6">
                          <h6 className="font-bold text-secondary mb-3 flex items-center gap-2">
                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                            Key Achievements
                          </h6>
                          <ul className="space-y-2">
                            {event.achievements.map((achievement, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-black">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {event.challenges && (
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h6 className="font-bold text-secondary mb-2 flex items-center gap-2">
                            <FiAlertTriangle className="w-5 h-5 text-orange-600" />
                            Challenges Faced
                          </h6>
                          <p className="text-gray-600 text-sm">{event.challenges}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative z-10 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg hidden md:block"></div>
                  
                  <div className="w-full md:w-5/12"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Insights from Carol's Story */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">What We Learned</h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Carol's journey revealed critical gaps in cancer care and the transformative power of accessible treatment.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-accent p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <FiTarget className="text-2xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Financial Barriers</h3>
              <p className="text-black leading-relaxed">
                Carol's initial delay in seeking proper care was primarily due to financial constraints. 
                Many patients face similar challenges that can be life-threatening.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-accent p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <FiHeart className="text-2xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Free Treatment Works</h3>
              <p className="text-black leading-relaxed">
                At Uganda Cancer Institute, Carol received completely free treatment - chemotherapy, surgery, 
                radiotherapy, and all tests. This saved her life.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-accent p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <FiUsers className="text-2xl text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Support Systems Matter</h3>
              <p className="text-black leading-relaxed">
                Mental health support and community connections were crucial to Carol's survival. 
                She found purpose in helping others through their cancer journey.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>



      {/* Impact Stats */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Our Impact</h2>
            <p className="text-xl text-black max-w-3xl mx-auto">
              Inspired by stories like Carol's, we're making a real difference in cancer care across Uganda.
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-accent p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-green-700 mb-2">500+</div>
              <div className="text-lg text-black">Patients Supported</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-accent p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-blue-700 mb-2">15</div>
              <div className="text-lg text-black">Partner Hospitals</div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-accent p-8 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">100%</div>
              <div className="text-lg text-black">Free Treatment</div>
            </motion.div>
            
            
          </motion.div>
        </div>
      </section>

      {/* Carol's Message */}
      <section className="py-20 bg-accent">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-green-500/5 p-12 rounded-3xl border border-gray-100">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <FiMessageCircle className="text-3xl text-green-500" />
              </div>
              <blockquote className="text-2xl md:text-3xl font-light text-black leading-relaxed mb-8 italic">
                "Taking the financial load off my medical journey is the reason I am alive to share my story today. 
                For now, I am grateful. I am alive."
              </blockquote>
              <div className="text-lg font-semibold text-green-500">— Carol, Breast Cancer Survivor</div>
            </div>
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
              <span className="text-sm font-medium">Make a Difference</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent">
              Be Part of the Solution
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-pink-100 leading-relaxed max-w-3xl mx-auto">
              Every donation, every volunteer hour, every shared story brings us closer to a world where 
              no one faces cancer without hope, support, and access to quality care.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/donate" className="group relative px-10 py-5 bg-white text-pink-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                <span className="relative z-10">Donate Now</span>
                <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">Donate Now</span>
              </a>
              <a href="/volunteer" className="group relative px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-xl hover:bg-white hover:text-pink-600 transition-all duration-300 transform hover:-translate-y-2">
                Volunteer With Us
              </a>
            </div>
          </motion.div>
        </div>
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Making a difference together" 
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </MainLayout>
  );
}