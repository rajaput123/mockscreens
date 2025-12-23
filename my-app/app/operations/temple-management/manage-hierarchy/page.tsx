'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography } from '../../../design-system';

interface Temple {
  id: string;
  name: string;
  location: string;
  parentTempleId?: string;
  childTemples?: string[];
}

export default function ManageHierarchyPage() {
  const searchParams = useSearchParams();
  const templeId = searchParams?.get('templeId');

  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectedChildren, setSelectedChildren] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Mock data
  const allTemples: Temple[] = [
    { id: '1', name: 'Main Temple Complex', location: 'City Center' },
    { id: '2', name: 'North Branch Temple', location: 'North District' },
    { id: '3', name: 'South Branch Temple', location: 'South District' },
    { id: '4', name: 'East Branch Temple', location: 'East District' },
  ];

  const parentTemples = allTemples.filter(t => !t.parentTempleId);
  const availableChildren = allTemples.filter(t => t.id !== selectedParent);

  useEffect(() => {
    if (templeId) {
      setSelectedParent(templeId);
      // Load existing children for this temple
      const temple = allTemples.find(t => t.id === templeId);
      if (temple?.childTemples) {
        setSelectedChildren(new Set(temple.childTemples));
      }
    }
  }, [templeId]);

  const toggleChild = (childId: string) => {
    const newSelected = new Set(selectedChildren);
    if (newSelected.has(childId)) {
      newSelected.delete(childId);
    } else {
      newSelected.add(childId);
    }
    setSelectedChildren(newSelected);
  };

  const handleSave = async () => {
    if (!selectedParent) {
      alert('Please select a parent temple');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    alert('Hierarchy updated successfully!');
  };

  return (
    <ModuleLayout
      title="Manage Temple Hierarchy"
      description="Assign child temples to parent temples"
    >
      <div 
        className="rounded-3xl p-6"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
          maxWidth: '900px',
        }}
      >
        <h2
          style={{
            fontFamily: typography.sectionHeader.fontFamily,
            fontSize: typography.sectionHeader.fontSize,
            fontWeight: typography.sectionHeader.fontWeight,
            marginBottom: spacing.lg,
            color: colors.text.primary,
          }}
        >
          Assign Child Temples
        </h2>

        {/* Parent Temple Selector */}
        <div style={{ marginBottom: spacing.xl }}>
          <label
            htmlFor="parentTemple"
            style={{
              display: 'block',
              marginBottom: spacing.sm,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 600,
              color: colors.text.primary,
            }}
          >
            Select Parent Temple <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <select
            id="parentTemple"
            value={selectedParent}
            onChange={(e) => {
              setSelectedParent(e.target.value);
              setSelectedChildren(new Set());
            }}
            className="rounded-2xl"
            style={{
              width: '100%',
              padding: spacing.base,
              border: `1px solid ${colors.border}`,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.primary,
              backgroundColor: colors.background.base,
            }}
          >
            <option value="">Select a parent temple...</option>
            {parentTemples.map((temple) => (
              <option key={temple.id} value={temple.id}>
                {temple.name} - {temple.location}
              </option>
            ))}
          </select>
        </div>

        {/* Child Temples Selection */}
        {selectedParent && (
          <>
            <div style={{ marginBottom: spacing.lg }}>
              <h3
                style={{
                  fontFamily: typography.sectionHeader.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  marginBottom: spacing.base,
                  color: colors.text.primary,
                }}
              >
                Select Child Temples
              </h3>
              <p
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.muted,
                  marginBottom: spacing.base,
                }}
              >
                Select the temples that should be child temples of "{parentTemples.find(t => t.id === selectedParent)?.name}".
              </p>

              <div
                className="rounded-2xl"
                style={{
                  border: `1px solid ${colors.border}`,
                  padding: spacing.base,
                  maxHeight: '400px',
                  overflowY: 'auto',
                  backgroundColor: colors.background.subtle,
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: spacing.sm,
                }}
              >
                {availableChildren.length > 0 ? (
                  availableChildren.map((temple) => (
                    <label
                      key={temple.id}
                      className="rounded-xl"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.base,
                        padding: spacing.base,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.background.light;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedChildren.has(temple.id)}
                        onChange={() => toggleChild(temple.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            fontWeight: 500,
                            color: colors.text.primary,
                          }}
                        >
                          {temple.name}
                        </div>
                        <div
                          style={{
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.muted,
                          }}
                        >
                          {temple.location}
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div
                    style={{
                      padding: spacing.xl,
                      textAlign: 'center',
                      fontFamily: typography.body.fontFamily,
                      fontSize: typography.body.fontSize,
                      color: colors.text.muted,
                    }}
                  >
                    No available temples to assign as children.
                  </div>
                )}
              </div>
            </div>

            {/* Preview */}
            {selectedChildren.size > 0 && (
              <div
                className="rounded-2xl"
                style={{
                  marginBottom: spacing.xl,
                  padding: spacing.base,
                  backgroundColor: colors.background.subtle,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <h3
                  style={{
                    fontFamily: typography.sectionHeader.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    marginBottom: spacing.base,
                    color: colors.text.primary,
                  }}
                >
                  Preview
                </h3>
                <div
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.primary,
                    marginBottom: spacing.sm,
                  }}
                >
                  <strong>{parentTemples.find(t => t.id === selectedParent)?.name}</strong> will have {selectedChildren.size} child temple(s):
                </div>
                <ul style={{ marginLeft: spacing.lg, color: colors.text.muted }}>
                  {Array.from(selectedChildren).map((childId) => {
                    const child = allTemples.find(t => t.id === childId);
                    return child ? (
                      <li key={childId} style={{ marginBottom: spacing.xs }}>
                        {child.name} - {child.location}
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}

            {/* Save Button */}
            <div style={{ display: 'flex', gap: spacing.base, justifyContent: 'flex-end' }}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-2xl"
                style={{
                  padding: `${spacing.base} ${spacing.lg}`,
                  backgroundColor: isSaving ? colors.text.muted : colors.primary.base,
                  color: '#ffffff',
                  border: 'none',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? 'Saving...' : 'Save Hierarchy'}
              </button>
            </div>
          </>
        )}

        {!selectedParent && (
          <div
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
            }}
          >
            Please select a parent temple to begin managing its hierarchy.
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}

