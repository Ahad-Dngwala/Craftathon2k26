'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface WeeklyGraphProps {
  data: { name: string; value: number }[];
}

export default function WeeklyGraph({ data }: WeeklyGraphProps) {
  const formattedData = data.map(item => {
    const d = new Date(item.name);
    return {
      ...item,
      shortDate: d.toLocaleDateString('en-US', { weekday: 'short' })
    };
  });

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF385C" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#FF385C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#F7F7F7" />
          <XAxis 
            dataKey="shortDate" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#717171', fontWeight: 800 }} 
            dy={15}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#717171', fontWeight: 800 }}
          />
          <Tooltip
            cursor={{ stroke: '#FF385C', strokeWidth: 1.5, strokeDasharray: '4 4' }}
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '20px', 
              border: '1px solid rgba(0,0,0,0.05)', 
              padding: '16px 20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)' 
            }}
            itemStyle={{ color: '#222222', fontWeight: '900', fontSize: '18px' }}
            labelStyle={{ color: '#FF385C', fontSize: '9px', fontWeight: '900', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#FF385C" 
            strokeWidth={5}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={2000}
            animationEasing="ease-in-out"
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

