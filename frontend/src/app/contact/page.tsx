'use client';

import { motion } from 'framer-motion';
import { Mail, MessageCircle, Phone, MapPin, Send, MessageSquare, Globe, Shield } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Header */}
      <section className="pt-24 pb-16 px-6 md:px-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-black text-[#222222] tracking-tighter mb-8 leading-tight">
            How can we <span className="text-[#008489]">help</span> you?
          </h1>
          <p className="text-xl text-gray-500 font-medium leading-relaxed">
            Have a question, feedback, or a security lead? Our team of analysts and engineers is here to listen and respond.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="py-20 px-6 md:px-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white p-12 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100">
             {submitted ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="h-full flex flex-col items-center justify-center text-center p-10"
               >
                  <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                     <Send size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-[#222222] mb-4">Message Received!</h3>
                  <p className="text-gray-500 font-medium max-w-sm">We've received your request and will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-[#FF385C] font-black underline underline-offset-4"
                  >
                    Send another message
                  </button>
               </motion.div>
             ) : (
               <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-[#222222] uppercase tracking-[0.2em]">Your Name</label>
                        <input type="text" placeholder="Jackson Santos" className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-[#FF385C] focus:ring-0 transition-colors outline-none font-bold" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-[#222222] uppercase tracking-[0.2em]">Email Address</label>
                        <input type="email" placeholder="jackson@example.com" className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-[#FF385C] focus:ring-0 transition-colors outline-none font-bold" />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#222222] uppercase tracking-[0.2em]">Topic</label>
                    <select className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-[#FF385C] focus:ring-0 transition-colors outline-none font-bold appearance-none">
                       <option>General Inquiry</option>
                       <option>Reporting a major threat</option>
                       <option>API Access Request</option>
                       <option>Career Opportunities</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#222222] uppercase tracking-[0.2em]">Your Message</label>
                    <textarea rows={6} placeholder="Tell us more about what's on your mind..." className="w-full bg-gray-50 border-2 border-gray-100 p-4 rounded-2xl focus:border-[#FF385C] focus:ring-0 transition-colors outline-none font-bold resize-none"></textarea>
                  </div>

                  <button className="w-full py-5 bg-[#FF385C] text-white rounded-2xl font-black text-lg hover:bg-[#D70466] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-[#FF385C]/20">
                     Submit Feedback <MessageSquare size={20} />
                  </button>
               </form>
             )}
          </div>

          {/* Right: Contact Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
             <div className="bg-[#222222] p-10 rounded-[40px] text-white">
                <h3 className="text-2xl font-black mb-8 italic">Direct Channels</h3>
                <ul className="space-y-8">
                   <li className="flex items-start gap-5 group">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#FF385C] transition-all">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#FF385C] mb-1 italic">Email</p>
                        <p className="font-bold text-lg">hello@security-center.org</p>
                      </div>
                   </li>
                   <li className="flex items-start gap-5 group">
                      <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-[#FF385C] transition-all">
                        <MessageCircle size={24} />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-[#FF385C] mb-1 italic">Discord</p>
                        <p className="font-bold text-lg">join.security/discord</p>
                      </div>
                   </li>
                </ul>

                <hr className="my-10 border-gray-800" />
                <h3 className="text-2xl font-black mb-6 italic">Social Hubs</h3>
                <div className="flex gap-4">
                   <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-[#FF385C] transition-all cursor-pointer text-white">
                      <Globe size={24} />
                   </div>
                   <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-[#FF385C] transition-all cursor-pointer text-white">
                      <Shield size={24} />
                   </div>

                </div>
             </div>

             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className="flex items-center gap-4 mb-4 text-[#222222]">
                   <MapPin className="text-[#FF385C]" size={28} />
                   <h3 className="text-2xl font-black italic">Headquarters</h3>
                </div>
                <p className="text-gray-500 font-bold leading-relaxed mb-6">
                   Distributed Global Network<br />
                   Primary Data Terminal: 0x82C...<br />
                   Singapore Node • Central Hub
                </p>
                <div className="w-full h-40 bg-gray-100 rounded-3xl overflow-hidden relative grayscale opacity-70">
                   <div className="absolute inset-0 bg-blue-500/10" />
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-32 px-6 md:px-20 text-center">
         <p className="text-gray-400 font-black uppercase tracking-[0.2em] mb-4">Quick answer needed?</p>
         <h2 className="text-4xl font-black text-[#222222] mb-8">Browse our help center</h2>
         <button className="px-12 py-5 bg-[#222222] text-white rounded-2xl font-black hover:bg-[#FF385C] transition-all">
            Visit Documentation
         </button>
      </section>
    </div>
  );
}
