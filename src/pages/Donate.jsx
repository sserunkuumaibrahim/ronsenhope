import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Donate() {
  return (
    <MainLayout>
      <Helmet>
        <title>Donate - Ronsen Hope Christian Foundation Uganda</title>
        <meta name="description" content="Support our mission by making a donation. Your contribution helps us create positive change in communities around the world." />
      </Helmet>

      <div className="container-custom py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Make a Donation</h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Your support enables us to continue our vital work. Every contribution, no matter the size, makes a difference in the lives of those we serve.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div dangerouslySetInnerHTML={{
              __html: `
                <a href="https://paypal.me/RonsenHopeUgCanada" target="_blank" rel="noopener noreferrer" class="inline-block">
                  <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_150x38.png" alt="Donate with PayPal" style="height: 38px;" />
                </a>
                <p class="mt-4 text-lg text-base-content/70">Click the PayPal button above to make a secure donation</p>
              `
            }} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}