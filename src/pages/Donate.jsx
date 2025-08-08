import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiDollarSign, FiCreditCard, FiUser, FiMail, FiCalendar, FiLock, FiCheckCircle } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Donate() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      amount: '50',
      donationType: 'one-time'
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const watchAmount = watch('amount');
  const watchCustomAmount = watch('customAmount');
  const watchDonationType = watch('donationType');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const finalAmount = data.amount === 'custom' ? data.customAmount : data.amount;
    console.log('Donation submitted:', { ...data, finalAmount });
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 5000);
  };

  const donationOptions = [
    { value: '25', label: '$25' },
    { value: '50', label: '$50' },
    { value: '100', label: '$100' },
    { value: '250', label: '$250' },
    { value: 'custom', label: 'Custom Amount' }
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>Donate - Charity NGO</title>
        <meta name="description" content="Support our mission by making a donation. Your contribution helps us create positive change in communities around the world." />
      </Helmet>

      {isSubmitted ? (
        <div className="container-custom py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-base-200 p-8 rounded-lg shadow-lg text-center"
          >
            <div className="text-6xl text-success mb-6 flex justify-center">
              <FiCheckCircle />
            </div>
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Donation!</h1>
            <p className="text-lg mb-6">
              Your generosity makes our work possible. We've sent a confirmation email with the details of your donation.
            </p>
            <p className="mb-8 text-base-content/70">
              Your donation will help us continue our mission to support communities in need and create positive change around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsSubmitted(false)} 
                className="btn btn-primary"
              >
                Make Another Donation
              </button>
              <button 
                onClick={() => window.location.href = '/'} 
                className="btn btn-outline"
              >
                Return to Homepage
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="container-custom py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              Your support enables us to continue our vital work. Every contribution, no matter the size, makes a difference in the lives of those we serve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 bg-base-200 p-8 rounded-lg shadow-lg"
            >
              <h2 className="text-2xl font-semibold mb-6">Donation Information</h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Donation Type</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        value="one-time" 
                        className="radio radio-primary" 
                        {...register('donationType')} 
                      />
                      <span>One-time Donation</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        value="monthly" 
                        className="radio radio-primary" 
                        {...register('donationType')} 
                      />
                      <span>Monthly Donation</span>
                    </label>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Donation Amount</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {donationOptions.map((option) => (
                      <label 
                        key={option.value} 
                        className={`btn ${watchAmount === option.value ? 'btn-primary' : 'btn-outline'}`}
                      >
                        <input 
                          type="radio" 
                          value={option.value} 
                          className="hidden" 
                          {...register('amount')} 
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                  
                  {watchAmount === 'custom' && (
                    <div className="mt-4 relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                        <FiDollarSign />
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        className={`input input-bordered w-full pl-10 ${errors.customAmount ? 'input-error' : ''}`}
                        placeholder="Enter amount"
                        {...register('customAmount', { 
                          required: 'Please enter a donation amount',
                          min: {
                            value: 1,
                            message: 'Minimum donation amount is $1'
                          }
                        })}
                      />
                      {errors.customAmount && (
                        <label className="label">
                          <span className="label-text-alt text-error">{errors.customAmount.message}</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>

                <div className="divider">Personal Information</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          required: 'Name is required'
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
                </div>

                <div className="divider">Payment Information</div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Card Number</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                      <FiCreditCard />
                    </span>
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10 ${errors.cardNumber ? 'input-error' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      {...register('cardNumber', { 
                        required: 'Card number is required',
                        pattern: {
                          value: /^[0-9]{16}$/,
                          message: 'Please enter a valid 16-digit card number'
                        }
                      })}
                    />
                  </div>
                  {errors.cardNumber && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.cardNumber.message}</span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text">Expiration Date</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                        <FiCalendar />
                      </span>
                      <input
                        type="text"
                        className={`input input-bordered w-full pl-10 ${errors.expDate ? 'input-error' : ''}`}
                        placeholder="MM/YY"
                        {...register('expDate', { 
                          required: 'Expiration date is required',
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                            message: 'Please enter a valid date in MM/YY format'
                          }
                        })}
                      />
                    </div>
                    {errors.expDate && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.expDate.message}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">CVV</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                        <FiLock />
                      </span>
                      <input
                        type="text"
                        className={`input input-bordered w-full pl-10 ${errors.cvv ? 'input-error' : ''}`}
                        placeholder="123"
                        {...register('cvv', { 
                          required: 'CVV is required',
                          pattern: {
                            value: /^[0-9]{3,4}$/,
                            message: 'Please enter a valid CVV'
                          }
                        })}
                      />
                    </div>
                    {errors.cvv && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.cvv.message}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    className={`btn btn-primary btn-lg w-full ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : `Donate ${watchAmount === 'custom' ? `$${watchCustomAmount || '0'}` : `$${watchAmount}`} ${watchDonationType === 'monthly' ? 'Monthly' : ''}`}
                  </button>
                </div>

                <p className="text-sm text-base-content/70 text-center mt-4">
                  Your donation is secure and encrypted. By donating, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                </p>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="bg-base-200 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Your Impact</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FiDollarSign className="text-xl text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">$25</h3>
                      <p className="text-base-content/70">Provides clean water for a family for one month</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FiDollarSign className="text-xl text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">$50</h3>
                      <p className="text-base-content/70">Supplies educational materials for 10 children</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FiDollarSign className="text-xl text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">$100</h3>
                      <p className="text-base-content/70">Funds medical supplies for a rural clinic</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <FiDollarSign className="text-xl text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">$250</h3>
                      <p className="text-base-content/70">Helps build sustainable housing for a family</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-base-200 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-6">Other Ways to Give</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Volunteer Your Time</h3>
                      <p className="text-base-content/70">Join our volunteer program and contribute your skills and time.</p>
                      <a href="/volunteer" className="text-primary hover:underline text-sm mt-1 inline-block">Learn more</a>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Corporate Partnerships</h3>
                      <p className="text-base-content/70">Partner with us to make a lasting impact through corporate social responsibility.</p>
                      <a href="/partnerships" className="text-primary hover:underline text-sm mt-1 inline-block">Learn more</a>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Planned Giving</h3>
                      <p className="text-base-content/70">Include our charity in your estate planning to leave a lasting legacy.</p>
                      <a href="/planned-giving" className="text-primary hover:underline text-sm mt-1 inline-block">Learn more</a>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}