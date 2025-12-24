'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { ModernCard, ElevatedCard } from '../../components';
import { DeliveryLog, DeliveryStatus } from '../types';
import { mockDeliveryLogs } from '../mockData';
import { loadDeliveryLogs, saveDeliveryLogs } from '../../utils/dataStorage';
import { loadAnnouncements } from '../../utils/dataStorage';
import { Announcement } from '../types';

export default function CommunicationsPage() {
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRecipientType, setFilterRecipientType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<DeliveryLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load logs and announcements from localStorage on mount
  useEffect(() => {
    const staticLogs = mockDeliveryLogs;
    const loadedLogs = loadDeliveryLogs(staticLogs);
    setLogs(loadedLogs);

    // Load announcements to get titles
    const { mockAnnouncements } = require('../mockData');
    const loadedAnnouncements = loadAnnouncements(mockAnnouncements);
    setAnnouncements(loadedAnnouncements);
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesRecipientType = filterRecipientType === 'all' || log.recipientType === filterRecipientType;
    const announcement = announcements.find(a => a.id === log.announcementId);
    const matchesSearch = !searchTerm || 
      log.recipientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (announcement && announcement.title.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesRecipientType && matchesSearch;
  });

  const handleView = (log: DeliveryLog) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const statusColors: Record<DeliveryStatus, { bg: string; text: string }> = {
    sent: { bg: 'bg-blue-100', text: 'text-blue-700' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700' },
    failed: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  const stats = {
    total: logs.length,
    delivered: logs.filter(l => l.status === 'delivered').length,
    failed: logs.filter(l => l.status === 'failed').length,
    sent: logs.filter(l => l.status === 'sent').length,
  };

  return (
    <ModuleLayout
      title="Communications Hub"
      description="View delivery logs and communication status"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <ModernCard elevation="lg" className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Logs</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </ModernCard>
        <ModernCard elevation="lg" className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          </div>
        </ModernCard>
        <ModernCard elevation="lg" className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </ModernCard>
        <ModernCard elevation="lg" className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Sent</p>
            <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          </div>
        </ModernCard>
      </div>

      {/* Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by recipient ID or announcement title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={filterRecipientType}
            onChange={(e) => setFilterRecipientType(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Types</option>
            <option value="devotee">Devotee</option>
            <option value="volunteer">Volunteer</option>
            <option value="employee">Employee</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-2xl border transition-all font-medium ${
                viewMode === 'table'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-2xl border transition-all font-medium ${
                viewMode === 'cards'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cards
            </button>
          </div>
        </div>
      </ModernCard>

      {/* Table View */}
      {viewMode === 'table' && (
        <ElevatedCard elevation="lg" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Announcement</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recipient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => {
                    const announcement = announcements.find(a => a.id === log.announcementId);
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{announcement?.title || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{log.recipientId}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">{log.recipientType}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-xl text-xs font-medium ${statusColors[log.status].bg} ${statusColors[log.status].text}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleView(log)}
                            className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No delivery logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </ElevatedCard>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <>
          {filteredLogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLogs.map((log) => {
                const announcement = announcements.find(a => a.id === log.announcementId);
                return (
                  <ElevatedCard
                    key={log.id}
                    onClick={() => handleView(log)}
                    elevation="lg"
                    className="cursor-pointer hover:scale-105 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{announcement?.title || 'Unknown Announcement'}</h3>
                          <p className="text-xs text-gray-500 capitalize">{log.recipientType}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${statusColors[log.status].bg} ${statusColors[log.status].text}`}>
                          {log.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Recipient: {log.recipientId}</p>
                        <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                      {log.failedReason && (
                        <div className="p-2 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-600">Failed: {log.failedReason}</p>
                        </div>
                      )}
                    </div>
                  </ElevatedCard>
                );
              })}
            </div>
          ) : (
            <ModernCard elevation="md" className="text-center p-12">
              <p className="text-gray-600">
                No delivery logs found. Delivery logs will appear here after announcements are sent.
              </p>
            </ModernCard>
          )}
        </>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLog(null);
        }}
        title="Delivery Log Details"
        size="md"
      >
        {selectedLog && (
          <div className="space-y-6">
            {(() => {
              const announcement = announcements.find(a => a.id === selectedLog.announcementId);
              return (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Announcement</p>
                  <p className="text-sm font-semibold text-gray-900">{announcement?.title || 'Unknown'}</p>
                </div>
              );
            })()}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Recipient ID</p>
                <p className="text-sm font-semibold text-gray-900">{selectedLog.recipientId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Recipient Type</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{selectedLog.recipientType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${statusColors[selectedLog.status].bg} ${statusColors[selectedLog.status].text}`}>
                  {selectedLog.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Timestamp</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
              </div>
              {selectedLog.deliveredAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Delivered At</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(selectedLog.deliveredAt).toLocaleString()}</p>
                </div>
              )}
            </div>
            {selectedLog.failedReason && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Failure Reason</p>
                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-sm text-red-700">{selectedLog.failedReason}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </ModuleLayout>
  );
}
