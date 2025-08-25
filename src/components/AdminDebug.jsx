import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const AdminDebug = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, createAdminUser, currentUser } = useAuth();

  const testAdminLogin = async () => {
    setLoading(true);
    setStatus('Testing admin login...');
    
    try {
      const result = await login('28labs@lumpsaway.org', 'Nopasswordhere!');
      setStatus(`Login successful! User: ${result.user.email}`);
    } catch (error) {
      setStatus(`Login failed: ${error.message}`);
      console.error('Admin login test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAdminExists = async () => {
    setLoading(true);
    setStatus('Checking if admin user exists...');
    
    try {
      // Try to get user document by email (this is a simplified check)
      // In a real app, you'd need to query by email or have a known UID
      setStatus('Admin existence check requires login first');
    } catch (error) {
      setStatus(`Error checking admin: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    setLoading(true);
    setStatus('Creating admin user...');
    
    try {
      await createAdminUser();
      setStatus('Admin user created successfully!');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setStatus('Admin user already exists!');
      } else {
        setStatus(`Failed to create admin: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Debug Panel</h2>
      
      {currentUser && (
        <div className="mb-4 p-3 bg-blue-100 rounded">
          <p><strong>Current User:</strong> {currentUser.email}</p>
          <p><strong>UID:</strong> {currentUser.uid}</p>
        </div>
      )}
      
      <div className="space-y-4">
        <button
          onClick={createAdmin}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Admin User'}
        </button>
        
        <button
          onClick={testAdminLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Admin Login'}
        </button>
        
        <button
          onClick={checkAdminExists}
          disabled={loading}
          className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Admin Exists'}
        </button>
      </div>
      
      {status && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm">{status}</p>
        </div>
      )}
      
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800">Admin Credentials:</h3>
        <p className="text-sm text-yellow-700">Email: 28labs@lumpsaway.org</p>
        <p className="text-sm text-yellow-700">Password: Nopasswordhere!</p>
      </div>
    </div>
  );
};

export default AdminDebug;