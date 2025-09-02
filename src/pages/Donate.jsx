import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';
import MainLayout from '../components/layout/MainLayout';

export default function Donate() {
  return (
    <MainLayout>
      <Helmet>
        <title>Donate - Lumps Away Foundation</title>
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
          <div dangerouslySetInnerHTML={{
            __html: `
              <script type="text/javascript" defer src="https://donorbox.org/install-popup-button.js"></script>
              <div class="flex justify-center">
                <iframe src="https://donorbox.org/embed/survive-and-thrive-804282?" name="donorbox" scrolling="no" seamless="seamless" frameborder="0" style="max-width: 500px; min-width: 250px; max-height:none!important; margin: 0 auto; border: 3px solid rgb(223, 24, 167); border-radius: 10px;"></iframe>
              </div>
            `
          }} />
        </div>
      </div>
    </MainLayout>
  );
}