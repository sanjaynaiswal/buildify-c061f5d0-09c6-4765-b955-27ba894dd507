
import { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useContext(UserContext);
  
  if (!user) {
    // Redirect to login with a return URL
    return <Navigate to="/login" state={{ returnUrl: window.location.pathname }} />;
  }
  
  // If it's a guest user and trying to access paid features
  if (user.isGuest && window.location.pathname.includes('/game/paid')) {
    return <Navigate to="/login" state={{ returnUrl: window.location.pathname }} />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;