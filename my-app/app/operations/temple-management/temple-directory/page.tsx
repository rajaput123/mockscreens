'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModuleLayout from '../../../components/layout/ModuleLayout';
import { colors, spacing, typography } from '../../../design-system';

interface Temple {
  id: string;
  name: string;
  location: string;
  type: 'parent' | 'child';
  parentTempleId?: string;
  parentTempleName?: string;
  status: 'active' | 'inactive';
  totalSevas: number;
  childTemples?: string[];
}

export default function TempleDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Mock data - will be replaced with actual API calls
  const temples: Temple[] = [
    {
      id: '1',
      name: 'Main Temple Complex',
      location: 'City Center',
      type: 'parent',
      status: 'active',
      totalSevas: 12,
      childTemples: ['2', '3'],
    },
    {
      id: '2',
      name: 'North Branch Temple',
      location: 'North District',
      type: 'child',
      parentTempleId: '1',
      parentTempleName: 'Main Temple Complex',
      status: 'active',
      totalSevas: 8,
    },
    {
      id: '3',
      name: 'South Branch Temple',
      location: 'South District',
      type: 'child',
      parentTempleId: '1',
      parentTempleName: 'Main Temple Complex',
      status: 'active',
      totalSevas: 6,
    },
  ];

  const filteredTemples = temples.filter(temple =>
    temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    temple.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getChildTemples = (parentId: string) => {
    return temples.filter(t => t.parentTempleId === parentId);
  };

  return (
    <ModuleLayout
      title="Temple Directory"
      description="View and manage all temples"
    >
      {/* Search and Filters */}
      <div 
        className="mb-6"
        style={{ marginBottom: spacing.lg }}
      >
        <input
          type="text"
          placeholder="Search temples by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '500px',
            padding: spacing.base,
            border: `1px solid ${colors.border}`,
            borderRadius: '16px',
            fontFamily: typography.body.fontFamily,
            fontSize: typography.body.fontSize,
          }}
        />
      </div>

      {/* Temples Table */}
      <div 
        className="rounded-3xl overflow-hidden"
        style={{
          backgroundColor: colors.background.base,
          border: `1px solid ${colors.border}`,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr
              style={{
                backgroundColor: colors.background.subtle,
                borderBottom: `2px solid ${colors.border}`,
              }}
            >
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
                Temple Name
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
                Parent Temple
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
                Location
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
                Total Sevas
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTemples
              .filter(t => !t.parentTempleId) // Show only parent temples initially
              .map((temple) => (
                <>
                  <tr
                    key={temple.id}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      cursor: temple.type === 'parent' ? 'pointer' : 'default',
                    }}
                    onClick={() => temple.type === 'parent' && toggleRow(temple.id)}
                  >
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {temple.type === 'parent' && (
                        <span style={{ marginRight: spacing.sm }}>
                          {expandedRows.has(temple.id) ? '▼' : '▶'}
                        </span>
                      )}
                      {temple.name}
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
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
                        {temple.type === 'parent' ? 'Parent' : 'Child'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.muted,
                      }}
                    >
                      {temple.parentTempleName || '-'}
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {temple.location}
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                        color: colors.text.primary,
                      }}
                    >
                      {temple.totalSevas}
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
                          backgroundColor: temple.status === 'active' ? '#d4edda' : '#f8d7da',
                          color: temple.status === 'active' ? '#155724' : '#721c24',
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                        }}
                      >
                        {temple.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: spacing.base,
                        fontFamily: typography.body.fontFamily,
                        fontSize: typography.body.fontSize,
                      }}
                    >
                      <Link
                        href={`/operations/temple-management/temple-details?templeId=${temple.id}`}
                        style={{
                          color: colors.primary.base,
                          textDecoration: 'none',
                          fontFamily: typography.body.fontFamily,
                          fontSize: typography.body.fontSize,
                        }}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                  {/* Child temples row */}
                  {temple.type === 'parent' && expandedRows.has(temple.id) && 
                    getChildTemples(temple.id).map((child) => (
                      <tr
                        key={child.id}
                        style={{
                          borderBottom: `1px solid ${colors.border}`,
                          backgroundColor: colors.background.subtle,
                        }}
                      >
                        <td
                          style={{
                            padding: spacing.base,
                            paddingLeft: spacing.xl,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          ↳ {child.name}
                        </td>
                        <td
                          style={{
                            padding: spacing.base,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          <span
                            className="rounded-xl"
                            style={{
                              padding: `${spacing.xs} ${spacing.sm}`,
                              backgroundColor: colors.background.light,
                              color: colors.text.muted,
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                            }}
                          >
                            Child
                          </span>
                        </td>
                        <td
                          style={{
                            padding: spacing.base,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.muted,
                          }}
                        >
                          {child.parentTempleName}
                        </td>
                        <td
                          style={{
                            padding: spacing.base,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {child.location}
                        </td>
                        <td
                          style={{
                            padding: spacing.base,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                            color: colors.text.primary,
                          }}
                        >
                          {child.totalSevas}
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
                              backgroundColor: child.status === 'active' ? '#d4edda' : '#f8d7da',
                              color: child.status === 'active' ? '#155724' : '#721c24',
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                            }}
                          >
                            {child.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: spacing.base,
                            fontFamily: typography.body.fontFamily,
                            fontSize: typography.body.fontSize,
                          }}
                        >
                          <Link
                            href={`/operations/temple-management/temple-details?templeId=${child.id}`}
                            style={{
                              color: colors.primary.base,
                              textDecoration: 'none',
                              fontFamily: typography.body.fontFamily,
                              fontSize: typography.body.fontSize,
                            }}
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
                </>
              ))}
          </tbody>
        </table>

        {filteredTemples.length === 0 && (
          <div
            style={{
              padding: spacing.xl,
              textAlign: 'center',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              color: colors.text.muted,
            }}
          >
            No temples found. Try adjusting your search criteria.
          </div>
        )}
      </div>
    </ModuleLayout>
  );
}

