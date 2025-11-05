import { RouterProvider } from 'react-router-dom';


import { Providers } from './providers';
import { router } from './router';

import { Toaster } from '@/shared/components/ui/toaster';

export const App = () => (
  <Providers>
    <RouterProvider router={router} />
    <Toaster />
  </Providers>
);
