'use client';
import { useRef, useState } from 'react';

import { 
  Shield, Search, Globe, Zap, Lock, BarChart3, 
  ArrowRight, CheckCircle2, CloudUpload, Eye, 
  Activity, Users, Database, Server, Smartphone, 
  Laptop, Network
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Link from 'next/link';

export default function RootPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    targetUrl: string;
    description: string;
    imageFile: File | null;
  }>({
    targetUrl: '',
    description: '',
    imageFile: null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, imageFile: e.target.files![0] }));
    }
  };

  const categories = [
    { name: 'Phishing', icon: Shield, color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Malware', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Scam', icon: Lock, color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'Botnet', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  return (
    <div className="w-full bg-white selection:bg-[#FF385C] selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 md:px-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFF1F2] rounded-full blur-[140px] -pt-40 -mr-40 opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F0FDFA] rounded-full blur-[120px] -mb-40 -ml-40 opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF1F2] rounded-full text-[#FF385C] text-xs font-black uppercase tracking-widest mb-8"
          >
            <Activity size={14} />
            <span>50,000+ Threats Neutralized This Week</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-[#222222] tracking-tighter mb-8 leading-[0.9] md:leading-[0.85]"
          >
            Digital Safety.<br /><span className="text-[#FF385C]">Built by Humans.</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-xl md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto mb-16 leading-relaxed"
          >
            The world's first decentralised threat intelligence network. Report malicious links, upload evidence, and secure the web for everyone.
          </motion.p>
        </div>

        {/* Redesigned 2-Tier Search/Report Bar */}
        <div className="max-w-5xl mx-auto relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[48px] shadow-2xl hover:shadow-[0_32px_64px_rgba(0,0,0,0.12)] transition-all p-4 space-y-2"
          >
            {/* Top Row: URL and File side by side */}
            <div className="flex flex-col md:flex-row gap-2">
              {/* Target Link */}
              <div className="flex-[2.5] px-10 py-6 bg-gray-50/50 hover:bg-white hover:shadow-inner rounded-[32px] transition-all cursor-text group overflow-hidden border border-transparent hover:border-gray-100">
                <label className="block text-[10px] font-black text-[#222222]/40 uppercase tracking-[0.2em] mb-2 group-hover:text-[#FF385C] transition-colors text-left pl-3">Target URL</label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-[#FF385C] transition-colors shadow-sm">
                    <Globe size={18} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="https://malicious-site.com" 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg placeholder-gray-300 font-black text-[#222222] outline-none"
                    value={formData.targetUrl}
                    onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-10 py-6 bg-gray-50/50 hover:bg-white hover:shadow-inner rounded-[32px] transition-all cursor-pointer group overflow-hidden border border-transparent hover:border-gray-100"
              >
                <label className="block text-[10px] font-black text-[#222222]/40 uppercase tracking-[0.2em] mb-2 group-hover:text-[#FF385C] transition-colors text-left pl-3">Evidence</label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-[#FF385C] transition-colors shadow-sm">
                    <CloudUpload size={18} />
                  </div>
                  <div className="flex flex-col text-left">
                     <span className="text-sm font-black text-[#222222] truncate max-w-[120px]">
                        {formData.imageFile ? formData.imageFile.name : 'Upload Image'}
                     </span>
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">
                        {formData.imageFile ? `${(formData.imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG or PDF'}
                     </span>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 px-10 py-8 bg-gray-50/50 hover:bg-white hover:shadow-inner rounded-[32px] transition-all cursor-text group relative border border-transparent hover:border-gray-100">
                <label className="block text-[10px] font-black text-[#222222]/40 uppercase tracking-[0.2em] mb-2 group-hover:text-[#FF385C] transition-colors text-left pl-3">Describe Active Threat</label>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-[#FF385C] transition-colors shadow-sm shrink-0">
                    <Zap size={22} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Tell us what you saw... (e.g. Unusual login request, fake giveaway, suspicious download)" 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-lg placeholder-gray-300 font-black text-[#222222] outline-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
                
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#FF385C] hover:bg-[#D70466] text-white w-20 h-20 rounded-[28px] flex items-center justify-center transition-all shadow-2xl shadow-[#FF385C]/30 active:scale-95 group/btn"
                  onClick={() => alert(`Submitting: ${formData.targetUrl}`)}
                >
                  <Search size={32} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center relative z-10">
           {[
             { label: 'Verified Threats', value: '8.2M+', icon: Shield },
             { label: 'Active Analysts', value: '42K', icon: Users },
             { label: 'Response Time', value: '1.2s', icon: Zap },
             { label: 'Secured Nodes', value: '1500+', icon: Network }
           ].map((stat, i) => (
             <div key={i} className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#FF385C] shadow-sm">
                  <stat.icon size={24} />
                </div>
                <div>
                   <h3 className="text-4xl font-black text-[#222222] italic leading-none mb-2">{stat.value}</h3>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Categories / Live Feed */}
      <section className="px-6 md:px-20 py-40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h4 className="text-[#FF385C] font-black uppercase tracking-[0.3em] text-xs mb-4 italic">Surveillance</h4>
            <h2 className="text-5xl md:text-6xl font-black text-[#222222] tracking-tighter leading-none mb-6">
              Active Hunting Grounds
            </h2>
            <p className="text-gray-500 font-medium text-xl max-w-2xl mx-auto">
              Our network actively monitors and neutralizes threats across these major digital vectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -12 }}
                className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all cursor-pointer group"
              >
                <div className={clsx("w-16 h-16 rounded-3xl flex items-center justify-center mb-8 transition-all group-hover:scale-110", cat.bg, cat.color)}>
                   <cat.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#222222] mb-4 tracking-tight italic">{cat.name}</h3>
                <p className="text-gray-500 font-medium text-base leading-relaxed mb-8">Detecting and neutralising malicious {cat.name.toLowerCase()} campaigns across decentralized networks.</p>
                <div className="h-1.5 w-12 bg-gray-100 rounded-full group-hover:w-full group-hover:bg-[#FF385C] transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="px-6 md:px-20 py-40 bg-[#222222] rounded-[100px] mx-6 md:mx-12 overflow-hidden relative">
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-white" style={{ maskImage: 'radial-gradient(circle, #000 1px, transparent 1px)', maskSize: '40px 40px' }} />
         </div>

         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center relative z-10">
            <div className="space-y-12">
               <div>
                 <h4 className="text-[#FF385C] font-black uppercase tracking-[0.3em] text-sm mb-6">Core Technology</h4>
                 <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
                   Blockchain Integrity.<br />
                   AI Intelligence.
                 </h2>
               </div>
               
               <div className="space-y-10">
                  {[
                    { title: 'Semantic Verification', desc: 'Our AI models understand the "intent" of a site, not just the code.', icon: Eye },
                    { title: 'Immutable Proof', desc: 'Threat evidence is hash-logged on decentralized ledgers for total auditability.', icon: Lock },
                    { title: 'Latency-Free Protection', desc: 'Secure APIs provide real-time filtering for multi-million user products.', icon: Zap }
                  ].map((feat, i) => (
                    <div key={i} className="flex gap-8 group">
                       <div className="w-16 h-16 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0 group-hover:bg-[#FF385C] group-hover:border-[#FF385C] transition-all">
                          <feat.icon size={26} />
                       </div>
                       <div>
                         <h5 className="text-xl font-black text-white mb-2">{feat.title}</h5>
                         <p className="text-gray-400 font-medium leading-relaxed">{feat.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                 className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-12 rounded-[64px] shadow-2xl"
               >
                  <div className="aspect-square bg-gradient-to-br from-[#FF385C] to-[#D70466] rounded-[48px] flex items-center justify-center shadow-inner overflow-hidden relative">
                     <Shield size={200} className="text-white/20 absolute -bottom-20 -right-20" strokeWidth={1} />
                     <div className="relative z-10 text-center space-y-6 px-10">
                        <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mx-auto text-[#FF385C] shadow-2xl">
                           <Network size={48} />
                        </div>
                        <p className="text-white font-black text-3xl tracking-tighter italic leading-none">Global Defense Consensus</p>
                        <p className="text-white/60 font-medium text-lg leading-relaxed">Securing 1.2M+ active endpoints every second through trustless verification.</p>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* How it Works - Steps */}
      <section className="px-6 md:px-20 py-48">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
               <div className="max-w-2xl">
                 <h4 className="text-[#FF385C] font-black uppercase tracking-[0.3em] text-xs mb-4 italic">Protocol Flow</h4>
                 <h2 className="text-5xl md:text-7xl font-black text-[#222222] tracking-tighter leading-none mb-6">
                   From Flag to Secure in Seconds.
                 </h2>
               </div>
               <p className="text-gray-500 font-medium text-xl max-w-sm mb-4 leading-relaxed">
                 Our three-step verification process ensures high accuracy and global distribution.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
               {[
                 { step: '01', title: 'Community Flagging', desc: 'Any user or analyst flags a suspicious link or behavior with evidence.', icon: Shield },
                 { step: '02', title: 'AI & Peer Review', desc: 'Network nodes verify the report using multi-modal AI and manual audit.', icon: Eye },
                 { step: '03', title: 'Global Settlement', desc: 'The threat is hashed on-chain and distributed across the secure global API.', icon: CheckCircle2 }
               ].map((step, i) => (
                 <div key={i} className="relative group">
                    <span className="text-[120px] font-black text-gray-50 absolute -top-24 -left-10 select-none group-hover:text-[#FFF1F2] transition-colors">{step.step}</span>
                    <div className="relative z-10 space-y-8">
                       <div className="w-20 h-20 bg-white border border-gray-100 rounded-[30px] shadow-sm flex items-center justify-center text-[#222222] group-hover:bg-[#FF385C] group-hover:text-white transition-all transform group-hover:rotate-6">
                          <step.icon size={32} />
                       </div>
                       <h3 className="text-3xl font-black text-[#222222] tracking-tight">{step.title}</h3>
                       <p className="text-gray-500 font-medium text-lg leading-relaxed">{step.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-20 pb-48 pt-24">
         <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#FF385C] to-[#D70466] rounded-[64px] p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-[#FF385C]/20 group">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-white rounded-full" />
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border-[1px] border-white/50 rounded-full" />
            </div>
            
            <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
               <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-8">
                 Ready to defend the Web?
               </h2>
               <p className="text-xl md:text-2xl font-medium text-white/80 leading-relaxed max-w-2xl mx-auto">
                 Join 42,000+ analysts across the globe and earn rewards for securing the digital frontier.
               </p>
               <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                  <button className="px-12 py-6 bg-white text-[#FF385C] rounded-[32px] font-black text-xl shadow-2xl hover:scale-105 transition-all active:scale-95 flex items-center gap-3 mx-auto sm:mx-0">
                    Get Started Now <ArrowRight size={24} />
                  </button>
                  <Link href="/about" className="px-12 py-6 bg-transparent border-2 border-white/30 text-white rounded-[32px] font-black text-xl hover:bg-white/10 transition-all mx-auto sm:mx-0">
                    Learn More
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}


