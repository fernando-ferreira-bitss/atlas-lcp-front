import { RouterProvider } from 'react-router-dom';
import { Toaster as SonnerToaster } from 'sonner';

import { Providers } from './providers';
import { router } from './router';

import { Toaster } from '@/shared/components/ui/toaster';

export const App = () => (
  <Providers>
    <RouterProvider router={router} />
    <Toaster />
    <SonnerToaster position="top-right" richColors />
  </Providers>
);
