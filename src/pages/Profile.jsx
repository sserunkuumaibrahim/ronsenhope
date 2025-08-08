import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiDollarSign, FiClock, FiHeart, FiSettings, FiShield, FiLogOut } from 'react-icons/fi';
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
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <button 
            className="btn btn-sm btn-ghost gap-1"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FiEdit2 /> {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        
        {updateSuccess && (
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Profile updated successfully!</span>
          </div>
        )}
        
        {updateError && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{updateError}</span>
          </div>
        )}
        
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="input-group">
                <span className="input-group-addon bg-base-300 px-3 flex items-center">
                  <FiUser />
                </span>
                <input 
                  type="text" 
                  className={`input input-bordered w-full ${errors.displayName ? 'input-error' : ''}`}
                  {...register('displayName', { required: 'Name is required' })}
                />
              </div>
              {errors.displayName && <span className="text-error text-sm mt-1">{errors.displayName.message}</span>}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="input-group">
                <span className="input-group-addon bg-base-300 px-3 flex items-center">
                  <FiMail />
                </span>
                <input 
                  type="email" 
                  className="input input-bordered w-full"
                  {...register('email')}
                  disabled
                />
              </div>
              <span className="text-sm mt-1 text-base-content/70">Email cannot be changed</span>
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <div className="input-group">
                <span className="input-group-addon bg-base-300 px-3 flex items-center">
                  <FiPhone />
                </span>
                <input 
                  type="tel" 
                  className={`input input-bordered w-full ${errors.phone ? 'input-error' : ''}`}
                  {...register('phone', { 
                    pattern: {
                      value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                />
              </div>
              {errors.phone && <span className="text-error text-sm mt-1">{errors.phone.message}</span>}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <div className="input-group">
                <span className="input-group-addon bg-base-300 px-3 flex items-center">
                  <FiMapPin />
                </span>
                <textarea 
                  className={`textarea textarea-bordered w-full ${errors.address ? 'textarea-error' : ''}`}
                  {...register('address')}
                  rows="3"
                ></textarea>
              </div>
              {errors.address && <span className="text-error text-sm mt-1">{errors.address.message}</span>}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button" 
                className="btn btn-ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="card bg-base-200">
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <FiUser className="text-primary" />
                  <div>
                    <p className="text-sm text-base-content/70">Full Name</p>
                    <p className="font-medium">{currentUser.displayName || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <FiMail className="text-primary" />
                  <div>
                    <p className="text-sm text-base-content/70">Email</p>
                    <p className="font-medium">{currentUser.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <FiPhone className="text-primary" />
                  <div>
                    <p className="text-sm text-base-content/70">Phone Number</p>
                    <p className="font-medium">{currentUser.phone || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <FiMapPin className="text-primary" />
                  <div>
                    <p className="text-sm text-base-content/70">Address</p>
                    <p className="font-medium">{currentUser.address || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
          
          <div className="card bg-base-200">
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FiSettings className="text-primary" />
                    <span>Change Password</span>
                  </div>
                  <button className="btn btn-sm btn-ghost">Update</button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FiShield className="text-primary" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <input type="checkbox" className="toggle toggle-primary" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FiLogOut className="text-error" />
                    <span className="text-error">Logout</span>
                  </div>
                  <button 
                    className="btn btn-sm btn-error btn-outline"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    donations: (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Donations</h2>
          <button className="btn btn-primary gap-1">
            <FiDollarSign /> Make a Donation
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-8">
            <FiHeart className="mx-auto text-4xl mb-4 text-base-content/30" />
            <h3 className="text-xl font-semibold mb-2">No Donations Yet</h3>
            <p className="mb-4">You haven't made any donations yet. Start making a difference today!</p>
            <button className="btn btn-primary">Donate Now</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id}>
                    <td>{donation.program}</td>
                    <td>${donation.amount.toFixed(2)}</td>
                    <td>{donation.date}</td>
                    <td>
                      <span className="badge badge-success">{donation.status}</span>
                    </td>
                    <td>
                      {donation.recurring ? (
                        <span className="flex items-center gap-1">
                          <FiClock size={14} /> Monthly
                        </span>
                      ) : (
                        'One-time'
                      )}
                    </td>
                    <td>
                      <button className="btn btn-xs btn-ghost">View Receipt</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="card bg-base-200 mt-8">
          <div className="card-body">
            <h3 className="card-title">Donation Summary</h3>
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Total Donated</div>
                <div className="stat-value text-primary">
                  ${donations.reduce((total, donation) => total + donation.amount, 0).toFixed(2)}
                </div>
                <div className="stat-desc">Lifetime contribution</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Donations</div>
                <div className="stat-value">{donations.length}</div>
                <div className="stat-desc">Total number of donations</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Monthly Recurring</div>
                <div className="stat-value">
                  ${donations.filter(d => d.recurring).reduce((total, donation) => total + donation.amount, 0).toFixed(2)}
                </div>
                <div className="stat-desc">Current monthly commitment</div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Tax Information</h4>
              <p className="text-sm">All donations are tax-deductible. You can download your annual donation receipt for tax purposes.</p>
              <button className="btn btn-sm btn-outline mt-2">Download 2023 Tax Receipt</button>
            </div>
          </div>
        </div>
      </div>
    ),
    volunteering: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Your Volunteer Activities</h2>
        
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mt-4 mb-2">No Volunteer Activities Yet</h3>
          <p className="mb-4">You haven't participated in any volunteer activities yet. Join our volunteer program to make a hands-on difference!</p>
          <button className="btn btn-primary">Explore Volunteer Opportunities</button>
        </div>
        
        <div className="card bg-base-200 mt-8">
          <div className="card-body">
            <h3 className="card-title">Why Volunteer With Us?</h3>
            <ul className="space-y-2 mt-2">
              <li className="flex items-start gap-2">
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Make a direct impact in communities that need it most</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Develop new skills and gain valuable experience</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Connect with like-minded individuals and build your network</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Flexible opportunities that fit your schedule and interests</span>
              </li>
            </ul>
            <button className="btn btn-outline mt-4">Learn More About Volunteering</button>
          </div>
        </div>
      </div>
    )
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Your Profile - Charity NGO</title>
        <meta name="description" content="Manage your profile, donations, and volunteer activities." />
      </Helmet>

      <div className="bg-base-200 py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center gap-6"
          >
            <div className="avatar">
              <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-content">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{currentUser.displayName || 'User'}</h1>
              <p className="text-base-content/70">Member since {new Date().getFullYear()}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="tabs tabs-boxed mb-8">
          <a 
            className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </a>
          <a 
            className={`tab ${activeTab === 'donations' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Donations
          </a>
          <a 
            className={`tab ${activeTab === 'volunteering' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('volunteering')}
          >
            Volunteering
          </a>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {tabContent[activeTab]}
        </motion.div>
      </div>
    </MainLayout>
  );
}