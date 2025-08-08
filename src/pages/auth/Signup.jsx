import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(data.email, data.password, data.displayName);
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email is already in use. Please use a different email or login.');
      } else {
        setError('Failed to create an account. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Sign Up - Charity NGO</title>
        <meta name="description" content="Create a new account with Charity NGO to join our community, participate in forums, and stay updated with our initiatives." />
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
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="mt-2 text-base-content/70">Join our community to make a difference</p>
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

            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
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
                    className={`input input-bordered w-full pl-10 ${errors.displayName ? 'input-error' : ''}`}
                    placeholder="John Doe"
                    {...register('displayName', { 
                      required: 'Full name is required',
                      minLength: {
                        value: 2,
                        message: 'Name must be at least 2 characters'
                      }
                    })}
                  />
                </div>
                {errors.displayName && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.displayName.message}</span>
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
                  <span className="label-text">Password</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FiLock />
                  </span>
                  <input
                    type="password"
                    className={`input input-bordered w-full pl-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                </div>
                {errors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.password.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm Password</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-base-content/50">
                    <FiLock />
                  </span>
                  <input
                    type="password"
                    className={`input input-bordered w-full pl-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match'
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.confirmPassword.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control mt-6">
                <button 
                  type="submit" 
                  className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 text-center"
            >
              <p>
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}