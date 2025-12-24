'use client';

import { useState } from 'react';
import { Certificate80G } from '../../../components/finance/types';
import Generate80GModal from '../../../components/finance/Generate80GModal';
import Certificate80GDetailModal from '../../../components/finance/Certificate80GDetailModal';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import ModuleNavigation from '../../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../../components/navigation/navigationData';

export default function Certificates80GPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate80G | null>(null);
  const [certificates, setCertificates] = useState<Certificate80G[]>([
    {
      id: '1',
      donorName: 'Rajesh Kumar',
      donorPan: 'ABCDE1234F',
      donorAddress: '123 Main Street, City, State - 123456',
      donationAmount: 50000,
      donationDate: '2024-03-15',
      donationType: 'bank_transfer',
      transactionId: 'TXN-2024-001',
      certificateNumber: '80G/2024/0001',
      status: 'issued',
      issuedAt: '2024-03-15T10:00:00Z',
      issuedBy: 'Admin',
      createdAt: '2024-03-15T10:00:00Z',
      updatedAt: '2024-03-15T10:00:00Z',
    },
  ]);

  const handleGenerate = (certificateData: Omit<Certificate80G, 'id' | 'certificateNumber' | 'createdAt' | 'updatedAt'>) => {
    const certificateNumber = `80G/${new Date().getFullYear()}/${String(certificates.length + 1).padStart(4, '0')}`;
    const newCertificate: Certificate80G = {
      ...certificateData,
      id: `c${Date.now()}`,
      certificateNumber: certificateNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCertificates([newCertificate, ...certificates]);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(2)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const module = navigationMenus.finance.find(m => m.id === 'donations-80g');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  return (
    <ModuleLayout
      title="80G Certificates"
      description="Generate and manage 80G tax exemption certificates"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Donations & 80G', href: '#' },
        { label: '80G Certificates' },
      ]}
      action={
        <button
          onClick={() => setShowGenerateModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate Certificate
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="donations-80g"
        category="finance"
      />

      {/* Certificates List */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Certificate #</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Donor Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PAN</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((cert) => (
                <tr 
                  key={cert.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedCertificate(cert)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {cert.certificateNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cert.donorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {cert.donorPan || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(cert.donationAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(cert.donationDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                      cert.status === 'issued'
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : cert.status === 'draft'
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {cert.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCertificate(cert);
                        }}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Download certificate:', cert.id);
                        }}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-12">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No certificates</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by generating a new 80G certificate.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showGenerateModal && (
        <Generate80GModal 
          onClose={() => setShowGenerateModal(false)}
          onGenerate={handleGenerate}
        />
      )}

      {selectedCertificate && (
        <Certificate80GDetailModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
          onDownload={(cert) => {
            console.log('Download certificate:', cert.id);
          }}
        />
      )}
    </ModuleLayout>
  );
}

