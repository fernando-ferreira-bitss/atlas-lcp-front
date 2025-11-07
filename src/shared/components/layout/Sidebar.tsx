import { BarChart3, Home, Monitor, Target, User, Users, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { cn } from '@/shared/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
    adminOnly: false,
  },
  {
    title: 'Dashboard 2',
    href: '/dashboard-full',
    icon: Monitor,
    adminOnly: false,
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
    adminOnly: false,
  },
  {
    title: 'Metas',
    href: '/metas',
    icon: Target,
    adminOnly: true,
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: Users,
    adminOnly: true,
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const { data: user } = useCurrentUser();
  const { isOpen, close } = useSidebar();

  const handleLinkClick = () => {
    close();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-[45] h-screen w-64 bg-lcp-blue transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-lcp-blue/30 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lcp-orange">
              <span className="text-lg font-bold text-white">LCP</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-base font-bold text-white">Dashboard</h1>
              <p className="text-xs text-blue-200">Vendas</p>
            </div>
          </div>

          {/* Botão fechar para mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={close}
            className="text-blue-100 hover:bg-lcp-blue/50 md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex h-[calc(100vh-4rem)] flex-col justify-between">
          <div className="flex flex-col gap-2 p-4">
            {menuItems
              .filter((item) => !item.adminOnly || user?.is_admin)
              .map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-lcp-orange text-white shadow-md'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
          </div>

          {user && (
            <div className="border-t border-white/10 bg-lcp-blue p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-lcp-orange/20">
                  <User className="h-5 w-5 text-lcp-orange" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-white">{user.nome}</p>
                  <p className="truncate text-xs text-blue-200">{user.email}</p>
                  <p className="mt-1 inline-flex rounded-full bg-lcp-orange/20 px-2 py-0.5 text-xs font-medium text-lcp-orange">
                    {user.is_admin ? 'Admin' : 'Usuário'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
};
