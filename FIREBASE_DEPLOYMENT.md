# Firebase Security Rules Deployment

This document explains how to deploy the Firebase security rules to fix the form submission issue.

## Problem
Forms on the home, contact, and volunteer pages were not submitting until users logged in because Firebase was using default security rules that require authentication for all write operations.

## Solution
I've created Firebase security rules that allow unauthenticated users to submit forms to specific collections while maintaining security for other operations.

## Files Created

### 1. `firestore.rules`
Contains Firestore security rules that:
- Allow unauthenticated writes to `contactMessages`, `newsletterSubscriptions`, and `applications` collections
- Require authentication for user-specific data and admin operations
- Allow public read access to public content (programs, blogs, stories, etc.)

### 2. `firebase.json`
Firebase configuration file that specifies:
- Firestore rules file location
- Hosting configuration for deployment
- Storage rules file location

### 3. `firestore.indexes.json`
Defines database indexes for optimal query performance on form submission collections.

### 4. `storage.rules`
Firebase Storage security rules for file uploads.

## Deployment Instructions

### Prerequisites
1. Ensure you have Firebase CLI installed: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase project: `firebase use --add` (select your project)

### Deploy Security Rules
```bash
# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy all Firebase configurations
firebase deploy
```

### Verify Deployment
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database > Rules
4. Verify the new rules are active

## Testing
After deployment:
1. Open your website without logging in
2. Try submitting the contact form on `/contact`
3. Try subscribing to newsletter on home page
4. Try submitting volunteer application on `/volunteer`
5. All forms should now work without requiring user authentication

## Security Notes
- Only form submission collections allow unauthenticated writes
- Admin operations still require authentication and admin privileges
- User-specific data requires authentication
- Public content allows read access but requires admin privileges for writes

## Collections Affected
- `contactMessages` - Contact form submissions
- `newsletterSubscriptions` - Newsletter subscriptions
- `applications` - Volunteer applications

These collections now accept submissions from unauthenticated users while maintaining read restrictions for privacy.