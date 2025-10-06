import { useState, useEffect } from 'react';
import { db, auth, realtimeDb, storage } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { ref, get } from 'firebase/database';

export default function FirebaseTest() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [configCheck, setConfigCheck] = useState({});

  useEffect(() => {
    // First check if environment variables are loaded
    const config = {
      apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: !!import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: !!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
      databaseURL: !!import.meta.env.VITE_FIREBASE_DATABASE_URL
    };
    setConfigCheck(config);

    // Check if all required config is present
    const hasAllConfig = Object.values(config).every(Boolean);
    if (!hasAllConfig) {
      setTestResults({ error: 'Missing Firebase configuration in .env file' });
      setLoading(false);
      return;
    }

    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    const results = {
      firestore: false,
      auth: false,
      realtimeDb: false,
      storage: false,
      errors: [],
      configValid: true
    };

    // Check if Firebase config is valid
    try {
      console.log('🔍 Checking Firebase configuration...');
      if (!import.meta.env.VITE_FIREBASE_API_KEY || !import.meta.env.VITE_FIREBASE_PROJECT_ID) {
        throw new Error('Firebase API key or Project ID is missing');
      }
      console.log('✅ Firebase config is valid');
    } catch (error) {
      results.configValid = false;
      results.errors.push(`Config Error: ${error.message}`);
      setTestResults(results);
      setLoading(false);
      return;
    }

    try {
      // Test Firestore - try to access a public collection
      console.log('🔍 Testing Firestore connection...');
      const testCollection = collection(db, 'test');
      await getDocs(testCollection);
      results.firestore = true;
      console.log('✅ Firestore connected successfully');
    } catch (error) {
      results.errors.push(`Firestore: ${error.message}`);
      console.error('❌ Firestore error:', error);
    }

    try {
      // Test Auth - check if auth is initialized
      console.log('🔍 Testing Authentication...');
      if (auth) {
        results.auth = true;
        console.log('✅ Authentication initialized');
      }
    } catch (error) {
      results.errors.push(`Auth: ${error.message}`);
      console.error('❌ Auth error:', error);
    }

    try {
      // Test Realtime Database
      console.log('🔍 Testing Realtime Database...');
      const testRef = ref(realtimeDb, 'test');
      await get(testRef);
      results.realtimeDb = true;
      console.log('✅ Realtime Database connected');
    } catch (error) {
      results.errors.push(`Realtime Database: ${error.message}`);
      console.error('❌ Realtime Database error:', error);
    }

    try {
      // Test Storage
      console.log('🔍 Testing Storage...');
      if (storage) {
        results.storage = true;
        console.log('✅ Storage initialized');
      }
    } catch (error) {
      results.errors.push(`Storage: ${error.message}`);
      console.error('❌ Storage error:', error);
    }

    setTestResults(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Testing Firebase Connection...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Environment Variables Check:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>API Key: {configCheck.apiKey ? '✅' : '❌'}</div>
            <div>Auth Domain: {configCheck.authDomain ? '✅' : '❌'}</div>
            <div>Project ID: {configCheck.projectId ? '✅' : '❌'}</div>
            <div>Storage Bucket: {configCheck.storageBucket ? '✅' : '❌'}</div>
            <div>Messaging Sender ID: {configCheck.messagingSenderId ? '✅' : '❌'}</div>
            <div>App ID: {configCheck.appId ? '✅' : '❌'}</div>
            <div>Measurement ID: {configCheck.measurementId ? '✅' : '❌'}</div>
            <div>Database URL: {configCheck.databaseURL ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>
    );
  }

  if (testResults.error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-red-600">Firebase Configuration Error</h2>
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <p className="text-red-800 mb-4">{testResults.error}</p>
          <div className="bg-gray-100 p-4 rounded text-sm">
            <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
            <ul className="space-y-1">
              <li>VITE_FIREBASE_API_KEY: {configCheck.apiKey ? '✅ Set' : '❌ Missing'}</li>
              <li>VITE_FIREBASE_AUTH_DOMAIN: {configCheck.authDomain ? '✅ Set' : '❌ Missing'}</li>
              <li>VITE_FIREBASE_PROJECT_ID: {configCheck.projectId ? '✅ Set' : '❌ Missing'}</li>
              <li>VITE_FIREBASE_STORAGE_BUCKET: {configCheck.storageBucket ? '✅ Set' : '❌ Missing'}</li>
              <li>VITE_FIREBASE_MESSAGING_SENDER_ID: {configCheck.messagingSenderId ? '✅ Set' : '❌ Missing'}</li>
              <li>VITE_FIREBASE_APP_ID: {configCheck.appId ? '✅ Set' : '❌ Missing'}</li>
              <li>VITE_FIREBASE_MEASUREMENT_ID: {configCheck.measurementId ? '✅ Set' : '❌ Missing'}</li>
              <li>VITE_FIREBASE_DATABASE_URL: {configCheck.databaseURL ? '✅ Set' : '❌ Missing'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Firebase Connection Test Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Services Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Firestore:</span>
              <span className={testResults.firestore ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {testResults.firestore ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Authentication:</span>
              <span className={testResults.auth ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {testResults.auth ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Realtime Database:</span>
              <span className={testResults.realtimeDb ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {testResults.realtimeDb ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Storage:</span>
              <span className={testResults.storage ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                {testResults.storage ? '✅ Connected' : '❌ Failed'}
              </span>
            </div>
          </div>
        </div>

        {testResults.errors.length > 0 && (
          <div className="bg-red-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-red-800">Errors Found</h3>
            <ul className="space-y-2">
              {testResults.errors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Firebase Configuration</h3>
        <div className="bg-gray-100 p-4 rounded text-sm font-mono">
          <div>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing'}</div>
          <div>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'}</div>
          <div>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing'}</div>
          <div>Storage Bucket: {import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing'}</div>
          <div>Database URL: {import.meta.env.VITE_FIREBASE_DATABASE_URL ? '✅ Set' : '❌ Missing'}</div>
        </div>
      </div>
    </div>
  );
}