'use client';

import { useState, useEffect } from 'react';
import { Modal } from '../../../components';
import { colors, spacing, typography, shadows } from '../../../design-system';

interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  aadharNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  salary?: string;
  designation?: string;
  reportingManager?: string;
  workLocation?: string;
  shift?: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmployeeFormData) => void;
  initialData?: EmployeeFormData;
}

// Available options for dropdowns
const ROLES = [
  'Temple Administrator',
  'Operations Manager',
  'HR / Admin Team',
  'PR / Content Team',
  'Trustees',
  'HR Executive',
  'Accounts Officer',
  'Finance Manager',
  'Security Officer',
  'Maintenance Staff',
  'Prasad Coordinator',
  'Event Manager',
  'IT Support',
  'Other',
];

const DEPARTMENTS = [
  'Operations',
  'Human Resources',
  'Finance',
  'Administration',
  'Security',
  'Maintenance',
  'PR & Communications',
  'IT',
  'Events',
  'Prasad Management',
  'Other',
];

const DESIGNATIONS = [
  'Senior Manager',
  'Manager',
  'Executive',
  'Officer',
  'Coordinator',
  'Assistant',
  'Staff',
  'Other',
];

const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Puducherry',
];

const EMERGENCY_RELATIONS = [
  'Father',
  'Mother',
  'Spouse',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Other Relative',
  'Friend',
];

const WORK_LOCATIONS = [
  'Main Temple',
  'Branch Office',
  'Administrative Office',
  'Event Hall',
  'Prasad Kitchen',
  'Other',
];

