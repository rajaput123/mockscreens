'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';
// Design system imports removed - using Tailwind CSS instead
import { getAllTemples, type Temple as StaticTemple } from '../templeData';

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

function AddTempleContent() {
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

  // Load static data on mount
  useEffect(() => {
    try {
      const staticTemples = getAllTemples();
      console.log('Loading static temples:', staticTemples.length);
      // Convert static temple data to the format expected by this component
      const convertedTemples: Temple[] = staticTemples.map(t => {
        // Check localStorage for uploaded image first
        const storageKey = `temple-image-${t.id}`;
        const uploadedImage = localStorage.getItem(storageKey);
        const imageToUse = uploadedImage || t.image;
        
        return {
          id: t.id,
          name: t.name,
          location: t.location,
          description: t.description,
          image: imageToUse,
          parentTempleId: t.parentTempleId,
          parentTempleName: t.parentTempleName,
          status: t.status,
          openingTime: t.openingTime,
          closingTime: t.closingTime,
          contactPhone: t.contactPhone,
          contactEmail: t.contactEmail,
          address: t.address,
          establishedDate: t.establishedDate,
          deity: t.deity,
          capacity: t.capacity,
          childTemples: t.childTemples?.map(childId => {
            const child = staticTemples.find(t => t.id === childId);
            // Check localStorage for child temple image
            const childStorageKey = `temple-image-${childId}`;
            const childUploadedImage = localStorage.getItem(childStorageKey);
            const childImageToUse = childUploadedImage || child?.image;
            
            return child ? {
              id: child.id,
              name: child.name,
              location: child.location,
              image: childImageToUse,
            } : null;
          }).filter(Boolean) as Array<{ id: string; name: string; location: string; image?: string }> || [],
        };
      });
      console.log('Converted temples:', convertedTemples.length);
      setTemples(convertedTemples);
    } catch (error) {
      console.error('Error loading static temples:', error);
    }
  }, []);

  // Load temple for editing if templeId is in URL
  useEffect(() => {
    // #region agent log
    const templeId = searchParams?.get('templeId');
    fetch('http://127.0.0.1:7242/ingest/426b5eba-90d2-4027-9f3b-c10ba102fba8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'add-temple/page.tsx:70',message:'Edit useEffect triggered',data:{templeId:templeId||null,templesCount:temples.length,searchParamsNull:!searchParams},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    if (templeId && temples.length > 0) {
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
  // Show only the first/main temple with its child temples
  const mainTemple = parentTemples.length > 0 ? parentTemples[0] : null;

  // Pre-select main temple as parent when creating new child temple
  useEffect(() => {
    if (mainTemple && !editingTempleId && !formData.parentTempleId) {
      setFormData(prev => ({
        ...prev,
        parentTempleId: mainTemple.id,
      }));
    }
  }, [mainTemple, editingTempleId]);

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
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = ''; // Reset file input
        return;
      }

      // Convert image to base64 for preview and localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64String = reader.result as string;
          setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: base64String,
          }));
          // Reset file input to allow re-uploading the same file
          e.target.value = '';
        }
      };
      reader.onerror = () => {
        alert('Error reading image file. Please try again.');
        e.target.value = ''; // Reset file input
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTempleImageChange = (templeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = ''; // Reset file input
        return;
      }

      // Convert image to base64 for localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64String = reader.result as string;
          
          // Store in localStorage
          const storageKey = `temple-image-${templeId}`;
          localStorage.setItem(storageKey, base64String);
          
          // Update state with base64 image
          setTemples(prev => prev.map(temple => 
            temple.id === templeId 
              ? { ...temple, image: base64String }
              : temple
          ));
          // Reset file input to allow re-uploading the same file
          e.target.value = '';
        }
      };
      reader.onerror = () => {
        alert('Error reading image file. Please try again.');
        e.target.value = ''; // Reset file input
      };
      reader.readAsDataURL(file);
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
      // Save uploaded image to localStorage if exists
      if (formData.imagePreview && formData.imagePreview.startsWith('data:image')) {
        const storageKey = `temple-image-${editingTempleId}`;
        localStorage.setItem(storageKey, formData.imagePreview);
      }
      
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
      const newTempleId = Date.now().toString();
      
      // Save uploaded image to localStorage if exists
      if (formData.imagePreview && formData.imagePreview.startsWith('data:image')) {
        const storageKey = `temple-image-${newTempleId}`;
        localStorage.setItem(storageKey, formData.imagePreview);
      }
      
      const newTemple: Temple = {
        id: newTempleId,
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
          className="rounded-2xl hover:opacity-90 active:scale-95 transition-all"
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#67461b',
            color: '#ffffff',
            border: 'none',
            fontFamily: 'var(--font-inter), system-ui, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Add Temple
        </button>
      }
    >
      {!mainTemple ? (
        /* Empty State */
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-6">
            🏛️
          </div>
          <h2 className="font-serif text-xl font-medium mb-4 text-gray-900">
            No temples added yet
          </h2>
          <p className="font-sans text-base text-gray-600 mb-8">
            Start by adding your first temple to the system using the "Add Temple" button above.
          </p>
        </div>
      ) : (
        /* Main Temple with Child Temples */
        <div>
          <div className="grid grid-cols-1 gap-6">
            {(() => {
              const childTemples = getChildTemples(mainTemple.id);
              const hasChildren = childTemples.length > 0;
              const isExpanded = expandedTemples.has(mainTemple.id);

              return (
                <div
                  key={mainTemple.id}
                  className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Main Temple Content */}
                  {mainTemple.image ? (
                    <div
                      className="overflow-hidden"
                      style={{
                        width: '100%',
                        position: 'relative',
                        aspectRatio: '16/9',
                        maxHeight: '400px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f5f3f0',
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
                        src={mainTemple.image}
                        alt={mainTemple.name}
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
                          top: '1rem',
                          left: '1rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          backgroundColor: mainTemple.status === 'active' ? '#a87738' : '#dc2626',
                          color: '#ffffff',
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          zIndex: 5,
                        }}
                      >
                        {mainTemple.status}
                      </div>
                      {/* Upload Icon Overlay */}
                      <div
                        data-upload-overlay
                        style={{
                          position: 'absolute',
                          top: '1rem',
                          right: '1rem',
                          opacity: 0,
                          transition: 'opacity 0.2s ease-in-out',
                          cursor: 'pointer',
                          zIndex: 10,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById(`temple-image-${mainTemple.id}`)?.click();
                        }}
                      >
                        <div
                          className="rounded-full flex items-center justify-center shadow-lg"
                          style={{
                            width: '50px',
                            height: '50px',
                            backgroundColor: '#67461b',
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
                        id={`temple-image-${mainTemple.id}`}
                        accept="image/*"
                        onChange={(e) => handleTempleImageChange(mainTemple.id, e)}
                        style={{ display: 'none' }}
                      />
                    </div>
                  ) : (
                    <div
                      className="overflow-hidden"
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        aspectRatio: '16/9',
                        maxHeight: '400px',
                        border: '2px dashed #e5e5e5',
                      }}
                    >
                      <div style={{ textAlign: 'center', color: '#737373' }}>
                        <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📷</div>
                        <div style={{ fontSize: '12px' }}>No image</div>
                      </div>
                    </div>
                  )}
                  {/* Title Section with Padding */}
                  <div style={{ paddingTop: '1.5rem', paddingBottom: '1rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#171717',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {mainTemple.name}
                        </h3>
                        <p
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#737373',
                            marginBottom: 0,
                          }}
                        >
                          {mainTemple.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section with Padding */}
                  <div style={{ paddingTop: 0, paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    {/* Description */}
                    {mainTemple.description && (
                      <p
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#404040',
                          marginBottom: '1rem',
                          lineHeight: '1.5',
                        }}
                      >
                        {mainTemple.description}
                      </p>
                    )}

                    {/* Temple Details Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginBottom: '1rem',
                        padding: '1rem',
                        borderRadius: '12px',
                      }}
                    >
                    {/* Parent Temple */}
                    {mainTemple.parentTempleName && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Parent Temple
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.parentTempleName}
                        </div>
                      </div>
                    )}

                    {/* Deity */}
                    {mainTemple.deity && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Deity
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.deity}
                        </div>
                      </div>
                    )}

                    {/* Opening Time */}
                    {mainTemple.openingTime && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Opening Time
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.openingTime}
                        </div>
                      </div>
                    )}

                    {/* Closing Time */}
                    {mainTemple.closingTime && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Closing Time
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.closingTime}
                        </div>
                      </div>
                    )}

                    {/* Capacity */}
                    {mainTemple.capacity && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Capacity
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.capacity} people
                        </div>
                      </div>
                    )}

                    {/* Established Date */}
                    {mainTemple.establishedDate && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Established
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.establishedDate}
                        </div>
                      </div>
                    )}

                    {/* Contact Phone */}
                    {mainTemple.contactPhone && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Phone
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.contactPhone}
                        </div>
                      </div>
                    )}

                    {/* Contact Email */}
                    {mainTemple.contactEmail && (
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                          }}
                        >
                          Email
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                          }}
                        >
                          {mainTemple.contactEmail}
                        </div>
                      </div>
                    )}
                  </div>

                    {/* Address */}
                    {mainTemple.address && (
                      <div
                        style={{
                          marginBottom: '1rem',
                          padding: '1rem',
                          borderRadius: '12px',
                        }}
                      >
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Address
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
                        }}
                      >
                        {mainTemple.address}
                      </div>
                    </div>
                    )}

                    {/* Custom Fields */}
                    {mainTemple.customFields && Object.keys(mainTemple.customFields).length > 0 && (
                      <div
                        style={{
                          marginBottom: '1rem',
                          padding: '1rem',
                          borderRadius: '12px',
                        }}
                      >
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.75rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Additional Information
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '0.75rem',
                        }}
                      >
                        {Object.entries(mainTemple.customFields).map(([key, value]) => (
                          <div key={key}>
                            <div
                              style={{
                                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#737373',
                                marginBottom: '0.5rem',
                              }}
                            >
                              {key}
                            </div>
                            <div
                              style={{
                                fontFamily: 'var(--font-inter), system-ui, sans-serif',
                                fontSize: '16px',
                                color: '#171717',
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
                    <div style={{ marginTop: '1rem', paddingTop: 0, paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                      <button
                        type="button"
                        onClick={() => toggleExpand(mainTemple.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          textTransform: 'uppercase',
                          marginBottom: '1rem',
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
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '1.5rem',
                          width: '100%',
                          gridAutoRows: 'min-content',
                          paddingBottom: '1rem',
                        }}
                      >
                        {childTemples.map((child) => {
                          const childTemple = temples.find(t => t.id === child.id) || child;
                          return (
                            <div
                              key={child.id}
                              className="rounded-2xl overflow-hidden transition-all hover:shadow-md"
                              style={{
                                border: '1px solid #e5e5e5',
                                cursor: 'pointer',
                                width: '100%',
                                minWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                              }}
                              onClick={() => {
                                setSelectedChildTemple(childTemple);
                                setShowChildDetailModal(true);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#c2410c';
                                e.currentTarget.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.08)`;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#e5e5e5';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              {/* Child Temple Image Thumbnail */}
                              {childTemple.image ? (
                                <div
                                  className="overflow-hidden"
                                  style={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    maxHeight: '160px',
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
                                      top: '0.5rem',
                                      left: '0.5rem',
                                      padding: '0.5rem 0.75rem',
                                      borderRadius: '6px',
                                      backgroundColor: childTemple.status === 'active' ? '#a87738' : '#dc2626',
                                      color: '#ffffff',
                                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
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
                                      top: '0.5rem',
                                      right: '0.5rem',
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
                                        backgroundColor: '#67461b',
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
                                    aspectRatio: '16/9',
                                    maxHeight: '160px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: '2px dashed #e5e5e5',
                                    position: 'relative',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    document.getElementById(`child-image-thumb-${child.id}`)?.click();
                                  }}
                                >
                                  <div style={{ textAlign: 'center', color: '#737373' }}>
                                    <div style={{ fontSize: '20px', marginBottom: '0.5rem' }}>📷</div>
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
                              <div style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1.5rem', paddingRight: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                {childTemple.deity ? (
                                  <h4
                                    style={{
                                      fontFamily: 'var(--font-noto-serif), serif',
                                      fontSize: '20px',
                                      fontWeight: 700,
                                      color: '#67461b',
                                      marginBottom: '0.5rem',
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {childTemple.deity}
                                  </h4>
                                ) : (
                                  <h4
                                    style={{
                                      fontFamily: 'var(--font-noto-serif), serif',
                                      fontSize: '17px',
                                      fontWeight: 600,
                                      color: '#171717',
                                      marginBottom: '0.5rem',
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {childTemple.name}
                                  </h4>
                                )}
                                <p
                                  style={{
                                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                                    fontSize: '13px',
                                    color: '#737373',
                                    marginTop: 'auto',
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
                        gap: '1rem',
                        marginTop: '1.5rem',
                        paddingTop: '1rem',
                        paddingBottom: '1.5rem',
                        paddingLeft: '1.5rem',
                        paddingRight: '1.5rem',
                        borderTop: '1px solid #e5e5e5',
                      }}
                    >
                    <button
                      onClick={() => router.push(`/operations/temple-management/temple-details?templeId=${mainTemple.id}`)}
                      className="rounded-xl hover:opacity-90 active:scale-95 transition-all"
                      style={{
                        flex: 1,
                        padding: '1rem',
                        backgroundColor: '#67461b',
                        color: '#ffffff',
                        border: 'none',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontSize: '16px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => router.push(`/operations/temple-management/add-temple?templeId=${mainTemple.id}`)}
                      className="rounded-xl hover:opacity-90 active:scale-95 transition-all"
                      style={{
                        flex: 1,
                        padding: '1rem',
                        backgroundColor: '#fafafa',
                        color: '#c2410c',
                        border: '1px solid #c2410c',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontSize: '16px',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Temple Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-6"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-3xl overflow-y-auto p-6 max-w-2xl w-full max-h-[90vh] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-xl font-medium text-gray-900">
            Add Temple
          </h2>
              <button
                onClick={handleCloseModal}
                className="bg-transparent border-none text-2xl text-gray-600 cursor-pointer p-1 leading-none hover:text-gray-900 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Temple Image - First Priority */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <label
                    htmlFor="image"
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
                    }}
                  >
                    {formData.parentTempleId ? 'Child Temple Image' : 'Temple Image'}
                  </label>
                  <span
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '12px',
                      color: '#737373',
                      fontStyle: 'italic',
                    }}
                  >
                    (Add image first)
                  </span>
                </div>
                {formData.imagePreview ? (
                  <div
                    style={{
                      marginBottom: '1rem',
                      position: 'relative',
                      width: '100%',
                      minHeight: '400px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#fafafa',
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
                      className="rounded-2xl transition-all"
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
                        top: '1rem',
                        right: '1rem',
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
                          backgroundColor: '#67461b',
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
                      className="rounded-xl hover:opacity-90 active:scale-95 transition-all"
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#fafafa',
                        color: '#171717',
                        border: '1px solid #e5e5e5',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontSize: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div
                    className="rounded-2xl transition-all text-center cursor-pointer hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      border: '2px dashed #c2410c',
                      padding: '2rem',
                      backgroundColor: '#fafafa',
                      borderWidth: '3px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#c2410c';
                      e.currentTarget.style.borderStyle = 'solid';
                      e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.12)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#c2410c';
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
                      <div style={{ fontSize: '64px', marginBottom: '1rem' }}>📷</div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#c2410c',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Click to upload {formData.parentTempleId ? 'child temple' : 'temple'} image
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          color: '#737373',
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
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
                    padding: '1rem',
                    border: `1px solid ${errors.name ? '#dc2626' : '#e5e5e5'}`,
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#171717',
                    backgroundColor: '#ffffff',
                  }}
                />
                {errors.name && (
                  <span
                    style={{
                      display: 'block',
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#dc2626',
                    }}
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Location */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="location"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
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
                    padding: '1rem',
                    border: `1px solid ${errors.location ? '#dc2626' : '#e5e5e5'}`,
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#171717',
                    backgroundColor: '#ffffff',
                  }}
                />
                {errors.location && (
                  <span
                    style={{
                      display: 'block',
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#dc2626',
                    }}
                  >
                    {errors.location}
                  </span>
                )}
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="description"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
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
                    padding: '1rem',
                    border: '1px solid #e5e5e5',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#171717',
                    backgroundColor: '#ffffff',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Address */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="address"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
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
                    padding: '1rem',
                    border: '1px solid #e5e5e5',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#171717',
                    backgroundColor: '#ffffff',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Opening Time & Closing Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label
                    htmlFor="openingTime"
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
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
                      padding: '1rem',
                      border: '1px solid #e5e5e5',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="closingTime"
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
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
                      padding: '1rem',
                      border: '1px solid #e5e5e5',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label
                    htmlFor="contactPhone"
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
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
                      padding: '1rem',
                      border: '1px solid #e5e5e5',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactEmail"
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
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
                      padding: '1rem',
                      border: '1px solid #e5e5e5',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
              </div>

              {/* Deity & Established Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label
                    htmlFor="deity"
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
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
                      padding: '1rem',
                      border: '1px solid #e5e5e5',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="establishedDate"
                    style={{
                      display: 'block',
                      marginBottom: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
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
                      padding: '1rem',
                      border: '1px solid #e5e5e5',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
              </div>

              {/* Capacity */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="capacity"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
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
                    padding: '1rem',
                    border: '1px solid #e5e5e5',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#171717',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              {/* Parent Temple */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="parentTempleId"
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
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
                    padding: '1rem',
                    border: '1px solid #e5e5e5',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#171717',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="">None (Parent Temple)</option>
                  {parentTemples.map((temple) => (
                    <option key={temple.id} value={temple.id}>
                      {temple.name} {temple.id === mainTemple?.id ? '(Main Temple)' : ''}
                    </option>
                  ))}
                </select>
                {mainTemple && (
                  <p
                    style={{
                      marginTop: '0.5rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '14px',
                      color: '#67461b',
                      fontStyle: 'italic',
                    }}
                  >
                    💡 Tip: New temples are automatically set as child temples of the main temple.
                  </p>
                )}
                <p
                  style={{
                    marginTop: '0.5rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#737373',
                  }}
                >
                  Leave empty if this is a parent temple, or select a parent temple if this is a child temple.
                </p>
                {!formData.parentTempleId && parentTemples.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        marginBottom: '0.75rem',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#171717',
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
                        padding: '1rem',
                        border: '1px solid #e5e5e5',
                        fontFamily: 'var(--font-inter), system-ui, sans-serif',
                        fontSize: '16px',
                        color: '#171717',
                        backgroundColor: '#ffffff',
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
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '0.75rem',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#171717',
                  }}
                >
                  Status
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
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
                      gap: '0.75rem',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
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
              <div style={{ marginBottom: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e5e5e5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-noto-serif), serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
                    }}
                  >
                    Custom Fields
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomField(!showAddCustomField)}
                    className="rounded-2xl"
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#fafafa',
                      color: '#c2410c',
                      border: '1px solid #c2410c',
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
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
                    padding: '1rem', 
                    marginBottom: '1rem',
                                border: '1px solid #e5e5e5',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'stretch' }}>
                      <div style={{ display: 'flex', alignItems: 'stretch' }}>
                        <input
                          type="text"
                          placeholder="Field Label (e.g., Special Notes, Festival Dates)"
                          value={newCustomField.label}
                          onChange={(e) => setNewCustomField({ ...newCustomField, label: e.target.value })}
                          className="rounded-2xl"
                          style={{
                            width: '100%',
                            padding: '0 1rem',
                            border: '1px solid #e5e5e5',
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                            backgroundColor: '#ffffff',
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
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingLeft: '1rem',
                            paddingRight: '40px',
                            border: '1px solid #e5e5e5',
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
                            backgroundColor: '#ffffff',
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
                            right: '1rem',
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
                              color: '#737373',
                            }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'stretch' }}>
                        <button
                          type="button"
                          onClick={addCustomField}
                          className="rounded-2xl"
                          style={{
                            padding: '0 1rem',
                            backgroundColor: '#67461b',
                            color: '#ffffff',
                            border: 'none',
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
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
                            padding: '0 1rem',
                            backgroundColor: '#ffffff',
                            color: '#171717',
                            border: '1px solid #e5e5e5',
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
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
                  <div key={field.id} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <label
                        style={{
                          flex: 1,
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          fontWeight: 600,
                          color: '#171717',
                        }}
                      >
                        {field.label}
                      </label>
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        className="rounded-3xl"
                        style={{
                          padding: '0.5rem',
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
                          padding: '1rem',
                          border: '1px solid #e5e5e5',
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
                          backgroundColor: '#ffffff',
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
                          padding: '1rem',
                          border: '1px solid #e5e5e5',
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
                          backgroundColor: '#ffffff',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-2xl"
                  style={{
                    padding: `${'1rem'} ${'1.5rem'}`,
                    border: '1px solid #e5e5e5',
                    backgroundColor: '#ffffff',
                    color: '#171717',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
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
                    padding: `${'1rem'} ${'1.5rem'}`,
                    backgroundColor: isSubmitting ? '#737373' : '#c2410c',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
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
            padding: '1.5rem',
          }}
          onClick={() => {
            setShowChildDetailModal(false);
            setSelectedChildTemple(null);
          }}
        >
          <div
            className="rounded-3xl overflow-y-auto transition-all"
            style={{
              backgroundColor: '#ffffff',
              padding: '2rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-noto-serif), serif',
                  fontSize: '20px',
                  fontWeight: '500',
                  color: '#171717',
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
                  color: '#737373',
                  cursor: 'pointer',
                  padding: '0.5rem',
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
                  marginBottom: '1.5rem',
                  backgroundColor: '#fafafa',
                  position: 'relative',
                  aspectRatio: '16/9',
                  maxHeight: '280px',
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
                    top: '1rem',
                    left: '1rem',
                    padding: `${'0.5rem'} ${'0.75rem'}`,
                    borderRadius: '8px',
                    backgroundColor: selectedChildTemple.status === 'active' ? '#a87738' : '#dc2626',
                    color: '#ffffff',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
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
                    top: '1rem',
                    right: '1rem',
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
                      backgroundColor: '#67461b',
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
                  marginBottom: '1.5rem',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '400px',
                  border: '2px dashed #e5e5e5',
                  position: 'relative',
                }}
                onClick={() => {
                  document.getElementById(`child-image-modal-${selectedChildTemple.id}`)?.click();
                }}
              >
                <div style={{ textAlign: 'center', color: '#737373' }}>
                  <div style={{ fontSize: '48px', marginBottom: '0.75rem' }}>📷</div>
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
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: '#171717',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {selectedChildTemple.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#737373',
                      marginBottom: '0.5rem',
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
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    color: '#404040',
                    marginBottom: '1rem',
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
                    gap: '1rem',
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                  }}
                >
                  {/* Opening Time */}
                  {selectedChildTemple.openingTime && (
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Opening Time
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
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
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Closing Time
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
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
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Capacity
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
                        }}
                      >
                        {selectedChildTemple.capacity} / {selectedChildTemple.capacity} available
                      </div>
                    </div>
                  )}

                  {/* Deity */}
                  {selectedChildTemple.deity && (
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Deity
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
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
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Phone
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
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
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#737373',
                          marginBottom: '0.5rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        Email
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-inter), system-ui, sans-serif',
                          fontSize: '16px',
                          color: '#171717',
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
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#737373',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Address
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '16px',
                      color: '#171717',
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
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                    borderRadius: '12px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#737373',
                      marginBottom: '0.75rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Additional Information
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.75rem',
                    }}
                  >
                    {Object.entries(selectedChildTemple.customFields).map(([key, value]) => (
                      <div key={key}>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#737373',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {key}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-inter), system-ui, sans-serif',
                            fontSize: '16px',
                            color: '#171717',
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
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                <button
                  onClick={() => router.push(`/operations/temple-management/temple-details?templeId=${selectedChildTemple.id}`)}
                  className="rounded-xl hover:opacity-90 active:scale-95 transition-all"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#67461b',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
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
                  className="rounded-xl hover:opacity-90 active:scale-95 transition-all"
                  style={{
                    flex: 1,
                    padding: '1rem',
                    backgroundColor: '#fafafa',
                    color: '#c2410c',
                    border: '1px solid #c2410c',
                    fontFamily: 'var(--font-inter), system-ui, sans-serif',
                    fontSize: '16px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fafafa';
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

export default function AddTemplePage() {
  return (
    <Suspense fallback={
      <ModuleLayout
        title="Add Temple"
        description="Add a new temple to the system"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ModuleLayout>
    }>
      <AddTempleContent />
    </Suspense>
  );
}
