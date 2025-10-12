import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb_Mlz3VsiIGbkyhRrIwGA3DkiSbvjqJY",
  authDomain: "ronsen-hope-8d750.firebaseapp.com",
  databaseURL: "https://ronsen-hope-8d750-default-rtdb.firebaseio.com",
  projectId: "ronsen-hope-8d750",
  storageBucket: "ronsen-hope-8d750.firebasestorage.app",
  messagingSenderId: "452730772657",
  appId: "1:452730772657:web:083680235634ab5e599690",
  measurementId: "G-WGW1KMN8P2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupAdminRole() {
  try {
    console.log('Setting up admin role for admin@ronsenministries.org...');

    await setDoc(doc(db, 'adminRoles', 'admin@ronsenministries.org'), {
      email: 'admin@ronsenministries.org',
      addedBy: 'system',
      addedAt: serverTimestamp(),
      role: 'admin'
    });

    console.log('Admin role set up successfully!');
  } catch (error) {
    console.error('Error setting up admin role:', error);
  }
}

setupAdminRole();