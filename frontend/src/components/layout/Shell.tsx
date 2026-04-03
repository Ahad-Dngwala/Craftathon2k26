'use client';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPalette from './CommandPalette';
import CustomCursor from './CustomCursor';
import { useAppStore } from '@/store/useAppStore';
import { usePathname } from 'next/navigation';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const { theme } = useAppStore();
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <CustomCursor />
      {!isLoginPage && <CommandPalette />}
      <div className={`flex h-screen overflow-hidden ${isLoginPage ? 'bg-transparent' : 'bg-scene'}`}>
        {!isLoginPage && <Sidebar />}
        <div className="flex flex-col flex-1 overflow-hidden">
          {!isLoginPage && <Topbar />}
          <main className={`flex-1 overflow-y-auto ${isLoginPage ? '' : 'p-6'}`}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
