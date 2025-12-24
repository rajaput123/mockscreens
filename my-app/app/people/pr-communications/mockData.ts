import { Announcement, DeliveryLog } from './types';

export const mockAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Diwali Festival Reminder',
    message: 'Reminder: Diwali celebration on November 12, 2024 at 6 PM. All devotees are welcome.',
    audience: 'all',
    status: 'sent',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-1',
    createdByName: 'Priya Sharma',
  },
  {
    id: 'ann-2',
    title: 'Volunteer Meeting',
    message: 'Monthly volunteer meeting scheduled for this Saturday at 10 AM in the community hall.',
    audience: 'volunteers',
    status: 'scheduled',
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-2',
    createdByName: 'Arjun Rao',
  },
  {
    id: 'ann-3',
    title: 'Temple Maintenance Notice',
    message: 'Temple will be closed for maintenance on Monday, November 18, 2024.',
    audience: 'all',
    status: 'draft',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: 'user-3',
    createdByName: 'Meera Iyer',
  },
];

export const mockDeliveryLogs: DeliveryLog[] = [
  {
    id: 'log-1',
    announcementId: 'ann-1',
    recipientId: 'dev-1',
    recipientType: 'devotee',
    status: 'delivered',
    deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-2',
    announcementId: 'ann-1',
    recipientId: 'vol-1',
    recipientType: 'volunteer',
    status: 'delivered',
    deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log-3',
    announcementId: 'ann-1',
    recipientId: 'dev-2',
    recipientType: 'devotee',
    status: 'failed',
    failedReason: 'Invalid phone number',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

