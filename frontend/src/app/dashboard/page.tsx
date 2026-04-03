'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import WeeklyGraph from '@/components/dashboard/WeeklyGraph';
import ContentTypePie from '@/components/dashboard/ContentTypePie';
import ThreadsView from '@/components/dashboard/ThreadsView';
import { ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

interface DashboardData {
  stats: {
    total: number;
    pending: number;
    resolved: number;
  };
  chartData: {
    weeklyReports: { name: string; value: number }[];
    categories: { name: string; value: number }[];
  };
}

export default function DashboardPage() {
  const { token, activeTab } = useAppStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const json = await res.json();

        if (json.status === 'success') {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      if (activeTab === 'dashboard') {
        fetchDashboardData();
      } else {
        setLoading(false); // ThreadsView does its own loading
      }
    }
  }, [token, activeTab]);

  if (activeTab === 'threads') {
    return <ThreadsView />;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 bg-gray-50 min-h-full rounded-3xl pb-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-end justify-between px-2 pt-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Live infrastructure monitoring and AI threat distribution.</p>
        </div>
      </motion.div>

      {/* Quick KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4"
        >
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Reported</p>
            <h3 className="text-2xl font-bold text-gray-900">{data?.stats.total || 0}</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4"
        >
          <div className="p-3 bg-red-100 rounded-xl text-red-600">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Pending</p>
            <h3 className="text-2xl font-bold text-gray-900">{data?.stats.pending || 0}</h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4"
        >
          <div className="p-3 bg-green-100 rounded-xl text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Resolved</p>
            <h3 className="text-2xl font-bold text-gray-900">{data?.stats.resolved || 0}</h3>
          </div>
        </motion.div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
        {data && <WeeklyGraph data={data.chartData.weeklyReports} />}
        {data && <ContentTypePie data={data.chartData.categories} />}
      </div>
    </div>
  );
}
