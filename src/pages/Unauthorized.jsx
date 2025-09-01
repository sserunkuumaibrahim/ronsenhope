import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHome, FiLock, FiLogIn } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';

export default function Unauthorized() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Access Denied - Lumps Away Foundation</title>
        <meta name="description" content="You do not have permission to access this page." />
      </Helmet>

      <div className="container-custom py-16 md:py-24 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-9xl font-bold text-error mb-4 flex justify-center">
            <FiLock className="w-32 h-32" />
          </div>
          <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
          <p className="text-lg mb-8 text-base-content/70">
            You don't have permission to access this page. This area might be restricted to specific user roles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={goBack} className="btn btn-outline gap-2">
              Go Back
            </button>
            <Link to="/" className="btn btn-primary gap-2">
              <FiHome /> Go to Homepage
            </Link>
            {!currentUser && (
              <Link to="/login" className="btn btn-secondary gap-2">
                <FiLogIn /> Sign In
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 max-w-md mx-auto bg-base-200 p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
          <p className="mb-4 text-left">
            If you believe you should have access to this page, please contact our support team or try the following:
          </p>
          <ul className="space-y-2 text-left list-disc list-inside">
            <li>Make sure you're logged in with the correct account</li>
            <li>Contact your administrator if you need elevated permissions</li>
            <li>Check if your account has the required role for this section</li>
          </ul>
          <div className="mt-6">
            <Link to="/contact" className="btn btn-outline btn-sm w-full">
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}