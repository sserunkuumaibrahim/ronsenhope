import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState('');
  const { createAdminUser } = useAuth();

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    setMessage('');
    
    try {
      await createAdminUser();
      setMessage('Admin user created successfully! Email: admin@ronsenministries.org, Password: Nopasswordhere!');
    } catch (error) {
      console.error('Error creating admin:', error);
      if (error.code === 'auth/email-already-in-use') {
        setMessage('Admin user already exists.');
      } else {
        setMessage('Failed to create admin user: ' + error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Setup</h2>
      <p className="text-gray-600 mb-4 text-sm">
        Click the button below to create an admin user with the following credentials:
      </p>
      <div className="bg-gray-100 p-3 rounded mb-4 text-sm">
        <p><strong>Email:</strong> admin@ronsenministries.org</p>
        <p><strong>Password:</strong> Nopasswordhere!</p>
      </div>
      
      <button
        onClick={handleCreateAdmin}
        disabled={isCreating}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? 'Creating Admin...' : 'Create Admin User'}
      </button>
      
      {message && (
        <div className={`mt-4 p-3 rounded text-sm ${
          message.includes('successfully') 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdminSetup;