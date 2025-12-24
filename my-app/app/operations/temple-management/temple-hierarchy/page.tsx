'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { getParentTemples, getChildTemples, getTempleById, getAllTemples, type Temple } from '../templeData';

interface TempleNode extends Temple {
  children?: TempleNode[];
}

export default function TempleHierarchyPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1']));
  const [showAllChildren, setShowAllChildren] = useState(true);

  // Build hierarchical data - only 1 main temple
  const templeHierarchy: TempleNode[] = useMemo(() => {
    const parents = getParentTemples();
    return parents.map(parent => {
      const children = getChildTemples(parent.id);
      return {
        ...parent,
        children: children.length > 0 ? children : undefined,
      };
    });
  }, []);

  const mainTemple = templeHierarchy[0];
  const [allTemples, setAllTemples] = useState<Temple[]>([]);
  const allChildren = mainTemple ? allTemples.filter(t => t.parentTempleId === mainTemple.id) : [];

  useEffect(() => {
    setAllTemples(getAllTemples());
  }, []);

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
          
          // Update temples immediately - getAllTemples will read from localStorage
          const updated = getAllTemples();
          setAllTemples(updated);
          
          // Reset file input
          e.target.value = '';
        }
      };
      reader.onerror = () => {
        alert('Error reading image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: TempleNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="mb-4" style={{ marginLeft: `${level * 3}rem` }}>
        <div
          className={`flex items-center gap-3 p-4 border border-gray-200 rounded-2xl transition-all ${
            hasChildren ? 'cursor-pointer hover:bg-gray-50' : ''
          }`}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {hasChildren && (
            <span className="font-sans text-base text-amber-600 w-5 inline-block">
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          {!hasChildren && <span className="w-5 inline-block" />}
          
          {/* Temple Image */}
          <div className="w-15 h-15 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={node.image}
              alt={node.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-sans text-base font-semibold text-gray-900">
                {node.name}
              </span>
              <span className={`inline-block px-2 py-1 rounded-xl text-xs font-sans font-medium ${
                node.type === 'parent' 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {node.type === 'parent' ? 'Parent' : 'Child'}
              </span>
            </div>
            <div className="font-sans text-base text-gray-600 mt-1">
              {node.location}
            </div>
            {node.deity && (
              <div className="font-sans text-xs text-gray-600 mt-1">
                Deity: {node.deity}
              </div>
            )}
          </div>
          
          <Link
            href={`/operations/temple-management/temple-details?templeId=${node.id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-amber-600 text-white px-4 py-2 rounded-xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
          >
            View Details
          </Link>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-3">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ModuleLayout
      title="Temple Hierarchy View"
      description="Visual tree structure showing temple parent-child relationships"
    >
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Temple Hierarchy Tree
            </h2>
            <p className="text-sm text-gray-600">
              Visual organizational chart showing the relationship structure between main and child temples
            </p>
          </div>
          <Link
            href="/operations/temple-management/manage-hierarchy"
            className="bg-amber-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-amber-700 transition-all duration-200 shadow-sm hover:shadow-md no-underline"
          >
            Manage Hierarchy
          </Link>
        </div>

        {mainTemple ? (
          <div className="relative">
            {/* Visual Tree Structure */}
            <div className="flex flex-col items-center">
              {/* Main Temple - Top Level */}
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-lg border-2 border-amber-700 min-w-[300px]">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white mb-4 shadow-md relative">
                      <img
                        src={mainTemple.image || '/placeholder-temple.jpg'}
                        alt={mainTemple.deity || mainTemple.name}
                        className="w-full h-full object-cover"
                      />
                      <label className="absolute top-1 right-1 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1.5 shadow-md">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(mainTemple.id, e)}
                          className="hidden"
                        />
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
                        </svg>
                      </label>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-lg mb-2">
                      <span className="text-white text-xs font-semibold">MAIN TEMPLE</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {mainTemple.deity || mainTemple.name}
                    </h3>
                    <p className="text-sm text-amber-100 mb-3">
                      {mainTemple.location}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        mainTemple.status === 'active'
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {mainTemple.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-white bg-opacity-20 text-white">
                        {allChildren.length} Children
                      </span>
                    </div>
                    <Link
                      href={`/operations/temple-management/temple-details?templeId=${mainTemple.id}`}
                      className="bg-white text-amber-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-all no-underline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Connecting Line */}
              {allChildren.length > 0 && (
                <div className="w-1 h-8 bg-gray-300 mb-4"></div>
              )}

              {/* Child Temples - Bottom Level */}
              {allChildren.length > 0 && (
                <div className="w-full">
                  <div className="flex justify-center mb-4">
                    <div className="bg-gray-200 h-1 w-full max-w-4xl"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {allChildren.map((child, index) => (
                      <div key={child.id} className="relative">
                        {/* Vertical line from top */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-gray-300"></div>
                        
                        {/* Child Temple Card */}
                        <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm hover:border-amber-400 hover:shadow-md transition-all mt-4">
                          <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mb-3 relative">
                              <img
                                src={child.image || '/placeholder-temple.jpg'}
                                alt={child.deity || child.name}
                                className="w-full h-full object-cover"
                                key={`hierarchy-child-${child.id}-${child.image?.substring(0, 20)}`}
                              />
                              <label className="absolute top-0.5 right-0.5 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1 shadow-md">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(child.id, e)}
                                  className="hidden"
                                />
                                <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
                                </svg>
                              </label>
                            </div>
                            <div className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600 mb-2">
                              CHILD TEMPLE
                            </div>
                            <h4 className="text-base font-semibold text-gray-900 mb-1">
                              {child.deity || child.name}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {child.location}
                            </p>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium mb-2 ${
                              child.status === 'active'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {child.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                            <Link
                              href={`/operations/temple-management/temple-details?templeId=${child.id}`}
                              className="text-amber-600 hover:text-amber-700 text-sm font-medium hover:underline transition-colors no-underline"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {allChildren.length === 0 && (
                <div className="mt-8 px-6 py-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <p className="text-gray-600 mb-4">No child temples in hierarchy</p>
                  <Link
                    href="/operations/temple-management/add-temple"
                    className="inline-block bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors no-underline"
                  >
                    Add Child Temple
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="px-6 py-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Main Temple Found</h3>
            <p className="text-gray-600 mb-6">Add a main temple to visualize the hierarchy structure</p>
            <Link
              href="/operations/temple-management/add-temple"
              className="inline-block bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors shadow-sm hover:shadow-md no-underline"
            >
              Add Main Temple
            </Link>
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}
