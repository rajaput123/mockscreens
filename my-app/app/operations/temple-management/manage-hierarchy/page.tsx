'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { getAllTemples, getParentTemples, type Temple } from '../templeData';

function ManageHierarchyContent() {
  const searchParams = useSearchParams();
  const templeId = searchParams?.get('templeId');

  const [allTemples, setAllTemples] = useState<Temple[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectedChildren, setSelectedChildren] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load temples once on mount
  useEffect(() => {
    const temples = getAllTemples();
    setAllTemples(temples);
  }, []);

  // Memoize parent temples and main temple
  const parentTemples = useMemo(() => {
    return allTemples.filter(t => t.type === 'parent');
  }, [allTemples]);

  const mainTemple = useMemo(() => {
    return parentTemples[0] || null;
  }, [parentTemples]);

  // Available children: all temples except the main temple itself
  const availableChildren = useMemo(() => {
    return allTemples.filter(t => t.id !== selectedParent && t.type === 'child');
  }, [allTemples, selectedParent]);

  // Initialize selected parent and children only once
  useEffect(() => {
    if (isInitialized || allTemples.length === 0) return;

    let initialParent = '';
    
    if (templeId) {
      initialParent = templeId;
      // Load existing children for this temple
      const temple = allTemples.find(t => t.id === templeId);
      if (temple?.childTemples) {
        setSelectedChildren(new Set(temple.childTemples));
      }
    } else if (mainTemple) {
      initialParent = mainTemple.id;
      // Load existing children for main temple
      if (mainTemple.childTemples) {
        setSelectedChildren(new Set(mainTemple.childTemples));
      }
    }

    if (initialParent) {
      setSelectedParent(initialParent);
    }
    
    setIsInitialized(true);
  }, [templeId, mainTemple, allTemples, isInitialized]);

  const toggleChild = (childId: string) => {
    const newSelected = new Set(selectedChildren);
    if (newSelected.has(childId)) {
      newSelected.delete(childId);
    } else {
      newSelected.add(childId);
    }
    setSelectedChildren(newSelected);
  };

  const handleSave = async () => {
    if (!selectedParent) {
      alert('Please select a parent temple');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    alert('Hierarchy updated successfully!');
  };

  return (
    <ModuleLayout
      title="Manage Temple Hierarchy"
      description="Assign child temples to parent temples"
    >
      <div className="bg-white border border-gray-200 rounded-3xl p-6 max-w-4xl shadow-sm">
        <h2 className="font-serif text-xl font-medium mb-6 text-gray-900">
          Assign Child Temples
        </h2>

        {/* Main Temple Display */}
        {mainTemple && (
          <div className="mb-8 bg-amber-50 border-2 border-amber-600 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-xl text-sm font-semibold font-sans">
                    Main Temple
                  </span>
                  <span className="font-sans text-base font-semibold text-gray-900">
                    {mainTemple.deity || mainTemple.name}
                  </span>
                </div>
                <p className="font-sans text-sm text-gray-600">
                  {mainTemple.location}
                </p>
              </div>
              <Link
                href={`/operations/temple-management/temple-details?templeId=${mainTemple.id}`}
                className="text-amber-600 hover:text-amber-700 font-sans text-sm font-medium underline"
              >
                View Details
              </Link>
            </div>
          </div>
        )}

        {/* Parent Temple Selector (if multiple parents exist) */}
        {parentTemples.length > 1 && (
          <div className="mb-8">
            <label
              htmlFor="parentTemple"
              className="block mb-2 font-sans text-base font-semibold text-gray-900"
            >
              Select Parent Temple <span className="text-red-600">*</span>
            </label>
            <select
              id="parentTemple"
              value={selectedParent}
              onChange={(e) => {
                setSelectedParent(e.target.value);
                setSelectedChildren(new Set());
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl font-sans text-base text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all"
            >
              {parentTemples.map((temple) => (
                <option key={temple.id} value={temple.id}>
                  {temple.name} - {temple.location}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Child Temples Selection */}
        {selectedParent && (
          <>
            <div className="mb-6">
              <h3 className="font-serif text-base font-semibold mb-2 text-gray-900">
                Select Child Temples
              </h3>
              <p className="font-sans text-base text-gray-600 mb-4">
                Select the temples that should be child temples of "{parentTemples.find(t => t.id === selectedParent)?.name}".
              </p>

              <div className="border border-gray-200 rounded-2xl p-4 max-h-96 overflow-y-auto grid grid-cols-1 gap-2">
                {availableChildren.length > 0 ? (
                  availableChildren.map((temple) => (
                    <label
                      key={temple.id}
                      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors w-full"
                    >
                      <input
                        type="checkbox"
                        checked={selectedChildren.has(temple.id)}
                        onChange={() => toggleChild(temple.id)}
                        className="cursor-pointer w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-600"
                      />
                      <div className="flex-1">
                        <div className="font-sans text-base font-medium text-gray-900">
                          {temple.name}
                        </div>
                        <div className="font-sans text-base text-gray-600">
                          {temple.location}
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center font-sans text-base text-gray-600">
                    No available temples to assign as children.
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {selectedChildren.size > 0 && (
              <div className="mb-8 p-4 border border-gray-200 rounded-2xl">
                <h3 className="font-serif text-base font-semibold mb-4 text-gray-900">
                  Preview
                </h3>
                <div className="font-sans text-base text-gray-900 mb-2">
                  <strong>{parentTemples.find(t => t.id === selectedParent)?.name}</strong> will have {selectedChildren.size} child temple(s):
                </div>
                <ul className="ml-6 text-gray-600 list-disc">
                  {Array.from(selectedChildren).map((childId) => {
                    const child = allTemples.find(t => t.id === childId);
                    return child ? (
                      <li key={childId} className="mb-1">
                        {child.name} - {child.location}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}

            {/* Save Button */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-6 py-3 rounded-2xl text-white font-sans text-base font-medium transition-all duration-200 ${
                  isSaving
                    ? 'bg-gray-400 cursor-not-allowed opacity-60'
                    : 'bg-amber-600 hover:bg-amber-700 cursor-pointer shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95'
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Hierarchy'}
              </button>
            </div>
          </>
        )}

        {!selectedParent && (
          <div className="px-6 py-8 text-center font-sans text-base text-gray-600">
            Please select a parent temple to begin managing its hierarchy.
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}

export default function ManageHierarchyPage() {
  return (
    <Suspense fallback={
      <ModuleLayout
        title="Manage Hierarchy"
        description="Manage temple hierarchy and relationships"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </ModuleLayout>
    }>
      <ManageHierarchyContent />
    </Suspense>
  );
}
