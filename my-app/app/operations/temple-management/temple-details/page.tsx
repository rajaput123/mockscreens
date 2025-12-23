'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography } from '../../../design-system';

interface Seva {
  id: string;
  name: string;
  type: string;
  duration: string;
  price: number;
  status: 'active' | 'inactive';
}

interface Temple {
  id: string;
  name: string;
  location: string;
  description?: string;
  type: 'parent' | 'child';
  parentTempleId?: string;
  parentTempleName?: string;
  status: 'active' | 'inactive';
  sevas: Seva[];
  childTemples?: Array<{ id: string; name: string; location: string }>;
}

export default function TempleDetailsPage() {
  const searchParams = useSearchParams();
  const templeId = searchParams ? searchParams.get('templeId') || '1' : '1';

  // Mock data - will be replaced with actual API call
  const temple: Temple = {
    id: templeId,
    name: 'Main Temple Complex',
    location: 'City Center',
    description: 'The main temple complex serving as the headquarters for all temple operations.',
    type: 'parent',
    status: 'active',
    sevas: [
      {
        id: '1',
        name: 'Morning Aarti',
        type: 'Daily Ritual',
        duration: '60 minutes',
        price: 500,
        status: 'active',
      },
      {
        id: '2',
        name: 'Abhishekam',
        type: 'Puja',
        duration: '45 minutes',
        price: 1000,
        status: 'active',
      },
      {
        id: '3',
        name: 'Special Puja',
        type: 'Special Service',
        duration: '90 minutes',
        price: 2500,
        status: 'active',
      },
      {
        id: '4',
        name: 'Evening Aarti',
        type: 'Daily Ritual',
        duration: '60 minutes',
        price: 500,
        status: 'active',
      },
    ],
    childTemples: [
      { id: '2', name: 'North Branch Temple', location: 'North District' },
      { id: '3', name: 'South Branch Temple', location: 'South District' },
    ],
  };

  return (
    <ModuleLayout
      title={temple.name}
      description={`Temple Details - ${temple.location}`}
    >
      {/* Temple Information Card */}
      <div 
        className="rounded-3xl p-6 mb-8"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
          marginBottom: spacing.xl,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2
              style={{
                fontFamily: typography.sectionHeader.fontFamily,
                fontSize: typography.sectionHeader.fontSize,
                fontWeight: typography.sectionHeader.fontWeight,
                marginBottom: spacing.base,
                color: colors.text.primary,
              }}
            >
              Temple Information
            </h2>
            <div style={{ marginBottom: spacing.base }}>
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.muted,
                  display: 'inline-block',
                  width: '120px',
                }}
              >
                Name:
              </span>
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                }}
              >
                {temple.name}
              </span>
            </div>
            <div style={{ marginBottom: spacing.base }}>
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.muted,
                  display: 'inline-block',
                  width: '120px',
                }}
              >
                Location:
              </span>
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  color: colors.text.primary,
                }}
              >
                {temple.location}
              </span>
            </div>
            <div style={{ marginBottom: spacing.base }}>
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.muted,
                  display: 'inline-block',
                  width: '120px',
                }}
              >
                Type:
              </span>
              <span
                className="rounded-xl"
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: temple.type === 'parent' ? colors.background.subtle : colors.background.light,
                  color: temple.type === 'parent' ? colors.primary.base : colors.text.muted,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                {temple.type === 'parent' ? 'Parent Temple' : 'Child Temple'}
              </span>
            </div>
            {temple.parentTempleName && (
              <div style={{ marginBottom: spacing.base }}>
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.muted,
                    display: 'inline-block',
                    width: '120px',
                  }}
                >
                  Parent Temple:
                </span>
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.primary.base,
                  }}
                >
                  {temple.parentTempleName}
                </span>
              </div>
            )}
            <div style={{ marginBottom: spacing.base }}>
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 600,
                  color: colors.text.muted,
                  display: 'inline-block',
                  width: '120px',
                }}
              >
                Status:
              </span>
              <span
                className="rounded-xl"
                style={{
                  padding: `${spacing.xs} ${spacing.sm}`,
                  backgroundColor: temple.status === 'active' ? '#d4edda' : '#f8d7da',
                  color: temple.status === 'active' ? '#155724' : '#721c24',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                }}
              >
                {temple.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            {temple.description && (
              <div style={{ marginTop: spacing.base }}>
                <p
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {temple.description}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            <h2
              style={{
                fontFamily: typography.sectionHeader.fontFamily,
                fontSize: typography.sectionHeader.fontSize,
                fontWeight: typography.sectionHeader.fontWeight,
                marginBottom: spacing.base,
                color: colors.text.primary,
              }}
            >
              Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.base }}>
              <Link
                href={`/operations/temple-management/add-temple?templeId=${temple.id}`}
                className="rounded-2xl"
                style={{
                  padding: spacing.base,
                  backgroundColor: colors.primary.base,
                  color: '#ffffff',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Edit Temple
              </Link>
              <Link
                href={`/operations/temple-management/assign-sevas?templeId=${temple.id}`}
                className="rounded-2xl"
                style={{
                  padding: spacing.base,
                  backgroundColor: colors.background.subtle,
                  color: colors.primary.base,
                  border: `1px solid ${colors.primary.base}`,
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  fontWeight: 500,
                }}
              >
                Manage Sevas
              </Link>
              {temple.type === 'parent' && (
                <Link
                  href={`/operations/temple-management/manage-hierarchy?templeId=${temple.id}`}
                  className="rounded-2xl"
                  style={{
                    padding: spacing.base,
                    backgroundColor: colors.background.subtle,
                    color: colors.primary.base,
                    border: `1px solid ${colors.primary.base}`,
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 500,
                  }}
                >
                  Manage Hierarchy
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sevas List */}
      <div 
        className="rounded-3xl p-6 mb-8"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
          padding: spacing.xl,
          marginBottom: spacing.xl,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <h2
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              color: colors.text.primary,
            }}
          >
            Associated Sevas ({temple.sevas.length})
          </h2>
          <Link
            href={`/operations/temple-management/assign-sevas?templeId=${temple.id}`}
            className="rounded-2xl"
            style={{
              padding: `${spacing.sm} ${spacing.base}`,
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
            }}
          >
            Add Sevas
          </Link>
        </div>

        {temple.sevas.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${colors.border}` }}>
                  <th
                    style={{
                      padding: spacing.base,
                      textAlign: 'left',
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.text.primary,
                    }}
                  >
                    Seva Name
                  </th>
                  <th
                    style={{
                      padding: spacing.base,
                      textAlign: 'left',
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.text.primary,
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: spacing.base,
                      textAlign: 'left',
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.text.primary,
                    }}
                  >
                    Duration
                  </th>
                  <th
                    style={{
                      padding: spacing.base,
                      textAlign: 'left',
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.text.primary,
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: spacing.base,
                      textAlign: 'left',
                      fontFamily: typography.sectionHeader.fontFamily,
                      fontSize: typography.sectionHeader.fontSize,
                      fontWeight: typography.sectionHeader.fontWeight,
                      color: colors.text.primary,
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {temple.sevas.map((seva) => (
                  <tr key={seva.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {seva.name}
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {seva.type}
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      {seva.duration}
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      ₹{seva.price.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                      }}
                    >
                      <span
                        className="rounded-xl"
                        style={{
                          padding: `${spacing.xs} ${spacing.sm}`,
                          backgroundColor: seva.status === 'active' ? '#d4edda' : '#f8d7da',
                          color: seva.status === 'active' ? '#155724' : '#721c24',
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                        }}
                      >
                        {seva.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            No sevas assigned to this temple yet.
          </div>
        )}
      </div>

      {/* Child Temples (if parent temple) */}
      {temple.type === 'parent' && temple.childTemples && temple.childTemples.length > 0 && (
        <div 
          className="rounded-3xl p-6"
          style={{
            backgroundColor: colors.background.base,
            border: `1px solid ${colors.border}`,
            padding: spacing.xl,
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
            Child Temples ({temple.childTemples.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: spacing.base }}>
            {temple.childTemples.map((child) => (
              <Link
                key={child.id}
                href={`/operations/temple-management/temple-details?templeId=${child.id}`}
                className="rounded-2xl"
                style={{
                  padding: spacing.base,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.background.subtle,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.primary.base;
                  e.currentTarget.style.backgroundColor = colors.background.light;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.border;
                  e.currentTarget.style.backgroundColor = colors.background.subtle;
                }}
              >
                <div
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    fontWeight: 600,
                    color: colors.text.primary,
                    marginBottom: spacing.xs,
                  }}
                >
                  {child.name}
                </div>
                <div
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: typography.body.fontSize,
                    color: colors.text.muted,
                  }}
                >
                  {child.location}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </ModuleLayout>
  );
}

