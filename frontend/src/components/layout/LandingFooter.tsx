'use client';
import Link from 'next/link';
import { Shield, Globe, Mail, MapPin, Share2, Activity, Zap, CheckCircle2 } from 'lucide-react';


export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12 px-6 md:px-20 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FFF1F2] rounded-full blur-[120px] opacity-50 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-[#FF385C] rounded-2xl flex items-center justify-center text-white transition-all group-hover:scale-110 shadow-lg shadow-[#FF385C]/20">
                <Shield size={26} fill="currentColor" />
              </div>
              <span className="text-[#222222] text-2xl font-black tracking-tighter">security</span>
            </Link>
            <p className="text-gray-400 font-medium max-w-sm leading-relaxed text-lg">
              The world's first decentralized, AI-driven threat intelligence network. 
              Protected by a global community of analysts and powered by blockchain consensus.
            </p>
            <div className="flex items-center gap-5">
              {[Globe, Shield, Activity, Share2].map((Icon, i) => (

                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF385C] hover:border-[#FF385C]/30 hover:bg-[#FFF1F2]/30 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h6 className="font-black text-sm uppercase tracking-widest text-[#222222] mb-8">Solution</h6>
            <ul className="space-y-4 text-gray-500 font-bold">
              <li><Link href="/dashboard" className="hover:text-[#FF385C] transition-colors">Threat Intelligence</Link></li>
              <li><Link href="#" className="hover:text-[#FF385C] transition-colors">API Access</Link></li>
              <li><Link href="#" className="hover:text-[#FF385C] transition-colors">Blockchain Node</Link></li>
              <li><Link href="#" className="hover:text-[#FF385C] transition-colors">Security Audit</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h6 className="font-black text-sm uppercase tracking-widest text-[#222222] mb-8">Resources</h6>
            <ul className="space-y-4 text-gray-500 font-bold">
              <li><Link href="/about" className="hover:text-[#FF385C] transition-colors">About Project</Link></li>
              <li><Link href="#" className="hover:text-[#FF385C] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-[#FF385C] transition-colors">Whitepaper</Link></li>
              <li><Link href="#" className="hover:text-[#FF385C] transition-colors">Brand Assets</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h6 className="font-black text-sm uppercase tracking-widest text-[#222222] mb-8">Contact</h6>
            <div className="space-y-5 text-gray-400 font-medium">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#FF385C]" />
                <span className="text-sm">ops@security.org</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-[#FF385C]" />
                <span className="text-sm">Silicon Valley, CA</span>
              </div>
              <div className="pt-2">
                <Link href="/contact" className="inline-block px-6 py-2.5 bg-[#FFF1F2] text-[#FF385C] rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#FF385C] hover:text-white transition-all shadow-sm">
                  Let's Talk
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            © 2026 Security Command Center • Built for the Open Web
          </p>
          <div className="flex gap-10 text-[10px] font-black text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-[#FF385C] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FF385C] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#FF385C] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
