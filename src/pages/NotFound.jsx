import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHome, FiHelpCircle } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <Helmet>
        <title>Page Not Found - Charity NGO</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <div className="container-custom py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
          <p className="text-lg mb-8 text-base-content/70">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn btn-primary gap-2">
              <FiHome /> Go to Homepage
            </Link>
            <Link to="/contact" className="btn btn-outline gap-2">
              <FiHelpCircle /> Contact Support
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 max-w-md mx-auto bg-base-200 p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Looking for something?</h3>
          <ul className="space-y-2 text-left">
            <li>
              <Link to="/programs" className="text-primary hover:underline">Our Programs</Link>
              <span className="text-base-content/70"> - Learn about our initiatives</span>
            </li>
            <li>
              <Link to="/donate" className="text-primary hover:underline">Donate</Link>
              <span className="text-base-content/70"> - Support our cause</span>
            </li>
            <li>
              <Link to="/volunteer" className="text-primary hover:underline">Volunteer</Link>
              <span className="text-base-content/70"> - Join our community</span>
            </li>
            <li>
              <Link to="/blog" className="text-primary hover:underline">Blog</Link>
              <span className="text-base-content/70"> - Read our latest updates</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </MainLayout>
  );
}