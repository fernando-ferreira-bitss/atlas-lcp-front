import { LogOut, User } from 'lucide-react';

import { useCurrentUser, useLogout } from '@/features/auth';
import { Button } from '@/shared/components/ui/button';

export const Header = () => {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">Dashboard LCP</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="font-medium">{user.nome}</span>
              <span className="text-muted-foreground">
                {user.is_admin ? '(Admin)' : '(Usuário)'}
              </span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
