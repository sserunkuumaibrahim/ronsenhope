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
            className="bg-white rounded-xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-secondary">Send Us a Message</h2>

            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="alert bg-primary/10 text-primary mb-6 flex items-center rounded-xl"
              >
                <FiCheckCircle className="text-lg mr-2" />
                <span>Your message has been sent successfully! We'll get back to you soon.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 border-primary/20 focus:border-primary ${errors.name ? 'input-error' : ''}`}
                    placeholder="John Doe"
                    {...register('name', { 
                      required: 'Name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                </div>
                {errors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10 border-primary/20 focus:border-primary ${errors.email ? 'input-error' : ''}`}
                    placeholder="your.email@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Subject</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                    <FiMessageSquare />
                  </span>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 border-primary/20 focus:border-primary ${errors.subject ? 'input-error' : ''}`}
                    placeholder="How can we help you?"
                    {...register('subject', { 
                      required: 'Subject is required'
                    })}
                  />
                </div>
                {errors.subject && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.subject.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Message</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered h-32 border-primary/20 focus:border-primary ${errors.message ? 'textarea-error' : ''}`}
                  placeholder="Your message here..."
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                />
                {errors.message && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.message.message}</span>
                  </label>
                )}
              </div>

              <button 
                type="submit" 
                className={`btn bg-primary hover:bg-primary/90 text-white w-full ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
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
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-secondary">Contact Information</h2>
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
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-secondary">Connect With Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="btn btn-circle bg-primary/10 hover:bg-primary/20 border-0">
                  <FiFacebook className="text-xl text-primary" />
                </a>
                <a href="#" className="btn btn-circle bg-primary/10 hover:bg-primary/20 border-0">
                  <FiTwitter className="text-xl text-primary" />
                </a>
                <a href="#" className="btn btn-circle bg-primary/10 hover:bg-primary/20 border-0">
                  <FiInstagram className="text-xl text-primary" />
                </a>
                <a href="#" className="btn btn-circle bg-primary/10 hover:bg-primary/20 border-0">
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