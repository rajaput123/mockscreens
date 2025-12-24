'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import {
  getAllParkingSlots,
  getAllBookings,
  getBookingsByParkingSlot,
  saveParkingSlot,
  saveBooking,
  ParkingSlot,
  Booking,
  getParkingSlotsByLocation,
} from '../facilitiesData';

export default function ManageParkingPage() {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [guestForm, setGuestForm] = useState({
    name: '',
    phone: '',
    vehicleNumber: '',
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allSlots = getAllParkingSlots();
    const allBookings = getAllBookings();
    setParkingSlots(allSlots);
    setBookings(allBookings);
  };

  const locations = Array.from(new Set(parkingSlots.map(s => s.location)));
  const filteredSlots = selectedLocation === 'all'
    ? parkingSlots
    : getParkingSlotsByLocation(selectedLocation);

  const availableSlots = filteredSlots.filter(s => s.status === 'available');
  const occupiedSlots = filteredSlots.filter(s => s.status === 'occupied');
  const reservedSlots = filteredSlots.filter(s => s.status === 'reserved');

  const getSlotColor = (status: ParkingSlot['status']) => {
    switch (status) {
      case 'available':
        return 'bg-amber-500 border-green-600';
      case 'occupied':
        return 'bg-red-500 border-red-600';
      case 'reserved':
        return 'bg-amber-500 border-blue-600';
      case 'maintenance':
        return 'bg-amber-500 border-amber-600';
      default:
        return 'bg-gray-500 border-gray-600';
    }
  };

  const handleBookSlot = () => {
    if (!selectedSlot || !guestForm.name || !guestForm.phone) {
      alert('Please select a slot and fill in guest details');
      return;
    }

    if (selectedSlot.status !== 'available' && selectedSlot.status !== 'reserved') {
      alert('This slot is not available for booking');
      return;
    }

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      parkingSlotId: selectedSlot.id,
      guestName: guestForm.name,
      guestPhone: guestForm.phone,
      checkIn: guestForm.checkIn,
      checkOut: guestForm.checkOut,
      status: 'confirmed',
      numberOfGuests: 1,
      notes: `Vehicle: ${guestForm.vehicleNumber}`,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin',
    };

    saveBooking(booking);

    // Update slot status
    const updatedSlot: ParkingSlot = {
      ...selectedSlot,
      status: 'reserved',
    };
    saveParkingSlot(updatedSlot);

    alert('Parking slot booked successfully!');
    loadData();
    
    // Reset form
    setGuestForm({
      name: '',
      phone: '',
      vehicleNumber: '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setSelectedSlot(null);
  };

  return (
    <ModuleLayout
      title="Manage Parking"
      description="Manage parking slots and bookings"
    >
      {/* Location Filter */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Available</div>
          <div className="text-2xl font-bold text-amber-600">{availableSlots.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Occupied</div>
          <div className="text-2xl font-bold text-red-600">{occupiedSlots.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="text-sm font-medium text-gray-600 mb-1">Reserved</div>
          <div className="text-2xl font-bold text-amber-600">{reservedSlots.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Parking Slots Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedLocation === 'all' ? 'All Parking Slots' : selectedLocation}
            </h3>
            
            {/* Parking Grid */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {filteredSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={`aspect-square ${getSlotColor(slot.status)} rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-110 relative group ${
                      isSelected ? 'ring-4 ring-amber-500 ring-offset-2' : ''
                    }`}
                    style={{
                      transform: 'perspective(200px) rotateX(5deg)',
                      boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                    }}
                  >
                    {/* Slot number */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-xs font-bold text-center">
                        {slot.slotNumber.split('-')[1]}
                      </div>
                    </div>

                    {/* Status indicator */}
                    <div className="absolute top-1 right-1">
                      <div className={`w-2 h-2 rounded-full ${
                        slot.status === 'available' ? 'bg-green-200' :
                        slot.status === 'occupied' ? 'bg-red-200 animate-pulse' :
                        slot.status === 'reserved' ? 'bg-blue-200' : 'bg-amber-200'
                      }`} />
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                        <div className="font-semibold mb-1">{slot.slotNumber}</div>
                        <div className="text-gray-300">{slot.location}</div>
                        <div className="text-gray-300 capitalize">Type: {slot.type}</div>
                        <div className="text-gray-300 capitalize">Status: {slot.status}</div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500"></div>
                <span className="text-gray-600">Occupied</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span className="text-gray-600">Reserved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500"></div>
                <span className="text-gray-600">Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Parking Slot</h3>

            {selectedSlot ? (
              <div className="space-y-4">
                {/* Selected Slot Display */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-semibold text-gray-900">{selectedSlot.slotNumber}</div>
                      <div className="text-sm text-gray-600">{selectedSlot.location}</div>
                    </div>
                    <button
                      onClick={() => setSelectedSlot(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs text-gray-600 capitalize">
                    Type: {selectedSlot.type} • Status: {selectedSlot.status}
                  </div>
                </div>

                {/* Guest Form */}
                <form onSubmit={(e) => { e.preventDefault(); handleBookSlot(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      value={guestForm.name}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number
                    </label>
                    <input
                      type="text"
                      value={guestForm.vehicleNumber}
                      onChange={(e) => setGuestForm(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="e.g., KA-01-AB-1234"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={selectedSlot.status !== 'available' && selectedSlot.status !== 'reserved'}
                    className="w-full px-4 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    Book Slot
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
                <p className="text-sm">Click on a parking slot to book it</p>
              </div>
            )}
          </div>

          {/* Active Bookings */}
          {selectedSlot && getBookingsByParkingSlot(selectedSlot.id).length > 0 && (
            <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Bookings</h4>
              <div className="space-y-2">
                {getBookingsByParkingSlot(selectedSlot.id)
                  .filter(b => b.status === 'confirmed' || b.status === 'checked-in')
                  .map((booking) => (
                    <div key={booking.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="font-medium text-sm text-gray-900">{booking.guestName}</div>
                      <div className="text-xs text-gray-600">
                        {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                      </div>
                      {booking.notes && (
                        <div className="text-xs text-gray-600 mt-1">{booking.notes}</div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <HelpButton module="facilities-infrastructure" />
    </ModuleLayout>
  );
}

