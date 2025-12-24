export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MenuCategory {
  id: string;
  label: string;
  subServices: MenuItem[];
  functions: MenuItem[];
}

export interface NavMenu {
  [key: string]: MenuCategory[];
}

export const navigationMenus: NavMenu = {
  operations: [
    {
      id: 'operational-planning',
      label: 'Operational Planning & Control',
      subServices: [
        { id: 'daily-operations-plan', label: 'Daily Operations Plan' },
      ],
      functions: [
        { id: 'operations-calendar', label: 'Operations Calendar' },
        { id: 'control-panel', label: 'Control Panel' },
      ],
    },
    {
      id: 'task-workflow',
      label: 'Task & Workflow Orchestration',
      subServices: [
        { id: 'create-task', label: 'Create Task' },
        { id: 'assign-task', label: 'Assign Task' },
        { id: 'close-task', label: 'Close Task' },
        { id: 'escalate-task', label: 'Escalate Task' },
      ],
      functions: [
        { id: 'task-board', label: 'Task Board' },
        { id: 'workflow-view', label: 'Workflow View' },
        { id: 'task-reports', label: 'Task Reports' },
      ],
    },
    {
      id: 'temple-management',
      label: 'Temple Management',
      subServices: [
        { id: 'add-temple', label: 'Add Temple' },
        { id: 'manage-hierarchy', label: 'Manage Hierarchy' }
      ],
      functions: [
        { id: 'temple-directory', label: 'Temple Directory' },
        { id: 'temple-hierarchy', label: 'Hierarchy View' },
        { id: 'temple-details', label: 'Temple Details' },
      ],
    },
    {
      id: 'ritual-seva-booking',
      label: 'Seva and Darshan Management',
      subServices: [
        { id: 'define-seva', label: 'Manage Sevas' },
        { id: 'slot-management', label: 'Slot Management' },
        { id: 'pricing-management', label: 'Pricing Management' },
      ],
      functions: [
        { id: 'seva-details', label: 'View Sevas' },
      ],
    },
    {
      id: 'crowd-capacity',
      label: 'Crowd & Capacity Management',
      subServices: [
        { id: 'lock-capacity', label: 'Manage Capacity' },
      ],
      functions: [
        { id: 'capacity-dashboard', label: 'Capacity Dashboard' },
        { id: 'crowd-monitoring', label: 'Crowd Monitoring' },
      ],
    },
    {
      id: 'kitchen-prasad',
      label: 'Kitchen & Prasad Operations',
      subServices: [
        { id: 'kitchen-planning', label: 'Kitchen Planning' },
        { id: 'prepare-prasad', label: 'Prepare & Distribute Prasad' },
        { id: 'distribution/counter-distribution', label: 'Counter Distribution' },
        { id: 'distribution/seva-distribution', label: 'Seva Distribution' },
        { id: 'distribution/annadan-distribution', label: 'Annadan Distribution' },
      ],
      functions: [
        { id: 'prasad-menu', label: 'Prasad Menu Management' },
        { id: 'kitchen-schedule', label: 'Kitchen Schedule' },
      ],
    },
    {
      id: 'perishable-inventory',
      label: 'Perishable Inventory Management',
      subServices: [
        { id: 'add-stock', label: 'Add Stock' },
        { id: 'issue-stock', label: 'Issue Stock' },
        { id: 'record-wastage', label: 'Record Wastage' },
        { id: 'rework-stock', label: 'Rework Stock' },
        { id: 'request-stock', label: 'Request Stock' },
      ],
      functions: [
        { id: '', label: 'Inventory Dashboard' }, // Main dashboard - empty id means root page
        { id: 'stock-reports', label: 'Stock Reports' },
      ],
    },
    {
      id: 'facilities-infrastructure',
      label: 'Facilities & Infrastructure Management',
      subServices: [
        { id: 'manage-lodge', label: 'Manage Lodge' },
        { id: 'manage-parking', label: 'Manage Parking' },
      ],
      functions: [
        { id: 'facilities-dashboard', label: 'Facilities Dashboard' },
        { id: 'maintenance-schedule', label: 'Maintenance Schedule' },
      ],
    },
  ],
  people: [
    {
      id: 'employee-management',
      label: 'Employee Management',
      subServices: [
        { id: 'add-employee', label: 'Add / Update Employee' },
        { id: 'update-role', label: 'Update Role / Access' },
      ],
      functions: [
        { id: 'employee-directory', label: 'Employee Directory' },
        { id: 'role-management', label: 'Role Management' },
        { id: 'access-control', label: 'Access Control' },
      ],
    },
    {
      id: 'task-assignment',
      label: 'Task Assignment',
      subServices: [
        { id: 'assign-employee-task', label: 'Assign Employee Task' },
      ],
      functions: [
        { id: 'task-assignment-view', label: 'Task Assignment View' },
        { id: 'employee-tasks', label: 'Employee Tasks' },
      ],
    },
    {
      id: 'volunteer-management',
      label: 'Volunteer Management',
      subServices: [
        { id: 'onboard-volunteer', label: 'Onboard Volunteer' },
        { id: 'assign-duty', label: 'Assign Duty' },
      ],
      functions: [
        { id: 'volunteer-directory', label: 'Volunteer Directory' },
        { id: 'duty-schedule', label: 'Duty Schedule' },
      ],
    },
    {
      id: 'freelancer-management',
      label: 'Freelancer Management',
      subServices: [
        { id: 'add-freelancer', label: 'Add / Manage Freelancer' },
        { id: 'create-contract', label: 'Create Contract' },
        { id: 'submit-work-log', label: 'Submit Work Log' },
      ],
      functions: [
        { id: 'freelancer-directory', label: 'Freelancer Directory' },
        { id: 'contract-management', label: 'Contract Management' },
      ],
    },
    {
      id: 'devotee-management',
      label: 'Devotee Management',
      subServices: [
        { id: 'create-devotee', label: 'Create / Update Devotee' },
        { id: 'view-devotee-history', label: 'View Devotee History' },
      ],
      functions: [
        { id: 'devotee-directory', label: 'Devotee Directory' },
        { id: 'devotee-history', label: 'Devotee History' },
      ],
    },
    {
      id: 'vip-devotee',
      label: 'VIP Devotee Management',
      subServices: [
        { id: 'mark-vip', label: 'Mark / Manage VIP' },
      ],
      functions: [
        { id: 'vip-directory', label: 'VIP Directory' },
        { id: 'vip-services', label: 'VIP Services' },
      ],
    },
    {
      id: 'content-management',
      label: 'Content Management',
      subServices: [
        { id: 'edit-content', label: 'Edit Temple Content' },
        { id: 'content-editor', label: 'Content Editor' },
      ],
      functions: [
        { id: 'content-library', label: 'Content Library' },
        { id: 'content-approval', label: 'Content Approval' },
        { id: 'content-history', label: 'Content History' },
      ],
    },
    {
      id: 'pr-communications',
      label: 'PR & Communications',
      subServices: [
        { id: 'publish-announcement', label: 'Publish Announcement' },
      ],
      functions: [
        { id: 'announcements', label: 'Announcements' },
        { id: 'communications', label: 'Communications Hub' },
      ],
    },
  ],
  projects: [
    {
      id: 'event-management',
      label: 'Event Management',
      subServices: [
        { id: 'create-event', label: 'Create Event' },
        { id: 'execute-event', label: 'Execute Event' },
      ],
      functions: [
        { id: 'event-calendar', label: 'Event Calendar' },
        { id: 'event-dashboard', label: 'Event Dashboard' },
        { id: 'event-reports', label: 'Event Reports' },
      ],
    },
    {
      id: 'event-donations',
      label: 'Event Donations',
      subServices: [
        { id: 'accept-donations', label: 'Accept Donations' },
      ],
      functions: [
        { id: 'donation-tracking', label: 'Donation Tracking' },
        { id: 'donation-reports', label: 'Donation Reports' },
      ],
    },
    {
      id: 'initiative-projects',
      label: 'Initiative & Project Management',
      subServices: [
        { id: 'create-initiative', label: 'Create Initiative' },
        { id: 'update-progress', label: 'Update Progress' },
      ],
      functions: [
        { id: 'project-dashboard', label: 'Project Dashboard' },
        { id: 'project-timeline', label: 'Project Timeline' },
        { id: 'project-reports', label: 'Project Reports' },
      ],
    },
    {
      id: 'initiative-donations',
      label: 'Initiative Donations',
      subServices: [
        { id: 'receive-donation', label: 'Receive Donation' },
      ],
      functions: [
        { id: 'initiative-donations', label: 'Initiative Donations' },
        { id: 'donation-analytics', label: 'Donation Analytics' },
      ],
    },
  ],
  finance: [
    {
      id: 'accounts-financial',
      label: 'Accounts & Financial Workflow',
      subServices: [
        { id: 'record-transaction', label: 'Record Transaction' },
      ],
      functions: [
        { id: 'financial-dashboard', label: 'Financial Dashboard' },
        { id: 'transaction-ledger', label: 'Transaction Ledger' },
        { id: 'financial-reports', label: 'Financial Reports' },
        { id: 'stock-requests', label: 'Stock Requests Approval' },
      ],
    },
    {
      id: 'donations-80g',
      label: 'Donations & 80G',
      subServices: [
        { id: 'generate-80g', label: 'Generate 80G Certificate' },
      ],
      functions: [
        { id: 'donation-management', label: 'Donation Management' },
        { id: '80g-certificates', label: '80G Certificates' },
        { id: 'donation-reports', label: 'Donation Reports' },
      ],
    },
    {
      id: 'compliance-legal',
      label: 'Compliance & Legal',
      subServices: [
        { id: 'file-returns', label: 'File Returns / Audits' },
      ],
      functions: [
        { id: 'compliance-dashboard', label: 'Compliance Dashboard' },
        { id: 'audit-reports', label: 'Audit Reports' },
        { id: 'legal-documents', label: 'Legal Documents' },
      ],
    },
    {
      id: 'asset-property',
      label: 'Asset & Property Management',
      subServices: [
        { id: 'update-property-value', label: 'Update Property Value' },
      ],
      functions: [
        { id: 'asset-register', label: 'Asset Register' },
        { id: 'property-management', label: 'Property Management' },
        { id: 'asset-valuation', label: 'Asset Valuation' },
      ],
    },
    {
      id: 'supplier-vendor',
      label: 'Supplier / Vendor Management',
      subServices: [
        { id: 'add-vendor', label: 'Add / Assign Vendor' },
      ],
      functions: [
        { id: 'vendor-directory', label: 'Vendor Directory' },
        { id: 'vendor-contracts', label: 'Vendor Contracts' },
        { id: 'vendor-performance', label: 'Vendor Performance' },
      ],
    },
    {
      id: 'branch-management',
      label: 'Branch Management',
      subServices: [
        { id: 'add-branch', label: 'Add / Update Branch' },
      ],
      functions: [
        { id: 'branch-directory', label: 'Branch Directory' },
        { id: 'branch-operations', label: 'Branch Operations' },
        { id: 'branch-reports', label: 'Branch Reports' },
      ],
    },
    {
      id: 'reports-audit',
      label: 'Reports & Audit',
      subServices: [
        { id: 'view-dashboards', label: 'View Dashboards' },
        { id: 'view-audit-logs', label: 'View Audit Logs' },
      ],
      functions: [
        { id: 'dashboard-hub', label: 'Dashboard Hub' },
        { id: 'audit-trail', label: 'Audit Trail' },
        { id: 'custom-reports', label: 'Custom Reports' },
      ],
    },
  ],
};
