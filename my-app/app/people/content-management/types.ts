export type ContentType = 'event' | 'notice' | 'information' | 'ritual-guide' | 'temple-information';
export type ContentStatus = 'draft' | 'under-review' | 'published' | 'archived';

export interface Content {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  status: ContentStatus;
  language: string;
  authorId: string;
  authorName: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  changes?: string;
}

