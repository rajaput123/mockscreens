'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import {
  getAllStockRequests,
  getStockRequestById,
  saveStockRequest,
  StockRequest,
} from '../../../operations/perishable-inventory/inventoryData';

export default function StockRequestsPage() {
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const allRequests = getAllStockRequests();
    setRequests(allRequests);
  };

  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter(r => r.status === filterStatus);

  const handleApprove = (requestId: string) => {
    const request = getStockRequestById(requestId);
    if (request) {
      const updatedRequest: StockRequest = {
        ...request,
        status: 'approved',
        approvedBy: 'Finance Admin', // TODO: Get from auth
        approvedDate: new Date().toISOString(),
      };
      saveStockRequest(updatedRequest);
      loadRequests();
      setShowModal(false);
      setSelectedRequest(null);
      alert('Stock request approved successfully!');
    }
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    const updatedRequest: StockRequest = {
      ...selectedRequest,
      status: 'rejected',
      approvedBy: 'Finance Admin', // TODO: Get from auth
      approvedDate: new Date().toISOString(),
      rejectionReason: rejectionReason,
    };
    saveStockRequest(updatedRequest);
    loadRequests();
    setShowModal(false);
    setSelectedRequest(null);
    setRejectionReason('');
    alert('Stock request rejected.');
  };

  const handleViewDetails = (request: StockRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
    setRejectionReason('');
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const totalEstimatedCost = filteredRequests
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + r.estimatedCost, 0);

  return (
    <ModuleLayout
      title="Stock Requests Approval"
      description="Review and approve stock requests from inventory management"
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Pending Requests</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Approved</p>
          <p className="text-2xl font-bold text-amber-600">{approvedCount}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-600 mb-1">Pending Value</p>
          <p className="text-2xl font-bold text-amber-600">₹{totalEstimatedCost.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 mr-2">Filter:</span>
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterStatus === status
                  ? 'bg-amber-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? requests.length : status === 'pending' ? pendingCount : status === 'approved' ? approvedCount : rejectedCount})
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-gray-200 shadow-sm">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No stock requests found</h3>
          <p className="text-gray-500 text-sm">
            {filterStatus === 'all' 
              ? 'No stock requests have been submitted yet'
              : `No ${filterStatus} requests found`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-amber-400 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{request.itemName}</h3>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      request.priority === 'urgent'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : request.priority === 'high'
                        ? 'bg-orange-50 text-orange-700 border-orange-200'
                        : request.priority === 'medium'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {request.priority.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${
                      request.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : request.status === 'approved'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {request.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-semibold text-gray-900">{request.requestedQuantity} {request.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Estimated Cost:</span>
                      <span className="ml-2 font-semibold text-gray-900">₹{request.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Requested By:</span>
                      <span className="ml-2 font-semibold text-gray-900">{request.requestedBy}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {new Date(request.requestedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {request.reason && (
                    <div className="mt-3 text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {request.reason}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewDetails(request)}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 m-4 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Stock Request Details</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedRequest(null);
                  setRejectionReason('');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Item Name
                  </label>
                  <p className="text-lg font-bold text-gray-900">{selectedRequest.itemName}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Category
                  </label>
                  <p className="text-lg text-gray-900">{selectedRequest.category}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Quantity
                  </label>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedRequest.requestedQuantity} {selectedRequest.unit}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Estimated Cost
                  </label>
                  <p className="text-lg font-bold text-amber-600">
                    ₹{selectedRequest.estimatedCost.toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Priority
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${
                    selectedRequest.priority === 'urgent'
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : selectedRequest.priority === 'high'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : selectedRequest.priority === 'medium'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-gray-50 text-gray-700 border-gray-200'
                  }`}>
                    {selectedRequest.priority.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold border ${
                    selectedRequest.status === 'pending'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : selectedRequest.status === 'approved'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {selectedRequest.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Reason
                </label>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.location && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Storage Location
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.location}</p>
                </div>
              )}

              {selectedRequest.supplier && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Preferred Supplier
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.supplier}</p>
                </div>
              )}

              {selectedRequest.notes && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Additional Notes
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Provide a reason for rejection..."
                  />
                </div>
              )}

              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Rejection Reason
                  </label>
                  <p className="text-sm text-red-700 leading-relaxed">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {selectedRequest.approvedBy && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {selectedRequest.status === 'approved' ? 'Approved By' : 'Rejected By'}
                    </label>
                    <p className="text-sm font-semibold text-gray-900">{selectedRequest.approvedBy}</p>
                  </div>
                  {selectedRequest.approvedDate && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Date
                      </label>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(selectedRequest.approvedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedRequest(null);
                    setRejectionReason('');
                  }}
                  className="px-6 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
                >
                  Close
                </button>
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all font-medium shadow-md hover:shadow-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      disabled={!rejectionReason.trim()}
                      className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

