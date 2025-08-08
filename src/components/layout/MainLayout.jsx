import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <header className="bg-primary text-accent shadow-md">
        <div className="container-custom py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">Charity NGO</Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              <Link to="/" className="hover:opacity-80 transition-colors">Home</Link>
              <Link to="/blog" className="hover:opacity-80 transition-colors">Blog</Link>
              <Link to="/forum" className="hover:opacity-80 transition-colors">Forum</Link>
              <Link to="/about" className="hover:opacity-80 transition-colors">About Us</Link>
              <Link to="/contact" className="hover:opacity-80 transition-colors">Contact</Link>
              
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                      <div className="w-10 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">
                          {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-neutral">
                      <li><Link to="/profile">Profile</Link></li>
                      {currentUser.role === 'admin' && (
                        <li><Link to="/admin">Admin Dashboard</Link></li>
                      )}
                      <li><button onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="btn btn-sm btn-ghost hover:bg-primary-focus">Login</Link>
                  <Link to="/signup" className="btn btn-sm btn-secondary">Sign Up</Link>
                </div>
              )}
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-2xl focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-base-200 overflow-hidden"
          >
            <nav className="flex flex-col space-y-2 p-4">
              <Link to="/" className="p-2 hover:bg-base-300 rounded-md">Home</Link>
              <Link to="/blog" className="p-2 hover:bg-base-300 rounded-md">Blog</Link>
              <Link to="/forum" className="p-2 hover:bg-base-300 rounded-md">Forum</Link>
              <Link to="/about" className="p-2 hover:bg-base-300 rounded-md">About Us</Link>
              <Link to="/contact" className="p-2 hover:bg-base-300 rounded-md">Contact</Link>
              
              {currentUser ? (
                <>
                  <div className="divider my-1"></div>
                  <Link to="/profile" className="p-2 hover:bg-base-300 rounded-md">Profile</Link>
                  {currentUser.role === 'admin' && (
                    <Link to="/admin" className="p-2 hover:bg-base-300 rounded-md">Admin Dashboard</Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-left hover:bg-base-300 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="divider my-1"></div>
                  <Link to="/login" className="p-2 hover:bg-base-300 rounded-md">Login</Link>
                  <Link to="/signup" className="p-2 hover:bg-base-300 rounded-md">Sign Up</Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary text-accent">
        <div className="container-custom py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Charity NGO</h3>
              <p className="text-sm mb-4">Making a difference in the world through compassion, action, and community.</p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="hover:text-primary transition-colors">Facebook</a>
                <a href="#" className="hover:text-primary transition-colors">Twitter</a>
                <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-base font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/forum" className="hover:text-primary transition-colors">Forum</Link></li>
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-bold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Education</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Healthcare</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Environment</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community Development</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Disaster Relief</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-base font-bold mb-4">Contact Us</h4>
              <address className="not-italic text-sm">
                <p>123 Charity Street</p>
                <p>New York, NY 10001</p>
                <p>Email: info@charity-ngo.org</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="divider my-6"></div>
          
          <div className="text-center">
            <p className="text-xs">&copy; {new Date().getFullYear()} Charity NGO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}