'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { ModernCard } from '../../components';
import AssignTaskModal from '../components/AssignTaskModal';

// Mock employees - in real app, this would come from API
const mockEmployees = [
  { id: '1', name: 'Arjun Rao' },
  { id: '2', name: 'Meera Iyer' },
  { id: '3', name: 'Karthik Sharma' },
];

export default function AssignEmployeeTaskPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAssign = (data: any) => {
    console.log('Task assigned:', data);
    alert('Task assigned successfully!');
  };

  return (
    <ModuleLayout
      title="Assign Employee Task"
      description="Assign tasks to employees for daily operations"
    >
      <ModernCard elevation="md" className="text-center p-12">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
            <svg
              width="40"
              height="40"
              fill="none"
              stroke={colors.primary.base}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Assign Employee Task
          </h2>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
              marginBottom: spacing.lg,
            }}
          >
            Click the button below to assign a new task to an employee
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 rounded-2xl transition-all hover:scale-105"
            style={{
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 600,
              boxShadow: shadows.md,
            }}
          >
            + Assign New Task
          </button>
        </div>
      </ModernCard>

      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssign}
        employees={mockEmployees}
      />
    </ModuleLayout>
  );
}
