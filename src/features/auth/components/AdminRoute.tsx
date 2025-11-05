import { Navigate, Outlet } from 'react-router-dom';

import { useCurrentUser } from '../hooks/useAuth';

import { Loading } from '@/shared/components/common';

/**
 * Componente de rota protegida que valida se o usuário é administrador
 * Redireciona para dashboard se não for admin
 */
export const AdminRoute = () => {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loading />;
  }

  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
