import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AdminRoute, PrivateRoute } from '@/features/auth';
import { Login } from '@/features/auth/pages/Login';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { Users } from '@/features/users/pages/Users';

// Placeholder components
const Propostas = () => <div className="p-6">Propostas em breve...</div>;
const Vendas = () => <div className="p-6">Vendas em breve...</div>;
const Relatorios = () => <div className="p-6">Relatórios em breve...</div>;
const Configuracoes = () => <div className="p-6">Configurações em breve...</div>;

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
