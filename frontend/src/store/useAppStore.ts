import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Report, SeverityLevel } from '@/lib/mockData';

interface AppState {
  // Layout
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Auth
  token: string | null;
  admin: { id: string; username: string; name: string } | null;
  isAuthenticated: boolean;
  login: (token: string, admin: { id: string; username: string; name: string }) => void;
  logout: () => void;

  // Tabs
  activeTab: 'dashboard' | 'threads';
  setActiveTab: (tab: 'dashboard' | 'threads') => void;

  // Theme
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Drawer
  drawerOpen: boolean;
  drawerReport: Report | null;
  openDrawer: (report: Report) => void;
  closeDrawer: () => void;

  // Table filters
  tableSearch: string;
  tableFilter: SeverityLevel | 'all';
  setTableSearch: (q: string) => void;
  setTableFilter: (f: SeverityLevel | 'all') => void;

  // Command palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;

  // Chart<>Table sync
  hoveredTimestamp: string | null;
  setHoveredTimestamp: (t: string | null) => void;

  // Audio
  audioEnabled: boolean;
  toggleAudio: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      token: null,
      admin: null,
      isAuthenticated: false,
      login: (token, admin) => set({ token, admin, isAuthenticated: true }),
      logout: () => set({ token: null, admin: null, isAuthenticated: false, activeTab: 'dashboard' }),

      activeTab: 'dashboard',
      setActiveTab: (tab) => set({ activeTab: tab }),

      theme: 'light',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      drawerOpen: false,
      drawerReport: null,
      openDrawer: (report) => set({ drawerOpen: true, drawerReport: report }),
      closeDrawer: () => set({ drawerOpen: false, drawerReport: null }),

      tableSearch: '',
      tableFilter: 'all',
      setTableSearch: (q) => set({ tableSearch: q }),
      setTableFilter: (f) => set({ tableFilter: f }),

      commandPaletteOpen: false,
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),

      hoveredTimestamp: null,
      setHoveredTimestamp: (t) => set({ hoveredTimestamp: t }),

      audioEnabled: false,
      toggleAudio: () => set((s) => ({ audioEnabled: !s.audioEnabled })),
    }),
    {
      name: 'scc-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        theme: state.theme,
        audioEnabled: state.audioEnabled,
        token: state.token,
        admin: state.admin,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
