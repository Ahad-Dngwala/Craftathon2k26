'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ContentTypePieProps {
  data: { name: string; value: number }[];
}

const AIRBNB_COLORS = ['#FF385C', '#00A699', '#FC642D', '#484848', '#717171', '#B0B0B0'];

export default function ContentTypePie({ data }: ContentTypePieProps) {
  const filteredData = data.filter(item => item.value > 0);

  return (
    <div className="w-full h-[400px]">
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              innerRadius={90}
              outerRadius={130}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationDuration={2000}
            >
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={AIRBNB_COLORS[index % AIRBNB_COLORS.length]} 
                  className="hover:opacity-80 transition-opacity outline-none"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                borderRadius: '24px', 
                border: '1px solid rgba(0,0,0,0.05)', 
                padding: '16px 20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)' 
              }}
              itemStyle={{ color: '#222222', fontWeight: '900', fontSize: '16px' }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ 
                fontSize: '10px', 
                fontWeight: '900', 
                color: '#717171', 
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                paddingTop: '40px' 
              }}
            />
          </PieChart>
        </ResponsiveContainer>

      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
          No categorization data available.
        </div>
      )}
    </div>
  );
}

