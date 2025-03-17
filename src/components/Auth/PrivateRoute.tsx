import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading, initialized } = useAuthStore();

  // Show loading spinner while auth is initializing
  if (loading || !initialized) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    // Redirect to sign in with the return URL
    const returnUrl = encodeURIComponent(window.location.pathname);
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};