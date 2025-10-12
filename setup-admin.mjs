import { createAdminUser } from './src/utils/seedAdmin.js';

async function setupAdmin() {
  try {
    console.log('Setting up admin roles...');
    await createAdminUser();
    console.log('Admin setup complete!');
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}

setupAdmin();