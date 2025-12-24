'use client';

import { useState, DragEvent } from 'react';
import { Room, getAllRooms, Booking, saveBooking } from '../facilitiesData';
import RoomCard from './RoomCard';

interface BookingDragDropProps {
  rooms: Room[];
  onBookingCreated?: (booking: Booking) => void;
}

export default function BookingDragDrop({ rooms, onBookingCreated }: BookingDragDropProps) {
  const [draggedGuest, setDraggedGuest] = useState<{ name: string; phone: string; guests: number } | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    email: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    numberOfGuests: 1,
    notes: '',
  });

  const availableRooms = rooms.filter(r => r.status === 'available' || r.status === 'reserved');

  const handleDragStart = (e: DragEvent) => {
    if (!guestForm.name || !guestForm.phone) {
      e.preventDefault();
      alert('Please fill in guest name and phone number');
      return;
    }
    
    setDraggedGuest({
      name: guestForm.name,
      phone: guestForm.phone,
      guests: guestForm.numberOfGuests,
    });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'guest-booking');
  };

  const handleDragOver = (e: DragEvent, roomId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setHoveredRoom(roomId);
  };

  const handleDrop = (e: DragEvent, room: Room) => {
    e.preventDefault();
    setHoveredRoom(null);

    if (room.status !== 'available' && room.status !== 'reserved') {
      alert('This room is not available for booking');
      return;
    }

    if (guestForm.numberOfGuests > room.capacity) {
      alert(`Room capacity is ${room.capacity}. Please reduce number of guests.`);
      return;
    }

    setSelectedRoom(room);
  };

  const handleCreateBooking = () => {
    if (!selectedRoom || !guestForm.name || !guestForm.phone) {
      alert('Please fill in all required fields');
      return;
    }

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      roomId: selectedRoom.id,
      guestName: guestForm.name,
      guestPhone: guestForm.phone,
      guestEmail: guestForm.email || undefined,
      checkIn: guestForm.checkIn,
      checkOut: guestForm.checkOut,
      status: 'confirmed',
      numberOfGuests: guestForm.numberOfGuests,
      totalAmount: selectedRoom.pricePerNight 
        ? selectedRoom.pricePerNight * Math.ceil(
            (new Date(guestForm.checkOut).getTime() - new Date(guestForm.checkIn).getTime()) / (1000 * 60 * 60 * 24)
          )
        : undefined,
      notes: guestForm.notes || undefined,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
    };

    saveBooking(booking);
    onBookingCreated?.(booking);

    alert('Booking created successfully!');
    
    // Reset form
    setGuestForm({
      name: '',
      phone: '',
      email: '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      numberOfGuests: 1,
      notes: '',
    });
    setSelectedRoom(null);
    setDraggedGuest(null);
  };

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Drag & Drop Booking System</h3>
        <p className="text-sm text-gray-600">Fill guest details and drag to room to create booking</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Guest Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Guest Information</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name *
              </label>
              <input
                type="text"
                value={guestForm.name}
                onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter guest name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={guestForm.phone}
                onChange={(e) => setGuestForm(prev => ({ ...prev, phone: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                value={guestForm.email}
                onChange={(e) => setGuestForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check In *
                </label>
                <input
                  type="date"
                  value={guestForm.checkIn}
                  onChange={(e) => setGuestForm(prev => ({ ...prev, checkIn: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Out *
                </label>
                <input
                  type="date"
                  value={guestForm.checkOut}
                  onChange={(e) => setGuestForm(prev => ({ ...prev, checkOut: e.target.value }))}
                  required
                  min={guestForm.checkIn}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests *
              </label>
              <input
                type="number"
                value={guestForm.numberOfGuests}
                onChange={(e) => setGuestForm(prev => ({ ...prev, numberOfGuests: parseInt(e.target.value) || 1 }))}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={guestForm.notes}
                onChange={(e) => setGuestForm(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Additional notes..."
              />
            </div>

            {/* Draggable Guest Card */}
            {guestForm.name && guestForm.phone && (
              <div
                draggable
                onDragStart={handleDragStart}
                className="p-4 bg-amber-100 border-2 border-purple-400 rounded-lg cursor-move hover:bg-amber-200 transition-all duration-200"
              >
                <div className="font-semibold text-gray-900">{guestForm.name}</div>
                <div className="text-sm text-gray-600">{guestForm.phone}</div>
                <div className="text-sm text-gray-600">{guestForm.numberOfGuests} guest(s)</div>
                <div className="text-xs text-amber-700 mt-2">Drag to room to book</div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Available Rooms */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Available Rooms</h4>
          
          {availableRooms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm">No available rooms</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
              {availableRooms.map((room) => {
                const isHovered = hoveredRoom === room.id;
                const isSelected = selectedRoom?.id === room.id;

                return (
                  <div
                    key={room.id}
                    onDragOver={(e) => handleDragOver(e, room.id)}
                    onDragLeave={() => setHoveredRoom(null)}
                    onDrop={(e) => handleDrop(e, room)}
                    onClick={() => setSelectedRoom(room)}
                    className={`relative transition-all duration-200 ${
                      isHovered
                        ? 'scale-110 z-10'
                        : isSelected
                        ? 'scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    <RoomCard
                      room={room}
                      size="small"
                      onClick={() => setSelectedRoom(room)}
                    />
                    {isHovered && (
                      <div className="absolute inset-0 bg-amber-500 bg-opacity-30 rounded-xl border-2 border-purple-500 flex items-center justify-center">
                        <div className="text-white font-semibold text-sm">Drop Here</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected Room Details */}
          {selectedRoom && (
            <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
              <div className="font-semibold text-gray-900 mb-2">{selectedRoom.name}</div>
              <div className="text-sm text-gray-600 mb-3">
                Capacity: {selectedRoom.capacity} • Price: ₹{selectedRoom.pricePerNight || 'N/A'}/night
              </div>
              <button
                onClick={handleCreateBooking}
                className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
              >
                Confirm Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

