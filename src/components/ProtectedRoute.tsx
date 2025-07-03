
import { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useContext(UserContext);
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;