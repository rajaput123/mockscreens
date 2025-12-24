'use client';

import { useState, useEffect } from 'react';
import ModuleLayout from '../components/layout/ModuleLayout';
import ModuleNavigation from '../components/layout/ModuleNavigation';
import HelpButton from '../components/help/HelpButton';
import { navigationMenus } from '../components/navigation/navigationData';
import Link from 'next/link';
import {
  getAllEmployees,
  getAllFreelancers,
  getAllVolunteers,
  getAllDevotees,
  getAllVIPDevotees,
  getActiveEmployees,
  getActiveFreelancers,
  getActiveVolunteers,
  getActiveDevotees,
} from './peopleData';
import { colors, spacing, typography } from '../design-system';

export default function PeopleModulePage() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    totalFreelancers: 0,
    activeFreelancers: 0,
    totalVolunteers: 0,
    activeVolunteers: 0,
    totalDevotees: 0,
    activeDevotees: 0,
    totalVIP: 0,
  });

  useEffect(() => {
    const employees = getAllEmployees();
    const freelancers = getAllFreelancers();
    const volunteers = getAllVolunteers();
    const devotees = getAllDevotees();
    const vipDevotees = getAllVIPDevotees();

    setStats({
      totalEmployees: employees.length,
      activeEmployees: getActiveEmployees().length,
      totalFreelancers: freelancers.length,
      activeFreelancers: getActiveFreelancers().length,
      totalVolunteers: volunteers.length,
      activeVolunteers: getActiveVolunteers().length,
      totalDevotees: devotees.length,
      activeDevotees: getActiveDevotees().length,
      totalVIP: vipDevotees.length,
    });
  }, []);

  const peopleModules = navigationMenus.people;

  return (
    <ModuleLayout
      title="People Management"
      description="Manage employees, freelancers, volunteers, and devotees"
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Employees */}
        <Link
          href="/people/employee-management"
          className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-amber-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <h3
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.sm,
              color: colors.text.primary,
            }}
            className="group-hover:text-amber-600 transition-colors duration-200"
          >
            Employees
          </h3>
          <p
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: '32px',
              fontWeight: typography.kpi.fontWeight,
              color: colors.primary.base,
            }}
            className="transform group-hover:scale-110 transition-transform duration-200 inline-block"
          >
            {stats.totalEmployees}
          </p>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '14px',
              color: colors.text.muted,
              marginTop: spacing.xs,
            }}
          >
            {stats.activeEmployees} active
          </p>
        </Link>

        {/* Freelancers */}
        <Link
          href="/people/freelancer-management"
          className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <h3
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.sm,
              color: colors.text.primary,
            }}
            className="group-hover:text-amber-600 transition-colors duration-200"
          >
            Freelancers
          </h3>
          <p
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: '32px',
              fontWeight: typography.kpi.fontWeight,
              color: colors.primary.base,
            }}
            className="transform group-hover:scale-110 transition-transform duration-200 inline-block"
          >
            {stats.totalFreelancers}
          </p>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '14px',
              color: colors.text.muted,
              marginTop: spacing.xs,
            }}
          >
            {stats.activeFreelancers} active
          </p>
        </Link>

        {/* Volunteers */}
        <Link
          href="/people/volunteer-management"
          className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-green-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <h3
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.sm,
              color: colors.text.primary,
            }}
            className="group-hover:text-amber-600 transition-colors duration-200"
          >
            Volunteers
          </h3>
          <p
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: '32px',
              fontWeight: typography.kpi.fontWeight,
              color: colors.primary.base,
            }}
            className="transform group-hover:scale-110 transition-transform duration-200 inline-block"
          >
            {stats.totalVolunteers}
          </p>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '14px',
              color: colors.text.muted,
              marginTop: spacing.xs,
            }}
          >
            {stats.activeVolunteers} active
          </p>
        </Link>

        {/* Devotees */}
        <Link
          href="/people/devotee-management"
          className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
        >
          <h3
            style={{
              fontFamily: typography.sectionHeader.fontFamily,
              fontSize: typography.sectionHeader.fontSize,
              fontWeight: typography.sectionHeader.fontWeight,
              marginBottom: spacing.sm,
              color: colors.text.primary,
            }}
            className="group-hover:text-amber-600 transition-colors duration-200"
          >
            Devotees
          </h3>
          <p
            style={{
              fontFamily: typography.kpi.fontFamily,
              fontSize: '32px',
              fontWeight: typography.kpi.fontWeight,
              color: colors.primary.base,
            }}
            className="transform group-hover:scale-110 transition-transform duration-200 inline-block"
          >
            {stats.totalDevotees}
          </p>
          <p
            style={{
              fontFamily: typography.body.fontFamily,
              fontSize: '14px',
              color: colors.text.muted,
              marginTop: spacing.xs,
            }}
          >
            {stats.activeDevotees} active • {stats.totalVIP} VIP
          </p>
        </Link>
      </div>

      {/* Module Navigation */}
      <div className="space-y-6">
        {peopleModules.map((module) => (
          <div
            key={module.id}
            className="rounded-3xl p-6"
            style={{
              backgroundColor: colors.background.base,
              border: `1px solid ${colors.border}`,
              padding: spacing.xl,
            }}
          >
            <ModuleNavigation
              subServices={module.subServices}
              functions={module.functions}
              moduleId={module.id}
              category="people"
            />
          </div>
        ))}
      </div>

      <HelpButton module="people" />
    </ModuleLayout>
  );
}

