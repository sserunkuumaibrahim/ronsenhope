import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

// Test photos data
const testPhotos = [
  {
    title: "Community Outreach Program",
    description: "Our team conducting outreach activities in local communities, providing essential support and resources to families in need.",
    category: "community",
    location: "Kampala, Uganda",
    photographer: "Ronsen Hope Team",
    tags: ["community", "outreach", "support"],
    imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Educational Workshop",
    description: "Children participating in our educational workshops, learning valuable skills for their future development.",
    category: "education",
    location: "Entebbe, Uganda",
    photographer: "Community Partner",
    tags: ["education", "children", "workshops"],
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Medical Support Initiative",
    description: "Providing medical assistance and health awareness programs to underserved communities.",
    category: "healthcare",
    location: "Jinja, Uganda",
    photographer: "Medical Team",
    tags: ["healthcare", "medical", "support"],
    imageUrl: "https://images.unsplash.com/photo-1551190822-a9333d879b1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Clean Water Project",
    description: "Installing clean water systems in rural communities to improve access to safe drinking water.",
    category: "water",
    location: "Rural Uganda",
    photographer: "Engineering Team",
    tags: ["water", "infrastructure", "rural"],
    imageUrl: "https://images.unsplash.com/photo-1541698444083-023c97d3f4b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

async function addTestPhotos() {
  try {
    console.log('Adding test photos to gallery...');

    for (const photo of testPhotos) {
      await addDoc(collection(db, 'gallery'), {
        ...photo,
        uploadDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        likes: Math.floor(Math.random() * 50) + 1
      });
      console.log(`Added photo: ${photo.title}`);
    }

    console.log('All test photos added successfully!');
  } catch (error) {
    console.error('Error adding test photos:', error);
  }
}

addTestPhotos();