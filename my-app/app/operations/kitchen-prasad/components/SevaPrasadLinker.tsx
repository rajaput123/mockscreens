'use client';

import { useState, useEffect } from 'react';
import { Seva } from '../../ritual-seva-booking/sevaData';
import { getAllSevas } from '../../ritual-seva-booking/sevaData';
import { PRASAD_CATEGORY } from '../prasadTypes';
import { SevaPrasadLink } from '../prasadData';
import { getLinkableSevas, validateSevaLink, calculateSevaPrasadQuantity } from '../kitchenPlanning';
import { KitchenPlan } from '../prasadData';

interface SevaPrasadLinkerProps {
  plan: KitchenPlan | null;
  date: string;
  sevaLinks: SevaPrasadLink[];
  onLinksChange: (links: SevaPrasadLink[]) => void;
  disabled?: boolean;
}

export default function SevaPrasadLinker({
  plan,
  date,
  sevaLinks,
  onLinksChange,
  disabled = false,
}: SevaPrasadLinkerProps) {
  const [availableSevas, setAvailableSevas] = useState<Seva[]>([]);
  const [selectedSevaId, setSelectedSevaId] = useState<string>('');
  const [bookingCount, setBookingCount] = useState<number>(0);
  const [prasadPerBooking, setPrasadPerBooking] = useState<number>(1);

  useEffect(() => {
    if (plan && date) {
      const linkable = getLinkableSevas(plan, date);
      setAvailableSevas(linkable);
      
      // Pre-fill booking count if seva is already selected
      if (selectedSevaId) {
        const seva = linkable.find(s => s.id === selectedSevaId);
        if (seva) {
          setBookingCount(seva.bookingSlots || 0);
        }
      }
    }
  }, [plan, date, selectedSevaId]);

  if (!plan || 
      (plan.category !== PRASAD_CATEGORY.SEVA_PRASAD_PAID && 
       plan.category !== PRASAD_CATEGORY.SEVA_PRASAD_FREE)) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-600">
          Seva linking is only available for Seva Prasad categories.
        </div>
      </div>
    );
  }

  const handleAddLink = () => {
    if (!selectedSevaId || bookingCount <= 0) return;

    const seva = availableSevas.find(s => s.id === selectedSevaId);
    if (!seva || !validateSevaLink(plan, seva)) return;

    // Check if link already exists
    if (sevaLinks.some(link => link.sevaId === selectedSevaId)) {
      alert('This seva is already linked. Please update the existing link instead.');
      return;
    }

    const newLink: SevaPrasadLink = {
      sevaId: seva.id,
      sevaName: seva.name,
      bookingCount,
      expectedQuantity: calculateSevaPrasadQuantity(seva, bookingCount, prasadPerBooking),
      distributedQuantity: 0,
    };

    onLinksChange([...sevaLinks, newLink]);
    
    // Reset form
    setSelectedSevaId('');
    setBookingCount(0);
    setPrasadPerBooking(1);
  };

  const handleUpdateLink = (linkId: string, updates: Partial<SevaPrasadLink>) => {
    const updated = sevaLinks.map(link => 
      link.sevaId === linkId 
        ? { ...link, ...updates, expectedQuantity: calculateSevaPrasadQuantity(
            availableSevas.find(s => s.id === link.sevaId)!,
            updates.bookingCount || link.bookingCount,
            prasadPerBooking
          ) }
        : link
    );
    onLinksChange(updated);
  };

  const handleRemoveLink = (linkId: string) => {
    onLinksChange(sevaLinks.filter(link => link.sevaId !== linkId));
  };

  const selectedSeva = availableSevas.find(s => s.id === selectedSevaId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Link Sevas to Prasad Plan
        </label>
        <p className="text-xs text-gray-600 mb-4">
          Connect this prasad plan to seva bookings to automatically calculate quantities.
        </p>
      </div>

      {/* Add New Link */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Seva
            </label>
            <select
              value={selectedSevaId}
              onChange={(e) => {
                setSelectedSevaId(e.target.value);
                const seva = availableSevas.find(s => s.id === e.target.value);
                if (seva) {
                  setBookingCount(seva.bookingSlots || 0);
                }
              }}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
            >
              <option value="">Select Seva</option>
              {availableSevas.map(seva => (
                <option key={seva.id} value={seva.id}>
                  {seva.name} {seva.isFree ? '(Free)' : '(Paid)'} - {seva.bookingSlots || 0} bookings
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Booking Count
            </label>
            <input
              type="number"
              value={bookingCount}
              onChange={(e) => setBookingCount(Math.max(0, parseInt(e.target.value) || 0))}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              min="0"
            />
            {selectedSeva && (
              <div className="text-xs text-gray-500 mt-1">
                Available: {selectedSeva.bookingSlots || 0}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Prasad/Booking
            </label>
            <input
              type="number"
              value={prasadPerBooking}
              onChange={(e) => setPrasadPerBooking(Math.max(0.1, parseFloat(e.target.value) || 1))}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
              min="0.1"
              step="0.1"
            />
            <div className="text-xs text-gray-500 mt-1">kg/booking</div>
          </div>
        </div>
        
        {selectedSevaId && bookingCount > 0 && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded text-sm">
            <div className="text-amber-700">
              Expected Quantity: <strong>
                {calculateSevaPrasadQuantity(
                  selectedSeva!,
                  bookingCount,
                  prasadPerBooking
                ).toFixed(2)} kg
              </strong>
            </div>
          </div>
        )}
        
        <button
          type="button"
          onClick={handleAddLink}
          disabled={disabled || !selectedSevaId || bookingCount <= 0}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          Add Seva Link
        </button>
      </div>

      {/* Existing Links */}
      {sevaLinks.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Linked Sevas ({sevaLinks.length})
          </div>
          {sevaLinks.map((link) => {
            const seva = availableSevas.find(s => s.id === link.sevaId);
            return (
              <div
                key={link.sevaId}
                className="p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{link.sevaName}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Bookings: {link.bookingCount} | Expected: {link.expectedQuantity.toFixed(2)} kg
                      {link.distributedQuantity > 0 && (
                        <span className="ml-2 text-amber-600">
                          | Distributed: {link.distributedQuantity.toFixed(2)} kg
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(link.sevaId)}
                    disabled={disabled}
                    className="ml-3 text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {availableSevas.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-sm text-amber-700">
            No sevas found for this date and category. Please select a different date or category.
          </div>
        </div>
      )}
    </div>
  );
}

