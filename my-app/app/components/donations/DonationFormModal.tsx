'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import { colors, spacing, typography } from '../../design-system';

interface DonationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (donationData: {
    eventId: string;
    donorName: string;
    amount: number;
    paymentMethod: 'cash' | 'online' | 'cheque' | 'bank_transfer';
    date: string;
    time: string;
    receiptNumber?: string;
    notes?: string;
  }) => void;
  events: Array<{ id: string; title: string }>;
  selectedEventId?: string;
}

export default function DonationFormModal({
  isOpen,
  onClose,
  onSubmit,
  events,
  selectedEventId,
}: DonationFormModalProps) {
  const [formData, setFormData] = useState({
    eventId: selectedEventId || '',
    donorName: '',
    amount: '',
    paymentMethod: 'cash' as 'cash' | 'online' | 'cheque' | 'bank_transfer',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    receiptNumber: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.eventId) newErrors.eventId = 'Event is required';
    if (!formData.donorName.trim()) newErrors.donorName = 'Donor name is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      eventId: formData.eventId,
      donorName: formData.donorName,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      time: formData.time,
      receiptNumber: formData.receiptNumber || undefined,
      notes: formData.notes || undefined,
    });

    setFormData({
      eventId: selectedEventId || '',
      donorName: '',
      amount: '',
      paymentMethod: 'cash',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      receiptNumber: '',
      notes: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Donation" size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.primary,
                fontWeight: 500,
              }}
            >
              Event *
            </span>
          </label>
          <select
            value={formData.eventId}
            onChange={(e) => {
              setFormData({ ...formData, eventId: e.target.value });
              if (errors.eventId) setErrors({ ...errors, eventId: '' });
            }}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: errors.eventId ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          {errors.eventId && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.eventId}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.primary,
                fontWeight: 500,
              }}
            >
              Donor Name *
            </span>
          </label>
          <input
            type="text"
            value={formData.donorName}
            onChange={(e) => {
              setFormData({ ...formData, donorName: e.target.value });
              if (errors.donorName) setErrors({ ...errors, donorName: '' });
            }}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: errors.donorName ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
            placeholder="Enter donor name"
          />
          {errors.donorName && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.donorName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                Amount (₹) *
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => {
                setFormData({ ...formData, amount: e.target.value });
                if (errors.amount) setErrors({ ...errors, amount: '' });
              }}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: errors.amount ? colors.error.base : colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
                {errors.amount}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                Payment Method *
              </span>
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  paymentMethod: e.target.value as 'cash' | 'online' | 'cheque' | 'bank_transfer',
                })
              }
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                Date *
              </span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
          </div>

          <div>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                  fontWeight: 500,
                }}
              >
                Time *
              </span>
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
              }}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.primary,
                fontWeight: 500,
              }}
            >
              Receipt Number
            </span>
          </label>
          <input
            type="text"
            value={formData.receiptNumber}
            onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                color: colors.text.primary,
                fontWeight: 500,
              }}
            >
              Notes
            </span>
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
            rows={3}
            placeholder="Optional notes"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-2xl border transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.primary,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-2xl text-white transition-all"
            style={{
              backgroundColor: colors.primary.base,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
            }}
          >
            Record Donation
          </button>
        </div>
      </form>
    </Modal>
  );
}

