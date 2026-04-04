'use client';

import { motion } from 'framer-motion';
import { Shield, Globe, Users, Target, BookOpen, Heart } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Sub Header */}
      <section className="pt-24 pb-16 px-6 md:px-20 border-b border-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-[#222222] tracking-tighter mb-8 leading-tight">
            Our mission is to make the <span className="text-[#FF385C]">web safer</span> for everyone.
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            We believe that security shouldn't be a luxury. By decentralizing threat intelligence and leveraging community power, we're building a defense system that grows stronger every day.
          </p>
        </div>
      </section>

      {/* Stats / Numbers */}
      <section className="py-20 px-6 md:px-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
           {[
             { label: 'Threats Blocked', val: '4.2M+' },
             { label: 'Active Analysts', val: '12K' },
             { label: 'Global Nodes', val: '850' },
             { label: 'Uptime', val: '99.9%' }
           ].map((s, i) => (
             <div key={i} className="text-center">
                <h3 className="text-4xl font-black text-[#FF385C] mb-2">{s.val}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black text-[#222222] tracking-tight mb-4">The Values that Drive Us</h2>
            <p className="text-gray-500 font-medium max-w-xl mx-auto">Built on a foundation of trust, transparency, and relentless innovation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
             {[
               { title: 'Radical Transparency', icon: Globe, desc: 'Everything we log is immutable and verifiable on the public ledger.' },
               { title: 'Community First', icon: Users, desc: 'Our strength comes from a global network of independent security researchers.' },
               { title: 'AI-Native Defense', icon: Target, desc: 'We utilize state-of-the-art NLP and Computer Vision to stay ahead of bad actors.' }
             ].map((v, i) => (
               <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-[32px] bg-[#FFF1F2] text-[#FF385C] flex items-center justify-center mb-8">
                     <v.icon size={36} />
                  </div>
                  <h4 className="text-2xl font-black text-[#222222] mb-4">{v.title}</h4>
                  <p className="text-gray-500 font-medium leading-relaxed">{v.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 px-6 md:px-20 bg-[#222222] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF385C] rounded-full blur-[160px] opacity-20 -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
             <h2 className="text-5xl font-black tracking-tighter mb-8 leading-tight">Born from the need for <span className="text-[#FF385C]">better standards</span>.</h2>
             <p className="text-lg text-gray-400 font-medium leading-relaxed mb-6">
               The Security Command Center project started as a small group of researchers frustrated by the siloed nature of threat data. Major companies keep security logs private, leaving smaller organizations vulnerable.
             </p>
             <p className="text-lg text-gray-400 font-medium leading-relaxed">
               We decided to build a platform where intelligence is a public good. Today, we're a leading voice in decentralized cybersecurity, powering the defense systems of hundreds of platforms world-wide.
             </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="h-64 bg-gray-800 rounded-[32px] mt-12" />
             <div className="h-64 bg-gray-700 rounded-[32px]" />
             <div className="h-64 bg-gray-700 rounded-[32px] -mt-12" />
             <div className="h-64 bg-gray-600 rounded-[32px]" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 md:px-20 text-center">
         <h2 className="text-5xl font-black text-[#222222] tracking-tighter mb-8">Ready to secure your future?</h2>
         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/" className="px-12 py-5 bg-[#FF385C] text-white rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#FF385C]/20">
               Start Reporting
            </Link>
            <Link href="/contact" className="px-12 py-5 bg-white border-2 border-gray-100 text-[#222222] rounded-2xl font-black hover:bg-gray-50 transition-all">
               Talk to the team
            </Link>
         </div>
      </section>
    </div>
  );
}
