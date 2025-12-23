'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography, animations } from '../../../design-system';

interface CustomField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'time' | 'email' | 'tel' | 'textarea';
  value: string;
}

interface Temple {
  id: string;
  name: string;
  location: string;
  description?: string;
  image?: string;
  parentTempleId?: string;
  parentTempleName?: string;
  status: 'active' | 'inactive';
  openingTime?: string;
  closingTime?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  establishedDate?: string;
  deity?: string;
  capacity?: number;
  customFields?: Record<string, string>;
  childTemples?: Array<{ id: string; name: string; location: string; image?: string }>;
}

export default function AddTemplePage() {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:36',message:'Component mount - initial state',data:{showModal:false,editingTempleId:null,templesCount:0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [editingTempleId, setEditingTempleId] = useState<string | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedChildTemple, setSelectedChildTemple] = useState<Temple | null>(null);
  const [showChildDetailModal, setShowChildDetailModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    parentTempleId: '',
    status: 'active' as 'active' | 'inactive',
    image: null as File | null,
    imagePreview: '',
    openingTime: '',
    closingTime: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    establishedDate: '',
    deity: '',
    capacity: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showAddCustomField, setShowAddCustomField] = useState(false);
  const [newCustomField, setNewCustomField] = useState({
    label: '',
    type: 'text' as CustomField['type'],
  });

  // Load temple for editing if templeId is in URL
  useEffect(() => {
    // #region agent log
    const templeId = searchParams?.get('templeId');
    fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:70',message:'Edit useEffect triggered',data:{templeId:templeId||null,templesCount:temples.length,searchParamsNull:!searchParams},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (templeId) {
      const temple = temples.find(t => t.id === templeId);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:73',message:'Temple search result',data:{templeId,templeFound:!!temple,templeName:temple?.name||null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      if (temple) {
        setEditingTempleId(templeId);
        setFormData({
          name: temple.name,
          location: temple.location,
          description: temple.description || '',
          parentTempleId: temple.parentTempleId || '',
          status: temple.status,
          image: null,
          imagePreview: temple.image || '',
          openingTime: temple.openingTime || '',
          closingTime: temple.closingTime || '',
          contactPhone: temple.contactPhone || '',
          contactEmail: temple.contactEmail || '',
          address: temple.address || '',
          establishedDate: temple.establishedDate || '',
          deity: temple.deity || '',
          capacity: temple.capacity?.toString() || '',
        });
        setShowModal(true);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:93',message:'Edit mode activated',data:{templeId,formDataName:temple.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
      }
    }
  }, [searchParams, temples]);

  const parentTemples = temples.filter(t => !t.parentTempleId);
  const mainTemples = temples.filter(t => !t.parentTempleId);

  // Helper function to get child temples for a parent
  const getChildTemples = (parentId: string) => {
    return temples.filter(t => t.parentTempleId === parentId);
  };

  // State for expand/collapse child temples
  const [expandedTemples, setExpandedTemples] = useState<Set<string>>(new Set());

  const toggleExpand = (templeId: string) => {
    setExpandedTemples(prev => {
      const newSet = new Set(prev);
      if (newSet.has(templeId)) {
        newSet.delete(templeId);
      } else {
        newSet.add(templeId);
      }
      return newSet;
    });
  };

  const addCustomField = () => {
    if (newCustomField.label.trim()) {
      const field: CustomField = {
        id: Date.now().toString(),
        label: newCustomField.label,
        type: newCustomField.type,
        value: '',
      };
      setCustomFields([...customFields, field]);
      setNewCustomField({ label: '', type: 'text' });
      setShowAddCustomField(false);
    }
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  const updateCustomFieldValue = (id: string, value: string) => {
    setCustomFields(customFields.map(f => 
      f.id === id ? { ...f, value } : f
    ));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleTempleImageChange = (templeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTemples(prev => prev.map(temple => 
        temple.id === templeId 
          ? { ...temple, image: imageUrl }
          : temple
      ));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Temple name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:183',message:'Form submit started',data:{editingTempleId,formDataName:formData.name,formDataLocation:formData.location,errorsCount:Object.keys(errors).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion

    if (!validateForm()) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:186',message:'Form validation failed',data:{errors},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    
    if (editingTempleId) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:197',message:'Updating temple',data:{editingTempleId,templesCountBefore:temples.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Update existing temple
      setTemples(prev => prev.map(temple => 
        temple.id === editingTempleId
          ? {
              ...temple,
              name: formData.name,
              location: formData.location,
              description: formData.description || undefined,
              image: formData.imagePreview || temple.image,
              parentTempleId: formData.parentTempleId || undefined,
              parentTempleName: formData.parentTempleId 
                ? parentTemples.find(t => t.id === formData.parentTempleId)?.name 
                : undefined,
              status: formData.status,
              openingTime: formData.openingTime || undefined,
              closingTime: formData.closingTime || undefined,
              contactPhone: formData.contactPhone || undefined,
              contactEmail: formData.contactEmail || undefined,
              address: formData.address || undefined,
              establishedDate: formData.establishedDate || undefined,
              deity: formData.deity || undefined,
              capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
              customFields: customFields.reduce((acc, field) => {
                if (field.value.trim()) {
                  acc[field.label] = field.value;
                }
                return acc;
              }, {} as Record<string, string>),
            }
          : temple
      ));
      setEditingTempleId(null);
      router.push('/operations/temple-management/add-temple');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:230',message:'Temple update completed',data:{editingTempleId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:232',message:'Adding new temple',data:{parentTempleId:formData.parentTempleId||null,templesCountBefore:temples.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Add new temple to the list (in real app, this would come from API response)
      const newTemple: Temple = {
        id: Date.now().toString(),
        name: formData.name,
        location: formData.location,
        description: formData.description || undefined,
        image: formData.imagePreview || undefined,
        parentTempleId: formData.parentTempleId || undefined,
        parentTempleName: formData.parentTempleId 
          ? parentTemples.find(t => t.id === formData.parentTempleId)?.name 
          : undefined,
        status: formData.status,
        openingTime: formData.openingTime || undefined,
        closingTime: formData.closingTime || undefined,
        contactPhone: formData.contactPhone || undefined,
        contactEmail: formData.contactEmail || undefined,
        address: formData.address || undefined,
        establishedDate: formData.establishedDate || undefined,
        deity: formData.deity || undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        bookings: 0, // Initialize bookings to 0
        customFields: customFields.reduce((acc, field) => {
          if (field.value.trim()) {
            acc[field.label] = field.value;
          }
          return acc;
        }, {} as Record<string, string>),
      };
      
      setTemples(prev => {
        const updated = [...prev, newTemple];
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:261',message:'Temple state update',data:{newTempleId:newTemple.id,isChildTemple:!!formData.parentTempleId,parentTempleId:formData.parentTempleId||null,updatedCount:updated.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
        // #endregion
        // If this is a child temple, add it to parent's childTemples array
        if (formData.parentTempleId) {
          const result = updated.map(t => 
            t.id === formData.parentTempleId
              ? { ...t, childTemples: [...(t.childTemples || []), { id: newTemple.id, name: newTemple.name, location: newTemple.location, image: newTemple.image }] }
              : t
          );
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:265',message:'Child temple sync',data:{parentTempleId:formData.parentTempleId,childTemplesCount:result.find(t=>t.id===formData.parentTempleId)?.childTemples?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
          // #endregion
          return result;
        }
        return updated;
      });
    }
    
    setShowModal(false);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:275',message:'Form submission completed',data:{templesCount:temples.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    // Reset form
    setFormData({
      name: '',
      location: '',
      description: '',
      parentTempleId: '',
      status: 'active',
      image: null,
      imagePreview: '',
      openingTime: '',
      closingTime: '',
      contactPhone: '',
      contactEmail: '',
      address: '',
      establishedDate: '',
      deity: '',
      capacity: '',
    });
    setCustomFields([]);
    setErrors({});
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTempleId(null);
    setFormData({
      name: '',
      location: '',
      description: '',
      parentTempleId: '',
      status: 'active',
      image: null,
      imagePreview: '',
      openingTime: '',
      closingTime: '',
      contactPhone: '',
      contactEmail: '',
      address: '',
      establishedDate: '',
      deity: '',
      capacity: '',
    });
    setCustomFields([]);
    setErrors({});
    router.push('/operations/temple-management/add-temple');
  };

  const handleAddChildTemple = (parentTempleId: string) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:371',message:'Add child temple triggered',data:{parentTempleId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    setFormData(prev => ({
      ...prev,
      parentTempleId: parentTempleId,
      name: '',
      location: '',
      description: '',
      image: null,
      imagePreview: '',
    }));
    setShowModal(true);
  };

  // Track temples state changes for data persistence debugging
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:386',message:'Temples state changed',data:{templesCount:temples.length,templeIds:temples.map(t=>t.id),parentTemplesCount:parentTemples.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  }, [temples, parentTemples]);

  return (
    <ModuleLayout
      title="Temple Management"
      description="Add and manage temples"
      action={
        <button
          onClick={() => setShowModal(true)}
          className={`rounded-2xl ${animations.buttonHover} ${animations.buttonActive}`}
          style={{
            padding: `${spacing.base} ${spacing.xl}`,
            backgroundColor: colors.primary.base,
            color: '#ffffff',
            border: 'none',
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add Temple
        </button>
      }
    >
      {temples.length === 0 ? (
        /* Empty State */
        <div 
          className="p-12 rounded-3xl"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
            padding: spacing['3xl'],
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: spacing.lg,
            }}
          >
            🏛️
          </div>
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.base,
              color: colors.text.primary,
            }}
          >
            No temples added yet
          </h2>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
              marginBottom: spacing.xl,
            }}
          >
            Start by adding your first temple to the system using the "Add Temple" button above.
          </p>
        </div>
      ) : (
        /* Temples List */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: spacing.lg }}>
            {mainTemples.map((temple, index) => {
              const childTemples = getChildTemples(temple.id);
              const hasChildren = childTemples.length > 0;
              const isExpanded = expandedTemples.has(temple.id);
              const staggerDelay = animations.stagger(index, 0.1);

              return (
                <div
                  key={temple.id}
                  className={`rounded-3xl ${animations.cardEnter} ${animations.cardHover} ${animations.transitionAll} overflow-hidden`}
                  style={{
                    backgroundColor: colors.background.base,
                    border: `1px solid ${colors.border}`,
                    ...staggerDelay,
                  }}
                >
                  {/* Main Temple Content */}
                  {temple.image ? (
                    <div
                      className="overflow-hidden"
                      style={{
                        width: '100%',
                        backgroundColor: colors.background.subtle,
                        position: 'relative',
                        minHeight: '400px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: spacing.base,
                        paddingBottom: spacing.base,
                      }}
                      onMouseEnter={(e) => {
                        const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                        if (overlay) overlay.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                        if (overlay) overlay.style.opacity = '0';
                      }}
                    >
                      <img
                        src={temple.image}
                        alt={temple.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                      {/* Status Indicator */}
                      <div
                        style={{
                          position: 'absolute',
                          top: spacing.base,
                          left: spacing.base,
                          padding: `${spacing.xs} ${spacing.sm}`,
                          borderRadius: '8px',
                          backgroundColor: temple.status === 'active' ? colors.success.base : colors.error.base,
                          color: '#ffffff',
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          zIndex: 5,
                        }}
                      >
                        {temple.status}
                      </div>
                      {/* Upload Icon Overlay */}
                      <div
                        data-upload-overlay
                        style={{
                          position: 'absolute',
                          top: spacing.base,
                          right: spacing.base,
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out',
                          cursor: 'pointer',
                          zIndex: 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById(`temple-image-${temple.id}`)?.click();
                        }}
                      >
                        <div
                          className="rounded-full flex items-center justify-center shadow-lg"
                          style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: colors.primary.base,
                            color: '#ffffff',
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4"
                            />
                          </svg>
                        </div>
                      </div>
                      {/* Hidden file input for this temple */}
                      <input
                        type="file"
                        id={`temple-image-${temple.id}`}
                        accept="image/*"
                        onChange={(e) => handleTempleImageChange(temple.id, e)}
                        style={{ display: 'none' }}
                      />
                    </div>
                  ) : (
                    <div
                      className="overflow-hidden"
                      style={{
                        width: '100%',
                        backgroundColor: colors.background.subtle,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                        border: `2px dashed ${colors.border}`,
                      }}
                    >
                      <div style={{ textAlign: 'center', color: colors.text.muted }}>
                        <div style={{ fontSize: '48px', marginBottom: spacing.sm }}>📷</div>
                        <div style={{ fontSize: '14px' }}>No image</div>
                      </div>
                    </div>
                  )}
                  {/* Title Section with Padding */}
                  <div style={{ padding: spacing.lg, paddingBottom: spacing.base, paddingTop: spacing.lg }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            fontWeight: 600,
                            color: colors.text.primary,
                            marginBottom: spacing.xs,
                          }}
                        >
                          {temple.name}
                        </h3>
                        <p
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.muted,
                            marginBottom: 0,
                          }}
                        >
                          {temple.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section with Padding */}
                  <div style={{ padding: spacing.lg, paddingTop: 0 }}>
                    {/* Description */}
                    {temple.description && (
                      <p
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.secondary,
                          marginBottom: spacing.base,
                          lineHeight: '1.5',
                        }}
                      >
                        {temple.description}
                      </p>
                    )}

                    {/* Temple Details Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: spacing.base,
                        marginBottom: spacing.base,
                        padding: spacing.base,
                        backgroundColor: colors.background.subtle,
                        borderRadius: '12px',
                      }}
                    >
                    {/* Parent Temple */}
                    {temple.parentTempleName && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Parent Temple
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.parentTempleName}
                        </div>
                      </div>
                    )}

                    {/* Deity */}
                    {temple.deity && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Deity
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.deity}
                        </div>
                      </div>
                    )}

                    {/* Opening Time */}
                    {temple.openingTime && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Opening Time
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.openingTime}
                        </div>
                      </div>
                    )}

                    {/* Closing Time */}
                    {temple.closingTime && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Closing Time
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.closingTime}
                        </div>
                      </div>
                    )}

                    {/* Capacity */}
                    {temple.capacity && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Capacity
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.capacity - (temple.bookings || 0)} / {temple.capacity} available
                          {temple.bookings && temple.bookings > 0 && (
                            <span
                              style={{
                                marginLeft: spacing.sm,
                                color: colors.text.muted,
                                fontSize: '14px',
                              }}
                            >
                              ({temple.bookings} booked)
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Established Date */}
                    {temple.establishedDate && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Established
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.establishedDate}
                        </div>
                      </div>
                    )}

                    {/* Contact Phone */}
                    {temple.contactPhone && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Phone
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.contactPhone}
                        </div>
                      </div>
                    )}

                    {/* Contact Email */}
                    {temple.contactEmail && (
                      <div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                            textTransform: 'uppercase',
                          }}
                        >
                          Email
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.contactEmail}
                        </div>
                      </div>
                    )}
                  </div>

                    {/* Address */}
                    {temple.address && (
                      <div
                        style={{
                          marginBottom: spacing.base,
                          padding: spacing.base,
                          backgroundColor: colors.background.subtle,
                          borderRadius: '12px',
                        }}
                      >
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                          textTransform: 'uppercase',
                        }}
                      >
                        Address
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {temple.address}
                      </div>
                    </div>
                  )}

                    {/* Custom Fields */}
                    {temple.customFields && Object.keys(temple.customFields).length > 0 && (
                      <div
                        style={{
                          marginBottom: spacing.base,
                          padding: spacing.base,
                          backgroundColor: colors.background.subtle,
                          borderRadius: '12px',
                        }}
                      >
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.sm,
                          textTransform: 'uppercase',
                        }}
                      >
                        Additional Information
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: spacing.sm,
                        }}
                      >
                        {Object.entries(temple.customFields).map(([key, value]) => (
                          <div key={key}>
                            <div
                              style={{
                                fontFamily: typography.body.fontFamily,
                                fontSize: '12px',
                                fontWeight: 600,
                                color: colors.text.muted,
                                marginBottom: spacing.xs,
                              }}
                            >
                              {key}
                            </div>
                            <div
                              style={{
                                fontFamily: typography.body.fontFamily,
                                fontSize: typography.body.fontSize,
                                color: colors.text.primary,
                              }}
                            >
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  </div>

                  {/* Child Temples Section */}
                  {hasChildren && (
                    <div style={{ marginTop: spacing.base, padding: spacing.lg, paddingTop: 0 }}>
                      <button
                        type="button"
                        onClick={() => toggleExpand(temple.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: spacing.xs,
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          textTransform: 'uppercase',
                          marginBottom: spacing.xs,
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease',
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Child Temples ({childTemples.length})
                      </button>

                      {/* Child Temples Grid */}
                      <div
                        style={{
                          maxHeight: isExpanded ? '1000px' : '0',
                          overflow: 'hidden',
                          transition: 'max-height 0.3s ease',
                          display: isExpanded ? 'grid' : 'none',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: spacing.base,
                        }}
                      >
                        {childTemples.map((child) => {
                          const childTemple = temples.find(t => t.id === child.id) || child;
                          return (
                            <div
                              key={child.id}
                              className={`rounded-2xl ${animations.cardEnter} ${animations.cardHover} ${animations.transitionAll} overflow-hidden`}
                              style={{
                                backgroundColor: colors.background.subtle,
                                border: `1px solid ${colors.border}`,
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setSelectedChildTemple(childTemple);
                                setShowChildDetailModal(true);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = colors.primary.base;
                                e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.08)`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = colors.border;
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              {/* Child Temple Image Thumbnail */}
                              {childTemple.image ? (
                                <div
                                  className="overflow-hidden"
                                  style={{
                                    width: '100%',
                                    height: '150px',
                                    backgroundColor: colors.background.light,
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  onMouseEnter={(e) => {
                                    const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                                    if (overlay) overlay.style.opacity = '1';
                                  }}
                                  onMouseLeave={(e) => {
                                    const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                                    if (overlay) overlay.style.opacity = '0';
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById(`child-image-thumb-${child.id}`)?.click();
                                  }}
                                >
                                  <img
                                    src={childTemple.image}
                                    alt={childTemple.name}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      display: 'block',
                                    }}
                                  />
                                  {/* Status Badge */}
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: spacing.xs,
                                      left: spacing.xs,
                                      padding: `${spacing.xs} ${spacing.sm}`,
                                      borderRadius: '6px',
                                      backgroundColor: childTemple.status === 'active' ? colors.success.base : colors.error.base,
                                      color: '#ffffff',
                                      fontFamily: typography.body.fontFamily,
                                      fontSize: '10px',
                                      fontWeight: 600,
                                      textTransform: 'uppercase',
                                      zIndex: 5,
                                    }}
                                  >
                                    {childTemple.status}
                                  </div>
                                  {/* Upload Icon Overlay */}
                                  <div
                                    data-upload-overlay
                                    style={{
                                      position: 'absolute',
                                      top: spacing.xs,
                                      right: spacing.xs,
                                      opacity: 0,
                                      transition: 'opacity 0.2s ease-in-out',
                                      cursor: 'pointer',
                                      zIndex: 10,
                                    }}
                                  >
                                    <div
                                      className="rounded-full flex items-center justify-center shadow-lg"
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: colors.primary.base,
                                        color: '#ffffff',
                                      }}
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  {/* Hidden file input for thumbnail upload */}
                                  <input
                                    type="file"
                                    id={`child-image-thumb-${child.id}`}
                                    accept="image/*"
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleTempleImageChange(child.id, e);
                                    }}
                                    style={{ display: 'none' }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="overflow-hidden"
                                  style={{
                                    width: '100%',
                                    height: '150px',
                                    backgroundColor: colors.background.light,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: `2px dashed ${colors.border}`,
                                    position: 'relative',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById(`child-image-thumb-${child.id}`)?.click();
                                  }}
                                >
                                  <div style={{ textAlign: 'center', color: colors.text.muted }}>
                                    <div style={{ fontSize: '24px', marginBottom: spacing.xs }}>📷</div>
                                    <div style={{ fontSize: '10px' }}>No image</div>
                                  </div>
                                  {/* Hidden file input for thumbnail upload */}
                                  <input
                                    type="file"
                                    id={`child-image-thumb-${child.id}`}
                                    accept="image/*"
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleTempleImageChange(child.id, e);
                                    }}
                                    style={{ display: 'none' }}
                                  />
                                </div>
                              )}
                              {/* Child Temple Minimal Info */}
                              <div style={{ padding: spacing.base }}>
                                <h4
                                  style={{
                                    fontFamily: typography.body.fontFamily,
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: colors.text.primary,
                                    marginBottom: spacing.xs,
                                  }}
                                >
                                  {childTemple.name}
                                </h4>
                                <p
                                  style={{
                                    fontFamily: typography.body.fontFamily,
                                    fontSize: '12px',
                                    color: colors.text.muted,
                                    marginBottom: 0,
                                  }}
                                >
                                  {childTemple.location}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: 'flex',
                        gap: spacing.base,
                        marginTop: spacing.lg,
                        paddingTop: spacing.base,
                        paddingBottom: spacing.lg,
                        paddingLeft: spacing.lg,
                        paddingRight: spacing.lg,
                        borderTop: `1px solid ${colors.border}`,
                      }}
                    >
                    <button
                      onClick={() => router.push(`/operations/temple-management/temple-details?templeId=${temple.id}`)}
                      className={`rounded-xl ${animations.buttonHover} ${animations.buttonActive}`}
                      style={{
                        flex: 1,
                        padding: spacing.base,
                        backgroundColor: colors.primary.base,
                        color: '#ffffff',
                        border: 'none',
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => router.push(`/operations/temple-management/add-temple?templeId=${temple.id}`)}
                      className={`rounded-xl ${animations.buttonHover} ${animations.buttonActive}`}
                      style={{
                        flex: 1,
                        padding: spacing.base,
                        backgroundColor: colors.background.subtle,
                        color: colors.primary.base,
                        border: `1px solid ${colors.primary.base}`,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.background.light;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.background.subtle;
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Temple Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
          onClick={handleCloseModal}
        >
          <div
            className="rounded-3xl overflow-y-auto"
            style={{
              backgroundColor: colors.background.base,
              padding: spacing.xl,
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.text.primary,
            }}
          >
            Add Temple
          </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: colors.text.muted,
                  cursor: 'pointer',
                  padding: spacing.xs,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Temple Image - First Priority */}
              <div style={{ marginBottom: spacing.xl }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                  <label
                    htmlFor="image"
                    style={{
                      display: 'block',
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    {formData.parentTempleId ? 'Child Temple Image' : 'Temple Image'}
                  </label>
                  <span
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      color: colors.text.muted,
                      fontStyle: 'italic',
                    }}
                  >
                    (Add image first)
                  </span>
                </div>
                {formData.imagePreview ? (
                  <div
                    style={{
                      marginBottom: spacing.base,
                      position: 'relative',
                      width: '100%',
                      minHeight: '400px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colors.background.subtle,
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={(e) => {
                      const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                      if (overlay) overlay.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                      if (overlay) overlay.style.opacity = '0';
                    }}
                  >
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className={`rounded-2xl ${animations.scaleIn}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {/* Upload Icon Overlay on Preview */}
                    <div
                      data-upload-overlay
                      style={{
                        position: 'absolute',
                        top: spacing.base,
                        right: spacing.base,
                        opacity: 0,
                        transition: 'opacity 0.2s ease-in-out',
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                      onClick={() => {
                        document.getElementById('image')?.click();
                      }}
                    >
                      <div
                        className="rounded-full flex items-center justify-center shadow-lg"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: colors.primary.base,
                          color: '#ffffff',
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4"
                          />
                        </svg>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image: null, imagePreview: '' }));
                      }}
                      className={`rounded-xl ${animations.buttonHover} ${animations.buttonActive}`}
                      style={{
                        marginTop: spacing.sm,
                        padding: `${spacing.xs} ${spacing.base}`,
                        backgroundColor: colors.background.subtle,
                        color: colors.text.primary,
                        border: `1px solid ${colors.border}`,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        cursor: 'pointer',
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl transition-all text-center cursor-pointer ${animations.hoverLift} ${animations.hoverGlow}`}
                    style={{
                      border: `2px dashed ${colors.primary.base}`,
                      padding: spacing.xl,
                      backgroundColor: colors.background.subtle,
                      borderWidth: '3px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = colors.primary.base;
                      e.currentTarget.style.backgroundColor = colors.background.light;
                      e.currentTarget.style.borderStyle = 'solid';
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.12)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = colors.primary.base;
                      e.currentTarget.style.backgroundColor = colors.background.subtle;
                      e.currentTarget.style.borderStyle = 'dashed';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <label
                      htmlFor="image"
                      style={{
                        cursor: 'pointer',
                        display: 'block',
                      }}
                    >
                      <div style={{ fontSize: '64px', marginBottom: spacing.base }}>📷</div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          fontWeight: 600,
                          color: colors.primary.base,
                          marginBottom: spacing.xs,
                        }}
                      >
                        Click to upload {formData.parentTempleId ? 'child temple' : 'temple'} image
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          color: colors.text.muted,
                        }}
                      >
                        PNG, JPG, WEBP up to 5MB
                      </div>
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>

              {/* Temple Name */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Temple Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="rounded-2xl"
                  style={{
                    width: '100%',
                    padding: spacing.base,
                    border: `1px solid ${errors.name ? '#dc2626' : colors.border}`,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    backgroundColor: colors.background.base,
                  }}
                />
                {errors.name && (
                  <span
                    style={{
                      display: 'block',
                      marginTop: spacing.xs,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: '#dc2626',
                    }}
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Location */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  htmlFor="location"
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Location <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="rounded-2xl"
                  style={{
                    width: '100%',
                    padding: spacing.base,
                    border: `1px solid ${errors.location ? '#dc2626' : colors.border}`,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    backgroundColor: colors.background.base,
                  }}
                />
                {errors.location && (
                  <span
                    style={{
                      display: 'block',
                      marginTop: spacing.xs,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: '#dc2626',
                    }}
                  >
                    {errors.location}
                  </span>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  htmlFor="description"
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={4}
                  className="rounded-2xl"
                  style={{
                    width: '100%',
                    padding: spacing.base,
                    border: `1px solid ${colors.border}`,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    backgroundColor: colors.background.base,
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  htmlFor="address"
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Address
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={2}
                  placeholder="Full address of the temple"
                  className="rounded-2xl"
                  style={{
                    width: '100%',
                    padding: spacing.base,
                    border: `1px solid ${colors.border}`,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    backgroundColor: colors.background.base,
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Opening Time & Closing Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.base, marginBottom: spacing.lg }}>
                <div>
                  <label
                    htmlFor="openingTime"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Opening Time
                  </label>
                  <input
                    type="time"
                    id="openingTime"
                    value={formData.openingTime}
                    onChange={(e) => handleChange('openingTime', e.target.value)}
                    className="rounded-2xl"
                    style={{
                      width: '100%',
                      padding: spacing.base,
                      border: `1px solid ${colors.border}`,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      backgroundColor: colors.background.base,
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="closingTime"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Closing Time
                  </label>
                  <input
                    type="time"
                    id="closingTime"
                    value={formData.closingTime}
                    onChange={(e) => handleChange('closingTime', e.target.value)}
                    className="rounded-2xl"
                    style={{
                      width: '100%',
                      padding: spacing.base,
                      border: `1px solid ${colors.border}`,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      backgroundColor: colors.background.base,
                    }}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.base, marginBottom: spacing.lg }}>
                <div>
                  <label
                    htmlFor="contactPhone"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="+91 1234567890"
                    className="rounded-2xl"
                    style={{
                      width: '100%',
                      padding: spacing.base,
                      border: `1px solid ${colors.border}`,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      backgroundColor: colors.background.base,
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactEmail"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Contact Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="temple@example.com"
                    className="rounded-2xl"
                    style={{
                      width: '100%',
                      padding: spacing.base,
                      border: `1px solid ${colors.border}`,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      backgroundColor: colors.background.base,
                    }}
                  />
                </div>
              </div>

              {/* Deity & Established Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.base, marginBottom: spacing.lg }}>
                <div>
                  <label
                    htmlFor="deity"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Main Deity
                  </label>
                  <input
                    type="text"
                    id="deity"
                    value={formData.deity}
                    onChange={(e) => handleChange('deity', e.target.value)}
                    placeholder="e.g., Lord Shiva, Lord Vishnu"
                    className="rounded-2xl"
                    style={{
                      width: '100%',
                      padding: spacing.base,
                      border: `1px solid ${colors.border}`,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      backgroundColor: colors.background.base,
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="establishedDate"
                    style={{
                      display: 'block',
                      marginBottom: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Established Date
                  </label>
                  <input
                    type="date"
                    id="establishedDate"
                    value={formData.establishedDate}
                    onChange={(e) => handleChange('establishedDate', e.target.value)}
                    className="rounded-2xl"
                    style={{
                      width: '100%',
                      padding: spacing.base,
                      border: `1px solid ${colors.border}`,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      backgroundColor: colors.background.base,
                    }}
                  />
                </div>
              </div>

              {/* Capacity */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  htmlFor="capacity"
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Capacity (Number of devotees)
                </label>
                <input
                  type="number"
                  id="capacity"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', e.target.value)}
                  placeholder="e.g., 500"
                  min="0"
                  className="rounded-2xl"
                  style={{
                    width: '100%',
                    padding: spacing.base,
                    border: `1px solid ${colors.border}`,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    backgroundColor: colors.background.base,
                  }}
                />
              </div>

              {/* Parent Temple */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  htmlFor="parentTempleId"
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Parent Temple (Optional)
                </label>
                <select
                  id="parentTempleId"
                  value={formData.parentTempleId}
                  onChange={(e) => {
                    // #region agent log
                    fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:1967',message:'Parent temple selected',data:{parentTempleId:e.target.value,isChildTemple:!!e.target.value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
                    // #endregion
                    handleChange('parentTempleId', e.target.value);
                  }}
                  className="rounded-2xl"
                  style={{
                    width: '100%',
                    padding: spacing.base,
                    border: `1px solid ${colors.border}`,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    backgroundColor: colors.background.base,
                  }}
                >
                  <option value="">None (Parent Temple)</option>
                  {parentTemples.map((temple) => (
                    <option key={temple.id} value={temple.id}>
                      {temple.name}
                    </option>
                  ))}
                </select>
                <p
                  style={{
                    marginTop: spacing.xs,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.muted,
                  }}
                >
                  Leave empty if this is a parent temple, or select a parent temple if this is a child temple.
                </p>
                {!formData.parentTempleId && parentTemples.length > 0 && (
                  <div style={{ marginTop: spacing.base }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: spacing.sm,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        fontWeight: 600,
                        color: colors.text.primary,
                      }}
                    >
                      Or add as child temple to:
                    </label>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddChildTemple(e.target.value);
                        }
                      }}
                      className="rounded-2xl"
                      style={{
                        width: '100%',
                        padding: spacing.base,
                        border: `1px solid ${colors.border}`,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                        backgroundColor: colors.background.base,
                      }}
                      defaultValue=""
                    >
                      <option value="">Select parent temple to add as child...</option>
                      {parentTemples.map((temple) => (
                        <option key={temple.id} value={temple.id}>
                          {temple.name} - {temple.location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Status */}
              <div style={{ marginBottom: spacing.lg }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: spacing.sm,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Status
                </label>
                <div style={{ display: 'flex', gap: spacing.base }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => handleChange('status', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    Active
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing.sm,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={(e) => handleChange('status', e.target.value)}
                      style={{ cursor: 'pointer' }}
                    />
                    Inactive
                  </label>
                </div>
              </div>

              {/* Custom Fields */}
              <div style={{ marginBottom: spacing.lg, paddingTop: spacing.lg, borderTop: `2px solid ${colors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.base }}>
                  <h3
                    style={{
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                    }}
                  >
                    Custom Fields
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomField(!showAddCustomField)}
                    className="rounded-2xl"
                    style={{
                      padding: `${spacing.sm} ${spacing.base}`,
                      backgroundColor: colors.background.subtle,
                      color: colors.primary.base,
                      border: `1px solid ${colors.primary.base}`,
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    + Add Custom Field
                  </button>
                </div>

                {/* Add Custom Field Form */}
                {showAddCustomField && (
                  <div className="rounded-2xl" style={{ 
                    padding: spacing.base, 
                    marginBottom: spacing.base,
                    backgroundColor: colors.background.subtle,
                    border: `1px solid ${colors.border}`,
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: spacing.base, alignItems: 'stretch' }}>
                      <div style={{ display: 'flex', alignItems: 'stretch' }}>
                        <input
                          type="text"
                          placeholder="Field Label (e.g., Special Notes, Festival Dates)"
                          value={newCustomField.label}
                          onChange={(e) => setNewCustomField({ ...newCustomField, label: e.target.value })}
                          className="rounded-2xl"
                          style={{
                            width: '100%',
                            padding: `0 ${spacing.base}`,
                            border: `1px solid ${colors.border}`,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                            backgroundColor: colors.background.base,
                            boxSizing: 'border-box',
                            height: '44px',
                            lineHeight: '44px',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield',
                            verticalAlign: 'middle',
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>
                        <select
                          value={newCustomField.type}
                          onChange={(e) => setNewCustomField({ ...newCustomField, type: e.target.value as CustomField['type'] })}
                          className="rounded-2xl"
                          style={{
                            width: '100%',
                            padding: `0 ${spacing.base}`,
                            paddingRight: '40px',
                            border: `1px solid ${colors.border}`,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                            backgroundColor: colors.background.base,
                            boxSizing: 'border-box',
                            height: '44px',
                            lineHeight: '44px',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            verticalAlign: 'middle',
                          }}
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="date">Date</option>
                          <option value="time">Time</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="textarea">Textarea</option>
                        </select>
                        <div
                          style={{
                            position: 'absolute',
                            right: spacing.base,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            pointerEvents: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{
                              color: colors.text.muted,
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: spacing.xs, alignItems: 'stretch' }}>
                        <button
                          type="button"
                          onClick={addCustomField}
                          className="rounded-2xl"
                          style={{
                            padding: `0 ${spacing.base}`,
                            backgroundColor: colors.primary.base,
                            color: '#ffffff',
                            border: 'none',
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            fontWeight: 500,
                            cursor: 'pointer',
                            height: '44px',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            verticalAlign: 'middle',
                          }}
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddCustomField(false);
                            setNewCustomField({ label: '', type: 'text' });
                          }}
                          className="rounded-2xl"
                          style={{
                            padding: `0 ${spacing.base}`,
                            backgroundColor: colors.background.base,
                            color: colors.text.primary,
                            border: `1px solid ${colors.border}`,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            cursor: 'pointer',
                            height: '44px',
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            verticalAlign: 'middle',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom Fields List */}
                {customFields.map((field) => (
                  <div key={field.id} style={{ marginBottom: spacing.base }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.base, marginBottom: spacing.xs }}>
                      <label
                        style={{
                          flex: 1,
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          fontWeight: 600,
                          color: colors.text.primary,
                        }}
                      >
                        {field.label}
                      </label>
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="rounded-3xl"
                        style={{
                          padding: spacing.xs,
                          backgroundColor: 'transparent',
                          color: '#dc2626',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '18px',
                        }}
                      >
                        ×
                      </button>
                    </div>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={field.value}
                        onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
                        rows={3}
                        className="rounded-2xl"
                        style={{
                          width: '100%',
                          padding: spacing.base,
                          border: `1px solid ${colors.border}`,
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                          backgroundColor: colors.background.base,
                          resize: 'vertical',
                        }}
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => updateCustomFieldValue(field.id, e.target.value)}
                        className="rounded-2xl"
                        style={{
                          width: '100%',
                          padding: spacing.base,
                          border: `1px solid ${colors.border}`,
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                          backgroundColor: colors.background.base,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: spacing.base, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-2xl"
                  style={{
                    padding: `${spacing.base} ${spacing.lg}`,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.background.base,
                    color: colors.text.primary,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl"
                  style={{
                    padding: `${spacing.base} ${spacing.lg}`,
                    backgroundColor: isSubmitting ? colors.text.muted : colors.primary.base,
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 500,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? (editingTempleId ? 'Updating...' : 'Adding...') : (editingTempleId ? 'Update Temple' : 'Add Temple')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Child Temple Detail Modal */}
      {showChildDetailModal && selectedChildTemple && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
          onClick={() => {
            setShowChildDetailModal(false);
            setSelectedChildTemple(null);
          }}
        >
          <div
            className={`rounded-3xl overflow-y-auto ${animations.modalContentEnter}`}
            style={{
              backgroundColor: colors.background.base,
              padding: spacing.xl,
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <h2
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.sectionHeader.fontSize,
                  fontWeight: typography.sectionHeader.fontWeight,
                  color: colors.text.primary,
                }}
              >
                {selectedChildTemple.name}
              </h2>
              <button
                onClick={() => {
                  setShowChildDetailModal(false);
                  setSelectedChildTemple(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: colors.text.muted,
                  cursor: 'pointer',
                  padding: spacing.xs,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Child Temple Image */}
            {selectedChildTemple.image ? (
              <div
                className="overflow-hidden rounded-2xl"
                style={{
                  width: '100%',
                  marginBottom: spacing.lg,
                  backgroundColor: colors.background.subtle,
                  position: 'relative',
                  minHeight: '400px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                  if (overlay) overlay.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector('[data-upload-overlay]') as HTMLElement;
                  if (overlay) overlay.style.opacity = '0';
                }}
              >
                <img
                  src={selectedChildTemple.image}
                  alt={selectedChildTemple.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Status Indicator */}
                <div
                  style={{
                    position: 'absolute',
                    top: spacing.base,
                    left: spacing.base,
                    padding: `${spacing.xs} ${spacing.sm}`,
                    borderRadius: '8px',
                    backgroundColor: selectedChildTemple.status === 'active' ? colors.success.base : colors.error.base,
                    color: '#ffffff',
                    fontFamily: typography.body.fontFamily,
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    zIndex: 5,
                  }}
                >
                  {selectedChildTemple.status}
                </div>
                {/* Upload Icon Overlay */}
                <div
                  data-upload-overlay
                  style={{
                    position: 'absolute',
                    top: spacing.base,
                    right: spacing.base,
                    opacity: 0,
                    transition: 'opacity 0.2s ease-in-out',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById(`child-image-modal-${selectedChildTemple.id}`)?.click();
                  }}
                >
                  <div
                    className="rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      width: '50px',
                      height: '50px',
                      backgroundColor: colors.primary.base,
                      color: '#ffffff',
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4"
                      />
                    </svg>
                  </div>
                </div>
                {/* Hidden file input for modal image upload */}
                <input
                  type="file"
                  id={`child-image-modal-${selectedChildTemple.id}`}
                  accept="image/*"
                  onChange={(e) => handleTempleImageChange(selectedChildTemple.id, e)}
                  style={{ display: 'none' }}
                />
              </div>
            ) : (
              <div
                className="overflow-hidden rounded-2xl"
                style={{
                  width: '100%',
                  marginBottom: spacing.lg,
                  backgroundColor: colors.background.subtle,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px',
                  border: `2px dashed ${colors.border}`,
                  position: 'relative',
                }}
                onClick={() => {
                  document.getElementById(`child-image-modal-${selectedChildTemple.id}`)?.click();
                }}
              >
                <div style={{ textAlign: 'center', color: colors.text.muted }}>
                  <div style={{ fontSize: '48px', marginBottom: spacing.sm }}>📷</div>
                  <div style={{ fontSize: '14px' }}>No image - Click to upload</div>
                </div>
                {/* Hidden file input for modal image upload */}
                <input
                  type="file"
                  id={`child-image-modal-${selectedChildTemple.id}`}
                  accept="image/*"
                  onChange={(e) => handleTempleImageChange(selectedChildTemple.id, e)}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* Child Temple Details - Mirror Parent Layout */}
            <div style={{ marginBottom: spacing.lg }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.base }}>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      fontWeight: 600,
                      color: colors.text.primary,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {selectedChildTemple.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                    }}
                  >
                    {selectedChildTemple.location}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedChildTemple.description && (
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.secondary,
                    marginBottom: spacing.base,
                    lineHeight: '1.5',
                  }}
                >
                  {selectedChildTemple.description}
                </p>
              )}

              {/* Temple Details Grid */}
              {(selectedChildTemple.openingTime ||
                selectedChildTemple.closingTime ||
                selectedChildTemple.capacity ||
                selectedChildTemple.deity ||
                selectedChildTemple.contactPhone ||
                selectedChildTemple.contactEmail) && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: spacing.base,
                    marginBottom: spacing.base,
                    padding: spacing.base,
                    backgroundColor: colors.background.subtle,
                    borderRadius: '12px',
                  }}
                >
                  {/* Opening Time */}
                  {selectedChildTemple.openingTime && (
                    <div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                          textTransform: 'uppercase',
                        }}
                      >
                        Opening Time
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedChildTemple.openingTime}
                      </div>
                    </div>
                  )}

                  {/* Closing Time */}
                  {selectedChildTemple.closingTime && (
                    <div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                          textTransform: 'uppercase',
                        }}
                      >
                        Closing Time
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedChildTemple.closingTime}
                      </div>
                    </div>
                  )}

                  {/* Capacity */}
                  {selectedChildTemple.capacity && (
                    <div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                          textTransform: 'uppercase',
                        }}
                      >
                        Capacity
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedChildTemple.capacity - (selectedChildTemple.bookings || 0)} / {selectedChildTemple.capacity} available
                        {selectedChildTemple.bookings && selectedChildTemple.bookings > 0 && (
                          <span
                            style={{
                              marginLeft: spacing.sm,
                              color: colors.text.muted,
                              fontSize: '14px',
                            }}
                          >
                            ({selectedChildTemple.bookings} booked)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Deity */}
                  {selectedChildTemple.deity && (
                    <div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                          textTransform: 'uppercase',
                        }}
                      >
                        Deity
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedChildTemple.deity}
                      </div>
                    </div>
                  )}

                  {/* Contact Phone */}
                  {selectedChildTemple.contactPhone && (
                    <div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                          textTransform: 'uppercase',
                        }}
                      >
                        Phone
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedChildTemple.contactPhone}
                      </div>
                    </div>
                  )}

                  {/* Contact Email */}
                  {selectedChildTemple.contactEmail && (
                    <div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.text.muted,
                          marginBottom: spacing.xs,
                          textTransform: 'uppercase',
                        }}
                      >
                        Email
                      </div>
                      <div
                        style={{
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                          color: colors.text.primary,
                        }}
                      >
                        {selectedChildTemple.contactEmail}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Address */}
              {selectedChildTemple.address && (
                <div
                  style={{
                    marginBottom: spacing.base,
                    padding: spacing.base,
                    backgroundColor: colors.background.subtle,
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: colors.text.muted,
                      marginBottom: spacing.xs,
                      textTransform: 'uppercase',
                    }}
                  >
                    Address
                  </div>
                  <div
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.primary,
                    }}
                  >
                    {selectedChildTemple.address}
                  </div>
                </div>
              )}

              {/* Custom Fields */}
              {selectedChildTemple.customFields && Object.keys(selectedChildTemple.customFields).length > 0 && (
                <div
                  style={{
                    marginBottom: spacing.base,
                    padding: spacing.base,
                    backgroundColor: colors.background.subtle,
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: typography.body.fontFamily,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: colors.text.muted,
                      marginBottom: spacing.sm,
                      textTransform: 'uppercase',
                    }}
                  >
                    Additional Information
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: spacing.sm,
                    }}
                  >
                    {Object.entries(selectedChildTemple.customFields).map(([key, value]) => (
                      <div key={key}>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: '12px',
                            fontWeight: 600,
                            color: colors.text.muted,
                            marginBottom: spacing.xs,
                          }}
                        >
                          {key}
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: spacing.base,
                  marginTop: spacing.lg,
                  paddingTop: spacing.base,
                  borderTop: `1px solid ${colors.border}`,
                }}
              >
                <button
                  onClick={() => router.push(`/operations/temple-management/temple-details?templeId=${selectedChildTemple.id}`)}
                  className={`rounded-xl ${animations.buttonHover} ${animations.buttonActive}`}
                  style={{
                    flex: 1,
                    padding: spacing.base,
                    backgroundColor: colors.primary.base,
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    setShowChildDetailModal(false);
                    router.push(`/operations/temple-management/add-temple?templeId=${selectedChildTemple.id}`);
                  }}
                  className={`rounded-xl ${animations.buttonHover} ${animations.buttonActive}`}
                  style={{
                    flex: 1,
                    padding: spacing.base,
                    backgroundColor: colors.background.subtle,
                    color: colors.primary.base,
                    border: `1px solid ${colors.primary.base}`,
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.light;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.subtle;
                  }}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}