export default function AddEmployeeModal({ isOpen, onClose, onSave, initialData }: AddEmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    alternatePhone: '',
    role: '',
    department: '',
    status: 'active',
    joinDate: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    aadharNumber: '',
    panNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    salary: '',
    designation: '',
    reportingManager: '',
    workLocation: '',
    shift: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'financial' | 'work'>('basic');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        phone: '',
        alternatePhone: '',
        role: '',
        department: '',
        status: 'active',
        joinDate: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelation: '',
        aadharNumber: '',
        panNumber: '',
        bankAccountNumber: '',
        ifscCode: '',
        salary: '',
        designation: '',
        reportingManager: '',
        workLocation: '',
        shift: '',
      });
      setErrors({});
      setActiveTab('basic');
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EmployeeFormData, string>> = {};

    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.joinDate.trim()) newErrors.joinDate = 'Join date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSave(formData);
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  const renderBasicInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Employee ID <span style={{ color: colors.error.base }}>*</span>
            </span>
          </label>
          <input
            type="text"
            value={formData.employeeId}
            onChange={(e) => handleChange('employeeId', e.target.value)}
            placeholder="Enter employee ID (e.g., EMP001)"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.employeeId ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
          {errors.employeeId && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.employeeId}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Full Name <span style={{ color: colors.error.base }}>*</span>
            </span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Arjun Rao"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.name ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
          {errors.name && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Email Address <span style={{ color: colors.error.base }}>*</span>
            </span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g., arjun.rao@temple.org"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.email ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
          {errors.email && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Phone Number <span style={{ color: colors.error.base }}>*</span>
            </span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="e.g., +91 98765 43210"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.phone ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
          {errors.phone && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Alternate Phone
            </span>
          </label>
          <input
            type="tel"
            value={formData.alternatePhone}
            onChange={(e) => handleChange('alternatePhone', e.target.value)}
            placeholder="e.g., +91 98765 43211"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Role <span style={{ color: colors.error.base }}>*</span>
            </span>
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.role ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="">Select Role</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.role}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Department <span style={{ color: colors.error.base }}>*</span>
            </span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.department ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.department}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Designation
            </span>
          </label>
          <select
            value={formData.designation}
            onChange={(e) => handleChange('designation', e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="">Select Designation</option>
            {DESIGNATIONS.map((desig) => (
              <option key={desig} value={desig}>
                {desig}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Join Date <span style={{ color: colors.error.base }}>*</span>
            </span>
          </label>
          <input
            type="date"
            value={formData.joinDate}
            onChange={(e) => handleChange('joinDate', e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: errors.joinDate ? colors.error.base : colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
          {errors.joinDate && (
            <p className="mt-1 text-xs" style={{ color: colors.error.base }}>
              {errors.joinDate}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Status
            </span>
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-4">
      <div>
        <h3
          style={{
            fontFamily: typography.sectionHeader.fontFamily,
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: spacing.md,
          }}
        >
          Address Information
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                Address
              </span>
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Enter complete address with street, area, landmark..."
              rows={3}
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all resize-none"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  City
                </span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Enter city name (e.g., Mumbai)"
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  boxShadow: shadows.sm,
                }}
              />
            </div>

            <div>
              <label className="block mb-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  State
                </span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  boxShadow: shadows.sm,
                }}
              >
                <option value="">Select State</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Pincode
                </span>
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
                placeholder="Enter 6-digit pincode (e.g., 400001)"
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  boxShadow: shadows.sm,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3
          style={{
            fontFamily: typography.sectionHeader.fontFamily,
            fontSize: '1rem',
            fontWeight: 600,
            color: colors.text.primary,
            marginBottom: spacing.md,
            marginTop: spacing.lg,
          }}
        >
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                Contact Name
              </span>
            </label>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => handleChange('emergencyContactName', e.target.value)}
              placeholder="Enter emergency contact name (e.g., Ramesh Rao)"
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            />
          </div>

          <div>
            <label className="block mb-2">
              <span
                style={{
                  fontFamily: typography.body.fontFamily,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: colors.text.primary,
                }}
              >
                Contact Phone
              </span>
            </label>
            <input
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
              placeholder="Enter emergency contact phone (e.g., +91 98765 43212)"
              className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: colors.border,
                fontFamily: typography.body.fontFamily,
                fontSize: typography.body.fontSize,
                boxShadow: shadows.sm,
              }}
            />
          </div>

            <div>
              <label className="block mb-2">
                <span
                  style={{
                    fontFamily: typography.body.fontFamily,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.text.primary,
                  }}
                >
                  Relation
                </span>
              </label>
              <select
                value={formData.emergencyContactRelation}
                onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: colors.border,
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.body.fontSize,
                  boxShadow: shadows.sm,
                }}
              >
                <option value="">Select Relation</option>
                {EMERGENCY_RELATIONS.map((relation) => (
                  <option key={relation} value={relation}>
                    {relation}
                  </option>
                ))}
              </select>
            </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Aadhar Number
            </span>
          </label>
          <input
            type="text"
            value={formData.aadharNumber}
            onChange={(e) => handleChange('aadharNumber', e.target.value)}
            placeholder="Enter 12-digit Aadhar number (e.g., 1234 5678 9012)"
            maxLength={14}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              PAN Number
            </span>
          </label>
          <input
            type="text"
            value={formData.panNumber}
            onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
            placeholder="Enter 10-character PAN number (e.g., ABCDE1234F)"
            maxLength={10}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Bank Account Number
            </span>
          </label>
          <input
            type="text"
            value={formData.bankAccountNumber}
            onChange={(e) => handleChange('bankAccountNumber', e.target.value)}
            placeholder="Enter bank account number (e.g., 123456789012)"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              IFSC Code
            </span>
          </label>
          <input
            type="text"
            value={formData.ifscCode}
            onChange={(e) => handleChange('ifscCode', e.target.value.toUpperCase())}
            placeholder="Enter 11-character IFSC code (e.g., HDFC0001234)"
            maxLength={11}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Salary (Monthly)
            </span>
          </label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
            placeholder="Enter monthly salary in rupees (e.g., 50000)"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderWorkInfo = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Reporting Manager
            </span>
          </label>
          <input
            type="text"
            value={formData.reportingManager}
            onChange={(e) => handleChange('reportingManager', e.target.value)}
            placeholder="Enter reporting manager name or employee ID"
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          />
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Work Location
            </span>
          </label>
          <select
            value={formData.workLocation}
            onChange={(e) => handleChange('workLocation', e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="">Select Work Location</option>
            {WORK_LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">
            <span
              style={{
                fontFamily: typography.body.fontFamily,
                fontSize: '0.875rem',
                fontWeight: 600,
                color: colors.text.primary,
              }}
            >
              Shift
            </span>
          </label>
          <select
            value={formData.shift}
            onChange={(e) => handleChange('shift', e.target.value)}
            className="w-full px-4 py-2 rounded-2xl border focus:outline-none focus:ring-2 transition-all"
            style={{
              borderColor: colors.border,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              boxShadow: shadows.sm,
            }}
          >
            <option value="">Select Shift</option>
            <option value="morning">Morning (6 AM - 2 PM)</option>
            <option value="afternoon">Afternoon (2 PM - 10 PM)</option>
            <option value="night">Night (10 PM - 6 AM)</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Employee' : 'Add New Employee'} size="xl">
      <form onSubmit={handleSubmit}>
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b" style={{ borderColor: colors.border }}>
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className="px-4 py-2 rounded-t-2xl transition-all"
            style={{
              backgroundColor: activeTab === 'basic' ? colors.primary.light : 'transparent',
              color: activeTab === 'basic' ? colors.primary.base : colors.text.muted,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: activeTab === 'basic' ? 600 : 400,
            }}
          >
            Basic Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className="px-4 py-2 rounded-t-2xl transition-all"
            style={{
              backgroundColor: activeTab === 'contact' ? colors.primary.light : 'transparent',
              color: activeTab === 'contact' ? colors.primary.base : colors.text.muted,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: activeTab === 'contact' ? 600 : 400,
            }}
          >
            Contact & Address
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('financial')}
            className="px-4 py-2 rounded-t-2xl transition-all"
            style={{
              backgroundColor: activeTab === 'financial' ? colors.primary.light : 'transparent',
              color: activeTab === 'financial' ? colors.primary.base : colors.text.muted,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: activeTab === 'financial' ? 600 : 400,
            }}
          >
            Financial Details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('work')}
            className="px-4 py-2 rounded-t-2xl transition-all"
            style={{
              backgroundColor: activeTab === 'work' ? colors.primary.light : 'transparent',
              color: activeTab === 'work' ? colors.primary.base : colors.text.muted,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: activeTab === 'work' ? 600 : 400,
            }}
          >
            Work Details
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-y-auto" style={{ paddingBottom: spacing.md }}>
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'contact' && renderContactInfo()}
          {activeTab === 'financial' && renderFinancialInfo()}
          {activeTab === 'work' && renderWorkInfo()}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 mt-6 border-t" style={{ borderColor: colors.border }}>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-2xl border-2 transition-all hover:scale-105"
            style={{
              borderColor: colors.border,
              color: colors.text.primary,
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
              boxShadow: shadows.sm,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-2xl transition-all hover:scale-105 disabled:opacity-50"
            style={{
              backgroundColor: colors.primary.base,
              color: '#ffffff',
              fontFamily: typography.body.fontFamily,
              fontSize: typography.body.fontSize,
              fontWeight: 500,
              boxShadow: shadows.md,
            }}
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

