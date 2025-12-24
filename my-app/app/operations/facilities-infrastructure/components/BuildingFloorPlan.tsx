'use client';

import { Room, getRoomsByFloor } from '../facilitiesData';
import RoomCard from './RoomCard';

interface BuildingFloorPlanProps {
  rooms: Room[];
  selectedRoom?: Room | null;
  onRoomClick?: (room: Room) => void;
  floor?: number;
  width?: number;
  height?: number;
}

export default function BuildingFloorPlan({
  rooms,
  selectedRoom,
  onRoomClick,
  floor,
  width = 1000,
  height = 700,
}: BuildingFloorPlanProps) {
  // Filter by floor if specified
  const filteredRooms = floor !== undefined 
    ? getRoomsByFloor(floor)
    : rooms;

  // Group rooms by floor
  const roomsByFloor = filteredRooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, Room[]>);

  const floors = Object.keys(roomsByFloor).map(Number).sort();

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Interactive Building Floor Plan</h3>
        <p className="text-sm text-gray-600">Click on rooms to view details and manage bookings</p>
      </div>

      {/* Floor selector */}
      {floors.length > 1 && (
        <div className="mb-4 flex gap-2">
          {floors.map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                floor === f
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Floor {f}
            </button>
          ))}
        </div>
      )}

      {/* Floor plan visualization */}
      {floors.map((f) => {
        const floorRooms = roomsByFloor[f];
        
        return (
          <div key={f} className="relative bg-white rounded-lg border-2 border-gray-300 overflow-hidden mb-4" style={{ width, height }}>
            {/* Grid background */}
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id={`grid-floor-${f}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-floor-${f})`} />
            </svg>

            {/* Floor label */}
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-lg border border-gray-300 shadow-sm z-10">
              <span className="text-sm font-semibold text-gray-700">Floor {f}</span>
            </div>

            {/* Rooms */}
            {floorRooms.map((room) => {
              const isSelected = selectedRoom?.id === room.id;
              
              const x = (room.location.x / 100) * width;
              const y = (room.location.y / 100) * height;
              const w = (room.location.width / 100) * width;
              const h = (room.location.height / 100) * height;

              const borderColor = 
                isSelected ? '#3b82f6' :
                room.status === 'occupied' ? '#dc2626' :
                room.status === 'maintenance' ? '#f59e0b' :
                room.status === 'reserved' ? '#2563eb' :
                '#a87738';

              return (
                <div
                  key={room.id}
                  onClick={() => onRoomClick?.(room)}
                  className="absolute cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 group"
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    width: `${w}px`,
                    height: `${h}px`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg border-3 relative"
                    style={{
                      backgroundColor: 
                        room.status === 'available' ? '#a8773840' :
                        room.status === 'occupied' ? '#dc262640' :
                        room.status === 'maintenance' ? '#f59e0b40' :
                        '#2563eb40',
                      borderColor,
                      borderWidth: isSelected ? '4px' : '3px',
                      boxShadow: isSelected 
                        ? `0 0 20px ${borderColor}80` 
                        : room.status === 'occupied' || room.status === 'maintenance'
                        ? `0 0 15px ${borderColor}60`
                        : '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {/* Room label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                      <div className="font-semibold text-gray-900 text-sm text-center">
                        {room.name}
                      </div>
                      <div className="text-xs text-gray-700 mt-1 text-center capitalize">
                        {room.type}
                      </div>
                      <div className="text-xs font-medium mt-1" style={{ color: borderColor }}>
                        {room.currentOccupancy}/{room.capacity}
                      </div>
                    </div>

                    {/* Status indicator */}
                    {room.status !== 'available' && (
                      <div className="absolute top-1 left-1">
                        <div className={`w-3 h-3 rounded-full ${
                          room.status === 'occupied' ? 'bg-red-500 animate-pulse' :
                          room.status === 'maintenance' ? 'bg-amber-500' :
                          'bg-amber-500'
                        }`} />
                      </div>
                    )}

                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl whitespace-nowrap">
                        <div className="font-semibold mb-1">{room.name}</div>
                        <div className="text-gray-300">Type: {room.type}</div>
                        <div className="text-gray-300">Status: {room.status}</div>
                        <div className="text-gray-300">Capacity: {room.capacity}</div>
                        {room.amenities.length > 0 && (
                          <div className="text-gray-300 mt-1">
                            {room.amenities.slice(0, 3).join(', ')}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-blue-500 bg-amber-100"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Maintenance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">Reserved</span>
        </div>
      </div>
    </div>
  );
}

