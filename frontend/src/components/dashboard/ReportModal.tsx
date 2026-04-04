'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Shield, ExternalLink, Hash, CheckCircle2, AlertCircle, Trash2, CheckCircle, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAppStore } from '@/store/useAppStore';
import { toPng } from 'html-to-image';
import clsx from 'clsx';


export interface ReportData {
  _id: string;
  reportId: string;
  severity: string;
  referenceURL: string;
  description: string;
  contentType: string;
  aiConfidence: string;
  evidenceCID: string[];
  evidenceURL: string[];
  status: string;
  evidenceCount: number;
  reportCID: string;
  txHash: string | null;
  createdAt: string;
}

interface ReportModalProps {
  report: ReportData;
  onClose: () => void;
  onUpdateStatus?: (id: string, status: string) => void;
}

export default function ReportModal({ report, onClose, onUpdateStatus }: ReportModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const { token } = useAppStore();

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    try {
      setUpdatingStatus(true);
      const res = await fetch(`http://localhost:5000/api/admin/dashboard/reports/${report.reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.status === 'success' && onUpdateStatus) {
        onUpdateStatus(report.reportId, newStatus);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);
      let y = margin;

      const checkPageBreak = (neededSpace: number) => {
        if (y + neededSpace > pageHeight - margin) {
          pdf.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(31, 41, 55); 
      pdf.text(`Report #${report.reportId}`, margin, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175);
      pdf.text(`Generated: ${new Date(report.createdAt).toLocaleString()}`, margin, y);
      y += 15;

      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(107, 114, 128);
      pdf.text('Severity', margin, y);
      pdf.text('Status', margin + 60, y);
      pdf.text('Content Type', margin + 120, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(17, 24, 39);
      pdf.text(report.severity, margin, y);
      pdf.text(report.status, margin + 60, y);
      pdf.text(report.contentType, margin + 120, y);
      y += 12;

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(107, 114, 128);
      pdf.text('AI Confidence', margin, y);
      pdf.text('Transaction Hash', margin + 60, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(17, 24, 39);
      pdf.text(report.aiConfidence.toString(), margin, y);
      if (report.txHash) {
        pdf.setFontSize(9);
        pdf.text(report.txHash, margin + 60, y);
        pdf.setFontSize(11);
      } else {
        pdf.text("Unconfirmed", margin + 60, y);
      }
      y += 15;

      if (report.referenceURL) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(107, 114, 128);
        pdf.text('Reference URL', margin, y);
        y += 6;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(94, 92, 230); // purple
        pdf.textWithLink(report.referenceURL, margin, y, { url: report.referenceURL });
        y += 15;
      }

      checkPageBreak(30);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(107, 114, 128);
      pdf.text('Description', margin, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81);
      const splitDesc = pdf.splitTextToSize(report.description || "No description provided.", contentWidth);
      
      splitDesc.forEach((line: string) => {
        checkPageBreak(6);
        pdf.text(line, margin, y);
        y += 6;
      });
      y += 10;

      checkPageBreak(15);
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 12;

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text(`Evidence Records (${report.evidenceCount})`, margin, y);
      y += 10;

      if (report.evidenceCID && report.evidenceCID.length > 0) {
        checkPageBreak(20);
        pdf.setFontSize(11);
        pdf.setTextColor(107, 114, 128);
        pdf.text('IPFS CIDs', margin, y);
        y += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99);
        report.evidenceCID.forEach(cid => {
          checkPageBreak(6);
          pdf.text(`• ${cid}`, margin + 5, y);
          y += 6;
        });
        y += 6;
      }

      if (report.evidenceURL && report.evidenceURL.length > 0) {
        checkPageBreak(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(107, 114, 128);
        pdf.text('Evidence URLs', margin, y);
        y += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(94, 92, 230);
        report.evidenceURL.forEach(url => {
          checkPageBreak(6);
          pdf.textWithLink(`• ${url}`, margin + 5, y, { url: url });
          y += 6;
        });
        y += 10;
      }

      checkPageBreak(15);
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(156, 163, 175);
      pdf.text(`Security Command Center • Report CID: ${report.reportCID}`, margin, y);

      pdf.save(`Report_${report.reportId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'REVIEWED': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'DISMISSED': return 'text-gray-500 bg-gray-50 border-gray-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-5xl max-h-[92vh] bg-white rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-gray-100 bg-white shrink-0">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-3 px-8 py-3.5 bg-[#FF385C] hover:bg-[#D70466] active:scale-95 text-white text-sm font-black rounded-2xl transition-all disabled:opacity-50 shadow-xl shadow-[#FF385C]/20"
          >
            {downloading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Download Full PDF
          </button>

          
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-10">
          <div ref={contentRef} className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm mx-auto max-w-4xl">
            {/* Header Area */}
            <div className="border-b border-gray-100 pb-10 mb-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-[#FFF1F2] text-[#FF385C] rounded-[24px] flex items-center justify-center shadow-inner shrink-0">
                    <Shield className="w-10 h-10" fill="currentColor" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <h2 className="text-3xl font-black text-[#222222] tracking-tighter truncate" title={report.reportId}>Report #{report.reportId.slice(-8)}</h2>

                    </div>
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-none">
                      Logged at {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className={clsx(
                  'px-6 py-3 rounded-2xl border-2 text-sm font-black flex items-center gap-3 transition-colors shadow-sm',
                  getStatusColor(report.status),
                  updatingStatus ? 'opacity-50' : ''
                )}>
                  {report.status === 'PENDING' && <Clock size={16} />}
                  {(report.status === 'RESOLVED' || report.status === 'REVIEWED') && <CheckCircle size={16} />}
                  <select 
                    value={report.status}
                    onChange={handleStatusChange}
                    disabled={updatingStatus}
                    className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none appearance-none font-black text-inherit tracking-widest"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="DISMISSED">DISMISSED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Info Grid */}


            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity Level</p>
                 <p className="text-xl font-black text-gray-900">{report.severity}</p>
               </div>
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Content Class</p>
                 <p className="text-xl font-black text-gray-900">{report.contentType}</p>
               </div>
               <div className="space-y-2">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Confidence</p>
                 <p className="text-xl font-black text-emerald-500">{(parseFloat(report.aiConfidence) * 100).toFixed(1)}%</p>
               </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 mb-12">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Reference Source</p>
                {report.referenceURL ? (
                  <a href={report.referenceURL} target="_blank" rel="noreferrer" className="text-[#FF385C] font-black underline underline-offset-8 break-all flex items-center gap-2 text-lg hover:text-[#D70466]">
                    {report.referenceURL} <ExternalLink size={18} />
                  </a>

               ) : (
                 <span className="text-gray-400 font-medium">No source URL provided</span>
               )}
            </div>

            {/* Description */}
            <div className="mb-12">
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Report Description</h3>
              <div className="text-gray-600 font-medium leading-relaxed bg-white border border-gray-100 p-8 rounded-3xl shadow-sm italic break-all">
                "{report.description || "Automated intelligence report describing potential threat vectors identified in the analyzed content stream."}"
              </div>

            </div>

            {/* Evidence */}
            <div className="pt-12 border-t border-gray-100">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-black text-gray-900 tracking-tight">Intelligence Evidence</h3>
                 <span className="bg-[#FF385C] text-white text-xs font-black px-4 py-1.5 rounded-full tracking-widest uppercase">
                   {report.evidenceCount} Files Secure
                 </span>
               </div>
               
               <div className="grid grid-cols-1 gap-6">
                 {report.evidenceURL.map((url, i) => (
                   <div key={i} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-[#FF385C]/30 transition-all group">
                     <div className="flex items-center gap-4 truncate">
                         <div className="w-10 h-10 bg-gray-50 rounded-[14px] flex items-center justify-center text-gray-400 group-hover:bg-[#FFF1F2] group-hover:text-[#FF385C] transition-colors">
                           <Hash size={18} />
                        </div>
                        <p className="text-sm font-black text-gray-500 truncate pr-4" title={url}>{url}</p>

                     </div>
                     <a href={url} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-gray-50 text-[#222222] text-[10px] font-black rounded-xl hover:bg-[#FF385C] hover:text-white transition-all uppercase tracking-widest shadow-sm">
                       View Record
                     </a>

                   </div>
                 ))}
               </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-100 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center">
              Security Command Center • Immutable Logic Proof: {report.reportCID.slice(0, 32)}...
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



