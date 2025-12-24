'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import DailyOperationsPlanView from '../components/DailyOperationsPlanView';

export default function DailyOperationsPlanPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [planStatus, setPlanStatus] = useState<'draft' | 'finalized' | 'published'>('draft');
  const [dayType, setDayType] = useState<'normal' | 'festival' | 'special'>('normal');
  // TODO: Replace with actual user role check from auth context
  // For now, defaulting to true for admin access
  const [isAdmin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumbs - Tailwind Only */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-400">Operations</span>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <Link href="/operations/operational-planning" className="hover:text-gray-900 transition-colors">
                Operational Planning & Control
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Daily Operations Plan</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Operations Plan</h1>
          <p className="text-gray-600">Create, review, and modify the structured operational plan for a specific day</p>
        </div>

        <DailyOperationsPlanView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          planStatus={planStatus}
          onStatusChange={setPlanStatus}
          dayType={dayType}
          onDayTypeChange={setDayType}
          isAdmin={isAdmin}
          templeName="Shri Krishna Temple"
        />
      </main>
    </div>
  );
}
