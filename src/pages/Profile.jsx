import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiDollarSign, FiClock, FiHeart, FiSettings, FiLogOut, FiUsers, FiStar, FiCalendar, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';

export default function Profile() {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [passwordUpdateError, setPasswordUpdateError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [enrolledOpportunities, setEnrolledOpportunities] = useState([]);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPasswordForm } = useForm();

  useEffect(() => {
    // Fetch user data and populate form
    if (currentUser) {
      setValue('displayName', currentUser.displayName || '');
      setValue('email', currentUser.email || '');
      setValue('phone', currentUser.phone || '');
      setValue('address', currentUser.address || '');
      
      // Simulate fetching donations
      const fetchDonations = async () => {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Sample donations data
        const donationsData = [
          {
            id: 1,
            program: 'Clean Water Initiative',
            amount: 50,
            date: 'June 15, 2023',
            status: 'completed',
            recurring: false
          },
          {
            id: 2,
            program: 'Education for All',
            amount: 25,
            date: 'May 28, 2023',
            status: 'completed',
            recurring: true
          },
          {
            id: 3,
            program: 'Community Development',
            amount: 100,
            date: 'April 10, 2023',
            status: 'completed',
            recurring: false
          }
        ];
        
        setDonations(donationsData);
        
        // Sample enrolled opportunities data
        const enrolledData = [
          {
            id: 1,
            title: 'Community Health Educator',
            category: 'Health',
            location: 'Downtown Community Center',
            startDate: 'March 15, 2024',
            status: 'Active',
            hoursCompleted: 24,
            totalHours: 40,
            coordinator: 'Dr. Sarah Johnson',
            nextSession: 'Tomorrow, 2:00 PM'
          },
          {
            id: 2,
            title: 'Youth Mentor',
            category: 'Education',
            location: 'Lincoln High School',
            startDate: 'February 1, 2024',
            status: 'Active',
            hoursCompleted: 18,
            totalHours: 30,
            coordinator: 'Ms. Emily Davis',
            nextSession: 'Friday, 4:00 PM'
          }
        ];
        
        setEnrolledOpportunities(enrolledData);
        setDonations(donationsData);
        setLoading(false);
      };

      fetchDonations();
    }
  }, [currentUser, setValue]);

  const onSubmit = async (data) => {
    try {
      setUpdateError('');
      setUpdateSuccess(false);
      
      // In a real app, this would update the user profile in the database
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate updating user profile
      await updateUserProfile({
        displayName: data.displayName,
        phone: data.phone,
        address: data.address
      });
      
      setUpdateSuccess(true);
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      setUpdateError('Failed to update profile. Please try again.');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setPasswordUpdateError('');
      setPasswordUpdateSuccess(false);
      
      if (data.newPassword !== data.confirmPassword) {
        setPasswordUpdateError('New passwords do not match');
        return;
      }
      
      // In a real app, this would update the password in the database
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPasswordUpdateSuccess(true);
      resetPasswordForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      setPasswordUpdateError('Failed to update password. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const tabContent = {
    profile: (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Personal Information</h2>
            <p className="text-gray-600 mt-1">Manage your account details and preferences</p>
          </div>
          <button 
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
              isEditing 
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                : 'bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl'
            }`}
            onClick={() => setIsEditing(!isEditing)}
          >
            <FiEdit2 className="w-4 h-4" /> 
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
        
        {updateSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-green-800 font-medium">Profile updated successfully!</span>
          </motion.div>
        )}
        
        {updateError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-red-800 font-medium">{updateError}</span>
          </motion.div>
        )}
        
        {isEditing ? (
          <div className="bg-gray-50 rounded-2xl p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                      errors.displayName 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : 'border-gray-200 focus:border-primary bg-white hover:border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    {...register('displayName', { required: 'Name is required' })}
                  />
                  {errors.displayName && (
                    <span className="text-red-600 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.displayName.message}
                    </span>
                  )}
                </div>
                 
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                     <FiMail className="w-4 h-4" />
                     Email Address
                   </label>
                   <input 
                     type="email" 
                     className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                     placeholder="Your email address"
                     {...register('email')}
                     disabled
                   />
                   <span className="text-gray-500 text-sm flex items-center gap-1">
                     <FiShield className="w-4 h-4" />
                     Email cannot be changed for security reasons
                   </span>
                 </div>
               </div>
            
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                     <FiPhone className="w-4 h-4" />
                     Phone Number
                   </label>
                   <input 
                     type="tel" 
                     className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                       errors.phone 
                         ? 'border-red-300 focus:border-red-500 bg-red-50' 
                         : 'border-gray-200 focus:border-primary bg-white hover:border-gray-300'
                     }`}
                     placeholder="+1 (555) 123-4567"
                     {...register('phone', { 
                       pattern: {
                         value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                         message: 'Please enter a valid phone number'
                       }
                     })}
                   />
                   {errors.phone && (
                     <span className="text-red-600 text-sm flex items-center gap-1">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                       </svg>
                       {errors.phone.message}
                     </span>
                   )}
                 </div>
                 
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                     <FiMapPin className="w-4 h-4" />
                     Address
                   </label>
                   <textarea 
                     className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary bg-white hover:border-gray-300 transition-all duration-300 focus:outline-none resize-none"
                     placeholder="Enter your address"
                     {...register('address')}
                     rows="3"
                   ></textarea>
                 </div>
               </div>
               
               <div className="flex justify-end gap-4 mt-8">
                 <button 
                   type="button" 
                   className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                   onClick={() => setIsEditing(false)}
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="px-6 py-3 rounded-xl font-medium text-white bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                 >
                   Save Changes
                 </button>
               </div>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FiUser className="text-blue-600 w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800">Full Name</span>
              </div>
              <p className="text-xl font-medium text-gray-900">{currentUser.displayName || 'Not provided'}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FiMail className="text-green-600 w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800">Email Address</span>
              </div>
              <p className="text-xl font-medium text-gray-900">{currentUser.email}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FiPhone className="text-purple-600 w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800">Phone Number</span>
              </div>
              <p className="text-xl font-medium text-gray-900">{currentUser.phone || 'Not provided'}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FiMapPin className="text-orange-600 w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-800">Address</span>
              </div>
              <p className="text-xl font-medium text-gray-900">{currentUser.address || 'Not provided'}</p>
            </div>
          </div>
        )}
        

      </div>
    ),

    volunteering: (
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Volunteer Activities</h2>
          <p className="text-gray-600">Track your volunteer commitments and progress</p>
        </div>

        {/* Enrolled Volunteer Opportunities */}
        {enrolledOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enrolledOpportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <FiHeart className="text-white text-xl" />
                  </div>
                  <span className={`px-3 py-1 text-white text-sm font-medium rounded-full ${
                    opportunity.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {opportunity.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-800">{opportunity.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-3 text-blue-500" />
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiCalendar className="mr-3 text-green-500" />
                    <span>Started: {opportunity.startDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUsers className="mr-3 text-purple-500" />
                    <span>Coordinator: {opportunity.coordinator}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{opportunity.hoursCompleted}/{opportunity.totalHours} hours</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(opportunity.hoursCompleted / opportunity.totalHours) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <FiClock className="text-blue-600" />
                    <span className="font-semibold text-blue-800">Next Session</span>
                  </div>
                  <p className="text-blue-700">{opportunity.nextSession}</p>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300">
                    View Details
                  </button>
                  <button className="flex-1 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-primary hover:text-primary transition-all duration-300">
                    Contact Coordinator
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-50 rounded-2xl p-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUsers className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Active Volunteer Activities</h3>
            <p className="text-gray-600 mb-6">You haven't enrolled in any volunteer opportunities yet.</p>
            <button className="px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300">
              Browse Opportunities
            </button>
          </div>
        )}
      </div>
    ),

    settings: (
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Account Settings</h2>
          <p className="text-gray-600">Manage your account security and preferences</p>
        </div>
        
        {/* Password Update Form */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FiLock className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
              <p className="text-gray-600 text-sm">Update your password to keep your account secure</p>
            </div>
          </div>
          
          {passwordUpdateSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-green-800 font-medium">Password updated successfully!</span>
            </motion.div>
          )}
          
          {passwordUpdateError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-red-800 font-medium">{passwordUpdateError}</span>
            </motion.div>
          )}
          
          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrentPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none pr-12 ${
                    passwordErrors.currentPassword 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-primary bg-white hover:border-gray-300'
                  }`}
                  placeholder="Enter your current password"
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <span className="text-red-600 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordErrors.currentPassword.message}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none pr-12 ${
                    passwordErrors.newPassword 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-primary bg-white hover:border-gray-300'
                  }`}
                  placeholder="Enter your new password"
                  {...registerPassword('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <span className="text-red-600 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordErrors.newPassword.message}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none pr-12 ${
                    passwordErrors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-primary bg-white hover:border-gray-300'
                  }`}
                  placeholder="Confirm your new password"
                  {...registerPassword('confirmPassword', { required: 'Please confirm your new password' })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <span className="text-red-600 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordErrors.confirmPassword.message}
                </span>
              )}
            </div>
            
            <button 
              type="submit" 
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Update Password
            </button>
          </form>
        </div>
        
        {/* Other Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Account Actions</h3>
          
          <div className="space-y-4">

            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <FiLogOut className="text-red-600 w-5 h-5" />
                </div>
                <span className="font-medium text-red-600">Logout</span>
              </div>
              <button 
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium border border-red-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Your Profile - Lumps Away Foundation</title>
        <meta name="description" content="Manage your profile, donations, and volunteer activities." />
      </Helmet>

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* User Profile Header */}
            <div className="p-8 border-b border-gray-100">
              <div className="flex items-center gap-6">
                {/* Profile Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-lg">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-bold text-primary">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                    {currentUser.displayName || 'User'}
                  </h1>
                  <p className="text-gray-600">{currentUser.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Member since {new Date().getFullYear()}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-8 pt-6">
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-2xl p-2 inline-flex gap-2">
                  <button 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'profile' 
                        ? 'bg-white text-primary shadow-lg transform scale-105' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile
                  </button>

                  <button 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'volunteering' 
                        ? 'bg-white text-primary shadow-lg transform scale-105' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={() => setActiveTab('volunteering')}
                  >
                    Volunteering
                  </button>

                  <button 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeTab === 'settings' 
                        ? 'bg-white text-primary shadow-lg transform scale-105' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content with Enhanced Styling */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8"
            >
              {tabContent[activeTab]}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}