import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import MainLayout from '../../components/layout/MainLayout';

export default function Signup() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, signInWithGoogle, getUserRole } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(data.email, data.password, data.displayName);
      
      // Wait a bit for auth state to update, then check role and redirect
      setTimeout(async () => {
        try {
          const role = await getUserRole();
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error getting user role:', error);
          navigate('/'); // Default to home if role check fails
        }
      }, 100);
    } catch (err) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
      
      // Wait a bit for auth state to update, then check role and redirect
      setTimeout(async () => {
        try {
          const role = await getUserRole();
          if (role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error getting user role:', error);
          navigate('/'); // Default to home if role check fails
        }
      }, 100);
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked. Please allow pop-ups and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Sign-in was cancelled. Please try again.');
      } else {
        setError('Failed to sign in with Google. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Sign Up - Charity NGO</title>
        <meta name="description" content="Create a new account with Charity NGO to join our community, participate in forums, and stay updated with our initiatives." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-4 -left-4 w-72 h-72 bg-gray-200/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -top-4 -right-4 w-72 h-72 bg-gray-300/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute -bottom-8 left-20 w-72 h-72 bg-gray-200/20 rounded-full mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 4,
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-medium rounded-full mb-4">
                <FiUser className="mr-2" />
                Join Our Community
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join our community to make a difference together</p>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center"
              >
                <FiAlertCircle className="text-lg mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <motion.form 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <FiUser className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white/50 backdrop-blur-sm ${
                      errors.displayName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your full name"
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
                  <p className="text-sm text-red-600">{errors.displayName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <FiMail className="w-5 h-5" />
                  </span>
                  <input
                    type="email"
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white/50 backdrop-blur-sm ${
                      errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your email address"
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
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <FiLock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white/50 backdrop-blur-sm ${
                      errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Create a secure password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                    <FiLock className="w-5 h-5" />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors bg-white/50 backdrop-blur-sm ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === watch('password') || 'Passwords do not match'
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  loading ? 'animate-pulse' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </motion.form>

            {/* Google Sign In Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-4">
                {/* Google Sign In Button */}
                <motion.button 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-3 px-6 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium shadow-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300 ${loading ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-0.5'}`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FcGoogle className="text-xl mr-3" />
                      <span>Continue with Google</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-pink-600 hover:text-pink-700 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      </div>
    </MainLayout>
  );
}