'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import Loader from '../Loader/Loader';

interface AuthProviderProps {
  children: React.ReactNode;
}

const privateRoutes = ['/profile', '/notes'];

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const isPrivateRoute = privateRoutes.some(route =>
        pathname.startsWith(route)
      );

      try {
        await checkSession();

        const user = await getMe();

        setUser(user);
      } catch {
        clearIsAuthenticated();

        if (isPrivateRoute) {
          await logout().catch(() => {});
          router.replace('/sign-in');
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <Loader />;
  }

  return children;
}
