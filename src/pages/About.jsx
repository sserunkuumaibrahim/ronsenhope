import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTarget, FiUsers, FiAward, FiGlobe, FiCalendar, FiShield, FiStar, FiArrowRight, FiMessageCircle, FiUser, FiBookOpen, FiActivity, FiDollarSign, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { SiTiktok } from 'react-icons/si';
import MainLayout from '../components/layout/MainLayout';
import { ref, onValue, off } from 'firebase/database';
import { realtimeDb } from '../firebase/config';

export default function About() {
  // State for teams from Firebase
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);

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

  // Team members from Ronsen Hope
  const teamMembers = [
    {
      name: 'Mr. Ssenfuma Ronald',
      role: 'Director - Chairperson',
      image: '/team-ronald.jpg',
      icon: FiUser,
      description: 'Founder of Ronsen Hope Christian Foundation Uganda, continuing his late father\'s legacy of helping vulnerable children.',
      expertise: 'Leadership & Community Development'
    },
    {
      name: 'Mrs Nandawula Mariam',
      role: 'Director - Vice Chairperson',
      image: '/team-mariam.jpg',
      icon: FiUsers,
      description: 'Dedicated to supporting the foundation\'s mission of providing care and education to orphaned children.',
      expertise: 'Administration & Family Support'
    },
    {
      name: 'Mrs Ampiire Florence',
      role: 'Director - Executive Secretary',
      image: '/team-florence.jpg',
      icon: FiBookOpen,
      description: 'Manages administrative operations and ensures smooth coordination of foundation activities.',
      expertise: 'Executive Management & Operations'
    },
    {
      name: 'Mrs Nabuule Sarah',
      role: 'Director - Treasurer',
      image: '/team-sarah.jpg',
      icon: FiDollarSign,
      description: 'Oversees financial management and ensures transparent use of donations for children\'s welfare.',
      expertise: 'Financial Management & Accountability'
    },
    {
      name: 'Mr. Mukalazi Martin',
      role: 'Project Manager',
      image: '/team-martin.jpg',
      icon: FiTarget,
      description: 'Leads project implementation and coordinates outreach programs for vulnerable communities.',
      expertise: 'Project Management & Community Outreach'
    },
    {
      name: 'Nakakande Suzan',
      role: 'Head of Education Ministry',
      image: '/team-suzan.jpg',
      icon: FiBookOpen,
      description: 'Oversees educational programs and ensures quality learning opportunities for children.',
      expertise: 'Education & Child Development'
    },
    {
      name: 'Mr. Yiga Dunstan',
      role: 'Head of Welfare Department',
      image: '/team-dunstan.jpg',
      icon: FiHeart,
      description: 'Manages welfare programs ensuring children\'s basic needs and emotional support.',
      expertise: 'Child Welfare & Care'
    },
    {
      name: 'Rev. Sr. Nandyowa Slyvia',
      role: 'Head of Advisory Committee',
      image: '/team-slyvia.jpg',
      icon: FiShield,
      description: 'Provides spiritual guidance and advisory support to the foundation\'s operations.',
      expertise: 'Spiritual Leadership & Advisory'
    },
    {
      name: 'Youth Pastor Shadrack Tendo Ssemanda',
      role: 'Head of Religious Outreaches',
      image: '/team-shadrack.jpg',
      icon: FiGlobe,
      description: 'Leads religious outreach programs and community spiritual development initiatives.',
      expertise: 'Religious Outreach & Youth Ministry'
    },
    {
      name: 'Mr. Ssegawa Frank',
      role: 'Head of Community Affairs',
      image: '/team-frank.jpg',
      icon: FiUsers,
      description: 'Manages community relations and coordinates local partnerships for children\'s support.',
      expertise: 'Community Relations & Partnerships'
    },
    {
      name: 'Mrs Nabukeera Diana-Rose',
      role: 'Head of Health Affairs',
      image: '/team-diana.jpg',
      icon: FiActivity,
      description: 'Oversees health programs and ensures medical care for vulnerable children and families.',
      expertise: 'Health Services & Medical Care'
    }
  ];



  return (
    <MainLayout>
      <Helmet>
        <title>About Us - Ronsen Hope Christian Foundation Uganda</title>
        <meta name="description" content="Learn about Ronsen Hope Christian Foundation Uganda's mission to provide holistic care and support to vulnerable children, orphans, youths and elderly in Uganda." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary"></div>
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
              <FiHeart className="text-primary" />
              <span className="text-sm font-medium">Our Story of Hope</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              About Ronsen Hope Christian Foundation Uganda
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto">
              A Christian based non-profit organization dedicated to providing holistic care and support to vulnerable children, orphans, youths and elderly in Uganda - East Africa.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                className="group relative px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  document.getElementById('our-story').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10">Learn Our Story</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">Learn Our Story</span>
              </button>
              <button 
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-primary transition-all duration-300 backdrop-blur-sm"
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
            alt="Ronsen Hope Christian Foundation Uganda background" 
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
              Born from the legacy of our late father and a passion to continue his work of helping vulnerable children.
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
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200">
                <h3 className="text-2xl font-bold text-orange-800 mb-4">Our History</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Ronsen Hope Christian Foundation Uganda started in 2016 after the death of our Father Late Ssemukuutu Charles. He used to help a number of children in our community and he was so passionate about rescuing those vulnerable children and orphans who were facing difficulties in life even if he was not a rich man. He could feed, shelter and give them some aid in sponsoring their education. When he died a number of needy children suffered because they were depending on him.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  I sat down with my Mother and my two young Sisters, Rev. Sr. Nandyowa Slyvia and Nabuule Sarah and we discussed how we can continue with our father's passion of supporting the needy and I came up with an idea of setting up an orphanage here at home even if the place was not big enough. They supported my passion and idea of setting up an orphanage. I came up with the name "RONSEN" I abbreviated it from my name RONALD SSENFUMA and we registered it as Ronsen Hope Christian Foundation Uganda.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We started with 15 children whom the Late Father had left at our home. Me and my mum struggled alot to look after these children because we did not have any job at that time, we could seek support from our church St. Agnes Catholic church kibuye - Makindye, community leaders and entire community. In 2021 God blessed us with a first donation from Pastor Frank Hurley the President of Equipping the Saints Global from USA who blessed us with bibles, food and scholastic materials. This motivated us to continue with our Godly mission of helping vulnerable children in our communities.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-3xl text-white shadow-2xl"
            >
              <div className="text-center mb-8">
                <FiHeart className="text-6xl text-orange-200 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              </div>
              <p className="text-lg leading-relaxed mb-6">
                Providing a loving, safe, nurturing environment for orphans and vulnerable children, equipping them with education, care, spiritual guidance to thrive, become confident, compassionate responsible individuals and guided by Christian values.
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <p className="text-orange-100 font-medium text-center">
                  "To be a beacon of hope, love, transforming the lives of orphaned and vulnerable children, empowering them to reach their full potential and become positive contributions to their communities, shining with hope and purpose."
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Christian principles that guide our work in supporting vulnerable children and orphans.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <FiHeart className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-orange-800 mb-4">Unconditional Love & Care</h3>
              <p className="text-gray-700 leading-relaxed">
                Demonstrating unconditional love and care for each child, showing empathy and kindness to those in need.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <FiTarget className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">Christian Principles</h3>
              <p className="text-gray-700 leading-relaxed">
                Guiding our work with Christian principles and values, operating with transparency, honesty and accountability.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <FiShield className="text-2xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-800 mb-4">Empowerment</h3>
              <p className="text-gray-700 leading-relaxed">
                Empowering children to reach their full potential, fostering a sense of belonging and community, treating each individual with dignity and respect.
              </p>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-secondary">Our Programs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive outreach programs designed to provide holistic care and support to vulnerable children, orphans, youths and elderly in Uganda.
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
              <h3 className="text-2xl font-bold text-secondary mb-4">Education & Care</h3>
              <p className="text-gray-600 leading-relaxed">
                Providing standard education and medical care to vulnerable children and orphans, equipping them with education, care, and spiritual guidance to thrive and become confident, compassionate individuals.
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
              <h3 className="text-2xl font-bold text-secondary mb-4">Outreach Programs</h3>
              <p className="text-gray-600 leading-relaxed">
                Food and nutrition support, healthcare services, shelter and housing assistance, clothing and basic needs provision, and community development initiatives to alleviate suffering in rural and urban slum areas.
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
              <h3 className="text-2xl font-bold text-secondary mb-4">Youth & Elderly Empowerment</h3>
              <p className="text-gray-600 leading-relaxed">
                Supporting elderly with livelihood programs, empowering youth through skilling and vocational training, and providing evangelistic materials and support to partner churches and schools.
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
              We started Ronsen Hope Christian Foundation Uganda in 2016 following the passing of our father, who was dedicated to helping vulnerable children in our community. When you support us, you're investing in giving hope to orphaned and vulnerable children by providing education, healthcare, shelter, and spiritual guidance. Your donations help us maintain our orphanage, sponsor school fees, provide medical care, and support community outreach programs that transform lives.
            </p>
            <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
              You're not just supporting an organization - you're helping build a community of care that demonstrates Christ's love through practical acts of service. Support us because together, we're creating a lasting impact, transforming lives and communities through faith, love, and service.
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
                  <a class="dbox-donation-button" style="background: rgb(249, 134, 33); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: inline-flex; gap: 8px; font-size: 16px; border-radius: 25px; line-height: 24px; padding: 12px 24px; font-weight: 600; border: 2px solid rgb(249, 134, 33);" href="https://paypal.me/RonsenHopeUgCanada"><img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="Donate with PayPal" style="height: 20px;" />Donate Now</a>
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
                <a href="https://www.facebook.com/100082882375342" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiMessageCircle className="text-lg" />
                </a>
                <a href="https://twitter.com/RonsenHopeUg" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiGlobe className="text-lg" />
                </a>
                <a href="https://www.instagram.com/ronsenhopefoundation/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiStar className="text-lg" />
                </a>
                <a href="https://www.linkedin.com/company/lumps-away-foundatin/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <FiUsers className="text-lg" />
                </a>
                <a href="https://tiktok.com/@ronsenministry" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300">
                  <SiTiktok className="text-lg" />
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





      {/* Call to Action */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600"></div>
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
              <FiHeart className="text-orange-300" />
              <span className="text-sm font-medium">Make a Difference</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent">
              Be Part of the Solution
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-orange-100 leading-relaxed max-w-3xl mx-auto">
              Every donation, every volunteer hour, every shared story brings us closer to a world where 
              no one faces cancer without hope, support, and access to quality care.
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
                <div dangerouslySetInnerHTML={{
                  __html: `
                    <a class="dbox-donation-button" style="background: rgb(249, 134, 33); color: rgb(255, 255, 255); text-decoration: none; font-family: Verdana, sans-serif; display: flex; gap: 8px; width: fit-content; font-size: 16px; border-radius: 5px; line-height: 24px; padding: 8px 24px; border: 2px solid white;" href="https://paypal.me/RonsenHopeUgCanada"><img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" alt="Donate with PayPal" style="height: 26px;" />Donate Now</a>
                  `
                }} />
                <a href="/volunteer" className="group relative px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-xl hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:-translate-y-2">
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