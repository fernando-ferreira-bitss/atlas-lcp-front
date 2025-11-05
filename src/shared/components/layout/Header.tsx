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
      <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggle}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChangePasswordOpen(true)}
            >
              <Key className="mr-2 h-4 w-4" />
              Alterar Senha
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </>
  );
};
