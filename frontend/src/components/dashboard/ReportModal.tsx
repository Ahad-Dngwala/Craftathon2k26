'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Shield, ExternalLink, Hash, CheckCircle2, AlertCircle, Trash2, CheckCircle, Clock } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAppStore } from '@/store/useAppStore';
import { toPng } from 'html-to-image';

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

      // Helper for page breaks
      const checkPageBreak = (neededSpace: number) => {
        if (y + neededSpace > pageHeight - margin) {
          pdf.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // Header
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(31, 41, 55); // gray-800
      pdf.text(`Report #${report.reportId}`, margin, y);
      y += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(156, 163, 175); // gray-400
      pdf.text(`Generated: ${new Date(report.createdAt).toLocaleString()}`, margin, y);
      y += 15;

      // Draw line
      pdf.setDrawColor(229, 231, 235); // gray-200
      pdf.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Quick Stats Matrix
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(107, 114, 128); // gray-500
      pdf.text('Severity', margin, y);
      pdf.text('Status', margin + 60, y);
      pdf.text('Content Type', margin + 120, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(17, 24, 39); // gray-900
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

      // Reference URL
      if (report.referenceURL) {
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(107, 114, 128);
        pdf.text('Reference URL', margin, y);
        y += 6;
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(79, 70, 229); // indigo-600
        pdf.textWithLink(report.referenceURL, margin, y, { url: report.referenceURL });
        y += 15;
      }

      // Description
      checkPageBreak(30);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(107, 114, 128);
      pdf.text('Description', margin, y);
      y += 6;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(55, 65, 81); // gray-700
      const splitDesc = pdf.splitTextToSize(report.description || "No description provided.", contentWidth);
      
      splitDesc.forEach((line: string) => {
        checkPageBreak(6);
        pdf.text(line, margin, y);
        y += 6;
      });
      y += 10;

      // Draw line
      checkPageBreak(15);
      pdf.setDrawColor(229, 231, 235);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 12;

      // Evidence Records
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(31, 41, 55);
      pdf.text(`Evidence Records (${report.evidenceCount})`, margin, y);
      y += 10;

      // IPFS CIDs
      if (report.evidenceCID && report.evidenceCID.length > 0) {
        checkPageBreak(20);
        pdf.setFontSize(11);
        pdf.setTextColor(107, 114, 128);
        pdf.text('IPFS CIDs', margin, y);
        y += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(75, 85, 99); // gray-600
        report.evidenceCID.forEach(cid => {
          checkPageBreak(6);
          pdf.text(`• ${cid}`, margin + 5, y);
          y += 6;
        });
        y += 6;
      }

      // Evidence URLs
      if (report.evidenceURL && report.evidenceURL.length > 0) {
        checkPageBreak(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(107, 114, 128);
        pdf.text('Evidence URLs', margin, y);
        y += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(79, 70, 229);
        report.evidenceURL.forEach(url => {
          checkPageBreak(6);
          // Print text and bind the clickable link region
          pdf.textWithLink(`• ${url}`, margin + 5, y, { url: url });
          y += 6;
        });
        y += 10;
      }

      // Footer
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
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'REVIEWED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'RESOLVED': return 'text-green-600 bg-green-50 border-green-200';
      case 'DISMISSED': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header Actions */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/80">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {downloading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Download PDF
          </button>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content for PDF generation */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div ref={contentRef} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mx-auto max-w-3xl">
            {/* Header Area */}
            <div className="border-b border-gray-100 pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Report #{report.reportId}</h2>
                    <p className="text-sm text-gray-500">{new Date(report.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg border text-sm font-semibold flex items-center gap-1.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-colors ${getStatusColor(report.status)} ${updatingStatus ? 'opacity-50' : ''}`}>
                  {report.status === 'PENDING' && <Clock size={14} />}
                  {report.status === 'RESOLVED' && <CheckCircle size={14} />}
                  <select 
                    value={report.status}
                    onChange={handleStatusChange}
                    disabled={updatingStatus}
                    className="bg-transparent border-none focus:ring-0 cursor-pointer outline-none appearance-none font-semibold text-inherit"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="DISMISSED">DISMISSED</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Severity</h3>
                  <p className="text-lg font-semibold text-gray-900">{report.severity}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Content Type</h3>
                  <p className="text-gray-900 font-medium bg-gray-50 px-2 py-1 rounded inline-block">
                    {report.contentType}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">AI Confidence Score</h3>
                  <p className="text-gray-900 font-medium">{report.aiConfidence}</p>
                </div>
              </div>

              <div className="space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Reference URL</h3>
                  {report.referenceURL ? (
                    <a href={report.referenceURL} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 break-all flex items-center gap-1">
                      {report.referenceURL} <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span className="text-gray-400">None provided</span>
                  )}
                </div>
                
                {report.txHash && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Hash size={14} /> Blockchain Transaction Hash
                    </h3>
                    <p className="text-xs bg-gray-50 p-2 rounded text-gray-600 font-mono break-all border border-gray-100">
                      {report.txHash}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-gray-700 whitespace-pre-wrap break-words overflow-hidden">
                {report.description || "No description provided."}
              </div>
            </div>

            {/* Evidence Sub-section */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>Evidence Records</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  Count: {report.evidenceCount}
                </span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">IPFS CIDs</h4>
                  <ul className="space-y-2">
                    {report.evidenceCID.map((cid, i) => (
                      <li key={i} className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-2 border border-gray-100 rounded break-all flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-indigo-500 shrink-0" /> {cid}
                      </li>
                    ))}
                    {report.evidenceCID.length === 0 && <span className="text-sm text-gray-400">No CIDs available</span>}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">Evidence URLs</h4>
                  <ul className="space-y-2">
                    {report.evidenceURL.map((url, i) => (
                      <li key={i} className="text-sm font-mono text-gray-600 bg-gray-50 px-3 py-2 border border-gray-100 rounded break-all">
                        <a href={url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                          {url}
                        </a>
                      </li>
                    ))}
                     {report.evidenceURL.length === 0 && <span className="text-sm text-gray-400">No URLs available</span>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center">
              Generated securely from Security Command Center • Report CID: {report.reportCID}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
