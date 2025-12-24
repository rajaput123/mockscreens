'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import ImagePicker from '../../../components/ui/ImagePicker';
import Modal from '../../../components/ui/Modal';
import { getAllTemples } from '../../temple-management/templeData';
import { 
  type Seva, 
  type TimingBlock, 
  saveSeva, 
  generateSevaId
} from '../sevaData';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SEVA_TYPES = ['Ritual', 'Offering', 'Special'] as const;
const SEVA_CATEGORIES = ['Daily', 'Weekly', 'Festival', 'Special'] as const;
const LOCATIONS = ['Main Hall', 'Mandap 1', 'Mandap 2', 'Mandap 3', 'Outdoor', 'Other'];

interface FormData {
  templeId: string;
  name: string;
  type: 'Ritual' | 'Offering' | 'Special';
  category: 'Daily' | 'Weekly' | 'Festival' | 'Special';
  shortDescription: string;
  image: string;
  devoteeVisibility: 'Visible' | 'Hidden';
  isFree: boolean;
  basePrice: string;
  originalPrice?: string;
  allowDonation: boolean;
  minDonation: string;
  maxDonation: string;
  timingBlocks: TimingBlock[];
  slotDuration: string;
  autoGenerateSlots: boolean;
  slotsPerTiming: string;
  maxSlots: string;
  bookingSlots: string;
  bufferTimeBeforeSlot: string;
  bufferTimeAfterSlot: string;
  maxDevoteesPerSlot: string;
  maxBookingsPerDevoteePerDay: string;
  maxTotalBookingsPerDay: string;
  physicalLocation: string;
  status: 'draft' | 'active';
  publishImmediately: boolean;
}

interface SevaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingSeva?: Seva | null;
}

