'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Filter, Search, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import ReportModal, { ReportData } from './ReportModal';
import clsx from 'clsx';


export default function ThreadsView() {
  const { token, tableSearch } = useAppStore();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard/reports', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.status === 'success') {
          setReports(json.data);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchReports();
  }, [token]);

  const contentTypes = useMemo(() => {
    const types = new Set(reports.map(r => r.contentType));
    return ['ALL', ...Array.from(types)];
  }, [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesType = filterType === 'ALL' || r.contentType === filterType;
      const matchesSearch = !tableSearch || 
        r.reportId.toLowerCase().includes(tableSearch.toLowerCase()) ||
        r.contentType.toLowerCase().includes(tableSearch.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(tableSearch.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [reports, filterType, tableSearch]);


  const getSeverityBadge = (sev: string) => {
    const styles: Record<string, string> = {
      'HIGHEST': 'bg-[#FF385C] text-white border-[#FF385C]',
      'HIGH': 'bg-[#FC642D] text-white border-[#FC642D]',
      'MEDIUM': 'bg-[#717171] text-white border-[#717171]',
      'LOW': 'bg-[#00A699] text-white border-[#00A699]',
    };
    const style = styles[sev] || 'bg-gray-200 text-gray-700 border-gray-200';
    return (
      <span className={clsx('text-[9px] font-black px-3 py-1.5 rounded-full border uppercase tracking-[0.2em] shadow-sm', style)}>
        {sev}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#FF385C]"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header and Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
          <h4 className="text-[#FF385C] font-black uppercase tracking-[0.3em] text-xs mb-4 italic">Intelligence Repository</h4>
          <h1 className="text-5xl font-black text-[#222222] tracking-tighter leading-none">
            Threat Landscape
          </h1>
          <p className="text-gray-500 font-medium mt-4 text-lg">Detailed analysis of verified and pending security reports.</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Filter size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF385C] transition-colors" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-white border-2 border-gray-100 rounded-[20px] py-4 pl-14 pr-12 text-sm font-black text-[#222222] focus:ring-4 focus:ring-[#FF385C]/5 focus:border-[#FF385C]/20 shadow-sm transition-all appearance-none outline-none cursor-pointer"
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'Everything' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-white p-24 rounded-[48px] text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
             <Search className="w-12 h-12 text-gray-200" />
          </div>
          <h3 className="text-3xl font-black text-[#222222] mb-3">No matching threats</h3>
          <p className="text-gray-500 font-medium max-w-sm text-lg">Try adjusting your filters or search criteria to find specific reports.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.reportId}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              onClick={() => setSelectedReport(report)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[4/3] w-full mb-6 overflow-hidden rounded-[40px] bg-gray-100 shadow-lg shadow-gray-200/50">
                 {/* Visual Header */}
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <img 
                   src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800`} 
                   alt="Threat" 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                 />
                 <div className="absolute top-6 right-6 z-20">
                   {getSeverityBadge(report.severity)}
                 </div>
                 <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                    <button className="bg-white text-[#222222] px-6 py-2.5 rounded-2xl font-black text-sm shadow-xl">
                       Open Details
                    </button>
                 </div>
              </div>
              
              <div className="space-y-3 px-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-[#222222] group-hover:text-[#FF385C] transition-colors tracking-tight italic truncate pr-4">
                    {report.contentType}
                  </h3>

                  <div className="flex items-center gap-1.5">
                     <Clock size={14} className="text-gray-400" />
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                        {report.reportId.slice(-6)}
                     </span>
                  </div>
                </div>
                
                <p className="text-base text-gray-500 font-medium line-clamp-2 leading-relaxed break-all">
                  {report.description || "System generated alert for potential threat patterns detected in real-time streams."}
                </p>

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2">
                    <div className={clsx(
                      'w-2.5 h-2.5 rounded-full ring-4 ring-offset-2',
                      report.status === 'PENDING' ? 'bg-[#FC642D] ring-[#FC642D]/10' : 'bg-[#00A699] ring-[#00A699]/10'
                    )} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none ml-1">{report.status}</span>
                  </div>
                  <div className="flex items-center -space-x-3 group-hover:-space-x-1 transition-all">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                     ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}


      {selectedReport && (
        <ReportModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
          onUpdateStatus={(id: string, status: string) => {
            setReports(prev => prev.map(r => r.reportId === id ? { ...r, status } as ReportData : r));
            setSelectedReport(prev => prev?.reportId === id ? { ...prev, status } as ReportData : prev);
          }}
        />
      )}
    </div>
  );
}
