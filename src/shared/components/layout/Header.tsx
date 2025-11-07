import { Key, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

import { ChangePasswordModal, useLogout } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';
import { useSidebar } from '@/shared/contexts/SidebarContext';

export const Header = () => {
  const logout = useLogout();
  const { toggle } = useSidebar();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-40 border-b bg-white shadow-sm md:left-64">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="text-sm text-lcp-gray md:hidden">Menu</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChangePasswordOpen(true)}
              className="text-lcp-gray hover:text-lcp-blue"
            >
              <Key className="mr-0 h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Alterar Senha</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-lcp-gray hover:text-lcp-orange"
            >
              <LogOut className="mr-0 h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </>
  );
};
