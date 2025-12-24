'use client';

import { useState } from 'react';
import { Vendor } from '../../components/finance/types';
import VendorDetailModal from '../../components/finance/VendorDetailModal';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../components/navigation/navigationData';

export default function VendorsPage() {
  const module = navigationMenus.finance.find(m => m.id === 'supplier-vendor');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'ABC Construction Pvt Ltd',
      type: 'contractor',
      contactPerson: 'Rajesh Kumar',
      email: 'contact@abcconstruction.com',
      phone: '+91 9876543210',
      address: '123 Industrial Area, City, State - 123456',
      gstNumber: '29ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'BANK0001234',
        bankName: 'State Bank of India',
      },
      status: 'active',
      rating: 4.5,
      totalTransactions: 25,
      totalAmount: 2500000,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
    },
    {
      id: '2',
      name: 'XYZ Supplies',
      type: 'supplier',
      contactPerson: 'Priya Sharma',
      email: 'info@xyzsupplies.com',
      phone: '+91 9876543211',
      address: '456 Market Street, City, State - 234567',
      gstNumber: '27FGHIJ5678K2Z6',
      status: 'active',
      rating: 4.2,
      totalTransactions: 50,
      totalAmount: 1200000,
      createdAt: '2023-02-20T10:00:00Z',
      updatedAt: '2024-03-10T10:00:00Z',
    },
    {
      id: '3',
      name: 'Clean Services Co',
      type: 'service_provider',
      contactPerson: 'Amit Patel',
      email: 'contact@cleanservices.com',
      phone: '+91 9876543212',
      address: '789 Service Road, City, State - 345678',
      status: 'active',
      rating: 4.8,
      totalTransactions: 30,
      totalAmount: 450000,
      createdAt: '2023-03-10T10:00:00Z',
      updatedAt: '2024-03-12T10:00:00Z',
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
      case 'suspended':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'supplier':
        return 'bg-amber-100 text-amber-700';
      case 'contractor':
        return 'bg-amber-100 text-amber-700';
      case 'service_provider':
        return 'bg-teal-100 text-teal-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <ModuleLayout
      title="Vendor Directory"
      description="Manage suppliers, contractors, and service providers"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Supplier / Vendor Management', href: '/finance/supplier-vendor' },
        { label: 'Vendor Directory' },
      ]}
      action={
        <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vendor
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="supplier-vendor"
        category="finance"
      />

      <div className="space-y-6">

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{vendor.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getTypeColor(vendor.type)}`}>
                        {vendor.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(vendor.status)}`}>
                        {vendor.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    {vendor.rating && (
                      <div className="flex items-center gap-1">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20" className="text-amber-500">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{vendor.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {vendor.contactPerson && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{vendor.contactPerson}</span>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{vendor.email}</span>
                    </div>
                  )}
                </div>

                {vendor.totalTransactions !== undefined && vendor.totalAmount !== undefined && (
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Transactions</span>
                      <span className="font-semibold text-gray-900">{vendor.totalTransactions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total Amount</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(vendor.totalAmount)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <button 
                    onClick={() => setSelectedVendor(vendor)}
                    className="w-full px-4 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {vendors.length === 0 && (
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new vendor.</p>
          </div>
        )}

        {/* Modals */}
        {selectedVendor && (
          <VendorDetailModal
            vendor={selectedVendor}
            onClose={() => setSelectedVendor(null)}
            onDelete={(vendorId) => {
              setVendors(vendors.filter(v => v.id !== vendorId));
            }}
          />
        )}
      </div>
    </ModuleLayout>
  );
}

