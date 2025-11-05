import { Navigate } from 'react-router-dom';

import { authService } from '../services/authService';

import { MainLayout } from '@/shared/components/layout/MainLayout';

export const PrivateRoute = () => {
  const isAuthenticated = !!authService.getToken();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
};
