'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import HelpButton from '../../../components/help/HelpButton';
import { 
  getAllPrasadMenus, 
  savePrasadMenu, 
  deletePrasadMenu,
  PrasadMenu,
  PrasadMenuItem 
} from '../prasadData';
import { PRASAD_CATEGORY } from '../prasadTypes';
import { getAllTemples } from '../../temple-management/templeData';
import PrasadMenuModal from '../components/PrasadMenuModal';
import DragDropBoard from '../components/DragDropBoard';

export default function PlanPrasadMenuPage() {
  const [menus, setMenus] = useState<PrasadMenu[]>([]);
  const [temples, setTemples] = useState<Array<{ id: string; name: string; deity?: string }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<PrasadMenu | null>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'all'>('today');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'in-progress' | 'completed'>('all');
  const [prasadTypeFilter, setPrasadTypeFilter] = useState<'all' | 'annadan' | 'paid'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allMenus = getAllPrasadMenus();
    setMenus(allMenus);
    
    const allTemples = getAllTemples();
    setTemples(allTemples.map(t => ({ id: t.id, name: t.name, deity: t.deity })));
  };

  const getTempleName = (templeId: string) => {
    const temple = temples.find(t => t.id === templeId);
    return temple?.deity || temple?.name || templeId;
  };

  const handleOpenModal = (menu?: PrasadMenu) => {
    setEditingMenu(menu || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMenu(null);
    loadData();
  };

  const handleDelete = (menuId: string) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      deletePrasadMenu(menuId);
      loadData();
    }
  };

  const getFilteredMenus = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let filtered = menus;

    // Filter by tab
    if (activeTab === 'today') {
      filtered = filtered.filter(m => m.date === today);
    } else if (activeTab === 'week') {
      filtered = filtered.filter(m => m.date >= today && m.date <= weekFromNow);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(m => m.status === statusFilter);
    }

    // Filter by prasad type (migrated from old `prasadType` to `category`)
    if (prasadTypeFilter !== 'all') {
      if (prasadTypeFilter === 'annadan') {
        filtered = filtered.filter(m => m.category === PRASAD_CATEGORY.ANNADAN);
      } else if (prasadTypeFilter === 'paid') {
        // "Paid" includes counter-paid and seva-paid categories
        filtered = filtered.filter(
          m => m.category === PRASAD_CATEGORY.COUNTER_PAID || m.category === PRASAD_CATEGORY.SEVA_PRASAD_PAID
        );
      }
    }

    // Limit to 6 for compact view
    return filtered.slice(0, 6);
  };

  const filteredMenus = getFilteredMenus();
  const hasMore = getFilteredMenus().length >= 6;

  const getStatusColor = (status: PrasadMenu['status']) => {
    switch (status) {
      case 'completed':
      case 'distributed':
        return 'bg-amber-100 text-amber-700';
      case 'prepared':
        return 'bg-amber-100 text-amber-700';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700';
      case 'scheduled':
        return 'bg-gray-100 text-gray-700';
      case 'draft':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: PrasadMenu['status']) => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <ModuleLayout
      title="Plan Prasad Menu"
      description="Create and manage prasad menus for all temples"
    >

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Plan Prasad Menu</h2>
            <p className="text-sm text-gray-600 mt-1">Create and manage breakfast, lunch, dinner, and prasad menus</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-200 font-medium"
          >
            + Create New Menu
          </button>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={prasadTypeFilter}
            onChange={(e) => setPrasadTypeFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm"
          >
            <option value="all">All Prasad Types</option>
            <option value="annadan">Annadan (Free - Expense)</option>
            <option value="paid">Paid (Revenue)</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'today'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setActiveTab('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'week'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Drag & Drop Board */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Plan Menu Schedule</h3>
          <p className="text-sm text-gray-600">Drag menus to time slots or create new ones</p>
        </div>
        <div className="h-[600px]">
          <DragDropBoard
            menus={filteredMenus}
            onMenuDrop={(menu, slot) => {
              // Update menu with new time slot
              const updatedMenu: PrasadMenu = {
                ...menu,
                mealType: slot.mealType,
                startTime: slot.time,
                date: new Date().toISOString().split('T')[0], // Use today's date for now
              };
              savePrasadMenu(updatedMenu);
              loadData();
            }}
            onNewMenuDrop={(slot) => {
              handleOpenModal();
            }}
            onCreateMenu={(slot) => {
              handleOpenModal();
            }}
          />
        </div>
      </div>

      <PrasadMenuModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingMenu={editingMenu}
        temples={temples}
      />

      <HelpButton module="kitchen-prasad" />
    </ModuleLayout>
  );
}


