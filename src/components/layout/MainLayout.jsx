import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

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
            <Link to="/" className="text-2xl font-bold">Ronsen Hope</Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden xl:flex space-x-6 items-center">
              <Link to="/" className="hover:opacity-80 transition-colors">Home</Link>
               <Link to="/about" className="hover:opacity-80 transition-colors">About Us</Link>
              <Link to="/programs" className="hover:opacity-80 transition-colors">Programs</Link>
              <Link to="/stories" className="hover:opacity-80 transition-colors">Stories</Link>
              <Link to="/gallery" className="hover:opacity-80 transition-colors">Gallery</Link>
              <Link to="/forum" className="hover:opacity-80 transition-colors">Forum</Link>
              <Link to="/volunteer" className="hover:opacity-80 transition-colors">Support us</Link>
              <Link to="/contact" className="hover:opacity-80 transition-colors">Contact</Link>
              {console.log(currentUser)}
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
                      {currentUser.role === 'admin' ? (
                        <>
                          <li><Link to="/admin">Dashboard</Link></li>
                          <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                      ) : (
                        <>
                          <li><Link to="/profile">Profile</Link></li>
                          <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="btn btn-sm btn-ghost hover:bg-primary-focus">Login</Link>
                  <Link to="/signup" className="btn btn-sm bg-white text-primary hover:bg-gray-50 border border-primary">Sign Up</Link>
                </div>
              )}
            </nav>
            
            {/* Tablet Auth Buttons */}
            <div className="hidden md:flex xl:hidden items-center space-x-2">
              {currentUser ? (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-lg font-bold text-accent">
                        {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 text-neutral">
                    {currentUser.role === 'admin' ? (
                      <>
                        <li><Link to="/admin">Dashboard</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                      </>
                    ) : (
                      <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={handleLogout}>Logout</button></li>
                      </>
                    )}
                  </ul>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="btn btn-sm btn-ghost hover:bg-primary-focus">Login</Link>
                  <Link to="/signup" className="btn btn-sm bg-white text-primary hover:bg-gray-50 border border-primary">Sign Up</Link>
                </div>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="xl:hidden text-2xl focus:outline-none"
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
            className="xl:hidden bg-white overflow-hidden shadow-lg"
          >
            <nav className="flex flex-col space-y-2 p-4">
              <Link to="/" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">Home</Link>
              <Link to="/programs" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">Programs</Link>
              <Link to="/stories" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">Stories</Link>
              <Link to="/volunteer" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">Volunteer</Link>
              <Link to="/gallery" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">Gallery</Link>
              
              <Link to="/forum" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">Forum</Link>
              <Link to="/about" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">About Us</Link>
              <Link to="/contact" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg">Contact</Link>
              
              {/* Mobile Auth Buttons - Only show on mobile, not tablets */}
              <div className="md:hidden">
                {currentUser ? (
                  <>
                    <div className="divider my-4"></div>
                    {currentUser.role === 'admin' ? (
                      <>
                        <Link to="/admin" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg block">Dashboard</Link>
                        <button 
                          onClick={handleLogout}
                          className="text-gray-700 hover:text-white hover:bg-red-500 transition-all duration-200 py-3 px-4 rounded-lg text-left w-full mt-2"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/profile" className="text-gray-700 hover:text-white hover:bg-primary transition-all duration-200 py-3 px-4 rounded-lg block">Profile</Link>
                        <button 
                          onClick={handleLogout}
                          className="text-gray-700 hover:text-white hover:bg-red-500 transition-all duration-200 py-3 px-4 rounded-lg text-left w-full mt-2"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div className="divider my-4"></div>
                    <div className="flex flex-col space-y-3">
                      <Link to="/login" className="bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 py-3 px-6 rounded-lg text-center font-medium border border-gray-300">Login</Link>
                      <Link to="/signup" className="bg-white text-primary px-6 py-3 rounded-lg hover:bg-gray-50 transition-all duration-200 text-center font-medium shadow-md border border-primary">Sign Up</Link>
                    </div>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-primary text-accent py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-sm">
                We are dedicated to making a positive impact in our community through various charitable initiatives and programs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/programs" className="hover:opacity-80 transition-colors">Our Programs</Link></li>
                <li><Link to="/volunteer" className="hover:opacity-80 transition-colors">Support us</Link></li>
                <li><Link to="/stories" className="hover:opacity-80 transition-colors">Success Stories</Link></li>
                <li><Link to="/contact" className="hover:opacity-80 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-2">
                <li>Email: info@ronsenhopeministries.org</li>
                <li>Phone: +256 123 456 789</li>
                <li>Address: Kampala, Uganda</li>
              </ul>
            </div>
            
          </div>
          <div className="mt-8 pt-8 border-t border-accent/20 text-center">
            <p>&copy; {new Date().getFullYear()} Ronsen Hope Christian Foundation Uganda. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}