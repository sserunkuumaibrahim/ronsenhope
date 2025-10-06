import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiSave, FiSettings, FiMail, FiGlobe, FiUsers, FiLock, FiImage, FiAlertTriangle, FiCheck } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  
  // Initialize react-hook-form for each settings section
  const { 
    register: registerGeneral, 
    handleSubmit: handleSubmitGeneral,
    setValue: setValueGeneral,
    formState: { errors: errorsGeneral }
  } = useForm();
  
  const { 
    register: registerEmail, 
    handleSubmit: handleSubmitEmail,
    setValue: setValueEmail,
    formState: { errors: errorsEmail }
  } = useForm();
  
  const { 
    register: registerAppearance, 
    handleSubmit: handleSubmitAppearance,
    setValue: setValueAppearance
  } = useForm();
  
  const { 
    register: registerSecurity, 
    handleSubmit: handleSubmitSecurity,
    setValue: setValueSecurity
  } = useForm();

  useEffect(() => {
    // Simulate API fetch to get current settings
    const fetchSettings = async () => {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample settings data
      const generalSettings = {
        organizationName: 'Ronsen Hope Christian Foundation Uganda',
        tagline: 'Empowering lives through child welfare and education',
        contactEmail: 'contact@lumpsaway.org',
        contactPhone: '+256 (700) 123-456',
        address: 'Kampala, Uganda',
        websiteUrl: 'https://lumpsaway.org',
        socialFacebook: 'https://www.facebook.com/100082882375342',
        socialTwitter: 'https://x.com/AwayLumps',
        socialInstagram: 'https://www.instagram.com/ronsenhopefoundation/',
        socialLinkedIn: 'https://www.linkedin.com/company/lumps-away-foundatin/?viewAsMember=true'
      };
      
      const emailSettings = {
        smtpServer: 'smtp.lumpsaway.org',
        smtpPort: '587',
        smtpUsername: 'notifications@lumpsaway.org',
        smtpPassword: '********',
        senderName: 'Ronsen Hope Christian Foundation Uganda',
        senderEmail: 'no-reply@lumpsaway.org',
        enableEmailNotifications: true,
        notifyOnDonations: true,
        notifyOnNewUsers: true,
        notifyOnContactForm: true,
        emailFooter: 'Ronsen Hope Christian Foundation Uganda - Transforming lives through faith, love, and service.'
      };
      
      const appearanceSettings = {
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        accentColor: '#f97316',
        logoUrl: 'https://placehold.co/200x80/3b82f6/ffffff?text=Lumps+Away',
        faviconUrl: 'https://placehold.co/32x32/3b82f6/ffffff?text=LA',
        defaultTheme: 'light',
        enableDarkMode: true,
        customCss: '',
        homepageBannerUrl: 'https://placehold.co/1200x400/3b82f6/ffffff?text=Lumps+Away+Banner',
        footerText: '© 2024 Ronsen Hope Christian Foundation Uganda. All rights reserved.'
      };
      
      const securitySettings = {
        enableTwoFactorAuth: false,
        requireEmailVerification: true,
        passwordMinLength: 8,
        passwordRequireUppercase: true,
        passwordRequireNumbers: true,
        passwordRequireSpecialChars: true,
        sessionTimeout: 60,
        maxLoginAttempts: 5,
        enableCaptcha: true,
        allowUserRegistration: true
      };
      
      // Set form values
      Object.entries(generalSettings).forEach(([key, value]) => {
        setValueGeneral(key, value);
      });
      
      Object.entries(emailSettings).forEach(([key, value]) => {
        setValueEmail(key, value);
      });
      
      Object.entries(appearanceSettings).forEach(([key, value]) => {
        setValueAppearance(key, value);
      });
      
      Object.entries(securitySettings).forEach(([key, value]) => {
        setValueSecurity(key, value);
      });
      
      setLoading(false);
    };

    fetchSettings();
  }, [setValueGeneral, setValueEmail, setValueAppearance, setValueSecurity]);

  const onSubmitGeneral = (data) => {
    saveSettings('general', data);
  };

  const onSubmitEmail = (data) => {
    saveSettings('email', data);
  };

  const onSubmitAppearance = (data) => {
    saveSettings('appearance', data);
  };

  const onSubmitSecurity = (data) => {
    saveSettings('security', data);
  };

  const saveSettings = async (type, data) => {
    setSaveStatus('saving');
    
    // In a real app, this would be an API call to save settings
    console.log(`Saving ${type} settings:`, data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful save
    setSaveStatus('success');
    
    // Reset status after 3 seconds
    setTimeout(() => {
      setSaveStatus(null);
    }, 3000);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Settings - Ronsen Hope Christian Foundation Uganda Admin</title>
        <meta name="description" content="Admin panel for managing application settings" />
      </Helmet>

      <div className="p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Settings</h1>
            
            {saveStatus && (
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Saving changes...</span>
                  </>
                )}
                {saveStatus === 'success' && (
                  <>
                    <FiCheck className="text-success" size={18} />
                    <span className="text-success">Settings saved successfully</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <FiAlertTriangle className="text-error" size={18} />
                    <span className="text-error">Error saving settings</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Settings Navigation */}
            <div className="w-full md:w-64 bg-base-100 rounded-lg shadow-lg p-4">
              <ul className="menu menu-vertical w-full">
                <li>
                  <button 
                    className={activeTab === 'general' ? 'active' : ''}
                    onClick={() => setActiveTab('general')}
                  >
                    <FiSettings size={18} /> General
                  </button>
                </li>
                <li>
                  <button 
                    className={activeTab === 'email' ? 'active' : ''}
                    onClick={() => setActiveTab('email')}
                  >
                    <FiMail size={18} /> Email
                  </button>
                </li>
                <li>
                  <button 
                    className={activeTab === 'appearance' ? 'active' : ''}
                    onClick={() => setActiveTab('appearance')}
                  >
                    <FiImage size={18} /> Appearance
                  </button>
                </li>
                <li>
                  <button 
                    className={activeTab === 'security' ? 'active' : ''}
                    onClick={() => setActiveTab('security')}
                  >
                    <FiLock size={18} /> Security
                  </button>
                </li>
              </ul>
            </div>

            {/* Settings Content */}
            <div className="flex-1 bg-base-100 rounded-lg shadow-lg p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FiGlobe size={20} /> General Settings
                  </h2>
                  
                  <form onSubmit={handleSubmitGeneral(onSubmitGeneral)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Organization Name</span>
                        </label>
                        <input 
                          type="text" 
                          className={`input input-bordered w-full ${errorsGeneral.organizationName ? 'input-error' : ''}`}
                          {...registerGeneral('organizationName', { required: 'Organization name is required' })}
                        />
                        {errorsGeneral.organizationName && (
                          <label className="label">
                            <span className="label-text-alt text-error">{errorsGeneral.organizationName.message}</span>
                          </label>
                        )}
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Tagline</span>
                        </label>
                        <input 
                          type="text" 
                          className="input input-bordered w-full"
                          {...registerGeneral('tagline')}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Contact Email</span>
                        </label>
                        <input 
                          type="email" 
                          className={`input input-bordered w-full ${errorsGeneral.contactEmail ? 'input-error' : ''}`}
                          {...registerGeneral('contactEmail', { 
                            required: 'Contact email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                          })}
                        />
                        {errorsGeneral.contactEmail && (
                          <label className="label">
                            <span className="label-text-alt text-error">{errorsGeneral.contactEmail.message}</span>
                          </label>
                        )}
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Contact Phone</span>
                        </label>
                        <input 
                          type="text" 
                          className="input input-bordered w-full"
                          {...registerGeneral('contactPhone')}
                        />
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Address</span>
                      </label>
                      <textarea 
                        className="textarea textarea-bordered h-20"
                        {...registerGeneral('address')}
                      ></textarea>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Website URL</span>
                      </label>
                      <input 
                        type="url" 
                        className="input input-bordered w-full"
                        {...registerGeneral('websiteUrl')}
                      />
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6 mb-2">Social Media</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Facebook URL</span>
                        </label>
                        <input 
                          type="url" 
                          className="input input-bordered w-full"
                          {...registerGeneral('socialFacebook')}
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Twitter URL</span>
                        </label>
                        <input 
                          type="url" 
                          className="input input-bordered w-full"
                          {...registerGeneral('socialTwitter')}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Instagram URL</span>
                        </label>
                        <input 
                          type="url" 
                          className="input input-bordered w-full"
                          {...registerGeneral('socialInstagram')}
                        />
                      </div>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">LinkedIn URL</span>
                        </label>
                        <input 
                          type="url" 
                          className="input input-bordered w-full"
                          {...registerGeneral('socialLinkedIn')}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button type="submit" className="btn btn-primary gap-2">
                        <FiSave size={18} /> Save General Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FiMail size={20} /> Email Settings
                  </h2>
                  
                  <form onSubmit={handleSubmitEmail(onSubmitEmail)} className="space-y-4">
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">SMTP Configuration</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">SMTP Server</span>
                          </label>
                          <input 
                            type="text" 
                            className={`input input-bordered w-full ${errorsEmail.smtpServer ? 'input-error' : ''}`}
                            {...registerEmail('smtpServer', { required: 'SMTP server is required' })}
                          />
                          {errorsEmail.smtpServer && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errorsEmail.smtpServer.message}</span>
                            </label>
                          )}
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">SMTP Port</span>
                          </label>
                          <input 
                            type="text" 
                            className={`input input-bordered w-full ${errorsEmail.smtpPort ? 'input-error' : ''}`}
                            {...registerEmail('smtpPort', { required: 'SMTP port is required' })}
                          />
                          {errorsEmail.smtpPort && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errorsEmail.smtpPort.message}</span>
                            </label>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">SMTP Username</span>
                          </label>
                          <input 
                            type="text" 
                            className="input input-bordered w-full"
                            {...registerEmail('smtpUsername')}
                          />
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">SMTP Password</span>
                          </label>
                          <input 
                            type="password" 
                            className="input input-bordered w-full"
                            {...registerEmail('smtpPassword')}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Email Sender</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Sender Name</span>
                          </label>
                          <input 
                            type="text" 
                            className={`input input-bordered w-full ${errorsEmail.senderName ? 'input-error' : ''}`}
                            {...registerEmail('senderName', { required: 'Sender name is required' })}
                          />
                          {errorsEmail.senderName && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errorsEmail.senderName.message}</span>
                            </label>
                          )}
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Sender Email</span>
                          </label>
                          <input 
                            type="email" 
                            className={`input input-bordered w-full ${errorsEmail.senderEmail ? 'input-error' : ''}`}
                            {...registerEmail('senderEmail', { 
                              required: 'Sender email is required',
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                              }
                            })}
                          />
                          {errorsEmail.senderEmail && (
                            <label className="label">
                              <span className="label-text-alt text-error">{errorsEmail.senderEmail.message}</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Notification Settings</h3>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerEmail('enableEmailNotifications')}
                          />
                          <span className="label-text">Enable Email Notifications</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerEmail('notifyOnDonations')}
                          />
                          <span className="label-text">Notify on New Donations</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerEmail('notifyOnNewUsers')}
                          />
                          <span className="label-text">Notify on New User Registrations</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerEmail('notifyOnContactForm')}
                          />
                          <span className="label-text">Notify on Contact Form Submissions</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email Footer Text</span>
                      </label>
                      <textarea 
                        className="textarea textarea-bordered h-20"
                        {...registerEmail('emailFooter')}
                      ></textarea>
                    </div>
                    
                    <div className="mt-6">
                      <button type="submit" className="btn btn-primary gap-2">
                        <FiSave size={18} /> Save Email Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FiImage size={20} /> Appearance Settings
                  </h2>
                  
                  <form onSubmit={handleSubmitAppearance(onSubmitAppearance)} className="space-y-4">
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Colors</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Primary Color</span>
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="color" 
                              className="input input-bordered h-10 w-10 p-1"
                              {...registerAppearance('primaryColor')}
                            />
                            <input 
                              type="text" 
                              className="input input-bordered flex-grow"
                              {...registerAppearance('primaryColor')}
                            />
                          </div>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Secondary Color</span>
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="color" 
                              className="input input-bordered h-10 w-10 p-1"
                              {...registerAppearance('secondaryColor')}
                            />
                            <input 
                              type="text" 
                              className="input input-bordered flex-grow"
                              {...registerAppearance('secondaryColor')}
                            />
                          </div>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Accent Color</span>
                          </label>
                          <div className="flex gap-2">
                            <input 
                              type="color" 
                              className="input input-bordered h-10 w-10 p-1"
                              {...registerAppearance('accentColor')}
                            />
                            <input 
                              type="text" 
                              className="input input-bordered flex-grow"
                              {...registerAppearance('accentColor')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Logos & Images</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Logo URL</span>
                          </label>
                          <div className="flex flex-col gap-2">
                            <input 
                              type="text" 
                              className="input input-bordered w-full"
                              {...registerAppearance('logoUrl')}
                            />
                            <div className="bg-base-300 p-2 rounded-lg flex justify-center">
                              <img 
                                src={registerAppearance('logoUrl').value} 
                                alt="Logo Preview" 
                                className="max-h-16"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text">Favicon URL</span>
                          </label>
                          <div className="flex flex-col gap-2">
                            <input 
                              type="text" 
                              className="input input-bordered w-full"
                              {...registerAppearance('faviconUrl')}
                            />
                            <div className="bg-base-300 p-2 rounded-lg flex justify-center">
                              <img 
                                src={registerAppearance('faviconUrl').value} 
                                alt="Favicon Preview" 
                                className="h-8 w-8"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="form-control mt-4">
                        <label className="label">
                          <span className="label-text">Homepage Banner URL</span>
                        </label>
                        <div className="flex flex-col gap-2">
                          <input 
                            type="text" 
                            className="input input-bordered w-full"
                            {...registerAppearance('homepageBannerUrl')}
                          />
                          <div className="bg-base-300 p-2 rounded-lg flex justify-center">
                            <img 
                              src={registerAppearance('homepageBannerUrl').value} 
                              alt="Banner Preview" 
                              className="max-h-32 w-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Theme</h3>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Default Theme</span>
                        </label>
                        <select 
                          className="select select-bordered w-full max-w-xs"
                          {...registerAppearance('defaultTheme')}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                        </select>
                      </div>
                      
                      <div className="form-control mt-2">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerAppearance('enableDarkMode')}
                          />
                          <span className="label-text">Enable Dark Mode Toggle</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Custom CSS</span>
                      </label>
                      <textarea 
                        className="textarea textarea-bordered h-32 font-mono text-sm"
                        placeholder="/* Add your custom CSS here */"
                        {...registerAppearance('customCss')}
                      ></textarea>
                    </div>
                    
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Footer Text</span>
                      </label>
                      <input 
                        type="text" 
                        className="input input-bordered w-full"
                        {...registerAppearance('footerText')}
                      />
                    </div>
                    
                    <div className="mt-6">
                      <button type="submit" className="btn btn-primary gap-2">
                        <FiSave size={18} /> Save Appearance Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FiLock size={20} /> Security Settings
                  </h2>
                  
                  <form onSubmit={handleSubmitSecurity(onSubmitSecurity)} className="space-y-4">
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Authentication</h3>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerSecurity('enableTwoFactorAuth')}
                          />
                          <span className="label-text">Enable Two-Factor Authentication</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerSecurity('requireEmailVerification')}
                          />
                          <span className="label-text">Require Email Verification</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerSecurity('allowUserRegistration')}
                          />
                          <span className="label-text">Allow User Registration</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Password Policy</h3>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Minimum Password Length</span>
                        </label>
                        <input 
                          type="number" 
                          className="input input-bordered w-full max-w-xs"
                          min="6"
                          max="32"
                          {...registerSecurity('passwordMinLength')}
                        />
                      </div>
                      
                      <div className="form-control mt-2">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary"
                            {...registerSecurity('passwordRequireUppercase')}
                          />
                          <span className="label-text">Require Uppercase Letters</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary"
                            {...registerSecurity('passwordRequireNumbers')}
                          />
                          <span className="label-text">Require Numbers</span>
                        </label>
                      </div>
                      
                      <div className="form-control">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="checkbox checkbox-primary"
                            {...registerSecurity('passwordRequireSpecialChars')}
                          />
                          <span className="label-text">Require Special Characters</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="bg-base-200 p-4 rounded-lg mb-4">
                      <h3 className="text-lg font-medium mb-2">Session & Security</h3>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Session Timeout (minutes)</span>
                        </label>
                        <input 
                          type="number" 
                          className="input input-bordered w-full max-w-xs"
                          min="5"
                          {...registerSecurity('sessionTimeout')}
                        />
                      </div>
                      
                      <div className="form-control mt-2">
                        <label className="label">
                          <span className="label-text">Max Login Attempts</span>
                        </label>
                        <input 
                          type="number" 
                          className="input input-bordered w-full max-w-xs"
                          min="1"
                          {...registerSecurity('maxLoginAttempts')}
                        />
                      </div>
                      
                      <div className="form-control mt-2">
                        <label className="label cursor-pointer justify-start gap-4">
                          <input 
                            type="checkbox" 
                            className="toggle toggle-primary"
                            {...registerSecurity('enableCaptcha')}
                          />
                          <span className="label-text">Enable CAPTCHA on Forms</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button type="submit" className="btn btn-primary gap-2">
                        <FiSave size={18} /> Save Security Settings
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}