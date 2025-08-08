import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiUser, FiMessageSquare, FiPhone, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', data);
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
    
    // Reset success message after 5 seconds
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

      <div className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Have questions or want to get involved? We'd love to hear from you. Fill out the form below or use our contact information to reach out directly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-base-200 p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="alert alert-success mb-6 flex items-center"
              >
                <FiCheckCircle className="text-lg mr-2" />
                <span>Your message has been sent successfully! We'll get back to you soon.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 ${errors.name ? 'input-error' : ''}`}
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
                  <span className="label-text">Email</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
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
                  <span className="label-text">Subject</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FiMessageSquare />
                  </span>
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 ${errors.subject ? 'input-error' : ''}`}
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
                  <span className="label-text">Message</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered h-32 ${errors.message ? 'textarea-error' : ''}`}
                  placeholder="Your message here..."
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                ></textarea>
                {errors.message && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.message.message}</span>
                  </label>
                )}
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary w-full ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-base-200 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMapPin className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-base-content/70">123 Charity Way, Nonprofit District<br />New York, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMail className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-base-content/70">info@charityngo.org<br />support@charityngo.org</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiPhone className="text-xl text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-base-content/70">+1 (555) 123-4567<br />+1 (555) 765-4321</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Office Hours</h2>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 5:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 2:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </li>
              </ul>
              <div className="divider"></div>
              <p className="text-base-content/70">
                Our support team is available during office hours. For urgent matters outside these hours, please email us at emergency@charityngo.org.
              </p>
            </div>

            <div className="bg-base-200 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Connect With Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="btn btn-circle btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="btn btn-circle btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="#" className="btn btn-circle btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="btn btn-circle btn-outline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}