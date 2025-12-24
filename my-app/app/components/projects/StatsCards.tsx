'use client';

interface StatsCardsProps {
  stats: {
    total: number;
    inProgress: number;
    completed: number;
    planning: number;
    totalTarget: number;
    totalCurrent: number;
    averageProgress: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-gradient-to-br from-white to-amber-50/50 rounded-2xl p-6 shadow-lg border border-amber-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <p className="text-sm font-medium text-gray-600 mb-1">Total Projects</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <p className="text-sm font-medium text-gray-600 mb-1">In Progress</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.inProgress}</p>
      </div>

      <div className="bg-gradient-to-br from-white to-green-50/50 rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <p className="text-sm font-medium text-gray-600 mb-1">Completed</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completed}</p>
      </div>

      <div className="bg-gradient-to-br from-white to-purple-50/50 rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
        <p className="text-sm font-medium text-gray-600 mb-1">Avg Progress</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{Math.round(stats.averageProgress)}%</p>
      </div>
    </div>
  );
}

