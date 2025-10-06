import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const onSubmit = async (data) => {
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(data.email);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else {
        setError('Failed to reset password. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Reset Password - Ronsen Hope Christian Foundation Uganda</title>
        <meta name="description" content="Reset your password for your Ronsen Hope Christian Foundation Uganda account." />
      </Helmet>

      <div className="container-custom py-16 md:py-24">
        <div className="max-w-md mx-auto bg-base-200 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="mt-2 text-base-content/70">We'll send you instructions to reset your password</p>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="alert alert-error mb-6 flex items-center"
              >
                <FiAlertCircle className="text-lg mr-2" />
                <span>{error}</span>
              </motion.div>
            )}

            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="alert alert-success mb-6 flex items-center"
              >
                <FiCheckCircle className="text-lg mr-2" />
                <span>{message}</span>
              </motion.div>
            )}

            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
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

              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Reset Password'}
                </button>
              </div>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-center space-y-2"
            >
              <p>
                <Link to="/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
              </p>
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}