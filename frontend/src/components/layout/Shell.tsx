'use client';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import LandingHeader from './LandingHeader';
import LandingFooter from './LandingFooter';
import CommandPalette from './CommandPalette';

import CustomCursor from './CustomCursor';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || pathname === '/about' || pathname === '/contact';
  const isLoginPage = pathname === '/login';
  const showAdminUI = !isPublicPage && !isLoginPage;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      {showAdminUI && <CommandPalette />}

      <div className={clsx(
        'flex h-screen overflow-hidden transition-colors duration-500',
        showAdminUI ? 'bg-[var(--bg-base)]' : 'bg-white'
      )}>
        {showAdminUI && <Sidebar />}
        <div className="flex flex-col flex-1 overflow-hidden relative">
          {showAdminUI && <Topbar />}
          {isPublicPage && <LandingHeader />}
          <main className={clsx(
            'flex-1 overflow-y-auto w-full relative',
            showAdminUI ? 'p-8 pb-12' : ''
          )}>
            {children}
            {isPublicPage && <LandingFooter />}
          </main>

        </div>
      </div>
    </>
  );
}


