import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiHeart, FiTarget, FiUsers, FiAward, FiGlobe, FiCalendar, FiShield, FiStar, FiArrowRight, FiMessageCircle, FiUser, FiBookOpen, FiActivity, FiDollarSign, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { ref, onValue, off } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

export default function About() {
  // State for teams from Firebase
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

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

  // Fetch teams from Firebase
  useEffect(() => {
    const teamsRef = ref(realtimeDb, 'teams');
    
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setTeams(teamsArray);
      } else {
        setTeams([]);
      }
      setTeamsLoading(false);
    });

    return () => off(teamsRef, 'value', unsubscribe);
  }, []);

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



  return (
    <MainLayout>
      <Helmet>
        <title>About Us - Lumps Away Foundation</title>
        <meta name="description" content="Learn about our mission to support cancer patients through Carol's inspiring story of survival and hope." />
        <script type="text/javascript" defer src="https://donorbox.org/install-popup-button.js" id="donorbox-popup-button-installer"></script>
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

      {/* Founding Story Section */}
      <section id="our-story" className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Our Founding Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Born from personal experience and a passion to help others navigate their cancer journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-8 rounded-2xl border border-pink-200">
                <h3 className="text-2xl font-bold text-pink-800 mb-4">Linda's Journey (2017)</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  During Linda Tusiime's journey with breast cancer in 2017, she was faced with the dilemma that many people who've been diagnosed are faced with – where can I get information? She frantically searched online for young women like her who had faced a similar experience but only found voices from outside Uganda. Voices she could not relate to.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  So, she started a blog – Lumps Away. It was her way of sharing her ordeal while also connecting with others out there to help each other through their shared journeys.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">The Foundation (2019)</h3>
                <p className="text-gray-700 leading-relaxed">
                  In 2019, with her friend, Fiona Toliva, Lumps Away shifted from being a blog to a Cancer Survivorship and Advocacy Organization. The Lumps Away Foundation is an organization built on hope and a passion for helping those going through pain we've known intimately.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pink-500 to-pink-600 p-8 rounded-3xl text-white shadow-2xl"
            >
              <div className="text-center mb-8">
                <FiHeart className="text-6xl text-pink-200 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              </div>
              <p className="text-lg leading-relaxed mb-6">
                Our mission is to create a safe space for women, men, caregivers, friends, and more who are affected by the nightmare that is cancer. We do what we can to help, bring awareness, and be an emotional support while making the lives of those affected by it a little easier.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <p className="text-pink-100 font-medium text-center">
                  "We can't fix it all, but we can do our best. If you care about our cause or are just curious, join us; we're always looking for the extra hand."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support services designed to help cancer patients and survivors at every stage of their journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <FiActivity className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Survivorship Programs</h3>
              <p className="text-gray-600 leading-relaxed">
                Support services designed to help cancer survivors navigate life after treatment, including personalized survivorship care plans and access to counseling and therapy sessions that address the unique challenges of post-cancer life.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FiUsers className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Patient Support</h3>
              <p className="text-gray-600 leading-relaxed">
                Direct assistance for those currently facing cancer, featuring peer counseling services that connect patients with survivors who understand their journey, and assisted transportation services to ensure treatment accessibility regardless of location or financial constraints.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiGlobe className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Advocacy & Education</h3>
              <p className="text-gray-600 leading-relaxed">
                Community-wide initiatives focused on raising cancer awareness, providing educational programs that empower individuals with knowledge about prevention and early detection, and collaborative advocacy efforts that work to improve cancer care policies and resources across Uganda.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a 
              href="/programs" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <span>Learn More About Our Programs</span>
              <FiArrowRight className="text-xl" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Why Support Us Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Why Support Us?</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-pink-50 to-pink-100 p-8 lg:p-12 rounded-3xl border border-pink-200 mb-12"
          >
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6">
              We started Lumps Away because we knew intimately the gaps that exist when facing cancer in our community. When you support us, you're investing in giving hope to patients by making vital cancer information accessible in our local context, providing community connections when people feel most alone, and delivering tangible support through programs like scholarships that keep children in school despite family health crises, and skills training that helps survivors rebuild their livelihoods.
            </p>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              You're not just supporting an organization - you're helping build the community of care that transforms how cancer is experienced in Uganda. Support us because together, we're proving that from the pain of cancer can come the most beautiful growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiDollarSign className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Donate</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Your support means we can ensure services continue to reach those who need it most.
              </p>
              <div dangerouslySetInnerHTML={{
                __html: `
                  <a class="dbox-donation-button" style="background: rgb(223, 24, 167); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: inline-flex; gap: 8px; font-size: 16px; border-radius: 25px; line-height: 24px; padding: 12px 24px; font-weight: 600;" href="https://donorbox.org/survive-and-thrive-804282?">Donate Now</a>
                `
              }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUsers className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Volunteer</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether it's your time, ideas, or services, reach out. We'd love to hear from you.
              </p>
              <a 
                href="/volunteer" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Involved
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiGlobe className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Follow Us</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Get the latest updates of our activities, events, stories and more.
              </p>
              <div className="flex justify-center gap-3">
                <a href="https://www.facebook.com/profile.php?id=100067651137058" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiMessageCircle className="text-lg" />
                </a>
                <a href="https://www.instagram.com/lumpsawayfoundation/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiStar className="text-lg" />
                </a>
                <a href="https://www.linkedin.com/company/lumps-away-foundatin/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiUsers className="text-lg" />
                </a>
                <a href="https://x.com/AwayLumps" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiGlobe className="text-lg" />
                </a>
              </div>
            </motion.div>
          </div>
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

      {/* Team Members by Department */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">Our Team Members</h2>
            <p className="text-xl text-black max-w-3xl mx-auto leading-relaxed">
              Meet the dedicated professionals working across different departments to support our mission.
            </p>
          </motion.div>

          {teamsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-lg animate-pulse">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiUsers className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">No Teams Available</h3>
              <p className="text-gray-500">Team information will be displayed here once available.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {teams.map((team, teamIndex) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: teamIndex * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-6 py-3 mb-4">
                      <FiUsers className="text-2xl text-primary" />
                      <h3 className="text-2xl font-bold text-secondary">{team.name}</h3>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">{team.description}</p>
                  </div>

                  {team.members && team.members.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {team.members.map((member, memberIndex) => (
                        <motion.div
                          key={memberIndex}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: memberIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="bg-accent p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiUser className="text-2xl text-primary" />
                              )}
                            </div>
                            <h4 className="text-xl font-bold text-secondary mb-2">{member.name}</h4>
                            <p className="text-primary font-semibold mb-3">{member.role}</p>
                            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm text-primary font-medium">{team.name}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiUser className="text-2xl text-gray-400" />
                      </div>
                      <p className="text-gray-500">No team members available for this department.</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
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
            <div className="flex flex-wrap gap-6 justify-center">
                <div dangerouslySetInnerHTML={{
                  __html: `
                    <script type="text/javascript" defer src="https://donorbox.org/install-popup-button.js"></script>
                    <a class="dbox-donation-button" style="background: rgb(223, 24, 167); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: flex; gap: 8px; width: fit-content; font-size: 16px; border-radius: 5px; line-height: 24px; padding: 8px 24px;" href="https://donorbox.org/survive-and-thrive-804282?"><img src="https://donorbox.org/images/white_logo.svg" alt="Donate with DonorBox" />Donate Now</a>
                  `
                }} />
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