export default function SevaFormModal({ isOpen, onClose, onSuccess, editingSeva }: SevaFormModalProps) {
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    templeId: '',
    name: '',
    type: 'Ritual',
    category: 'Daily',
    shortDescription: '',
    image: '',
    devoteeVisibility: 'Visible',
    isFree: true,
    basePrice: '',
    originalPrice: '',
    allowDonation: false,
    minDonation: '',
    maxDonation: '',
    timingBlocks: [{
      id: `timing-${Date.now()}`,
      applicableDays: [],
      startTime: '',
      endTime: '',
      effectiveFromDate: '',
      effectiveTillDate: '',
    }],
    slotDuration: '',
    autoGenerateSlots: false,
    slotsPerTiming: '',
    maxSlots: '',
    bookingSlots: '',
    bufferTimeBeforeSlot: '',
    bufferTimeAfterSlot: '',
    maxDevoteesPerSlot: '',
    maxBookingsPerDevoteePerDay: '',
    maxTotalBookingsPerDay: '',
    physicalLocation: '',
    status: 'draft',
    publishImmediately: false,
  });

  useEffect(() => {
    const allTemples = getAllTemples();
    setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
  }, []);

  useEffect(() => {
    if (editingSeva) {
      setFormData({
        templeId: editingSeva.templeId,
        name: editingSeva.name,
        type: editingSeva.type,
        category: editingSeva.category,
        shortDescription: editingSeva.shortDescription || '',
        image: editingSeva.image || '',
        devoteeVisibility: editingSeva.devoteeVisibility,
        isFree: editingSeva.isFree,
        basePrice: editingSeva.basePrice?.toString() || '',
        originalPrice: (editingSeva as any).originalPrice?.toString() || '',
        allowDonation: editingSeva.allowDonation,
        minDonation: editingSeva.minDonation?.toString() || '',
        maxDonation: editingSeva.maxDonation?.toString() || '',
        timingBlocks: editingSeva.timingBlocks,
        slotDuration: editingSeva.slotDuration.toString(),
        autoGenerateSlots: editingSeva.autoGenerateSlots,
        slotsPerTiming: editingSeva.slotsPerTiming?.toString() || '',
        maxSlots: (editingSeva as any).maxSlots?.toString() || '',
        bookingSlots: (editingSeva as any).bookingSlots?.toString() || '',
        bufferTimeBeforeSlot: editingSeva.bufferTimeBeforeSlot.toString(),
        bufferTimeAfterSlot: editingSeva.bufferTimeAfterSlot.toString(),
        maxDevoteesPerSlot: editingSeva.maxDevoteesPerSlot.toString(),
        maxBookingsPerDevoteePerDay: editingSeva.maxBookingsPerDevoteePerDay.toString(),
        maxTotalBookingsPerDay: editingSeva.maxTotalBookingsPerDay.toString(),
        physicalLocation: editingSeva.physicalLocation,
        status: editingSeva.status,
        publishImmediately: editingSeva.publishImmediately,
      });
    } else {
      resetForm();
    }
  }, [editingSeva, isOpen]);

  const handleChange = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const handleTimingBlockChange = useCallback((blockId: string, field: keyof TimingBlock, value: any) => {
    setFormData(prev => ({
      ...prev,
      timingBlocks: prev.timingBlocks.map(block =>
        block.id === blockId ? { ...block, [field]: value } : block
      ),
    }));
    setIsDirty(true);
  }, []);

  const addTimingBlock = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      timingBlocks: [
        ...prev.timingBlocks,
        {
          id: `timing-${Date.now()}-${Math.random()}`,
          applicableDays: [],
          startTime: '',
          endTime: '',
          effectiveFromDate: '',
          effectiveTillDate: '',
        },
      ],
    }));
    setIsDirty(true);
  }, []);

  const removeTimingBlock = useCallback((blockId: string) => {
    setFormData(prev => ({
      ...prev,
      timingBlocks: prev.timingBlocks.filter(block => block.id !== blockId),
    }));
    setIsDirty(true);
  }, []);

  const toggleDay = useCallback((blockId: string, day: string) => {
    setFormData(prev => {
      const block = prev.timingBlocks.find(b => b.id === blockId);
      if (!block) return prev;
      
      const newDays = block.applicableDays.includes(day)
        ? block.applicableDays.filter(d => d !== day)
        : [...block.applicableDays, day];
      
      return {
        ...prev,
        timingBlocks: prev.timingBlocks.map(b =>
          b.id === blockId ? { ...b, applicableDays: newDays } : b
        ),
      };
    });
    setIsDirty(true);
  }, []);

  const checkValidation = useCallback((forPublish: boolean = false): boolean => {
    if (!formData.templeId) return false;
    if (!formData.name.trim()) return false;
    if (!formData.isFree && !formData.basePrice) return false;
    if (formData.allowDonation && formData.minDonation && formData.maxDonation) {
      const min = parseFloat(formData.minDonation);
      const max = parseFloat(formData.maxDonation);
      if (min > max) return false;
    }
    if (formData.timingBlocks.length === 0) return false;
    for (const block of formData.timingBlocks) {
      if (block.applicableDays.length === 0) return false;
      if (!block.startTime || !block.endTime) return false;
      if (block.startTime >= block.endTime) return false;
      if (!block.effectiveFromDate) return false;
    }
    if (!formData.slotDuration) return false;
    if (formData.autoGenerateSlots && !formData.slotsPerTiming) return false;
    if (!formData.maxDevoteesPerSlot) return false;
    if (!formData.maxBookingsPerDevoteePerDay) return false;
    if (!formData.maxTotalBookingsPerDay) return false;
    if (!formData.physicalLocation) return false;
    if (forPublish) {
      if (formData.timingBlocks.length === 0) return false;
      if (!formData.maxDevoteesPerSlot || !formData.maxTotalBookingsPerDay) return false;
    }
    return true;
  }, [formData]);

  const validateForm = useCallback((forPublish: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.templeId) newErrors.templeId = 'Temple is required';
    if (!formData.name.trim()) newErrors.name = 'Seva name is required';
    if (!formData.isFree && !formData.basePrice) {
      newErrors.basePrice = 'Base price is required when seva is not free';
    }
    if (formData.allowDonation && formData.minDonation && formData.maxDonation) {
      const min = parseFloat(formData.minDonation);
      const max = parseFloat(formData.maxDonation);
      if (min > max) {
        newErrors.maxDonation = 'Maximum donation must be greater than minimum donation';
      }
    }
    if (formData.timingBlocks.length === 0) {
      newErrors.timingBlocks = 'At least one timing block is required';
    } else {
      formData.timingBlocks.forEach((block, index) => {
        if (block.applicableDays.length === 0) {
          newErrors[`timing-${index}-days`] = 'Select at least one day';
        }
        if (!block.startTime) {
          newErrors[`timing-${index}-startTime`] = 'Start time is required';
        }
        if (!block.endTime) {
          newErrors[`timing-${index}-endTime`] = 'End time is required';
        }
        if (block.startTime && block.endTime && block.startTime >= block.endTime) {
          newErrors[`timing-${index}-endTime`] = 'End time must be after start time';
        }
        if (!block.effectiveFromDate) {
          newErrors[`timing-${index}-effectiveFromDate`] = 'Effective from date is required';
        }
      });
    }
    if (!formData.slotDuration) newErrors.slotDuration = 'Slot duration is required';
    if (formData.autoGenerateSlots && !formData.slotsPerTiming) {
      newErrors.slotsPerTiming = 'Number of slots is required when auto-generating';
    }
    if (!formData.maxDevoteesPerSlot) newErrors.maxDevoteesPerSlot = 'Maximum devotees per slot is required';
    if (!formData.maxBookingsPerDevoteePerDay) {
      newErrors.maxBookingsPerDevoteePerDay = 'Maximum bookings per devotee per day is required';
    }
    if (!formData.maxTotalBookingsPerDay) {
      newErrors.maxTotalBookingsPerDay = 'Maximum total bookings per day is required';
    }
    if (!formData.physicalLocation) newErrors.physicalLocation = 'Physical location is required';

    if (forPublish) {
      if (formData.timingBlocks.length === 0) {
        newErrors.timingBlocks = 'Cannot publish without timing configuration';
      }
      if (!formData.maxDevoteesPerSlot || !formData.maxTotalBookingsPerDay) {
        newErrors.capacity = 'Cannot publish without capacity configuration';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = () => {
    setFormData({
      templeId: '',
      name: '',
      type: 'Ritual',
      category: 'Daily',
      shortDescription: '',
      image: '',
      devoteeVisibility: 'Visible',
      isFree: true,
      basePrice: '',
      originalPrice: '',
      allowDonation: false,
      minDonation: '',
      maxDonation: '',
      timingBlocks: [{
        id: `timing-${Date.now()}`,
        applicableDays: [],
        startTime: '',
        endTime: '',
        effectiveFromDate: '',
        effectiveTillDate: '',
      }],
      slotDuration: '',
      autoGenerateSlots: false,
      slotsPerTiming: '',
      maxSlots: '',
      bookingSlots: '',
      bufferTimeBeforeSlot: '',
      bufferTimeAfterSlot: '',
      maxDevoteesPerSlot: '',
      maxBookingsPerDevoteePerDay: '',
      maxTotalBookingsPerDay: '',
      physicalLocation: '',
      status: 'draft',
      publishImmediately: false,
    });
    setErrors({});
    setIsDirty(false);
  };

  const handleCloseModal = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Are you sure you want to close?')) {
        resetForm();
        onClose();
      }
    } else {
      resetForm();
      onClose();
    }
  };

  const handleSaveDraft = useCallback(async () => {
    if (!validateForm(false)) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const selectedTemple = temples.find(t => t.id === formData.templeId);
    const seva: Seva = {
      id: editingSeva?.id || generateSevaId(),
      templeId: formData.templeId,
      templeName: selectedTemple?.name,
      deityName: selectedTemple?.deity,
      name: formData.name,
      type: formData.type,
      category: formData.category,
      shortDescription: formData.shortDescription || undefined,
      image: formData.image || undefined,
      devoteeVisibility: formData.devoteeVisibility,
      isFree: formData.isFree,
      basePrice: formData.isFree ? undefined : parseFloat(formData.basePrice),
      allowDonation: formData.allowDonation,
      minDonation: formData.allowDonation && formData.minDonation ? parseFloat(formData.minDonation) : undefined,
      maxDonation: formData.allowDonation && formData.maxDonation ? parseFloat(formData.maxDonation) : undefined,
      timingBlocks: formData.timingBlocks,
      slotDuration: parseInt(formData.slotDuration),
      autoGenerateSlots: formData.autoGenerateSlots,
      slotsPerTiming: formData.autoGenerateSlots && formData.slotsPerTiming ? parseInt(formData.slotsPerTiming) : undefined,
      bufferTimeBeforeSlot: parseInt(formData.bufferTimeBeforeSlot) || 0,
      bufferTimeAfterSlot: parseInt(formData.bufferTimeAfterSlot) || 0,
      maxDevoteesPerSlot: parseInt(formData.maxDevoteesPerSlot),
      maxBookingsPerDevoteePerDay: parseInt(formData.maxBookingsPerDevoteePerDay),
      maxTotalBookingsPerDay: parseInt(formData.maxTotalBookingsPerDay),
      physicalLocation: formData.physicalLocation,
      status: 'draft',
      publishImmediately: false,
      createdBy: editingSeva?.createdBy || 'System Admin',
      createdOn: editingSeva?.createdOn || new Date().toISOString(),
      draftVersion: editingSeva?.draftVersion || 1,
    };

    // Add extended fields
    (seva as any).originalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;
    (seva as any).maxSlots = formData.maxSlots ? parseInt(formData.maxSlots) : undefined;
    (seva as any).bookingSlots = formData.bookingSlots ? parseInt(formData.bookingSlots) : undefined;

    saveSeva(seva);
    setIsSubmitting(false);
    setIsDirty(false);
    resetForm();
    onClose();
    onSuccess();
  }, [formData, temples, validateForm, editingSeva, onClose, onSuccess]);

  const handlePublish = useCallback(async () => {
    if (!validateForm(true)) {
      setShowConfirmModal(false);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const selectedTemple = temples.find(t => t.id === formData.templeId);
    const seva: Seva = {
      id: editingSeva?.id || generateSevaId(),
      templeId: formData.templeId,
      templeName: selectedTemple?.name,
      deityName: selectedTemple?.deity,
      name: formData.name,
      type: formData.type,
      category: formData.category,
      shortDescription: formData.shortDescription || undefined,
      image: formData.image || undefined,
      devoteeVisibility: formData.devoteeVisibility,
      isFree: formData.isFree,
      basePrice: formData.isFree ? undefined : parseFloat(formData.basePrice),
      allowDonation: formData.allowDonation,
      minDonation: formData.allowDonation && formData.minDonation ? parseFloat(formData.minDonation) : undefined,
      maxDonation: formData.allowDonation && formData.maxDonation ? parseFloat(formData.maxDonation) : undefined,
      timingBlocks: formData.timingBlocks,
      slotDuration: parseInt(formData.slotDuration),
      autoGenerateSlots: formData.autoGenerateSlots,
      slotsPerTiming: formData.autoGenerateSlots && formData.slotsPerTiming ? parseInt(formData.slotsPerTiming) : undefined,
      bufferTimeBeforeSlot: parseInt(formData.bufferTimeBeforeSlot) || 0,
      bufferTimeAfterSlot: parseInt(formData.bufferTimeAfterSlot) || 0,
      maxDevoteesPerSlot: parseInt(formData.maxDevoteesPerSlot),
      maxBookingsPerDevoteePerDay: parseInt(formData.maxBookingsPerDevoteePerDay),
      maxTotalBookingsPerDay: parseInt(formData.maxTotalBookingsPerDay),
      physicalLocation: formData.physicalLocation,
      status: formData.publishImmediately ? 'active' : 'draft',
      publishImmediately: formData.publishImmediately,
      createdBy: editingSeva?.createdBy || 'System Admin',
      createdOn: editingSeva?.createdOn || new Date().toISOString(),
      draftVersion: editingSeva?.draftVersion || 1,
    };

    // Add extended fields
    (seva as any).originalPrice = formData.originalPrice ? parseFloat(formData.originalPrice) : undefined;
    (seva as any).maxSlots = formData.maxSlots ? parseInt(formData.maxSlots) : undefined;
    (seva as any).bookingSlots = formData.bookingSlots ? parseInt(formData.bookingSlots) : undefined;

    saveSeva(seva);
    setIsSubmitting(false);
    setIsDirty(false);
    setShowConfirmModal(false);
    resetForm();
    onClose();
    onSuccess();
  }, [formData, temples, validateForm, editingSeva, onClose, onSuccess]);

  const canPublish = useMemo(() => {
    return checkValidation(true);
  }, [checkValidation]);

  // Calculate reduced slots display
  const reducedSlots = useMemo(() => {
    if (formData.maxSlots && formData.bookingSlots) {
      const max = parseInt(formData.maxSlots);
      const booked = parseInt(formData.bookingSlots);
      return max - booked;
    }
    return null;
  }, [formData.maxSlots, formData.bookingSlots]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={editingSeva ? "Update Seva" : "Add New Seva"}
        size="xl"
        showCloseButton={true}
      >
        <div className="text-sm text-gray-600 mb-4">
          {editingSeva ? "Update and configure the seva." : "Create and configure a new seva for this temple."}
        </div>
        
        <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto pr-2">
          {/* Section 1: Seva Basic Details */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-amber-800">1. Seva Basic Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Temple <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.templeId}
                  onChange={(e) => handleChange('templeId', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">Select a temple</option>
                  {temples.map(temple => (
                    <option key={temple.id} value={temple.id}>
                      {temple.deity || temple.name}
                    </option>
                  ))}
                </select>
                {errors.templeId && <p className="text-red-600 text-xs mt-1">{errors.templeId}</p>}
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Seva Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="Enter seva name"
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Seva Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value as typeof formData.type)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  >
                    {SEVA_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Seva Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value as typeof formData.category)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  >
                    {SEVA_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">Short Description</label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="Enter a brief description"
                />
              </div>

              <div>
                <ImagePicker
                  value={formData.image}
                  onChange={(url) => handleChange('image', url)}
                  label="Seva Image"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.devoteeVisibility === 'Visible'}
                    onChange={(e) => handleChange('devoteeVisibility', e.target.checked ? 'Visible' : 'Hidden')}
                    className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-medium text-gray-700 text-sm">Visible to Devotees</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing Setup */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-amber-800">2. Pricing Setup</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Is this Seva Free? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={() => handleChange('isFree', true)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="isFree"
                      checked={!formData.isFree}
                      onChange={() => handleChange('isFree', false)}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {!formData.isFree && (
                <>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">
                      Base Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => handleChange('basePrice', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                      placeholder="0.00"
                    />
                    {errors.basePrice && <p className="text-red-600 text-xs mt-1">{errors.basePrice}</p>}
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">Original Price</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => handleChange('originalPrice', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Original price before discount (optional)</p>
                  </div>
                </>
              )}

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.allowDonation}
                    onChange={(e) => handleChange('allowDonation', e.target.checked)}
                    className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-medium text-gray-700 text-sm">Allow Donation?</span>
                </label>
              </div>

              {formData.allowDonation && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">Minimum Donation</label>
                    <input
                      type="number"
                      value={formData.minDonation}
                      onChange={(e) => handleChange('minDonation', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 text-sm">Maximum Donation</label>
                    <input
                      type="number"
                      value={formData.maxDonation}
                      onChange={(e) => handleChange('maxDonation', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                      placeholder="0.00"
                    />
                    {errors.maxDonation && <p className="text-red-600 text-xs mt-1">{errors.maxDonation}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Timing Definition */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-amber-800">3. Timing Definition</h2>
            
            {errors.timingBlocks && <p className="text-red-600 text-xs mb-3">{errors.timingBlocks}</p>}
            
            <div className="space-y-4">
              {formData.timingBlocks.map((block, blockIndex) => (
                <div key={block.id} className="p-3 border border-amber-300 rounded-xl bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700 text-sm">Timing Block {blockIndex + 1}</h3>
                    {formData.timingBlocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimingBlock(block.id)}
                        className="text-red-600 hover:text-red-700 text-xs font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block mb-2 font-medium text-gray-700 text-sm">
                        Applicable Days <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {DAYS_OF_WEEK.map(day => (
                          <label key={day} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={block.applicableDays.includes(day)}
                              onChange={() => toggleDay(block.id, day)}
                              className="w-3 h-3 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                            />
                            <span className="text-xs text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                      {errors[`timing-${blockIndex}-days`] && (
                        <p className="text-red-600 text-xs mt-1">{errors[`timing-${blockIndex}-days`]}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={block.startTime}
                          onChange={(e) => handleTimingBlockChange(block.id, 'startTime', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                        />
                        {errors[`timing-${blockIndex}-startTime`] && (
                          <p className="text-red-600 text-xs mt-1">{errors[`timing-${blockIndex}-startTime`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          End Time <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="time"
                          value={block.endTime}
                          onChange={(e) => handleTimingBlockChange(block.id, 'endTime', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                        />
                        {errors[`timing-${blockIndex}-endTime`] && (
                          <p className="text-red-600 text-xs mt-1">{errors[`timing-${blockIndex}-endTime`]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">
                          Effective From Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={block.effectiveFromDate}
                          onChange={(e) => handleTimingBlockChange(block.id, 'effectiveFromDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                        />
                        {errors[`timing-${blockIndex}-effectiveFromDate`] && (
                          <p className="text-red-600 text-xs mt-1">{errors[`timing-${blockIndex}-effectiveFromDate`]}</p>
                        )}
                      </div>
                      <div>
                        <label className="block mb-2 font-medium text-gray-700 text-sm">Effective Till Date</label>
                        <input
                          type="date"
                          value={block.effectiveTillDate || ''}
                          onChange={(e) => handleTimingBlockChange(block.id, 'effectiveTillDate', e.target.value || undefined)}
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addTimingBlock}
                className="w-full py-2 px-3 border-2 border-dashed border-amber-300 rounded-xl text-amber-700 hover:border-amber-500 hover:bg-amber-50 transition-colors text-sm"
              >
                + Add Another Timing Block
              </button>
            </div>
          </div>

          {/* Section 4: Slot Configuration */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-amber-800">4. Slot Configuration</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Slot Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.slotDuration}
                  onChange={(e) => handleChange('slotDuration', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="30"
                />
                {errors.slotDuration && <p className="text-red-600 text-xs mt-1">{errors.slotDuration}</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoGenerateSlots}
                    onChange={(e) => handleChange('autoGenerateSlots', e.target.checked)}
                    className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="font-medium text-gray-700 text-sm">Auto-Generate Slots</span>
                </label>
              </div>

              {formData.autoGenerateSlots && (
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">
                    Number of Slots per Timing <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.slotsPerTiming}
                    onChange={(e) => handleChange('slotsPerTiming', e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                    placeholder="10"
                  />
                  {errors.slotsPerTiming && <p className="text-red-600 text-xs mt-1">{errors.slotsPerTiming}</p>}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Buffer Before Slot (minutes)</label>
                  <input
                    type="number"
                    value={formData.bufferTimeBeforeSlot}
                    onChange={(e) => handleChange('bufferTimeBeforeSlot', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700 text-sm">Buffer After Slot (minutes)</label>
                  <input
                    type="number"
                    value={formData.bufferTimeAfterSlot}
                    onChange={(e) => handleChange('bufferTimeAfterSlot', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Slot Management */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-amber-800">5. Slot Management</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Maximum Slots <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxSlots}
                  onChange={(e) => handleChange('maxSlots', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="100"
                />
                <p className="text-xs text-gray-500 mt-1">Total number of slots available</p>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Booking Slots <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.bookingSlots}
                  onChange={(e) => handleChange('bookingSlots', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Number of slots currently booked</p>
              </div>

              {reducedSlots !== null && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm font-medium text-amber-800">
                    Available Slots: <span className="text-amber-600">{reducedSlots}</span>
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    {formData.maxSlots} (Max) - {formData.bookingSlots} (Booked) = {reducedSlots} (Available)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Capacity Rules */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-amber-800">6. Capacity Rules</h2>
            
            {errors.capacity && <p className="text-red-600 text-xs mb-3">{errors.capacity}</p>}
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Maximum Devotees per Slot <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxDevoteesPerSlot}
                  onChange={(e) => handleChange('maxDevoteesPerSlot', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="50"
                />
                {errors.maxDevoteesPerSlot && <p className="text-red-600 text-xs mt-1">{errors.maxDevoteesPerSlot}</p>}
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Maximum Bookings per Devotee per Day <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxBookingsPerDevoteePerDay}
                  onChange={(e) => handleChange('maxBookingsPerDevoteePerDay', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="2"
                />
                {errors.maxBookingsPerDevoteePerDay && <p className="text-red-600 text-xs mt-1">{errors.maxBookingsPerDevoteePerDay}</p>}
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Maximum Total Bookings per Day <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.maxTotalBookingsPerDay}
                  onChange={(e) => handleChange('maxTotalBookingsPerDay', e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                  placeholder="100"
                />
                {errors.maxTotalBookingsPerDay && <p className="text-red-600 text-xs mt-1">{errors.maxTotalBookingsPerDay}</p>}
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">
                  Physical Location / Mandap <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.physicalLocation}
                  onChange={(e) => handleChange('physicalLocation', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white"
                >
                  <option value="">Select location</option>
                  {LOCATIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.physicalLocation && <p className="text-red-600 text-xs mt-1">{errors.physicalLocation}</p>}
              </div>
            </div>
          </div>

          {/* Section 7: Status & Publishing */}
          <div className="p-4 rounded-2xl border border-amber-200 bg-white">
            <h2 className="text-lg font-semibold mb-4 text-amber-800">7. Status & Publishing</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-700 text-sm">Initial Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'draft'}
                      onChange={() => handleChange('status', 'draft')}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Draft</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'active'}
                      onChange={() => handleChange('status', 'active')}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              {formData.status === 'active' && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.publishImmediately}
                      onChange={(e) => handleChange('publishImmediately', e.target.checked)}
                      className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="font-medium text-gray-700 text-sm">Publish Immediately</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-amber-200 p-4 mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCloseModal}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={!canPublish || isSubmitting}
            className="px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {editingSeva ? 'Update Seva' : 'Create Seva'}
          </button>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Publish Seva"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            Are you sure you want to {editingSeva ? 'update and publish' : 'publish'} this seva? Once published, it will be available for bookings.
          </p>
            <div className="bg-white p-4 rounded-2xl border border-amber-200">
            <h3 className="font-semibold text-amber-800 mb-2 text-sm">Seva Details:</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li><strong>Name:</strong> {formData.name}</li>
              <li><strong>Temple:</strong> {
                (() => {
                  const temple = temples.find(t => t.id === formData.templeId);
                  return temple ? (temple.deity || temple.name) : 'N/A';
                })()
              }</li>
              <li><strong>Type:</strong> {formData.type}</li>
              <li><strong>Category:</strong> {formData.category}</li>
              <li><strong>Status:</strong> {formData.publishImmediately ? 'Active (Immediate)' : 'Draft'}</li>
              {formData.maxSlots && formData.bookingSlots && (
                <li><strong>Available Slots:</strong> {reducedSlots} / {formData.maxSlots}</li>
              )}
            </ul>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 border border-amber-300 text-gray-700 rounded-xl hover:bg-amber-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={isSubmitting}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm"
            >
              {isSubmitting ? 'Publishing...' : 'Confirm & Publish'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

