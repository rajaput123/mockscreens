'use client';

import { useState, useRef } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  attendees: number;
  maxCapacity?: number;
  category: string;
  eventType?: string;
  priestAssigned?: string;
  pujaItems?: string;
  budget?: number;
  registrationRequired?: boolean;
  contactPerson?: string;
  contactPhone?: string;
  specialInstructions?: string;
  isRecurring?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  media?: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    isPrimary: boolean;
  }>;
}

interface MediaFile {
  id: string;
  file: File;
  type: 'video' | 'image';
  preview: string;
  isPrimary: boolean;
}

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: Event) => void;
}

export default function CreateEventModal({ isOpen, onClose, onCreateEvent }: CreateEventModalProps) {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    category: '',
    expectedAttendees: '',
    maxCapacity: '',
    eventType: '',
    priestAssigned: '',
    pujaItems: '',
    budget: '',
    registrationRequired: false,
    contactPerson: '',
    contactPhone: '',
    specialInstructions: '',
    isRecurring: false,
    recurringPattern: 'weekly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(e.target.files || []);
    
    files.forEach((file) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      const newMedia: MediaFile = {
        id,
        file,
        type,
        preview,
        isPrimary: false,
      };
      
      setMediaFiles((prev) => {
        const updated = [...prev, newMedia];
        return setPrimaryMedia(updated);
      });
    });
    
    if (e.target) {
      e.target.value = '';
    }
  };

  const setPrimaryMedia = (media: MediaFile[]): MediaFile[] => {
    if (media.length === 0) return media;
    
    const video = media.find(m => m.type === 'video');
    const updated = media.map(m => ({ ...m, isPrimary: false }));
    
    if (video) {
      const videoIndex = updated.findIndex(m => m.id === video.id);
      if (videoIndex !== -1) {
        updated[videoIndex].isPrimary = true;
      }
    } else if (updated.length > 0) {
      updated[0].isPrimary = true;
    }
    
    return updated;
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const updated = prev.filter(m => m.id !== id);
      return setPrimaryMedia(updated);
    });
  };

  const setAsPrimary = (id: string) => {
    setMediaFiles((prev) => {
      const updated = prev.map(m => ({
        ...m,
        isPrimary: m.id === id,
      }));
      return updated;
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventMedia = mediaFiles.map((media) => ({
      id: media.id,
      type: media.type,
      url: media.preview,
      isPrimary: media.isPrimary,
    }));
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      endTime: formData.endTime || undefined,
      location: formData.location,
      status: 'upcoming',
      attendees: parseInt(formData.expectedAttendees) || 0,
      maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : undefined,
      category: formData.category,
      eventType: formData.eventType || undefined,
      priestAssigned: formData.priestAssigned || undefined,
      pujaItems: formData.pujaItems || undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      registrationRequired: formData.registrationRequired,
      contactPerson: formData.contactPerson || undefined,
      contactPhone: formData.contactPhone || undefined,
      specialInstructions: formData.specialInstructions || undefined,
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? formData.recurringPattern : undefined,
      media: eventMedia.length > 0 ? eventMedia : undefined,
    };
    
    onCreateEvent(newEvent);
    
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      location: '',
      category: '',
      expectedAttendees: '',
      maxCapacity: '',
      eventType: '',
      priestAssigned: '',
      pujaItems: '',
      budget: '',
      registrationRequired: false,
      contactPerson: '',
      contactPhone: '',
      specialInstructions: '',
      isRecurring: false,
      recurringPattern: 'weekly',
    });
    setMediaFiles([]);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      endTime: '',
      location: '',
      category: '',
      expectedAttendees: '',
      maxCapacity: '',
      eventType: '',
      priestAssigned: '',
      pujaItems: '',
      budget: '',
      registrationRequired: false,
      contactPerson: '',
      contactPhone: '',
      specialInstructions: '',
      isRecurring: false,
      recurringPattern: 'weekly',
    });
    setMediaFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fade-in_0.3s_cubic-bezier(0.4,0,0.2,1)] overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-[scale-in_0.3s_cubic-bezier(0.4,0,0.2,1)] my-8 border border-gray-100">
          <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-3xl z-10 backdrop-blur-sm">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 font-serif">Create New Event</h2>
              <p className="text-sm text-gray-600 mt-1">Fill in the details to create a new temple event</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200 hover:scale-110"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <form onSubmit={handleCreateEvent} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Enter location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  >
                    <option value="">Select category</option>
                    <option value="Religious Festival">Religious Festival</option>
                    <option value="Spiritual Event">Spiritual Event</option>
                    <option value="Service Event">Service Event</option>
                    <option value="Special Event">Special Event</option>
                    <option value="Cultural Event">Cultural Event</option>
                    <option value="Daily Ritual">Daily Ritual</option>
                    <option value="Seva">Seva</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Create Event
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

