'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { getTempleById, getChildTemples, getAllTemples, type Temple } from '../templeData';

function TempleDetailsContent() {
  const searchParams = useSearchParams();
  const templeId = searchParams ? searchParams.get('templeId') || '1' : '1';
  
  const [temple, setTemple] = useState<Temple | null>(null);
  const [childTemples, setChildTemples] = useState<Temple[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Always reload from getAllTemples to get latest localStorage images
    const allTemples = getAllTemples();
    const currentTemple = allTemples.find(t => t.id === templeId);
    if (currentTemple) {
      setTemple(currentTemple);
      const children = currentTemple.type === 'parent' && currentTemple.childTemples
        ? currentTemple.childTemples.map(id => allTemples.find(t => t.id === id)).filter(Boolean) as Temple[]
        : [];
      setChildTemples(children);
    }
  }, [templeId, refreshKey]);

  if (!temple) {
    return (
      <ModuleLayout title="Temple Not Found" description="The requested temple could not be found">
        <div className="px-6 py-8 text-center text-gray-600 font-sans">
          Temple with ID {templeId} not found.
        </div>
      </ModuleLayout>
    );
  }

  const isMainTemple = temple.type === 'parent';

  const handleImageUpload = (templeId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64String = reader.result as string;
          const storageKey = `temple-image-${templeId}`;
          localStorage.setItem(storageKey, base64String);
          
          // Reload temple data from getAllTemples to ensure we get the latest image
          const allTemples = getAllTemples();
          const updatedTemple = allTemples.find(t => t.id === templeId);
          if (updatedTemple) {
            setTemple(updatedTemple);
            
            // Refresh child temples if this is a parent temple
            if (updatedTemple.type === 'parent' && updatedTemple.childTemples) {
              const children = updatedTemple.childTemples
                .map(id => allTemples.find(t => t.id === id))
                .filter(Boolean) as Temple[];
              setChildTemples(children);
            }
          }
          
          // Trigger refresh to update UI
          setRefreshKey(prev => prev + 1);
          
          // Reset file input to allow same file upload again
          e.target.value = '';
        }
      };
      reader.onerror = () => {
        alert('Error reading image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ModuleLayout
      title={temple.deity || temple.name}
      description={`Temple Details - ${temple.location}`}
    >
      {/* Breadcrumb for Child Temples */}
      {!isMainTemple && temple.parentTempleName && (
        <div className="mb-6">
          <Link
            href={`/operations/temple-management/temple-details?templeId=${temple.parentTempleId}`}
            className="font-sans text-base text-amber-600 hover:text-amber-700 hover:underline transition-colors"
          >
            ← Back to {temple.parentTempleName}
          </Link>
        </div>
      )}

      {/* Temple Image and Information Card */}
      <div className={`bg-white border rounded-3xl overflow-hidden mb-8 shadow-sm ${
        isMainTemple ? 'border-2 border-amber-600 bg-amber-50' : 'border border-gray-200'
      }`}>
        {/* Temple Image */}
        <div className="w-full aspect-video max-h-[500px] bg-gray-100 relative">
          <img
            key={`temple-img-${temple.id}-${temple.image?.substring(0, 50)}`}
            src={temple.image || '/placeholder-temple.jpg'}
            alt={temple.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-temple.jpg';
            }}
          />
          <label className="absolute top-2 right-2 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200 hover:scale-110 z-10" title="Replace image">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(temple.id, e)}
              className="hidden"
            />
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
            </svg>
          </label>
        </div>

        {/* Temple Information */}
        <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="font-serif text-xl font-medium text-gray-900">
                Temple Information
              </h2>
              {isMainTemple && (
                <span className="bg-amber-600 text-white px-3 py-1 rounded-xl text-sm font-semibold font-sans">
                  Main Temple
                </span>
              )}
            </div>
            <div className="mb-4">
              <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                Name:
              </span>
              <span className="font-sans text-base text-gray-900 ml-2">
                {temple.name}
              </span>
            </div>
            <div className="mb-4">
              <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                Location:
              </span>
              <span className="font-sans text-base text-gray-900 ml-2">
                {temple.location}
              </span>
            </div>
            <div className="mb-4">
              <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                Type:
              </span>
              <span className={`inline-block px-2 py-1 rounded-xl text-sm font-sans ml-2 ${
                temple.type === 'parent' ? 'text-amber-600' : 'text-gray-600'
              }`}>
                {temple.type === 'parent' ? 'Parent Temple' : 'Child Temple'}
              </span>
            </div>
            {temple.parentTempleName && (
              <div className="mb-4">
                <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                  Parent Temple:
                </span>
                <span className="font-sans text-base text-amber-600 ml-2">
                  {temple.parentTempleName}
                </span>
              </div>
            )}
            <div className="mb-4">
              <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                Status:
              </span>
              <span className={`inline-block px-2 py-1 rounded-xl text-sm font-sans ml-2 ${
                temple.status === 'active' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
              }`}>
                {temple.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            {temple.description && (
              <div className="mt-4">
                <p className="font-sans text-base text-gray-600 leading-relaxed">
                  {temple.description}
                </p>
              </div>
            )}
            {temple.address && (
              <div className="mt-4">
                <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                  Address:
                </span>
                <span className="font-sans text-base text-gray-900 ml-2">
                  {temple.address}
                </span>
              </div>
            )}
            {temple.contactPhone && (
              <div className="mt-4">
                <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                  Phone:
                </span>
                <span className="font-sans text-base text-gray-900 ml-2">
                  {temple.contactPhone}
                </span>
              </div>
            )}
            {temple.openingTime && temple.closingTime && (
              <div className="mt-4">
                <span className="inline-block w-30 font-sans text-base font-semibold text-gray-600">
                  Timings:
                </span>
                <span className="font-sans text-base text-gray-900 ml-2">
                  {temple.openingTime} - {temple.closingTime}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            <h2 className="font-serif text-xl font-medium mb-4 text-gray-900">
              Actions
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                href={`/operations/temple-management/add-temple?templeId=${temple.id}`}
                className="bg-amber-600 text-white px-4 py-3 rounded-2xl text-center font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
              >
                Edit Temple
              </Link>
              {temple.type === 'parent' && (
                <Link
                  href={`/operations/temple-management/manage-hierarchy?templeId=${temple.id}`}
                  className="border border-amber-600 text-amber-600 px-4 py-3 rounded-2xl text-center font-sans text-base font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline"
                >
                  Manage Hierarchy
                </Link>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Child Temples (if main temple) */}
      {isMainTemple && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl font-medium text-gray-900">
              Child Temples ({childTemples.length})
            </h2>
            <Link
              href="/operations/temple-management/add-temple"
              className="bg-amber-600 text-white px-4 py-2 rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
            >
              Add Child Temple
            </Link>
          </div>
          {childTemples.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {childTemples.map((child) => (
                <Link
                  key={child.id}
                  href={`/operations/temple-management/temple-details?templeId=${child.id}`}
                  className="border border-gray-200 rounded-2xl overflow-hidden no-underline transition-all hover:border-amber-600 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="w-full aspect-video max-h-[250px] bg-gray-100 relative mb-4 rounded-2xl overflow-hidden">
                    <img
                      key={`child-img-${child.id}-${child.image?.substring(0, 50)}`}
                      src={child.image || '/placeholder-temple.jpg'}
                      alt={child.deity || child.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-temple.jpg';
                      }}
                    />
                    <label className="absolute top-1 right-1 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1.5 shadow-md">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(child.id, e)}
                        className="hidden"
                      />
                      <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
                      </svg>
                    </label>
                  </div>
                  <div className="px-4 pb-4">
                    <div className="font-sans text-lg font-semibold text-amber-600 mb-1">
                      {child.deity || child.name}
                    </div>
                    <div className="font-sans text-sm text-gray-600 mb-2">
                      {child.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-lg text-xs font-sans ${
                        child.status === 'active'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {child.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center font-sans text-base text-gray-600">
              <p className="mb-4">No child temples added yet.</p>
              <Link
                href="/operations/temple-management/add-temple"
                className="inline-block bg-amber-600 text-white px-6 py-3 rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
              >
                Add First Child Temple
              </Link>
            </div>
          )}
        </div>
      )}
    </ModuleLayout>
  );
}

export default function TempleDetailsPage() {
  return (
    <Suspense fallback={
      <ModuleLayout
        title="Temple Details"
        description="View temple details and information"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ModuleLayout>
    }>
      <TempleDetailsContent />
    </Suspense>
  );
}
