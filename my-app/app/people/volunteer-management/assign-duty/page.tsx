'use client';

import { useState } from 'react';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography, shadows } from '../../../design-system';
import { ModernCard } from '../../components';
import AssignDutyModal from '../components/AssignDutyModal';

export default function AssignDutyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ModuleLayout
      title="Assign Duty"
      description="Assign duties to volunteers for events and festivals"
    >
      <ModernCard elevation="md" className="text-center p-12">
        <div className="space-y-4">
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.text.primary,
              marginBottom: spacing.md,
            }}
          >
            Assign Duty
          </h2>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
              marginBottom: spacing.lg,
            }}
          >
            Click the button below to assign a duty to a volunteer
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 rounded-2xl transition-all hover:scale-105"
            style={{
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
              boxShadow: shadows.md,
            }}
          >
            + Assign New Duty
          </button>
        </div>
      </ModernCard>

      <AssignDutyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={(data) => {
          console.log('Duty assigned:', data);
          setIsModalOpen(false);
        }}
      />
    </ModuleLayout>
  );
}

