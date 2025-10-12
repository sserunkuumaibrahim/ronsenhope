import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCb_Mlz3VsiIGbkyhRrIwGA3DkiSbvjqJY',
  authDomain: 'ronsen-hope-8d750.firebaseapp.com',
  projectId: 'ronsen-hope-8d750',
  storageBucket: 'ronsen-hope-8d750.firebasestorage.app',
  messagingSenderId: '452730772657',
  appId: '1:452730772657:web:083680235634ab5e599690'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkGallery() {
  try {
    console.log('Checking gallery collection...');
    const galleryRef = collection(db, 'gallery');
    const snapshot = await getDocs(galleryRef);

    console.log(`Found ${snapshot.size} gallery documents`);

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Document:', doc.id);
      console.log('Title:', data.title);
      console.log('Full Image URL:', data.imageUrl);
      console.log('Category:', data.category);
      console.log('---');
    });
  } catch (error) {
    console.error('Error checking gallery:', error);
  }
}

checkGallery();