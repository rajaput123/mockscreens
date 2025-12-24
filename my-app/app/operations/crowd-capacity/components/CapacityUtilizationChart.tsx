'use client';

import { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAllCapacityRules, generateHistoricalData } from '../capacityData';

type TimeRange = 'today' | 'week' | 'month';

export default function CapacityUtilizationChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const data = useMemo(() => {
    if (typeof window === 'undefined') return [];
    const rules = getAllCapacityRules()
      .filter(r => r.status === 'active')
      .slice(0, 5); // Limit to 5 locations for readability
    
    const days = timeRange === 'today' ? 1 : timeRange === 'week' ? 7 : 30;
    
    // Generate time points
    const timePoints: string[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      timePoints.push(date.toISOString().split('T')[0]);
    }
    
    // Create chart data structure
    const chartData = timePoints.map(date => {
      const point: any = { date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
      
      rules.forEach(rule => {
        const historical = generateHistoricalData(rule.location, days);
        const pointData = historical.find(h => h.timestamp.startsWith(date));
        point[rule.location] = pointData ? pointData.utilization : 0;
      });
      
      return point;
    });
    
    return chartData;
  }, [timeRange]);

  const rules = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return getAllCapacityRules()
      .filter(r => r.status === 'active')
      .slice(0, 5);
  }, []);

  const colors = ['#3b82f6', '#a87738', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Loading chart...</p>
      </div>
    );
  }

  if (rules.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No capacity data available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          {(['today', 'week', 'month'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
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
            formatter={(value: number) => [`${value}%`, 'Utilization']}
          />
          <Legend />
          {rules.map((rule, index) => (
            <Line
              key={rule.id}
              type="monotone"
              dataKey={rule.location}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

