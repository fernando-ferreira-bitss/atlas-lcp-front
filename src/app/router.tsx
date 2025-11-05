import { createBrowserRouter } from 'react-router-dom';

// Placeholder components - serão criados posteriormente
const HomePage = () => <div>Home Page - Dashboard em breve</div>;
const LoginPage = () => <div>Login Page</div>;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
]);
