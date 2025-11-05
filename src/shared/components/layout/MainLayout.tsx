import { Outlet } from 'react-router-dom';

import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pl-64">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);
