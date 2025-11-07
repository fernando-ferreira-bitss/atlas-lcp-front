import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AdminRoute, PrivateRoute } from '@/features/auth';
import { Login } from '@/features/auth/pages/Login';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { DashboardFull } from '@/features/dashboard-full';
import { Metas } from '@/features/metas';
import { Relatorios } from '@/features/relatorios';
import { Users } from '@/features/users/pages/Users';

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
        path: 'relatorios',
        element: <Relatorios />,
      },
      {
        path: 'metas',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <Metas />,
          },
        ],
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
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
