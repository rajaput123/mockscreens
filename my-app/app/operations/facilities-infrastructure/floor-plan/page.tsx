'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllRooms,
  getAllBookings,
  getBookingsByRoom,
  Room,
} from '../facilitiesData';
import BuildingFloorPlan from '../components/BuildingFloorPlan';
import RoomCard from '../components/RoomCard';

export default function FloorPlanPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRooms = getAllRooms();
    setRooms(allRooms);
  };

  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort();

  return (
    <ModuleLayout
      title="Building Floor Plan"
      description="Interactive floor plan visualization of all facilities"
    >
      {/* Floor Selector */}
      {floors.length > 1 && (
        <div className="mb-6 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Select Floor:</label>
            <select
              value={selectedFloor ?? 'all'}
              onChange={(e) => setSelectedFloor(e.target.value === 'all' ? undefined : parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Floors</option>
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  Floor {floor}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Floor Plan */}
      <div className="mb-6">
        <BuildingFloorPlan
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomClick={setSelectedRoom}
          floor={selectedFloor}
        />
      </div>

      {/* Selected Room Details */}
      {selectedRoom && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{selectedRoom.name}</h3>
            <button
              onClick={() => setSelectedRoom(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Room Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-900 capitalize">{selectedRoom.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Building:</span>
                    <span className="font-semibold text-gray-900">{selectedRoom.building}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Floor:</span>
                    <span className="font-semibold text-gray-900">{selectedRoom.floor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold capitalize ${
                      selectedRoom.status === 'available' ? 'text-amber-600' :
                      selectedRoom.status === 'occupied' ? 'text-red-600' :
                      selectedRoom.status === 'maintenance' ? 'text-amber-600' : 'text-amber-600'
                    }`}>
                      {selectedRoom.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Capacity Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Occupancy:</span>
                    <span className="font-semibold text-gray-900">{selectedRoom.currentOccupancy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Maximum Capacity:</span>
                    <span className="font-semibold text-gray-900">{selectedRoom.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedRoom.capacity - selectedRoom.currentOccupancy}
                    </span>
                  </div>
                  {selectedRoom.pricePerNight && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Night:</span>
                      <span className="font-semibold text-gray-900">₹{selectedRoom.pricePerNight}</span>
                    </div>
                  )}
                </div>
              </div>
              {selectedRoom.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRoom.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Active Bookings */}
          {getBookingsByRoom(selectedRoom.id).length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Active Bookings</h4>
              <div className="space-y-2">
                {getBookingsByRoom(selectedRoom.id)
                  .filter(b => b.status === 'confirmed' || b.status === 'checked-in')
                  .map((booking) => (
                    <div key={booking.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-gray-900">{booking.guestName}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          booking.status === 'checked-in' ? 'bg-amber-100 text-amber-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Room Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {rooms.slice(0, 12).map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedRoom?.id === room.id ? 'ring-2 ring-amber-500' : ''
            }`}
          >
            <RoomCard room={room} size="small" />
          </div>
        ))}
      </div>

      <HelpButton module="facilities-infrastructure" />
    </ModuleLayout>
  );
}

