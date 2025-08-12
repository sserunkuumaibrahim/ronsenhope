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
import Reports from './pages/admin/Reports';
import Events from './pages/admin/Events';
import Settings from './pages/admin/Settings';
import BlogManagement from './pages/admin/Blog';
import BlogCreate from './pages/admin/BlogCreate';
import BlogEdit from './pages/admin/BlogEdit';
import ForumManagement from './pages/admin/Forum';
import AdminForumDetail from './pages/admin/ForumDetail';

// User Pages
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetail';
import Donate from './pages/Donate';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import ForumDetail from './pages/ForumDetail';

// Placeholder for pages not yet implemented
import Volunteer from './pages/Volunteer';
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
            
            {/* Content Routes */}
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
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
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <BlogManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog/create" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <BlogCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blog/edit/:id" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <BlogEdit />
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
