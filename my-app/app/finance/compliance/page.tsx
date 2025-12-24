'use client';

import { useState } from 'react';
import { ComplianceRecord } from '../../components/finance/types';
import ComplianceDetailModal from '../../components/finance/ComplianceDetailModal';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../components/navigation/navigationData';

export default function CompliancePage() {
  const module = navigationMenus.finance.find(m => m.id === 'compliance-legal');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null);
  const [records, setRecords] = useState<ComplianceRecord[]>([
    {
      id: '1',
      type: 'tax_return',
      title: 'Income Tax Return - FY 2023-24',
      description: 'Annual income tax return filing',
      dueDate: '2024-07-31',
      status: 'pending',
    },
    {
      id: '2',
      type: 'gst_filing',
      title: 'GST Return - March 2024',
      description: 'Monthly GST return filing',
      dueDate: '2024-04-20',
      status: 'pending',
    },
    {
      id: '3',
      type: 'audit',
      title: 'Annual Audit - FY 2023-24',
      description: 'Statutory audit completion',
      dueDate: '2024-09-30',
      status: 'pending',
    },
    {
      id: '4',
      type: 'gst_filing',
      title: 'GST Return - February 2024',
      description: 'Monthly GST return filing',
      dueDate: '2024-03-20',
      filingDate: '2024-03-18',
      status: 'completed',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tax_return':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'gst_filing':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'audit':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !records.find(r => r.dueDate === dueDate && r.status === 'completed');
  };

  return (
    <ModuleLayout
      title="Compliance & Legal"
      description="Manage tax returns, audits, and legal compliance"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Compliance & Legal', href: '/finance/compliance-legal' },
        { label: 'Compliance Dashboard' },
      ]}
      action={
        <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Record
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="compliance-legal"
        category="finance"
      />

      <div className="space-y-6">

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Records</p>
            <p className="text-3xl font-bold text-gray-900">{records.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Pending</p>
            <p className="text-3xl font-bold text-amber-600">
              {records.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Overdue</p>
            <p className="text-3xl font-bold text-red-600">
              {records.filter(r => isOverdue(r.dueDate)).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Completed</p>
            <p className="text-3xl font-bold text-amber-600">
              {records.filter(r => r.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Compliance Records */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Filing Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr 
                    key={record.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecord(record)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(record.type)}
                        <span className="text-sm text-gray-600 capitalize">
                          {record.type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {record.description || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(record.dueDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.filingDate
                        ? new Date(record.filingDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        getStatusColor(isOverdue(record.dueDate) ? 'overdue' : record.status)
                      }`}>
                        {isOverdue(record.dueDate) ? 'Overdue' : record.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                          className="text-amber-600 hover:text-amber-700 font-medium"
                        >
                          View
                        </button>
                        {record.status === 'pending' && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setRecords(records.map(r => 
                                r.id === record.id 
                                  ? { ...r, status: 'completed' as const, filingDate: new Date().toISOString().split('T')[0] }
                                  : r
                              ));
                            }}
                            className="text-amber-600 hover:text-amber-700 font-medium"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {selectedRecord && (
          <ComplianceDetailModal
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
            onMarkFiled={(recordId) => {
              setRecords(records.map(r => 
                r.id === recordId 
                  ? { ...r, status: 'filed' as const, filingDate: new Date().toISOString().split('T')[0] }
                  : r
              ));
            }}
          />
        )}
      </div>
    </ModuleLayout>
  );
}

