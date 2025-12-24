'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { ModernCard, ElevatedCard } from '../../components';
import PublishAnnouncementModal from '../components/PublishAnnouncementModal';
import { Announcement, AudienceType } from '../types';
import { mockAnnouncements } from '../mockData';
import { loadAnnouncements, saveAnnouncements } from '../../utils/dataStorage';

export default function PublishAnnouncementPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load announcements from localStorage on mount
  useEffect(() => {
    const staticAnnouncements = mockAnnouncements;
    const loadedAnnouncements = loadAnnouncements(staticAnnouncements);
    setAnnouncements(loadedAnnouncements);
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handlePublish = (data: { title: string; message: string; audience: AudienceType; scheduledAt?: string }) => {
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      title: data.title,
      message: data.message,
      audience: data.audience,
      status: data.scheduledAt ? 'scheduled' : 'sent',
      scheduledAt: data.scheduledAt,
      sentAt: data.scheduledAt ? undefined : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      createdByName: 'Current User',
    };
    const updatedAnnouncements = [...announcements, newAnnouncement];
    setAnnouncements(updatedAnnouncements);
    saveAnnouncements(updatedAnnouncements);
    setIsModalOpen(false);
    alert(data.scheduledAt ? 'Announcement scheduled successfully!' : 'Announcement sent successfully!');
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
            status: data.scheduledAt ? 'scheduled' as const : a.status,
          }
        : a
    );
    setAnnouncements(updatedAnnouncements);
    saveAnnouncements(updatedAnnouncements);
    setIsEditModalOpen(false);
    setSelectedAnnouncement(null);
    alert('Announcement updated successfully!');
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsEditModalOpen(true);
  };

  const handleSendNow = (announcementId: string) => {
    if (confirm('Send this announcement now?')) {
      const updatedAnnouncements = announcements.map(a => 
        a.id === announcementId 
          ? { 
              ...a, 
              status: 'sent' as const,
              sentAt: new Date().toISOString(),
              scheduledAt: undefined
            }
          : a
      );
      setAnnouncements(updatedAnnouncements);
      saveAnnouncements(updatedAnnouncements);
      alert('Announcement sent successfully!');
    }
  };

  return (
    <ModuleLayout
      title="Publish Announcement"
      description="Create and send announcements to devotees, volunteers, or employees"
    >
      {/* Action Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-amber-600 text-white font-semibold transition-all hover:bg-amber-700 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          + Create New Announcement
        </button>
      </div>

      {/* Search and Filters */}
      <ModernCard elevation="md" className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search announcements..."
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
          </select>
        </div>
      </ModernCard>

      {/* Announcements List */}
      {filteredAnnouncements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map((announcement) => (
            <ElevatedCard
              key={announcement.id}
              elevation="lg"
              className="hover:scale-105 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{announcement.title}</h3>
                    <p className="text-xs text-gray-500 capitalize">{announcement.audience}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                    announcement.status === 'sent'
                      ? 'bg-green-100 text-green-700'
                      : announcement.status === 'scheduled'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
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
                    onClick={() => handleEdit(announcement)}
                    className="flex-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  {announcement.status === 'scheduled' && (
                    <button
                      onClick={() => handleSendNow(announcement.id)}
                      className="flex-1 px-3 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-sm font-medium transition-colors"
                    >
                      Send Now
                    </button>
                  )}
                </div>
              </div>
            </ElevatedCard>
          ))}
        </div>
      ) : (
        <ModernCard elevation="md" className="text-center p-12">
          <p className="text-gray-600">
            No announcements found. Create your first announcement using the button above.
          </p>
        </ModernCard>
      )}

      {/* Create Modal */}
      <PublishAnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPublish={handlePublish}
      />

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
