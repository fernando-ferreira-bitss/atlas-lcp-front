import { Outlet } from 'react-router-dom';


import { Header } from './Header';
import { Sidebar } from './Sidebar';

import { SidebarProvider } from '@/shared/contexts/SidebarContext';

export const MainLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="min-h-screen pt-16">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);
