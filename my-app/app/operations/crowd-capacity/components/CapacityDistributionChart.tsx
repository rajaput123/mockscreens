'use client';

import { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getAllCapacityRules } from '../capacityData';

const COLORS = ['#3b82f6', '#a87738', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function CapacityDistributionChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const rules = getAllCapacityRules().filter(r => r.status === 'active');
    
    const totalCapacity = rules.reduce((sum, r) => sum + r.maxCapacity, 0);
    
    return rules.map((rule, index) => ({
      name: rule.location,
      value: rule.maxCapacity,
      percentage: totalCapacity > 0 ? Math.round((rule.maxCapacity / totalCapacity) * 100) : 0,
      color: COLORS[index % COLORS.length],
    }));
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Loading chart...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No capacity data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
          }}
          formatter={(value: number) => [`${value.toLocaleString()}`, 'Capacity']}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => value}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

