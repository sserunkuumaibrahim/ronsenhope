import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { currentUser, getUserRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      if (requiredRole) {
        const role = await getUserRole();
        setHasAccess(role === requiredRole);
      } else {
        setHasAccess(true);
      }
      
      setLoading(false);
    }

    checkAccess();
  }, [currentUser, getUserRole, requiredRole]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !hasAccess) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}