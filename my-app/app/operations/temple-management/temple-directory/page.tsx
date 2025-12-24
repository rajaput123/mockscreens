'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { getAllTemples, getParentTemples, getChildTemples, type Temple } from '../templeData';

type ViewMode = 'grid' | 'list' | 'table';
type SortOption = 'name-asc' | 'name-desc' | 'location-asc' | 'sevas-desc';

export default function TempleDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [viewFilter, setViewFilter] = useState<'all' | 'main' | 'children'>('all');

  const [allTemples, setAllTemples] = useState<Temple[]>([]);
  const mainTemples = allTemples.filter(t => t.type === 'parent');
  const mainTemple = mainTemples[0]; // There's only 1 main temple
  const allChildTemples = mainTemple ? allTemples.filter(t => t.parentTempleId === mainTemple.id) : [];

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
          
          // Update temples immediately with new image
          setAllTemples(prev => prev.map(t => 
            t.id === templeId ? { ...t, image: base64String } : t
          ));
          
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

  // Recalculate child temples when allTemples updates
  const allChildTemplesMemo = useMemo(() => {
    return mainTemple ? allTemples.filter(t => t.parentTempleId === mainTemple.id) : [];
  }, [mainTemple, allTemples]);

  // Filter and sort child temples
  const filteredAndSortedChildren = useMemo(() => {
    let filtered = allChildTemplesMemo.filter(child => {
      const matchesSearch = !searchTerm || 
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (child.deity && child.deity.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || child.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort child temples
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'location-asc':
          return a.location.localeCompare(b.location);
        case 'sevas-desc':
          return 0; // Capacity sorting removed
        default:
          return 0;
      }
    });

    return filtered;
  }, [allChildTemples, searchTerm, statusFilter, sortOption]);

  // Check if main temple matches search
  const mainTempleMatches = mainTemple && (
    !searchTerm ||
    mainTemple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mainTemple.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mainTemple.deity && mainTemple.deity.toLowerCase().includes(searchTerm.toLowerCase()))
  ) && (statusFilter === 'all' || mainTemple.status === statusFilter);

  return (
    <ModuleLayout
      title="Temple Directory"
      description="Comprehensive searchable directory of all temples with filters and multiple view options"
    >
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        <input
          type="text"
              placeholder="Search temples by name, location, or deity..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-2xl font-sans text-base focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 border border-gray-200 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
              }`}
              title="Grid View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
              }`}
              title="List View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:scale-105'
              }`}
              title="Table View"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 rounded-2xl font-sans text-base text-gray-900 focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="location-asc">Location</option>
          </select>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewFilter('all')}
            className={`px-4 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
              viewFilter === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            All Temples
          </button>
          <button
            onClick={() => setViewFilter('main')}
            className={`px-4 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
              viewFilter === 'main'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            Main Temple
          </button>
          <button
            onClick={() => setViewFilter('children')}
            className={`px-4 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
              viewFilter === 'children'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            Child Temples
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
              statusFilter === 'all'
                ? 'bg-gray-200 text-gray-900 shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
              statusFilter === 'active'
                ? 'bg-amber-100 text-amber-800 shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-1.5 rounded-xl font-sans text-sm transition-all duration-200 ${
              statusFilter === 'inactive'
                ? 'bg-red-100 text-red-800 shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Main Temple Featured Card */}
      {mainTemple && mainTempleMatches && (viewFilter === 'all' || viewFilter === 'main') && (
        <div className="mb-8 bg-amber-50 border-2 border-amber-600 rounded-3xl overflow-hidden shadow-lg">
          <div className="w-full aspect-video max-h-[400px] bg-gray-100 relative mb-6 rounded-3xl overflow-hidden">
            <img
              src={mainTemple.image || '/placeholder-temple.jpg'}
              alt={mainTemple.deity || mainTemple.name}
              className="w-full h-full object-cover"
            />
            <label className="absolute top-2 right-2 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-md">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(mainTemple.id, e)}
                className="hidden"
              />
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
              </svg>
            </label>
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-xl text-sm font-semibold font-sans">
                    Main Temple
                  </span>
                  <span className={`px-3 py-1 rounded-xl text-sm font-sans ${
                    mainTemple.status === 'active'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mainTemple.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-amber-600 mb-2">
                  {mainTemple.deity || mainTemple.name}
                </h2>
                <p className="font-sans text-base text-gray-600 mb-4">
                  {mainTemple.location}
                </p>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <span className="font-sans text-sm text-gray-600">Child Temples:</span>
                    <span className="font-sans text-base font-semibold text-amber-600 ml-2">
                      {allChildTemplesMemo.length}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/operations/temple-management/temple-details?templeId=${mainTemple.id}`}
                  className="bg-amber-600 text-white px-6 py-2 rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
                >
                  View Details
                </Link>
                <Link
                  href={`/operations/temple-management/add-temple?templeId=${mainTemple.id}`}
                  className="border-2 border-amber-600 text-amber-600 px-6 py-2 rounded-2xl font-sans text-base font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline"
                >
                  Edit Temple
                </Link>
                <Link
                  href="/operations/temple-management/manage-hierarchy"
                  className="border-2 border-amber-600 text-amber-600 px-6 py-2 rounded-2xl font-sans text-base font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline"
                >
                  Manage Hierarchy
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Child Temples Section */}
      {(viewFilter === 'all' || viewFilter === 'children') && (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-xl font-medium text-gray-900">
              Child Temples ({filteredAndSortedChildren.length})
            </h2>
            <Link
              href="/operations/temple-management/add-temple"
              className="bg-amber-600 text-white px-4 py-2 rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
            >
              Add Child Temple
            </Link>
          </div>

          {filteredAndSortedChildren.length > 0 ? (
            <>
              {/* Grid View */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAndSortedChildren.map((child) => (
                    <Link
                      key={child.id}
                      href={`/operations/temple-management/temple-details?templeId=${child.id}`}
                      className="border border-gray-200 rounded-2xl p-4 no-underline transition-all hover:border-amber-600 hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden mb-3 bg-gray-100 relative mx-auto">
                        <img
                          src={child.image}
                          alt={child.deity || child.name}
                          className="w-full h-full object-cover"
                        />
                        <label className="absolute top-1 right-1 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1 shadow-md">
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
                    </Link>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === 'list' && (
                <div className="space-y-3">
                  {filteredAndSortedChildren.map((child) => (
                    <Link
                      key={child.id}
                      href={`/operations/temple-management/temple-details?templeId=${child.id}`}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl no-underline transition-all hover:border-amber-600 hover:shadow-sm"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 relative">
                        <img
                          src={child.image}
                          alt={child.deity || child.name}
                          className="w-full h-full object-cover"
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
                      <div className="flex-1 min-w-0">
                        <div className="font-sans text-lg font-semibold text-amber-600 mb-1">
                          {child.deity || child.name}
                        </div>
                        <div className="font-sans text-sm text-gray-600">
                          {child.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-xl text-sm font-sans ${
                          child.status === 'active'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {child.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b-2 border-gray-200">
                        <th className="px-4 py-3 text-left font-serif text-xl font-medium text-gray-900">
                Deity
              </th>
                        <th className="px-4 py-3 text-left font-serif text-xl font-medium text-gray-900">
                Location
              </th>
                        <th className="px-4 py-3 text-left font-serif text-xl font-medium text-gray-900">
                Status
              </th>
                        <th className="px-4 py-3 text-left font-serif text-xl font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
                      {filteredAndSortedChildren.map((child) => (
                      <tr
                        key={child.id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 font-sans text-base text-gray-900">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                <img
                                  src={child.image}
                                  alt={child.deity || child.name}
                                  className="w-full h-full object-cover"
                                />
                                <label className="absolute top-0 right-0 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-0.5 shadow-sm">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(child.id, e)}
                                    className="hidden"
                                  />
                                  <svg className="w-2.5 h-2.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12m0 0l4-4m-4 4l-4 4" />
                                  </svg>
                                </label>
                              </div>
                              <span className="font-semibold text-amber-600">{child.deity || child.name}</span>
                            </div>
                        </td>
                          <td className="px-4 py-3 font-sans text-base text-gray-900">
                          {child.location}
                        </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-1 rounded-xl text-sm font-sans ${
                              child.status === 'active'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {child.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                          <td className="px-4 py-3">
                          <Link
                            href={`/operations/temple-management/temple-details?templeId=${child.id}`}
                              className="font-sans text-base text-amber-600 hover:text-amber-700 hover:underline transition-colors"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
              ))}
          </tbody>
        </table>
                </div>
              )}
            </>
          ) : (
            <div className="px-6 py-12 text-center font-sans text-base text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? `No child temples found matching your criteria.`
                : 'No child temples added yet. Add your first child temple to get started.'
              }
            </div>
          )}
        </div>
      )}

      {/* Empty State - No Main Temple */}
      {!mainTemple && (
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
          <div className="text-5xl mb-6">🏛️</div>
          <h3 className="font-serif text-xl font-medium mb-4 text-gray-900">
            No Main Temple Found
          </h3>
          <p className="font-sans text-base text-gray-600 mb-8">
            Please add a main temple to get started.
          </p>
          <Link
            href="/operations/temple-management/add-temple"
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
          >
            Add Main Temple
          </Link>
          </div>
        )}
    </ModuleLayout>
  );
}

