'use client';

import { useState } from 'react';
import { Branch } from '../../components/finance/types';
import BranchDetailModal from '../../components/finance/BranchDetailModal';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../components/navigation/navigationData';

export default function BranchesPage() {
  const module = navigationMenus.finance.find(m => m.id === 'branch-management');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: '1',
      name: 'Main Temple',
      code: 'MT-001',
      address: '123 Temple Street',
      city: 'City',
      state: 'State',
      pincode: '123456',
      phone: '+91 9876543210',
      email: 'main@temple.com',
      managerName: 'Rajesh Kumar',
      managerPhone: '+91 9876543211',
      status: 'active',
      openingDate: '1990-01-01',
      totalRevenue: 5000000,
      totalExpenses: 2000000,
    },
    {
      id: '2',
      name: 'North Branch',
      code: 'NB-002',
      address: '456 North Avenue',
      city: 'City',
      state: 'State',
      pincode: '234567',
      phone: '+91 9876543212',
      email: 'north@temple.com',
      managerName: 'Priya Sharma',
      managerPhone: '+91 9876543213',
      status: 'active',
      openingDate: '2010-06-15',
      totalRevenue: 2500000,
      totalExpenses: 1000000,
    },
    {
      id: '3',
      name: 'South Branch',
      code: 'SB-003',
      address: '789 South Road',
      city: 'City',
      state: 'State',
      pincode: '345678',
      phone: '+91 9876543214',
      email: 'south@temple.com',
      managerName: 'Amit Patel',
      managerPhone: '+91 9876543215',
      status: 'active',
      openingDate: '2015-03-20',
      totalRevenue: 1800000,
      totalExpenses: 800000,
    },
  ]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalRevenue = branches.reduce((sum, b) => sum + (b.totalRevenue || 0), 0);
  const totalExpenses = branches.reduce((sum, b) => sum + (b.totalExpenses || 0), 0);

  return (
    <ModuleLayout
      title="Branch Directory"
      description="Manage temple branches and their operations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Branch Management', href: '/finance/branch-management' },
        { label: 'Branch Directory' },
      ]}
      action={
        <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Branch
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="branch-management"
        category="finance"
      />

      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Branches</p>
            <p className="text-3xl font-bold text-gray-900">{branches.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-amber-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{branch.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Code: {branch.code}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(branch.status)}`}>
                      {branch.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{branch.address}, {branch.city}, {branch.state} - {branch.pincode}</span>
                  </div>
                  {branch.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{branch.phone}</span>
                    </div>
                  )}
                  {branch.managerName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Manager: {branch.managerName}</span>
                    </div>
                  )}
                </div>

                {branch.totalRevenue !== undefined && branch.totalExpenses !== undefined && (
                  <div className="pt-4 border-t border-gray-100 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Revenue</span>
                      <span className="font-semibold text-amber-600">{formatCurrency(branch.totalRevenue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Expenses</span>
                      <span className="font-semibold text-red-600">{formatCurrency(branch.totalExpenses)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                      <span className="font-medium text-gray-700">Net</span>
                      <span className={`font-bold ${(branch.totalRevenue - branch.totalExpenses) >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                        {formatCurrency(branch.totalRevenue - branch.totalExpenses)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setSelectedBranch(branch)}
                    className="w-full px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {branches.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md border border-gray-100">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No branches</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new branch.</p>
          </div>
        )}

        {/* Modals */}
        {selectedBranch && (
          <BranchDetailModal
            branch={selectedBranch}
            onClose={() => setSelectedBranch(null)}
            onDelete={(branchId) => {
              setBranches(branches.filter(b => b.id !== branchId));
            }}
          />
        )}
      </div>
    </ModuleLayout>
  );
}

