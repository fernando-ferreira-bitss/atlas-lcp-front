import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AdminRoute, PrivateRoute } from '@/features/auth';
import { Login } from '@/features/auth/pages/Login';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { DashboardFull } from '@/features/dashboard-full';
import { GruposPage } from '@/features/grupos';
import { Metas } from '@/features/metas';
import { Relatorios } from '@/features/relatorios';
import { Sincronizacao } from '@/features/sincronizacao';
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
        path: 'grupos',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <GruposPage />,
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
      {
        path: 'sincronizacao',
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <Sincronizacao />,
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
