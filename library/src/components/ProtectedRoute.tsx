import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

interface ProtectedRouteProps {
  onlyGuest?: boolean;
  allowedRoles?: ('Читатель' | 'Администратор' | 'Библиотекарь')[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  onlyGuest,
  allowedRoles,
  redirectTo = '/',
}) => {
  const { token } = useAppSelector((state) => state.auth);
  const { loaded } = useAppSelector((state) => state.user);
  const user = useAppSelector((state) => state.user.user);
  const user_type = user?.user_type;

  const isAuthenticated = Boolean(token);

  if (isAuthenticated && !loaded) {
    return null;
  }
  
  if (onlyGuest && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!onlyGuest && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user_type || !allowedRoles.includes(user_type))) {
    console.log(allowedRoles, user_type);
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;