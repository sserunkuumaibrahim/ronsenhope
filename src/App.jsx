import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import About from './pages/About';
import Gallery from './pages/Gallery';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Donations from './pages/admin/Donations';
import AdminPrograms from './pages/admin/Programs';
import Applications from './pages/admin/Applications';
import Reports from './pages/admin/Reports';
import AdminGallery from './pages/admin/Gallery';

import AdminStories from './pages/admin/Stories';
import ForumManagement from './pages/admin/Forum';
import AdminForumDetail from './pages/admin/ForumDetail';
import Opportunities from './pages/admin/Opportunities';
import Teams from './pages/admin/Teams';
import Testimonials from './pages/admin/Testimonials';
import Carousel from './pages/admin/Carousel';
import Messages from './pages/admin/Messages';

// User Pages
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Donate from './pages/Donate';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import ForumDetail from './pages/ForumDetail';

// Placeholder for pages not yet implemented
import Volunteer from './pages/Volunteer';
import AdminSetup from './components/AdminSetup';
import AdminDebug from './components/AdminDebug';
import FirebaseTest from './components/FirebaseTest';
const UserDonations = () => <div>User Donations (Coming Soon)</div>;

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/firebase-test" element={<FirebaseTest />} />
            {/* <Route path="/admin-setup" element={<AdminSetup />} /> */}
            {/* <Route path="/admin-debug" element={<AdminDebug />} /> */}
            
            {/* Content Routes */}
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumDetail />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-donations" 
              element={
                <ProtectedRoute>
                  <UserDonations />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Users />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/donations" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Donations />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/programs" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminPrograms />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/teams" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Teams />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/opportunities" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Opportunities />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/applications" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Applications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/messages" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Messages />
                </ProtectedRoute>
              } 
            />
            {/* <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              } 
            /> */}
            <Route 
              path="/admin/gallery" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminGallery />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/carousel" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Carousel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stories" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminStories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stories/create" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminStories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/stories/edit/:id" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminStories />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/testimonials" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Testimonials />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/forum" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <ForumManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/forum/:id" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminForumDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  )};

export default App
