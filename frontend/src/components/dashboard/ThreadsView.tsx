'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Filter, Search, Clock, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import ReportModal, { ReportData } from './ReportModal';

export default function ThreadsView() {
  const { token } = useAppStore();
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

    if (token) {
      fetchReports();
    }
  }, [token]);

  // Extract unique content types for the filter dropdown
  const contentTypes = useMemo(() => {
    const types = new Set(reports.map(r => r.contentType));
    return ['ALL', ...Array.from(types)];
  }, [reports]);

  const filteredReports = useMemo(() => {
    if (filterType === 'ALL') return reports;
    return reports.filter(r => r.contentType === filterType);
  }, [reports, filterType]);

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'HIGHEST': return 'bg-red-100 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-12">
         <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 bg-gray-50 min-h-full rounded-3xl pb-8">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end p-4 border-b border-gray-200 bg-white rounded-t-3xl shadow-sm">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Shield className="text-indigo-600" /> Threat Threads
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review, filter, and export individual threat reports.</p>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1 w-full sm:w-auto">
          <Filter size={16} className="text-gray-400 ml-2" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 py-1.5 pr-8 pl-1 cursor-pointer outline-none w-full sm:w-auto"
          >
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'ALL' ? 'All Content Types' : type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="px-6">
        {filteredReports.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No reports found</h3>
            <p className="text-gray-500">Try adjusting your content type filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.reportId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => setSelectedReport(report)}
                className="bg-white p-5 rounded-xl border border-gray-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-bold px-2 py-1 flex items-center gap-1 rounded border uppercase tracking-wider ${getSeverityStyle(report.severity)}`}>
                    {report.severity}
                  </span>
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                    #{report.reportId.slice(-6)}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-1">
                  {report.contentType}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                  {report.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center text-xs text-gray-400 gap-1.5">
                    {report.status === 'PENDING' ? <Clock size={12} className="text-yellow-500" /> : <CheckCircle size={12} className="text-green-500" />}
                    <span>{report.status}</span>
                  </div>
                  <span className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details &rarr;
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup */}
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
