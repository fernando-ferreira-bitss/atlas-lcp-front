import { BarChart3, FileText, Home, Settings, TrendingUp, User, Users, X } from 'lucide-react';
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
    title: 'Propostas',
    href: '/propostas',
    icon: FileText,
    adminOnly: false,
  },
  {
    title: 'Vendas',
    href: '/vendas',
    icon: TrendingUp,
    adminOnly: false,
  },
  {
    title: 'Relatórios',
    href: '/relatorios',
    icon: BarChart3,
    adminOnly: false,
  },
  {
    title: 'Usuários',
    href: '/usuarios',
    icon: Users,
    adminOnly: true,
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
    adminOnly: false,
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
          'fixed left-0 top-16 z-[45] h-[calc(100vh-4rem)] w-64 border-r bg-blue-800 transition-transform duration-300 ease-in-out',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Botão fechar para mobile */}
        <div className="flex justify-end p-2 md:hidden">
          <Button variant="ghost" size="icon" onClick={close} className="text-blue-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex h-[calc(100%-3rem)] flex-col justify-between md:h-full">
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
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'text-blue-100 hover:bg-blue-600 hover:text-white'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
          </div>

          {user && (
            <div className="border-t border-blue-600 bg-blue-800 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                  <User className="h-5 w-5 text-blue-100" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-white">{user.nome}</p>
                  <p className="truncate text-xs text-blue-200">{user.email}</p>
                  <p className="mt-1 text-xs font-medium text-blue-300">
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
