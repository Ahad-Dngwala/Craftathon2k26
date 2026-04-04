'use client';
import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, LayoutDashboard, Bell, Activity, FileText,
  Settings, ChevronLeft, ChevronRight, Zap, Eye, LogOut
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import clsx from 'clsx';

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'threads', icon: FileText, label: 'Threads/Reports' },
];

interface MagneticIconProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed: boolean;
  onClick?: () => void;
  danger?: boolean;
}

function MagneticIcon({ icon: Icon, label, active, collapsed, onClick, danger }: MagneticIconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!el) return;
        if (dist < 40) {
          const factor = (40 - dist) / 40;
          el.style.transform = `translate(${dx * 0.3 * factor}px, ${dy * 0.3 * factor}px)`;
        } else {
          el.style.transform = 'translate(0,0)';
        }
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafRef.current);
      if (el) el.style.transform = 'translate(0,0)';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      el?.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      title={label}
      onClick={onClick}
      style={{ transition: 'transform 0.15s ease' }}
      className={clsx(
        'relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group',
        'transition-colors duration-150',
        active && !danger
          ? 'bg-indigo-500/15 text-indigo-600'
          : danger 
            ? 'text-red-500 hover:bg-red-50'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      )}
    >
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full"
        />
      )}
      <Icon size={18} className="shrink-0" />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="text-sm font-medium whitespace-nowrap overflow-hidden"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, activeTab, setActiveTab } = useAppStore();

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col shrink-0 h-screen overflow-hidden z-20 border-r border-gray-100 bg-white"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-8 py-10">
        <div className="w-10 h-10 rounded-xl bg-[#FF385C] flex items-center justify-center shrink-0 shadow-lg shadow-[#FF385C]/20">
          <Shield size={20} className="text-white" fill="currentColor" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <h2 className="text-xl font-black tracking-tighter text-[#FF385C] leading-none">security</h2>
              <p className="text-[10px] text-gray-400 font-black tracking-[0.2em] uppercase mt-1 italic">Admin Hub</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as 'dashboard' | 'threads')}
              className={clsx(
                'w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative',
                active 
                  ? 'bg-[#FFF1F2] text-[#FF385C]' 
                  : 'text-gray-500 hover:text-[#222222] hover:bg-gray-50'
              )}
            >
              {active && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-[#FF385C] rounded-full"
                />
              )}
              <Icon size={20} className={clsx('shrink-0 transition-transform duration-300', active ? 'scale-110' : 'group-hover:scale-110')} />
              {!sidebarCollapsed && (
                <span className="text-sm font-black tracking-tight">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout / Bottom Actions */}
      <div className="px-4 py-10 border-t border-gray-50">
        <button
          className={clsx(
            'w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:text-[#FF385C] hover:bg-[#FFF1F2] transition-all duration-300 group'
          )}
        >
          <LogOut size={20} className="shrink-0 transition-transform group-hover:translate-x-1" />
          {!sidebarCollapsed && (
            <span className="text-sm font-black tracking-tight">Logout</span>
          )}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-12 w-8 h-8 rounded-full flex items-center justify-center bg-white text-gray-400 border border-gray-100 shadow-sm z-30 hover:text-[#FF385C] hover:border-[#FF385C]/20 transition-all active:scale-90"
        aria-label="Toggle sidebar"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}


