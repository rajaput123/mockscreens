'use client';

import { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAllCapacityRules, getUtilization, getCapacityStatusColor } from '../capacityData';

export default function LocationComparisonChart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const data = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const rules = getAllCapacityRules().filter(r => r.status === 'active');
    
    return rules
      .map(rule => ({
        location: rule.location,
        utilization: getUtilization(rule.currentOccupancy, rule.maxCapacity),
        capacity: rule.maxCapacity,
        occupancy: rule.currentOccupancy,
      }))
      .sort((a, b) => b.utilization - a.utilization);
  }, []);

  const getBarColor = (utilization: number) => {
    const color = getCapacityStatusColor(utilization);
    const colorMap: Record<string, string> = {
      green: '#a87738',
      yellow: '#eab308',
      orange: '#f97316',
      red: '#ef4444',
    };
    return colorMap[color] || '#6b7280';
  };

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
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="location" 
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          label={{ value: 'Utilization %', angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
          }}
          formatter={(value: number, name: string, props: any) => {
            if (name === 'utilization') {
              return [`${value}%`, 'Utilization'];
            }
            return [value, name];
          }}
          labelFormatter={(label) => `Location: ${label}`}
        />
        <Bar dataKey="utilization" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.utilization)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

