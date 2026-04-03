'use client';
import { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Command, LogOut, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAudioCues } from '@/hooks/useAudioCues';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationReport {
  reportId: string;
  status: string;
  severity: string;
  contentType: string;
  createdAt: string;
}

export default function Topbar() {
  const { theme, toggleTheme, setCommandPaletteOpen, token, logout } = useAppStore();
  const { tick } = useAudioCues();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [recentReports, setRecentReports] = useState<NotificationReport[]>([]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard/reports', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const json = await res.json();

        if (json.status === 'success') {
          // just grab the 5 most recent
          setRecentReports(json.data.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <header
      className="flex items-center justify-between px-6 h-14 border-b shrink-0 z-50 relative"
      style={{
        background: 'var(--bg-surface-trans-more)',
        borderColor: 'var(--border-05)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Search / Command Palette trigger */}
      <button
        onClick={() => { setCommandPaletteOpen(true); tick(); }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:text-gray-700 dark:text-gray-300 hover:border-indigo-500/30 transition-all cursor-none group"
        style={{ borderColor: 'var(--border-08)', background: 'oklch(100% 0 0 / 0.02)' }}
      >
        <Search size={14} className="group-hover:text-indigo-400 transition-colors" />
        <span className="hidden sm:inline">Search threats...</span>
        <span className="hidden sm:flex items-center gap-0.5 ml-2 px-1.5 py-0.5 rounded text-[10px] border" style={{ borderColor: 'var(--border-1)' }}>
          <Command size={9} /><span>K</span>
        </span>
      </button>

      {/* Right controls */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <button
          onClick={() => { toggleTheme(); tick(); }}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 dark:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:text-gray-700 dark:text-gray-300 transition-all cursor-none"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-none ${notificationsOpen ? 'bg-black/5 dark:bg-white/5 text-indigo-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-300 dark:text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:bg-white/5'}`}
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
              >
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Alerts</h3>
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">{recentReports.length} New</span>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {recentReports.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      No recent notifications
                    </div>
                  ) : (
                    recentReports.map(report => (
                      <div key={report.reportId} className="px-4 py-3 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer flex gap-3 items-start">
                        <div className="mt-0.5 min-w-fit">
                          {report.status === 'PENDING' ? (
                            <ShieldAlert className="w-4 h-4 text-orange-500" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight mb-1">
                            New <span className="uppercase text-indigo-600 dark:text-indigo-400">{report.contentType}</span> report logged
                          </p>
                          <div className="flex gap-2 items-center text-xs">
                            <span className="text-gray-500 dark:text-gray-400">#{report.reportId.slice(-6)}</span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span className="text-gray-500 dark:text-gray-400">{new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'oklch(100% 0 0 / 0.08)' }} />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-500 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors cursor-none"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
