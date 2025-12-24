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
    
    // Convert media files to event media format
    const eventMedia = mediaFiles.map((media) => ({
      id: media.id,
      type: media.type,
      url: media.preview, // Using preview URL (in production, upload to server and get URL)
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
    
    // Reset form
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
      {/* Create Event Modal */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fade-in_0.3s_cubic-bezier(0.4,0,0.2,1)] overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-[scale-in_0.3s_cubic-bezier(0.4,0,0.2,1)] my-8 border border-gray-100">
          {/* Modal Header */}
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

          {/* Modal Body */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type / Seva Type
                  </label>
                  <input
                    type="text"
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="e.g., Abhishekam, Aarti, Puja"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priest / Pandit Assigned
                  </label>
                  <input
                    type="text"
                    value={formData.priestAssigned}
                    onChange={(e) => setFormData({ ...formData, priestAssigned: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Enter priest name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    value={formData.expectedAttendees}
                    onChange={(e) => setFormData({ ...formData, expectedAttendees: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Enter expected number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Maximum capacity"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rituals / Puja Items Required
                </label>
                <textarea
                  value={formData.pujaItems}
                  onChange={(e) => setFormData({ ...formData, pujaItems: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  placeholder="List required items: flowers, fruits, incense, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget / Estimated Cost (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Enter budget amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                    placeholder="Event organizer name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  placeholder="+91 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  placeholder="Any special notes or instructions for the event"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="registrationRequired"
                    checked={formData.registrationRequired}
                    onChange={(e) => setFormData({ ...formData, registrationRequired: e.target.checked })}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="registrationRequired" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Registration Required
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Recurring Event
                  </label>
                </div>
              </div>

              {formData.isRecurring && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recurring Pattern
                  </label>
                  <select
                    value={formData.recurringPattern}
                    onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors duration-200"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              {/* Media Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Media
                </label>
                <button
                  type="button"
                  onClick={() => setShowMediaModal(true)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-colors duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-amber-600"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Videos & Images
                </button>

                {/* Media Preview */}
                {mediaFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {mediaFiles.map((media) => (
                      <div
                        key={media.id}
                        className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-amber-500 transition-colors duration-200"
                      >
                        {media.type === 'video' ? (
                          <video
                            src={media.preview}
                            className="w-full h-32 object-cover"
                            controls={false}
                          />
                        ) : (
                          <img
                            src={media.preview}
                            alt="Event media"
                            className="w-full h-32 object-cover"
                          />
                        )}
                        
                        {media.isPrimary && (
                          <div className="absolute top-2 left-2 bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                            Primary
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAsPrimary(media.id)}
                            className="opacity-0 group-hover:opacity-100 bg-white text-gray-700 p-2 rounded-lg hover:bg-amber-100 transition-all duration-200"
                            title="Set as primary"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => removeMedia(media.id)}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all duration-200"
                            title="Remove"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Media Upload Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-[fade-in_0.3s_cubic-bezier(0.4,0,0.2,1)]">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-[scale-in_0.3s_cubic-bezier(0.4,0,0.2,1)] border border-gray-100">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-white to-gray-50/50 border-b border-gray-200 px-6 py-5 flex items-center justify-between rounded-t-3xl backdrop-blur-sm">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Add Media</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {mediaFiles.some(m => m.type === 'video') 
                    ? 'Video is set as primary. You can add images as additional media.'
                    : 'Add videos or images. Video will be set as primary if added.'}
                </p>
              </div>
              <button
                onClick={() => setShowMediaModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200 hover:scale-110"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Video
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileSelect(e, 'video')}
                    className="hidden"
                    multiple
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Click to upload video</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI (max 100MB)</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        videoInputRef.current?.click();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Select Video
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Images
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-amber-500 hover:bg-amber-50/50 transition-all duration-200 cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, 'image')}
                    className="hidden"
                    multiple
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-amber-600">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WEBP (max 10MB each)</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      Select Images
                    </button>
                  </div>
                </div>
              </div>

              {/* Uploaded Media Preview */}
              {mediaFiles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selected Media ({mediaFiles.length})
                  </label>
                  <div className="grid grid-cols-3 gap-4 max-h-64 overflow-y-auto p-2">
                    {mediaFiles.map((media) => (
                      <div
                        key={media.id}
                        className="relative group rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        {media.type === 'video' ? (
                          <video
                            src={media.preview}
                            className="w-full h-24 object-cover"
                            controls={false}
                          />
                        ) : (
                          <img
                            src={media.preview}
                            alt="Preview"
                            className="w-full h-24 object-cover"
                          />
                        )}
                        {media.isPrimary && (
                          <div className="absolute top-1 left-1 bg-amber-600 text-white text-xs font-medium px-2 py-0.5 rounded">
                            Primary
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(media.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors duration-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

