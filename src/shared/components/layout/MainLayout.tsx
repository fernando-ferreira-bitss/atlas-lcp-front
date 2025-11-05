import { Outlet } from 'react-router-dom';


import { Header } from './Header';
import { Sidebar } from './Sidebar';

import { SidebarProvider } from '@/shared/contexts/SidebarContext';

export const MainLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 md:pl-64">
          <div className="container py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  </SidebarProvider>
);
