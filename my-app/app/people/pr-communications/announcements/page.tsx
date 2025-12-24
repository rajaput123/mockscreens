'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { Modal } from '../../../components';
import { ModernCard, ElevatedCard } from '../../components';
import { Announcement, AnnouncementStatus, AudienceType } from '../types';
import { mockAnnouncements } from '../mockData';
import { loadAnnouncements, saveAnnouncements } from '../../utils/dataStorage';
import PublishAnnouncementModal from '../components/PublishAnnouncementModal';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAudience, setFilterAudience] = useState<string>('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load announcements from localStorage on mount
  useEffect(() => {
    const staticAnnouncements = mockAnnouncements;
    const loadedAnnouncements = loadAnnouncements(staticAnnouncements);
    setAnnouncements(loadedAnnouncements);
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    const matchesAudience = filterAudience === 'all' || announcement.audience === filterAudience;
    return matchesSearch && matchesStatus && matchesAudience;
  });

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  const handleDelete = (announcementId: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      const updatedAnnouncements = announcements.filter(a => a.id !== announcementId);
      setAnnouncements(updatedAnnouncements);
      saveAnnouncements(updatedAnnouncements);
      alert('Announcement deleted successfully!');
    }
  };

  const handleUpdate = (data: { title: string; message: string; audience: AudienceType; scheduledAt?: string }) => {
    if (!selectedAnnouncement) return;
    const updatedAnnouncements = announcements.map(a => 
      a.id === selectedAnnouncement.id 
        ? { 
            ...a, 
            title: data.title,
            message: data.message,
            audience: data.audience,
            scheduledAt: data.scheduledAt,
            status: data.scheduledAt ? 'scheduled' as AnnouncementStatus : a.status,
            updatedAt: new Date().toISOString()
          }
        : a
    );
    setAnnouncements(updatedAnnouncements);
    saveAnnouncements(updatedAnnouncements);
    setIsEditModalOpen(false);
    setSelectedAnnouncement(null);
    alert('Announcement updated successfully!');
  };

  const handleCancelSchedule = (announcementId: string) => {
    if (confirm('Cancel this scheduled announcement?')) {
      const updatedAnnouncements = announcements.map(a => 
        a.id === announcementId 
          ? { ...a, status: 'cancelled' as AnnouncementStatus }
          : a
      );
      setAnnouncements(updatedAnnouncements);
      saveAnnouncements(updatedAnnouncements);
      alert('Announcement cancelled!');
    }
  };

  const statusColors: Record<AnnouncementStatus, { bg: string; text: string }> = {
    draft: { bg: 'bg-gray-100', text: 'text-gray-700' },
    scheduled: { bg: 'bg-amber-100', text: 'text-amber-700' },
    sent: { bg: 'bg-green-100', text: 'text-green-700' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
  };

  return (
    <ModuleLayout
      title="Announcements"
      description="View all announcements and their delivery status"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <a
          href="/people/pr-communications/publish-announcement"
          className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Create New Announcement
        </a>
      </div>

      {/* Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search announcements by title or message..."
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
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="sent">Sent</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="px-4 py-2 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm bg-white"
          >
            <option value="all">All Audiences</option>
            <option value="all">All</option>
            <option value="devotees">Devotees</option>
            <option value="volunteers">Volunteers</option>
            <option value="employees">Employees</option>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Audience</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement) => (
                    <tr
                      key={announcement.id}
                      className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{announcement.title}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-1">{announcement.message}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{announcement.audience}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${statusColors[announcement.status].bg} ${statusColors[announcement.status].text}`}>
                          {announcement.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(announcement.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(announcement)}
                            className="text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors"
                          >
                            View
                          </button>
                          {announcement.status !== 'sent' && (
                            <>
                              <button
                                onClick={() => handleEdit(announcement)}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(announcement.id)}
                                className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {announcement.status === 'scheduled' && (
                            <button
                              onClick={() => handleCancelSchedule(announcement.id)}
                              className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No announcements found. Create your first announcement.
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
          {filteredAnnouncements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnnouncements.map((announcement) => (
                <ElevatedCard
                  key={announcement.id}
                  onClick={() => handleView(announcement)}
                  elevation="lg"
                  className="cursor-pointer hover:scale-105 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                        <p className="text-xs text-gray-500 capitalize">{announcement.audience}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-xl text-xs font-medium ${statusColors[announcement.status].bg} ${statusColors[announcement.status].text}`}>
                        {announcement.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{announcement.message}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                      <span>By {announcement.createdByName}</span>
                      <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                    {announcement.scheduledAt && (
                      <div className="text-xs text-amber-600 font-medium">
                        Scheduled: {new Date(announcement.scheduledAt).toLocaleString()}
                      </div>
                    )}
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(announcement);
                        }}
                        className="flex-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm font-medium transition-colors"
                      >
                        View
                      </button>
                      {announcement.status !== 'sent' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(announcement);
                            }}
                            className="flex-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(announcement.id);
                            }}
                            className="flex-1 px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </ElevatedCard>
              ))}
            </div>
          ) : (
            <ModernCard elevation="md" className="text-center p-12">
              <p className="text-gray-600">
                No announcements found. Create your first announcement to get started.
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
          setSelectedAnnouncement(null);
        }}
        title={selectedAnnouncement?.title}
        size="md"
      >
        {selectedAnnouncement && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Audience</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">{selectedAnnouncement.audience}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-medium ${statusColors[selectedAnnouncement.status].bg} ${statusColors[selectedAnnouncement.status].text}`}>
                  {selectedAnnouncement.status}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created By</p>
                <p className="text-sm font-semibold text-gray-900">{selectedAnnouncement.createdByName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Created</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(selectedAnnouncement.createdAt).toLocaleString()}</p>
              </div>
              {selectedAnnouncement.scheduledAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Scheduled For</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(selectedAnnouncement.scheduledAt).toLocaleString()}</p>
                </div>
              )}
              {selectedAnnouncement.sentAt && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Sent At</p>
                  <p className="text-sm font-semibold text-gray-900">{new Date(selectedAnnouncement.sentAt).toLocaleString()}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Message</p>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-700">{selectedAnnouncement.message}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      {selectedAnnouncement && (
        <PublishAnnouncementModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedAnnouncement(null);
          }}
          onPublish={handleUpdate}
          initialData={{
            title: selectedAnnouncement.title,
            message: selectedAnnouncement.message,
            audience: selectedAnnouncement.audience,
            scheduledAt: selectedAnnouncement.scheduledAt,
          }}
        />
      )}
    </ModuleLayout>
  );
}
