import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageSquare, FiPhone, FiMapPin, FiCheckCircle, FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiSend, FiClock, FiGlobe } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Form submitted:', data);
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Contact Us - Charity NGO</title>
        <meta name="description" content="Get in touch with our team at Charity NGO. We're here to answer your questions and provide support for our programs and initiatives." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-pink-500 to-pink-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"
            animate={{
              x: [0, -40, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto text-white"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30"
            >
              <FiMail className="text-pink-200" />
              <span className="text-sm font-medium">Let's Connect</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent"
            >
              Get in Touch
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed"
            >
              Ready to make a difference together? We'd love to hear from you and explore how we can work together.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button 
                className="group relative px-8 py-4 bg-white text-pink-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="relative z-10 flex items-center">
                  <FiSend className="mr-2" />
                  Send Message
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                  <FiSend className="mr-2" />
                  Send Message
                </span>
              </button>
              <button 
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-pink-600 transition-all duration-300 backdrop-blur-sm flex items-center"
                onClick={() => {
                  document.getElementById('contact-info').scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <FiPhone className="mr-2" />
                Contact Info
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 md:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
          >
            {/* Contact Form */}
            <motion.div
              id="contact-form"
              variants={itemVariants}
              className="relative"
            >
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <FiSend className="text-white text-xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Send Us a Message</h2>
                </div>

                {isSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-sm"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <FiCheckCircle className="text-lg text-green-600" />
                    </div>
                    <span className="font-medium">Your message has been sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="form-control relative group">
                    <input
                      type="text"
                      placeholder=" "
                      className={`peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 pt-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg ${errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                    />
                    <label className="pointer-events-none absolute left-6 top-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                      Full Name
                    </label>
                    <div className="absolute right-6 top-5 transition-colors duration-300">
                      <FiUser className={`text-xl ${errors.name ? 'text-red-400' : 'text-gray-400 group-hover:text-primary'}`} />
                    </div>
                    {errors.name && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 ml-2 font-medium flex items-center gap-1"
                      >
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.name.message}
                      </motion.span>
                    )}
                  </div>

                  <div className="form-control relative group">
                    <input
                      type="email"
                      placeholder=" "
                      className={`peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 pt-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg ${errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address'
                        }
                      })}
                    />
                    <label className="pointer-events-none absolute left-6 top-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                      Email Address
                    </label>
                    <div className="absolute right-6 top-5 transition-colors duration-300">
                      <FiMail className={`text-xl ${errors.email ? 'text-red-400' : 'text-gray-400 group-hover:text-primary'}`} />
                    </div>
                    {errors.email && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 ml-2 font-medium flex items-center gap-1"
                      >
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.email.message}
                      </motion.span>
                    )}
                  </div>

                  <div className="form-control relative group">
                    <input
                      type="text"
                      placeholder=" "
                      className={`peer h-16 w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm px-6 pt-6 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg ${errors.subject ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      {...register('subject', { 
                        required: 'Subject is required'
                      })}
                    />
                    <label className="pointer-events-none absolute left-6 top-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                      Subject
                    </label>
                    <div className="absolute right-6 top-5 transition-colors duration-300">
                      <FiMessageSquare className={`text-xl ${errors.subject ? 'text-red-400' : 'text-gray-400 group-hover:text-primary'}`} />
                    </div>
                    {errors.subject && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 ml-2 font-medium flex items-center gap-1"
                      >
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.subject.message}
                      </motion.span>
                    )}
                  </div>

                  <div className="form-control relative group">
                    <textarea
                      placeholder=" "
                      rows="5"
                      className={`peer w-full rounded-2xl border-2 bg-white/50 backdrop-blur-sm p-6 pt-8 outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:shadow-lg resize-none ${errors.message ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters'
                        }
                      })}
                    ></textarea>
                    <label className="pointer-events-none absolute left-6 top-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-sm peer-focus:font-medium peer-focus:text-primary">
                      Your Message
                    </label>
                    {errors.message && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-2 ml-2 font-medium flex items-center gap-1"
                      >
                        <div className="w-1 h-1 bg-red-500 rounded-full" />
                        {errors.message.message}
                      </motion.span>
                    )}
                  </div>

                  <motion.button 
                    type="submit" 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-16 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-primary/90 hover:to-secondary/90'}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FiSend className="text-xl" />
                        Send Message
                      </span>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              id="contact-info"
              variants={itemVariants}
              className="space-y-8"
            >
              {/* Contact Info Card */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 lg:p-12">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <FiMapPin className="text-white text-xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Get in Touch</h2>
                </div>
                
                <div className="space-y-8">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="group flex items-start p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <FiMapPin className="text-xl text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Visit Our Office</h3>
                      <p className="text-gray-600 leading-relaxed">123 Charity Way, Nonprofit District<br />New York, NY 10001</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="group flex items-start p-6 rounded-2xl bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-secondary to-primary rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <FiMail className="text-xl text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Email Us</h3>
                      <p className="text-gray-600 leading-relaxed">
                        <a href="mailto:info@charityngo.org" className="hover:text-primary transition-colors">info@charityngo.org</a><br />
                        <a href="mailto:support@charityngo.org" className="hover:text-primary transition-colors">support@charityngo.org</a>
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="group flex items-start p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all duration-300"
                  >
                    <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                      <FiPhone className="text-xl text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Call Us</h3>
                      <p className="text-gray-600 leading-relaxed">
                        <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a><br />
                        <a href="tel:+15557654321" className="hover:text-primary transition-colors">+1 (555) 765-4321</a>
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>

               {/* Social Media Card */}
               <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                     <FiGlobe className="text-white text-xl" />
                   </div>
                   <h2 className="text-3xl font-bold text-gray-800">Follow Our Journey</h2>
                 </div>
                 
                 <p className="text-gray-600 mb-8 leading-relaxed">
                   Stay connected with our latest updates, success stories, and community impact.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <motion.a 
                     href="#" 
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300"
                   >
                     <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <FiFacebook className="text-lg text-white" />
                     </div>
                     <span className="font-semibold text-blue-700">Facebook</span>
                   </motion.a>
                   
                   <motion.a 
                     href="#" 
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 transition-all duration-300"
                   >
                     <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <FiTwitter className="text-lg text-white" />
                     </div>
                     <span className="font-semibold text-sky-700">Twitter</span>
                   </motion.a>
                   
                   <motion.a 
                     href="#" 
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all duration-300"
                   >
                     <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <FiInstagram className="text-lg text-white" />
                     </div>
                     <span className="font-semibold text-pink-700">Instagram</span>
                   </motion.a>
                   
                   <motion.a 
                     href="#" 
                     whileHover={{ scale: 1.05, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 transition-all duration-300"
                   >
                     <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                       <FiLinkedin className="text-lg text-white" />
                     </div>
                     <span className="font-semibold text-indigo-700">LinkedIn</span>
                   </motion.a>
                 </div>
               </div>
             </motion.div>
           </motion.div>
         </div>
       </div>
    </MainLayout>
  );
}