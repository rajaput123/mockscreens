'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../components/layout/ModuleLayout';
import HelpButton from '../../components/help/HelpButton';
import Link from 'next/link';
import {
  getAllRooms,
  getAllParkingSlots,
  getAllBookings,
  getAllMaintenanceTasks,
  getUpcomingMaintenanceTasks,
  getOverdueMaintenanceTasks,
  Room,
  ParkingSlot,
  Booking,
  MaintenanceTask,
} from './facilitiesData';
import MaintenanceTimeline from './components/MaintenanceTimeline';
import RoomCard from './components/RoomCard';

export default function FacilitiesInfrastructureDashboard() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allRooms = getAllRooms();
    const allParkingSlots = getAllParkingSlots();
    const allBookings = getAllBookings();
    const allTasks = getAllMaintenanceTasks();
    setRooms(allRooms);
    setParkingSlots(allParkingSlots);
    setBookings(allBookings);
    setMaintenanceTasks(allTasks);
  };

  const availableRooms = rooms.filter(r => r.status === 'available');
  const occupiedRooms = rooms.filter(r => r.status === 'occupied');
  const availableParking = parkingSlots.filter(p => p.status === 'available');
  const occupiedParking = parkingSlots.filter(p => p.status === 'occupied');
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'checked-in');
  const upcomingMaintenance = getUpcomingMaintenanceTasks(30);
  const overdueMaintenance = getOverdueMaintenanceTasks();

  const stats = {
    totalRooms: rooms.length,
    availableRooms: availableRooms.length,
    occupiedRooms: occupiedRooms.length,
    totalParking: parkingSlots.length,
    availableParking: availableParking.length,
    activeBookings: activeBookings.length,
    upcomingMaintenance: upcomingMaintenance.length,
    overdueMaintenance: overdueMaintenance.length,
  };

  return (
    <ModuleLayout
      title="Facilities & Infrastructure Management"
      description="Manage rooms, parking, and maintenance across all facilities"
    >
      {/* View Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">View</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/operations/facilities-infrastructure/floor-plan"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Floor Plan
          </Link>
          <Link
            href="/operations/facilities-infrastructure/resource-network"
            className="px-6 py-3 rounded-2xl font-sans text-base font-medium transition-all duration-200 transform hover:scale-105 no-underline border-2 border-amber-600 text-amber-600 hover:bg-amber-50 cursor-pointer"
          >
            Resource Network
          </Link>
        </div>
      </div>

      {/* Manage Buttons */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Manage</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/operations/facilities-infrastructure/manage-lodge"
            className="bg-amber-600 text-white px-6 py-3 rounded-2xl font-sans text-base font-medium hover:bg-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 no-underline"
          >
            Manage Lodge
          </Link>
          <Link
            href="/operations/facilities-infrastructure/manage-parking"
            className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-2xl font-sans text-base font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline"
          >
            Manage Parking
          </Link>
          <Link
            href="/operations/facilities-infrastructure/maintenance-schedule"
            className="border-2 border-amber-600 text-amber-600 px-6 py-3 rounded-2xl font-sans text-base font-medium hover:bg-amber-50 transition-all duration-200 transform hover:scale-105 no-underline"
          >
            Maintenance Schedule
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
            Total Rooms
          </h3>
          <p className="font-sans text-3xl font-semibold text-amber-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.totalRooms}
          </p>
          <p className="text-sm text-gray-600 mt-1">{stats.availableRooms} available</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
            Parking Slots
          </h3>
          <p className="font-sans text-3xl font-semibold text-amber-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.totalParking}
          </p>
          <p className="text-sm text-gray-600 mt-1">{stats.availableParking} available</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-green-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
            Active Bookings
          </h3>
          <p className="font-sans text-3xl font-semibold text-amber-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.activeBookings}
          </p>
          <p className="text-sm text-gray-600 mt-1">Currently active</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-red-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <h3 className="font-serif text-xl font-medium mb-2 text-gray-900 group-hover:text-red-600 transition-colors duration-200">
            Maintenance
          </h3>
          <p className="font-sans text-3xl font-semibold text-red-600 transform group-hover:scale-110 transition-transform duration-200 inline-block">
            {stats.upcomingMaintenance}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {stats.overdueMaintenance > 0 && `${stats.overdueMaintenance} overdue • `}
            {stats.upcomingMaintenance} upcoming
          </p>
        </div>
      </div>

      {/* Maintenance Alerts */}
      {overdueMaintenance.length > 0 && (
        <div className="mb-6 bg-red-50 border-2 border-red-300 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-sm font-semibold text-red-900">Overdue Maintenance Tasks</h3>
            </div>
          </div>
          <div className="space-y-2">
            {overdueMaintenance.slice(0, 3).map((task) => (
              <div key={task.id} className="p-2 bg-white border border-red-200 rounded">
                <div className="font-medium text-sm text-red-900">{task.title}</div>
                <div className="text-xs text-red-700">
                  Scheduled: {new Date(task.scheduledDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Overview - Room Cards */}
      <div className="mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Room Overview</h3>
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
        </div>
      </div>

      {/* Maintenance Timeline */}
      <div className="mb-6">
        <MaintenanceTimeline
          tasks={maintenanceTasks}
          daysRange={30}
          onTaskClick={(task) => {
            console.log('Task clicked:', task);
          }}
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
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      <HelpButton module="facilities-infrastructure" />
    </ModuleLayout>
  );
}

