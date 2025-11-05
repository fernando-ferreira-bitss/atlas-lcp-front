import { createBrowserRouter, Navigate } from 'react-router-dom';

import { PrivateRoute } from '@/features/auth/components/PrivateRoute';
import { HomePage } from '@/shared/components/common/HomePage';
import { LoginPage } from '@/shared/components/common/LoginPage';

// Placeholder components
const Propostas = () => <div>Propostas em breve...</div>;
const Vendas = () => <div>Vendas em breve...</div>;
const Relatorios = () => <div>Relatórios em breve...</div>;
const Configuracoes = () => <div>Configurações em breve...</div>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <HomePage />,
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
