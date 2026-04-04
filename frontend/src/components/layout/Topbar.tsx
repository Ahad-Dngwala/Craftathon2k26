'use client';
import { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Command, LogOut, Shield, CheckCircle, User } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAudioCues } from '@/hooks/useAudioCues';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';


interface NotificationReport {
  reportId: string;
  status: string;
  severity: string;
  contentType: string;
  createdAt: string;
}

export default function Topbar() {
  const { tableSearch, setTableSearch, setActiveTab, activeTab, logout } = useAppStore();
  const { tick } = useAudioCues();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableSearch(value);
    if (activeTab !== 'threads' && value.length > 0) {
      setActiveTab('threads');
    }
  };

  return (
    <header className="flex items-center justify-between px-10 h-24 bg-white border-b border-gray-100 shrink-0 z-10 relative">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative w-full group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF385C] transition-colors" />
          <input
            type="text"
            placeholder="Search reports by ID, type, or description..."
            value={tableSearch}
            onChange={handleSearch}
            className="w-full bg-gray-50 border-gray-100 border-2 rounded-[20px] py-4 pl-14 pr-4 text-sm font-black text-[#222222] focus:ring-4 focus:ring-[#FF385C]/5 focus:border-[#FF385C]/10 transition-all placeholder-gray-400 outline-none shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Simplified Topbar: Theme, Notifications, and New Report buttons removed as per user request */}
        
        <div className="flex items-center gap-4 pl-8 group cursor-pointer border-l border-gray-50">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-[#222222] leading-none group-hover:text-[#FF385C] transition-colors italic">Chief Admin</p>
            <p className="text-[10px] text-gray-400 font-bold mt-1.5 uppercase tracking-widest text-right">Security Cluster</p>
          </div>
          <div className="w-12 h-12 rounded-[18px] bg-gray-50 border border-gray-100 overflow-hidden shadow-sm ring-4 ring-white group-hover:ring-[#FFF1F2] transition-all">
             <img src="https://ui-avatars.com/api/?name=Jackson+Santos&background=FF385C&color=fff&bold=true" alt="Avatar" />
          </div>
          <button 
            onClick={async () => {
              try {
                await fetch('http://localhost:5000/api/admin/logout', { method: 'POST', credentials: 'include' });
              } catch (e) {
                console.error('Logout failed:', e);
              }
              logout();
              window.location.href = '/login';
            }}
            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-2"
            title="Log Out"
          >
             <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>

  );
}


