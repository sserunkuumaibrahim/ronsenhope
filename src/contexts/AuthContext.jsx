import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { createAdminUser } from '../utils/seedAdmin';

const AuthContext = createContext();

// Helper function to check if user is admin
async function checkIsAdmin(email) {
  try {
    const adminDoc = await getDoc(doc(db, 'adminRoles', email));
    return adminDoc.exists();
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Determine role based on email
      const isUserAdmin = await checkIsAdmin(email);
      const role = isUserAdmin ? 'admin' : 'user';
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        role,
        createdAt: serverTimestamp(),
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  async function login(email, password) {
    try {
      console.log('Attempting login for:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful for:', email);
      
      // Check if user document exists and get role
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (userDoc.exists()) {
        console.log('User role:', userDoc.data().role);
      } else {
        console.log('User document not found in Firestore');
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      console.log('Starting Google sign-in...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google sign-in successful:', user.email);
      
      // Check if user document exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        console.log('Creating new user document for:', user.email);
        // Determine role based on email
        const role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user';
        
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role,
          createdAt: serverTimestamp(),
        });
        console.log('User document created with role:', role);
      } else {
        console.log('User document already exists');
      }
      
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function getUserRole() {
    if (!currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Ensure user document exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          let userData = null;
          
          if (!userDoc.exists()) {
            // Create user document if it doesn't exist
            const role = ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user';
            userData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email.split('@')[0],
              role,
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', user.uid), userData);
          } else {
            userData = userDoc.data();
          }
          
          // Attach role to user object
          user.role = userData.role;
        }
        setCurrentUser(user);
      } catch (error) {
        console.error('Error in auth state change:', error);
        setCurrentUser(user);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    getUserRole,
    createAdminUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}