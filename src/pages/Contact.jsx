import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageSquare, FiPhone, FiMapPin, FiCheckCircle, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      <section className="relative bg-gradient-to-br from-primary to-secondary text-white py-20">
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-lg md:text-xl opacity-90">
              Have questions or want to get involved? We'd love to hear from you. Reach out through any of our channels below.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-16 md:py-24 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8 lg:p-10"
          >
            <h2 className="text-2xl font-bold mb-8 text-secondary">Send Us a Message</h2>

            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-primary/5 border border-primary/10 text-primary px-6 py-4 rounded-xl mb-8 flex items-center"
              >
                <FiCheckCircle className="text-xl mr-3" />
                <span>Your message has been sent successfully! We'll get back to you soon.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="form-control relative">
                <input
                  type="text"
                  placeholder=" "
                  className={`peer h-14 w-full rounded-xl border bg-white px-4 pt-4 outline-none transition-all focus:border-primary ${errors.name ? 'border-error' : 'border-gray-200'}`}
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                />
                <label className="pointer-events-none absolute left-4 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary">
                  Full Name
                </label>
                <span className="absolute right-4 top-4 text-primary">
                  <FiUser className={errors.name ? 'text-error' : 'text-gray-400'} />
                </span>
                {errors.name && (
                  <span className="text-error text-sm mt-1 ml-1">{errors.name.message}</span>
                )}
              </div>

              <div className="form-control relative">
                <input
                  type="email"
                  placeholder=" "
                  className={`peer h-14 w-full rounded-xl border bg-white px-4 pt-4 outline-none transition-all focus:border-primary ${errors.email ? 'border-error' : 'border-gray-200'}`}
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                <label className="pointer-events-none absolute left-4 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary">
                  Email Address
                </label>
                <span className="absolute right-4 top-4 text-primary">
                  <FiMail className={errors.email ? 'text-error' : 'text-gray-400'} />
                </span>
                {errors.email && (
                  <span className="text-error text-sm mt-1 ml-1">{errors.email.message}</span>
                )}
              </div>

              <div className="form-control relative">
                <input
                  type="text"
                  placeholder=" "
                  className={`peer h-14 w-full rounded-xl border bg-white px-4 pt-4 outline-none transition-all focus:border-primary ${errors.subject ? 'border-error' : 'border-gray-200'}`}
                  {...register('subject', { 
                    required: 'Subject is required'
                  })}
                />
                <label className="pointer-events-none absolute left-4 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary">
                  Subject
                </label>
                <span className="absolute right-4 top-4 text-primary">
                  <FiMessageSquare className={errors.subject ? 'text-error' : 'text-gray-400'} />
                </span>
                {errors.subject && (
                  <span className="text-error text-sm mt-1 ml-1">{errors.subject.message}</span>
                )}
              </div>

              <div className="form-control relative">
                <textarea
                  placeholder=" "
                  rows="4"
                  className={`peer w-full rounded-xl border bg-white p-4 pt-6 outline-none transition-all focus:border-primary resize-none ${errors.message ? 'border-error' : 'border-gray-200'}`}
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                ></textarea>
                <label className="pointer-events-none absolute left-4 top-1 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-sm peer-focus:text-primary">
                  Your Message
                </label>
                {errors.message && (
                  <span className="text-error text-sm mt-1 ml-1">{errors.message.message}</span>
                )}
              </div>

              <button 
                type="submit" 
                className={`w-full h-14 bg-primary text-white rounded-xl font-medium transition-all hover:bg-primary/90 active:scale-[0.98] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </span>
                ) : 'Send Message'}
              </button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-10">
              <h2 className="text-2xl font-bold mb-8 text-secondary">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMapPin className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary">Address</h3>
                    <p className="text-gray-600 mt-1">123 Charity Way, Nonprofit District<br />New York, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMail className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary">Email</h3>
                    <p className="text-gray-600 mt-1">info@charityngo.org<br />support@charityngo.org</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiPhone className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary">Phone</h3>
                    <p className="text-gray-600 mt-1">+1 (555) 123-4567<br />+1 (555) 765-4321</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-secondary">Connect With Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="btn btn-circle bg-primary/5 hover:bg-primary/10 border-0">
                  <FiFacebook className="text-xl text-primary" />
                </a>
                <a href="#" className="btn btn-circle bg-primary/5 hover:bg-primary/10 border-0">
                  <FiTwitter className="text-xl text-primary" />
                </a>
                <a href="#" className="btn btn-circle bg-primary/5 hover:bg-primary/10 border-0">
                  <FiInstagram className="text-xl text-primary" />
                </a>
                <a href="#" className="btn btn-circle bg-primary/5 hover:bg-primary/10 border-0">
                  <FiLinkedin className="text-xl text-primary" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}