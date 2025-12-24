'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllRooms,
  getAllParkingSlots,
  Room,
  ParkingSlot,
} from '../facilitiesData';
import ResourceAllocationGraph from '../components/ResourceAllocationGraph';

export default function ResourceNetworkPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [selectedResource, setSelectedResource] = useState<Room | ParkingSlot | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRooms = getAllRooms();
    const allParkingSlots = getAllParkingSlots();
    setRooms(allRooms);
    setParkingSlots(allParkingSlots);
  };

  const totalRooms = rooms.length;
  const totalParking = parkingSlots.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const availableParking = parkingSlots.filter(p => p.status === 'available').length;

  return (
    <ModuleLayout
      title="Resource Allocation Network"
      description="Interactive network visualization of rooms and parking across facilities"
    >
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Rooms</div>
          <div className="text-2xl font-bold text-amber-600">{totalRooms}</div>
          <div className="text-xs text-gray-500 mt-1">{availableRooms} available</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Total Parking</div>
          <div className="text-2xl font-bold text-amber-600">{totalParking}</div>
          <div className="text-xs text-gray-500 mt-1">{availableParking} available</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Occupied Rooms</div>
          <div className="text-2xl font-bold text-red-600">{rooms.filter(r => r.status === 'occupied').length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Occupied Parking</div>
          <div className="text-2xl font-bold text-red-600">{parkingSlots.filter(p => p.status === 'occupied').length}</div>
        </div>
      </div>

      {/* Network Graph */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Resource Allocation Network</h3>
          <p className="text-sm text-gray-600">Click on nodes to view details. Nodes are grouped by category.</p>
        </div>
        <div className="h-[600px]">
          <ResourceAllocationGraph
            rooms={rooms}
            parkingSlots={parkingSlots}
            onNodeClick={setSelectedResource}
            width={1200}
            height={600}
          />
        </div>
      </div>

      {/* Selected Resource Details */}
      {selectedResource && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {'capacity' in selectedResource ? selectedResource.name : selectedResource.slotNumber}
            </h3>
            <button
              onClick={() => setSelectedResource(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {'capacity' in selectedResource ? (
              // Room details
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Room Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-900 capitalize">{selectedResource.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building:</span>
                      <span className="font-semibold text-gray-900">{selectedResource.building}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Floor:</span>
                      <span className="font-semibold text-gray-900">{selectedResource.floor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold capitalize ${
                        selectedResource.status === 'available' ? 'text-amber-600' :
                        selectedResource.status === 'occupied' ? 'text-red-600' :
                        selectedResource.status === 'maintenance' ? 'text-amber-600' : 'text-amber-600'
                      }`}>
                        {selectedResource.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Capacity</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-semibold text-gray-900">{selectedResource.currentOccupancy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Maximum:</span>
                      <span className="font-semibold text-gray-900">{selectedResource.capacity}</span>
                    </div>
                    {selectedResource.pricePerNight && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price/Night:</span>
                        <span className="font-semibold text-gray-900">₹{selectedResource.pricePerNight}</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Parking slot details
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Parking Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Slot Number:</span>
                      <span className="font-semibold text-gray-900">{selectedResource.slotNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold text-gray-900">{selectedResource.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-900 capitalize">{selectedResource.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold capitalize ${
                        selectedResource.status === 'available' ? 'text-amber-600' :
                        selectedResource.status === 'occupied' ? 'text-red-600' :
                        selectedResource.status === 'reserved' ? 'text-amber-600' : 'text-amber-600'
                      }`}>
                        {selectedResource.status}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Resource Summary by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Rooms by Type</h4>
          <div className="space-y-2">
            {['lodge', 'hall', 'office', 'storage', 'other'].map((type) => {
              const typeRooms = rooms.filter(r => r.type === type);
              if (typeRooms.length === 0) return null;
              return (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">{type}:</span>
                  <span className="font-semibold text-gray-900">
                    {typeRooms.length} rooms
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Parking by Location</h4>
          <div className="space-y-2">
            {Array.from(new Set(parkingSlots.map(s => s.location))).map((location) => {
              const locationSlots = parkingSlots.filter(s => s.location === location);
              return (
                <div key={location} className="flex justify-between text-sm">
                  <span className="text-gray-600">{location}:</span>
                  <span className="font-semibold text-gray-900">
                    {locationSlots.length} slots
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <HelpButton module="facilities-infrastructure" />
    </ModuleLayout>
  );
}

