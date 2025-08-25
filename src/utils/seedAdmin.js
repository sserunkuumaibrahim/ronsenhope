import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Admin credentials
const ADMIN_EMAIL = '28labs@lumpsaway.org';
const ADMIN_PASSWORD = 'Nopasswordhere!';
const ADMIN_NAME = 'Admin User';

export async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Create admin user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName: ADMIN_NAME });
    
    // Create user document in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: ADMIN_NAME,
      role: 'admin',
      createdAt: serverTimestamp(),
    });
    
    console.log('Admin user created successfully!');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
    
    return user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Admin user already exists!');
    } else {
      console.error('Error creating admin user:', error);
      throw error;
    }
  }
}

// Function to call from browser console for testing
window.createAdminUser = createAdminUser;