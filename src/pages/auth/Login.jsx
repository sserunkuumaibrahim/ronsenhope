

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiHeart, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import MainLayout from '../../components/layout/MainLayout';

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, signInWithGoogle, getUserRole } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);
      await login(data.email, data.password);
      
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
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address format.');
      } else if (err.code === 'auth/user-disabled') {
        setError('This account has been disabled.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
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
    } catch (err) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in was cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked. Please allow pop-ups and try again.');
      } else if (err.code === 'auth/cancelled-popup-request') {
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
        <title>Welcome Back - Lumps Away Foundation</title>
        <meta name="description" content="Sign in to your Lumps Away Foundation account to access the community forum, manage your profile, and continue making a difference." />
      </Helmet>

      {/* Login Section with Soft White Background */}
      <section className="relative min-h-screen py-20 overflow-hidden flex items-center">
        {/* Soft White Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        
        {/* Subtle animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gray-100/30 rounded-full blur-xl"
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
            className="absolute bottom-20 right-10 w-48 h-48 bg-gray-50/20 rounded-full blur-2xl"
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
          <motion.div
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-gray-100/20 rounded-full blur-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-md mx-auto">
            {/* Login Card */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center mb-8"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-6 py-3 mb-6 border border-pink-200"
                  >
                    <FiHeart className="text-pink-500" />
                    <span className="text-sm font-medium text-pink-700">Welcome Back</span>
                  </motion.div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">
                    Sign In
                  </h1>
                  <p className="text-gray-600 text-lg">Continue your journey with us</p>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center"
                  >
                    <FiAlertCircle className="text-red-500 text-lg mr-3 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Login Form */}
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <FiMail className="text-lg" />
                      </div>
                      <input
                        type="email"
                        className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-0 ${
                          errors.email 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : 'border-gray-200 focus:border-pink-400 focus:bg-white'
                        }`}
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
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                        <FiLock className="text-lg" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-0 ${
                          errors.password 
                            ? 'border-red-300 focus:border-red-500 bg-red-50' 
                            : 'border-gray-200 focus:border-pink-400 focus:bg-white'
                        }`}
                        placeholder="••••••••"
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-pink-600 hover:text-pink-700 font-medium transition-colors duration-200"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit" 
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -1 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className={`group relative w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                      loading ? 'cursor-not-allowed opacity-70' : 'hover:-translate-y-1'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                          Signing you in...
                        </>
                      ) : (
                        <>
                          <FiHeart className="mr-2" />
                          Sign In
                        </>
                      )}
                    </span>
                    {!loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

                {/* Sign Up Link */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-8 text-center"
                >
                  <p className="text-gray-600">
                    New to our community?{' '}
                    <Link 
                      to="/signup" 
                      className="text-pink-600 hover:text-pink-700 font-semibold transition-colors duration-200 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}