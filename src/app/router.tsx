import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AdminRoute, PrivateRoute, PrivateRouteNoLayout } from '@/features/auth';
import { Login } from '@/features/auth/pages/Login';
import { Configuracoes } from '@/features/configuracoes';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { DashboardFull } from '@/features/dashboard-full';
import { Propostas } from '@/features/propostas';
import { Relatorios } from '@/features/relatorios';
import { Users } from '@/features/users/pages/Users';
import { Vendas } from '@/features/vendas';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'dashboard-full',
        element: <DashboardFull />,
      },
      {
        path: 'propostas',
        element: <Propostas />,
      },
      {
        path: 'vendas',
        element: <Vendas />,
      },
      {
        path: 'relatorios',
        element: <Relatorios />,
      },
      {
        path: 'usuarios',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <Users />,
          },
        ],
      },
      {
        path: 'configuracoes',
        element: <Configuracoes />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
