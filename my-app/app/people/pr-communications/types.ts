export type AudienceType = 'all' | 'devotees' | 'volunteers' | 'employees' | 'custom';
export type AnnouncementStatus = 'draft' | 'scheduled' | 'sent' | 'cancelled';
export type DeliveryStatus = 'sent' | 'delivered' | 'failed';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: AudienceType;
  customAudienceIds?: string[];
  status: AnnouncementStatus;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
}

export interface DeliveryLog {
  id: string;
  announcementId: string;
  recipientId: string;
  recipientType: 'devotee' | 'volunteer' | 'employee';
  status: DeliveryStatus;
  deliveredAt?: string;
  failedReason?: string;
  timestamp: string;
}

