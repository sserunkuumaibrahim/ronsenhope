# Ronsen Hope Christian Foundation Uganda Web Application

A comprehensive web application for Ronsen Hope Christian Foundation Uganda, supporting vulnerable children, orphans, youths and elderly in Uganda. Built with React, Vite, Tailwind CSS, DaisyUI, and Firebase.

## About

Ronsen Hope Christian Foundation Uganda is a registered Christian-based non-profit organization dedicated to providing holistic care and support to vulnerable children, orphans, youths and elderly in Uganda - East Africa. Our mission is to demonstrate the love of Christ through practical acts of service, empowering vulnerable children and orphans in rural and urban slum areas of Uganda.

## Features

- Responsive design for all devices
- User authentication and role-based access control
- Donation management system
- Program and event management
- Blog and content management
- Admin dashboard with analytics
- User profiles and donation history

## Tech Stack

- **Frontend**: React, React Router, Framer Motion
- **Styling**: Tailwind CSS, DaisyUI
- **Forms**: React Hook Form
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/sserunkuumaibrahim/ronsenhope.git
   cd ronsenhope
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration details

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Enable Storage
5. Get your Firebase configuration and update the `.env` file

## Project Structure

```
/src
  /assets        # Static assets
  /components    # Reusable components
  /contexts      # React contexts (Auth, etc.)
  /firebase      # Firebase configuration
  /pages         # Application pages
    /admin       # Admin pages
    /auth        # Authentication pages
  /App.jsx       # Main application component
  /main.jsx      # Entry point
```

## Deployment

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
