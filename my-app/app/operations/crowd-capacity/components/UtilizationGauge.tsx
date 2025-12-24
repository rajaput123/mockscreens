'use client';

import { useMemo, useState, useEffect } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { CapacityRule, getUtilization, getCapacityStatusColor } from '../capacityData';

interface UtilizationGaugeProps {
  rule: CapacityRule;
}

export default function UtilizationGauge({ rule }: UtilizationGaugeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const utilization = useMemo(() => getUtilization(rule.currentOccupancy, rule.maxCapacity), [rule]);
  const statusColor = useMemo(() => getCapacityStatusColor(utilization), [utilization]);

  const colorMap: Record<string, string> = {
    green: '#a87738',
    yellow: '#eab308',
    orange: '#f97316',
    red: '#ef4444',
  };

  const color = colorMap[statusColor] || '#6b7280';

  // Create data for semi-circle gauge
  const data = [
    { name: 'Used', value: utilization, fill: color },
    { name: 'Available', value: 100 - utilization, fill: '#e5e7eb' },
  ];

  if (!isMounted) {
    return (
      <div className="flex flex-col items-center">
        <div className="w-full h-[200px] flex items-center justify-center text-gray-500">
          <p>Loading...</p>
        </div>
        <div className="mt-4 text-center">
          <div className="text-4xl font-bold text-gray-400">
            --
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="90%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <div className="text-4xl font-bold" style={{ color }}>
          {utilization}%
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {rule.currentOccupancy.toLocaleString()} / {rule.maxCapacity.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {rule.maxCapacity - rule.currentOccupancy} available
        </div>
      </div>
    </div>
  );
}

