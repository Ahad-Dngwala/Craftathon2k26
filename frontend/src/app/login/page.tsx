'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ArrowRight, AlertCircle, Activity } from 'lucide-react';
import clsx from 'clsx';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, token } = useAppStore();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && token) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.status === 'success') {
        login(data.data.token, data.data.admin);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated && token) {
    return null; // Don't render layout overlap while redirecting
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans">
      
      {/* Decorative premium background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-white" style={{ maskImage: 'radial-gradient(circle, #000 1px, transparent 1px)', maskSize: '40px 40px' }} />
      </div>
      <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-[#FF385C] rounded-full blur-[140px] opacity-10 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#FFF1F2] rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-lg p-10 md:p-12 bg-white/70 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.05)] border border-white z-10 mx-4"
      >
        <div className="mb-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-[#FF385C] rounded-[28px] flex items-center justify-center shadow-xl shadow-[#FF385C]/20 mb-8"
          >
            <Shield className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl font-black text-[#222222] tracking-tighter">Command Center</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-4 flex items-center gap-2 justify-center">
            <Activity size={14} className="text-[#FF385C] animate-pulse" /> Authentication Required
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 bg-[#FFF1F2] border border-[#FF385C]/20 rounded-2xl flex items-center gap-3 text-[#FF385C] shadow-inner font-medium">
                  <AlertCircle size={18} className="shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-3">
                Admin Username
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#FF385C] text-gray-300">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-14 pr-4 py-4 bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-[20px] text-[#222222] font-bold text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]/30 transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-3">
                Secure Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-[#FF385C] text-gray-300">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-4 py-4 bg-gray-50/50 hover:bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white rounded-[20px] text-[#222222] font-bold text-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF385C]/20 focus:border-[#FF385C]/30 transition-all font-mono"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={clsx(
              "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-[20px] text-base font-black text-white transition-all shadow-xl shadow-[#FF385C]/20 tracking-wide mt-8",
              isLoading ? "bg-[#FF385C] opacity-70 cursor-not-allowed" : "bg-[#FF385C] hover:bg-[#D70466] active:scale-95"
            )}
          >
            {isLoading ? (
               <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Initialize Access
                <ArrowRight size={20} strokeWidth={2.5} />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
