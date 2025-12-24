'use client';

import { Room } from '../facilitiesData';

interface RoomCardProps {
  room: Room;
  onClick?: (room: Room) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function RoomCard({ room, onClick, size = 'medium' }: RoomCardProps) {
  const statusColors = {
    available: 'bg-amber-500 border-green-600',
    occupied: 'bg-red-500 border-red-600',
    maintenance: 'bg-amber-500 border-amber-600',
    reserved: 'bg-amber-500 border-blue-600',
  };

  const statusText = {
    available: 'Available',
    occupied: 'Occupied',
    maintenance: 'Maintenance',
    reserved: 'Reserved',
  };

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  };

  return (
    <div
      onClick={() => onClick?.(room)}
      className={`${sizeClasses[size]} ${statusColors[room.status]} rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl relative group border-2`}
      style={{
        transform: 'perspective(500px) rotateX(5deg)',
        boxShadow: `0 4px 12px rgba(0,0,0,0.15), inset 0 -2px 4px rgba(0,0,0,0.1)`,
      }}
      title={`${room.name} - ${statusText[room.status]}`}
    >
      {/* Status indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-3 h-3 rounded-full ${
          room.status === 'available' ? 'bg-green-200' :
          room.status === 'occupied' ? 'bg-red-200' :
          room.status === 'maintenance' ? 'bg-amber-200' : 'bg-blue-200'
        } animate-pulse`} />
      </div>

      {/* Room name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <div className="text-white text-center">
          <div className="font-bold text-lg mb-1">{room.name}</div>
          <div className="text-xs opacity-90 capitalize">{room.type}</div>
        </div>
      </div>

      {/* Capacity badge */}
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded-full px-2 py-1 shadow-md">
        <span className="text-xs font-bold text-gray-900">
          {room.currentOccupancy}/{room.capacity}
        </span>
      </div>

      {/* Price badge (for lodge rooms) */}
      {room.type === 'lodge' && room.pricePerNight && (
        <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full px-2 py-1 shadow-md">
          <span className="text-xs font-bold text-gray-900">₹{room.pricePerNight}</span>
        </div>
      )}

      {/* Pulse animation for occupied/maintenance */}
      {(room.status === 'occupied' || room.status === 'maintenance') && (
        <div className={`absolute inset-0 ${statusColors[room.status]} rounded-xl opacity-50 animate-pulse`} />
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
          <div className="font-semibold mb-1">{room.name}</div>
          <div className="text-gray-300">Type: {room.type}</div>
          <div className="text-gray-300">Status: {statusText[room.status]}</div>
          <div className="text-gray-300">Floor: {room.floor}</div>
          <div className="text-gray-300">Building: {room.building}</div>
          {room.amenities.length > 0 && (
            <div className="text-gray-300 mt-1">
              Amenities: {room.amenities.slice(0, 3).join(', ')}
            </div>
          )}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

