import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX, FiHome, FiFileText, FiMessageSquare, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentUser, logout, getUserRole } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useState(() => {
    async function checkAdmin() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const role = await getUserRole();
      setIsAdmin(role === 'admin');
      setLoading(false);
    }

    checkAdmin();
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
    { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/blog', icon: <FiFileText />, label: 'Blog Management' },
    { path: '/admin/forum', icon: <FiMessageSquare />, label: 'Forum Management' },
    { path: '/admin/users', icon: <FiUsers />, label: 'User Management' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 250, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral text-neutral-content fixed h-full z-10 overflow-hidden"
          >
            <div className="p-4 flex justify-between items-center">
              <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>
              <button 
                className="md:hidden text-2xl focus:outline-none"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FiX />
              </button>
            </div>
            
            <nav className="mt-6">
              <ul className="space-y-2 px-4">
                {sidebarItems.map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path} 
                      className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${location.pathname === item.path ? 'bg-primary text-primary-content' : 'hover:bg-base-300 hover:text-neutral'}`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li className="mt-8">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-3 rounded-md w-full text-left hover:bg-base-300 hover:text-neutral transition-colors"
                  >
                    <span className="text-xl"><FiLogOut /></span>
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-[250px]' : ''}`}>
        {/* Header */}
        <header className="bg-base-100 shadow-md p-4">
          <div className="flex justify-between items-center">
            <button 
              className="text-2xl focus:outline-none"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-content">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/">View Site</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}