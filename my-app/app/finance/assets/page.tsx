'use client';

import { useState } from 'react';
import { Asset } from '../../components/finance/types';
import AssetDetailModal from '../../components/finance/AssetDetailModal';
import ModuleLayout from '../../components/layout/ModuleLayout';
import ModuleNavigation from '../../components/layout/ModuleNavigation';
import { navigationMenus } from '../../components/navigation/navigationData';

export default function AssetsPage() {
  const module = navigationMenus.finance.find(m => m.id === 'asset-property');
  const subServices = module?.subServices || [];
  const functions = module?.functions || [];

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: '1',
      name: 'Main Temple Building',
      category: 'property',
      description: 'Primary temple structure with main hall',
      purchaseDate: '1990-01-01',
      purchasePrice: 2000000,
      currentValue: 15000000,
      location: 'Main Complex',
      condition: 'good',
    },
    {
      id: '2',
      name: 'Temple Vehicle - Van',
      category: 'vehicle',
      description: 'Transport vehicle for temple activities',
      purchaseDate: '2020-06-15',
      purchasePrice: 800000,
      currentValue: 400000,
      location: 'Parking Area',
      condition: 'good',
      depreciationRate: 10,
    },
    {
      id: '3',
      name: 'Sound System Equipment',
      category: 'equipment',
      description: 'Complete audio system for temple events',
      purchaseDate: '2023-03-10',
      purchasePrice: 150000,
      currentValue: 120000,
      location: 'Main Hall',
      condition: 'excellent',
      depreciationRate: 15,
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'good':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'fair':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'poor':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'property':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'vehicle':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'equipment':
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <ModuleLayout
      title="Asset Register"
      description="Manage and track temple assets and properties"
      breadcrumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Finance', href: '#' },
        { label: 'Asset & Property Management', href: '/finance/asset-property' },
        { label: 'Asset Register' },
      ]}
      action={
        <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-2xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Asset
        </button>
      }
    >
      <ModuleNavigation
        subServices={subServices}
        functions={functions}
        moduleId="asset-property"
        category="finance"
      />

      <div className="space-y-6">

        {/* Summary Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 shadow-md border border-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-700 mb-2">Total Asset Value</p>
              <p className="text-4xl font-bold text-indigo-900">{formatCurrency(totalValue)}</p>
              <p className="text-sm text-indigo-600 mt-2">{assets.length} assets registered</p>
            </div>
            <div className="w-20 h-20 bg-indigo-200 rounded-2xl flex items-center justify-center">
              <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-indigo-600">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(asset.category)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{asset.category}</p>
                    </div>
                  </div>
                </div>

                {asset.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{asset.description}</p>
                )}

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Value</span>
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(asset.currentValue)}</span>
                  </div>
                  {asset.purchasePrice && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Purchase Price</span>
                      <span className="text-sm font-medium text-gray-700">{formatCurrency(asset.purchasePrice)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <span className="text-sm text-gray-700">{asset.location}</span>
                  </div>
                  {asset.purchaseDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Purchase Date</span>
                      <span className="text-sm text-gray-700">
                        {new Date(asset.purchaseDate).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getConditionColor(asset.condition)}`}>
                    {asset.condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <button 
                    onClick={() => setSelectedAsset(asset)}
                    className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {assets.length === 0 && (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new asset.</p>
          </div>
        )}

        {/* Modals */}
        {selectedAsset && (
          <AssetDetailModal
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onDelete={(assetId) => {
              setAssets(assets.filter(a => a.id !== assetId));
            }}
          />
        )}
      </div>
    </ModuleLayout>
  );
}

