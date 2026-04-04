'use client';
import Link from 'next/link';
import { Shield, Menu, User, Globe, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function LandingHeader() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 md:p-8 pointer-events-none">
      <header className="pointer-events-auto w-full max-w-6xl h-16 md:h-20 bg-white/70 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-full px-6 md:px-10 flex items-center justify-between transition-all hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#FF385C] rounded-full flex items-center justify-center text-white transition-all group-hover:rotate-12 shadow-lg shadow-[#FF385C]/20">
            <Shield size={22} fill="currentColor" />
          </div>
          <span className="text-[#222222] text-xl font-black tracking-tighter hidden sm:block">security</span>
        </Link>

        {/* Center Nav - Floating Pill style */}
        <nav className="hidden lg:flex items-center gap-10 text-sm font-black text-[#222222] uppercase tracking-widest">
          <Link href="/about" className={clsx(
            "hover:text-[#FF385C] transition-colors relative group",
            pathname === '/about' && "text-[#FF385C]"
          )}>
            About Us
            <span className={clsx("absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF385C] transition-all group-hover:w-full", pathname === '/about' && "w-full")} />
          </Link>
          <Link href="/contact" className={clsx(
            "hover:text-[#FF385C] transition-colors relative group",
            pathname === '/contact' && "text-[#FF385C]"
          )}>
            Contact
            <span className={clsx("absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF385C] transition-all group-hover:w-full", pathname === '/contact' && "w-full")} />
          </Link>
        </nav>

        {/* Right Actions - Empty now as requested */}
        <div className="flex items-center gap-6" />
      </header>
    </div>

  );
}
