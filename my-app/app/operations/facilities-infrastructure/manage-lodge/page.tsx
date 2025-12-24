'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllRooms,
  getAllBookings,
  getBookingsByRoom,
  saveRoom,
  saveBooking,
  Room,
  Booking,
} from '../facilitiesData';
import BuildingFloorPlan from '../components/BuildingFloorPlan';
import BookingDragDrop from '../components/BookingDragDrop';
import RoomCard from '../components/RoomCard';

export default function ManageLodgePage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | undefined>(undefined);
  const [viewType, setViewType] = useState<'floorplan' | 'booking' | 'list'>('floorplan');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRooms = getAllRooms().filter(r => r.type === 'lodge');
    const allBookings = getAllBookings();
    setRooms(allRooms);
    setBookings(allBookings);
  };

  const availableRooms = rooms.filter(r => r.status === 'available');
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const reservedRooms = rooms.filter(r => r.status === 'reserved');

  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort();

  const handleBookingCreated = (booking: Booking) => {
    // Update room status
    if (booking.roomId) {
      const room = rooms.find(r => r.id === booking.roomId);
      if (room) {
        const updatedRoom: Room = {
          ...room,
          status: 'reserved',
          currentOccupancy: booking.numberOfGuests,
        };
        saveRoom(updatedRoom);
        loadData();
      }
    }
  };

  return (
    <ModuleLayout
      title="Manage Lodge"
      description="Book and manage lodge rooms with drag-and-drop interface"
    >
      {/* View Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="flex gap-1 p-2">
          <button
            onClick={() => setViewType('floorplan')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              viewType === 'floorplan'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Floor Plan
          </button>
          <button
            onClick={() => setViewType('booking')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              viewType === 'booking'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Book Room
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              viewType === 'list'
                ? 'bg-amber-100 text-amber-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Room List
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-amber-600">{availableRooms.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Occupied</div>
          <div className="text-2xl font-bold text-red-600">{occupiedRooms.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Reserved</div>
          <div className="text-2xl font-bold text-amber-600">{reservedRooms.length}</div>
        </div>
      </div>

      {/* Floor Plan View */}
      {viewType === 'floorplan' && (
        <div className="mb-6">
          <BuildingFloorPlan
            rooms={rooms}
            selectedRoom={selectedRoom}
            onRoomClick={setSelectedRoom}
            floor={selectedFloor}
          />
        </div>
      )}

      {/* Booking View */}
      {viewType === 'booking' && (
        <div className="mb-6">
          <BookingDragDrop
            rooms={rooms}
            onBookingCreated={handleBookingCreated}
          />
        </div>
      )}

      {/* List View */}
      {viewType === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Lodge Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => {
              const roomBookings = getBookingsByRoom(room.id);
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedRoom?.id === room.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900">{room.name}</div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      room.status === 'available' ? 'bg-amber-100 text-amber-700' :
                      room.status === 'occupied' ? 'bg-red-100 text-red-700' :
                      room.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Floor {room.floor} • {room.building}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Capacity: {room.capacity} • Occupied: {room.currentOccupancy}
                  </div>
                  {room.pricePerNight && (
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{room.pricePerNight}/night
                    </div>
                  )}
                  {roomBookings.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {roomBookings.length} active booking(s)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Room Information</h4>
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
                {selectedRoom.pricePerNight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price per Night:</span>
                    <span className="font-semibold text-gray-900">₹{selectedRoom.pricePerNight}</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Amenities</h4>
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
                          <div className="text-sm text-gray-600">
                            {booking.numberOfGuests} guest(s)
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

      <HelpButton module="facilities-infrastructure" />
    </ModuleLayout>
  );
}

