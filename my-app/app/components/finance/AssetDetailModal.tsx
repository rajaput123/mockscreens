'use client';

import Modal from '../ui/Modal';
import { Asset } from './types';

interface AssetDetailModalProps {
  asset: Asset | null;
  onClose: () => void;
  onDelete?: (assetId: string) => void;
}

export default function AssetDetailModal({ asset, onClose, onDelete }: AssetDetailModalProps) {
  if (!asset) return null;

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

  return (
    <Modal isOpen={!!asset} onClose={onClose} title={asset.name} size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Category</label>
            <p className="mt-1 text-gray-900 capitalize">{asset.category}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Condition</label>
            <p className="mt-1 text-gray-900 capitalize">{asset.condition}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Location</label>
            <p className="mt-1 text-gray-900">{asset.location}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Current Value</label>
            <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(asset.currentValue)}</p>
          </div>
          {asset.purchasePrice && (
            <div>
              <label className="text-sm font-medium text-gray-600">Purchase Price</label>
              <p className="mt-1 text-gray-900">{formatCurrency(asset.purchasePrice)}</p>
            </div>
          )}
          {asset.purchaseDate && (
            <div>
              <label className="text-sm font-medium text-gray-600">Purchase Date</label>
              <p className="mt-1 text-gray-900">
                {new Date(asset.purchaseDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}
          {asset.depreciationRate && (
            <div>
              <label className="text-sm font-medium text-gray-600">Depreciation Rate</label>
              <p className="mt-1 text-gray-900">{asset.depreciationRate}%</p>
            </div>
          )}
        </div>
        {asset.description && (
          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="mt-1 text-gray-900">{asset.description}</p>
          </div>
        )}
        <div className="flex gap-3 pt-4 border-t">
          {onDelete && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete this asset?')) {
                  onDelete(asset.id);
                  onClose();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

