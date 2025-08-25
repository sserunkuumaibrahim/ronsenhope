import { useState, useEffect } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiHome, FiFileText, FiMessageSquare, FiUsers, FiSettings, FiLogOut, FiCalendar, FiTrendingUp, FiGlobe, FiBarChart, FiClipboard, FiTarget, FiUserCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser, logout, getUserRole } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (currentUser === null) {
      // User is not logged in
      setIsAdmin(false);
      setLoading(false);
    } else if (currentUser) {
      // User is logged in, check role
      if (currentUser.role) {
        // Role is already attached to user object
        setIsAdmin(currentUser.role === 'admin');
        setLoading(false);
      } else {
        // Fallback: fetch role from Firestore
        async function checkAdmin() {
          const role = await getUserRole();
          setIsAdmin(role === 'admin');
          setLoading(false);
        }
        checkAdmin();
      }
    }
  }, [currentUser, getUserRole]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" />;
  }

  const sidebarItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard', description: 'Overview & Analytics' },
    { path: '/admin/users', icon: <FiUsers />, label: 'Users', description: 'Manage Users & Roles' },
    { path: '/admin/programs', icon: <FiTrendingUp />, label: 'Programs', description: 'Manage Programs' },
    { path: '/admin/teams', icon: <FiUserCheck />, label: 'Teams', description: 'Manage Teams & Members' },
    { path: '/admin/opportunities', icon: <FiTarget />, label: 'Opportunities', description: 'Volunteer Opportunities' },
    { path: '/admin/applications', icon: <FiClipboard />, label: 'Applications', description: 'Volunteer Applications' },
    { path: '/admin/gallery', icon: <FiCalendar />, label: 'Gallery', description: 'Photo Management' },
    { path: '/admin/stories', icon: <FiFileText />, label: 'Stories', description: 'Story Management' },
    { path: '/admin/forum', icon: <FiMessageSquare />, label: 'Forum', description: 'Community Discussions' },
    // { path: '/admin/reports', icon: <FiBarChart />, label: 'Reports', description: 'Analytics & Insights' },

  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-white shadow-2xl fixed left-0 top-0 h-full z-20 overflow-hidden border-r border-gray-200"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary to-secondary">
              <div className="flex justify-between items-center">
                <Link to="/admin" className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <FiGlobe className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                    <p className="text-white/80 text-sm">Management Dashboard</p>
                  </div>
                </Link>
                <button 
                  className="lg:hidden text-white/80 hover:text-white text-2xl focus:outline-none transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FiX />
                </button>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="mt-6 px-4">
              <div className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link 
                      to={item.path} 
                      className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        location.pathname === item.path 
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-[1.02]' 
                          : 'hover:bg-gray-50 text-gray-700 hover:text-primary hover:shadow-md'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        location.pathname === item.path 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{item.label}</div>
                        <div className={`text-sm transition-colors ${
                          location.pathname === item.path 
                            ? 'text-white/80' 
                            : 'text-gray-500 group-hover:text-primary/70'
                        }`}>
                          {item.description}
                        </div>
                      </div>
                      {location.pathname === item.path && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-l-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
              
              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="group flex items-center gap-4 p-4 rounded-xl w-full text-left hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-300 hover:shadow-md"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center transition-all duration-300">
                    <FiLogOut className="text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Logout</div>
                    <div className="text-sm text-gray-500 group-hover:text-red-500 transition-colors">Sign out of admin panel</div>
                  </div>
                </button>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0 lg:ml-[280px]' : 'ml-0'} min-w-0`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-4">
              <button 
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 focus:outline-none transition-all duration-200 hover:shadow-md"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
              </button>
              
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm">Manage your organization efficiently</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <div className="hidden lg:flex items-center gap-2">
                <Link 
                  to="/" 
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm font-medium hover:shadow-md flex items-center gap-2"
                >
                  <FiGlobe className="text-sm" />
                  View Site
                </Link>
              </div>
              
              {/* User Menu */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:shadow-lg transition-all duration-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
                      </span>
                    </div>
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-white rounded-2xl w-64 border border-gray-200">
                  <li className="mb-2">
                    <div className="p-3 bg-gray-50 rounded-xl">
                      <div className="font-semibold text-gray-800">{currentUser.displayName || 'Admin User'}</div>
                      <div className="text-sm text-gray-600">{currentUser.email}</div>
                    </div>
                  </li>
                  {/* <li><Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"><FiUsers className="text-lg" />Profile</Link></li> */}
                  <li><Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"><FiGlobe className="text-lg" />View Site</Link></li>
                  <li className="border-t border-gray-100 mt-2 pt-2">
                    <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left">
                      <FiLogOut className="text-lg" />Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 w-full overflow-x-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}