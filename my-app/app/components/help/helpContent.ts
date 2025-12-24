export interface HelpContent {
  id: string;
  title: string;
  overview: string;
  steps?: string[];
  tips?: string[];
  related?: string[];
  faq?: Array<{ question: string; answer: string }>;
}

export interface HelpContentMap {
  [key: string]: HelpContent;
}

export const helpContent: HelpContentMap = {
  dashboard: {
    id: 'dashboard',
    title: 'Dashboard Overview',
    overview: 'The dashboard provides a comprehensive overview of your temple operations, including calendar events, tasks, financial summaries, and announcements.',
    steps: [
      'View today\'s events and schedule in the Calendar Planning Zone',
      'Check upcoming events and celebrations in the Events Snapshot',
      'Monitor task status and assignments in Task Management',
      'Review financial summaries including revenue, expenses, and donations',
      'Stay updated with important announcements',
    ],
    tips: [
      'Click on any date in the calendar to view events for that day',
      'Use the carousel navigation to switch between different dashboard views',
      'Today\'s date is automatically highlighted in the calendar',
    ],
    related: ['operations', 'people', 'projects', 'finance'],
    faq: [
      {
        question: 'How do I view events for a specific date?',
        answer: 'Click on any date in the calendar. The selected date will show its scheduled events below the calendar.',
      },
      {
        question: 'Can I change the calendar type?',
        answer: 'Yes, use the calendar type buttons (Temple Calendar, Shri Gurugal, Temple Executive) to switch between different calendar views.',
      },
    ],
  },
  'employee-management': {
    id: 'employee-management',
    title: 'Employee Management',
    overview: 'Manage your temple staff, including adding new employees, updating roles, and controlling access permissions.',
    steps: [
      'Navigate to People > Employee Management',
      'Use "Add / Update Employee" to create or modify employee records',
      'Use "Update Role / Access" to manage permissions',
      'View all employees in the Employee Directory',
      'Manage roles and access controls in Role Management',
    ],
    tips: [
      'Ensure all required fields are filled when adding an employee',
      'Regularly review and update employee roles as responsibilities change',
      'Use the Employee Directory to quickly find employee information',
    ],
    related: ['task-assignment', 'role-management'],
  },
  'create-booking': {
    id: 'create-booking',
    title: 'Create Booking',
    overview: 'Create and manage bookings for rituals, seva, and other temple services.',
    steps: [
      'Navigate to Operations > Ritual Seva & Booking Management > Create Booking',
      'Select the type of booking (ritual, seva, etc.)',
      'Choose the date and time for the booking',
      'Enter devotee information',
      'Review and confirm the booking details',
      'Submit to create the booking',
    ],
    tips: [
      'Check calendar availability before creating a booking',
      'Ensure all required information is provided for accurate booking records',
      'Bookings can be modified or cancelled after creation',
    ],
    related: ['ritual-seva-booking', 'seva-calendar'],
  },
  'financial-dashboard': {
    id: 'financial-dashboard',
    title: 'Financial Dashboard',
    overview: 'Monitor your temple\'s financial health with comprehensive revenue, expense, and donation tracking.',
    steps: [
      'Navigate to Finance > Accounts & Financial Workflow > Financial Dashboard',
      'View daily, monthly, and yearly financial summaries',
      'Analyze revenue trends and expense categories',
      'Review donation records and 80G certificates',
      'Generate financial reports as needed',
    ],
    tips: [
      'Regularly review financial summaries to track temple finances',
      'Use expense categories to understand spending patterns',
      'Keep donation records updated for accurate reporting',
    ],
    related: ['accounts-financial', 'donations-80g'],
  },
  'create-event': {
    id: 'create-event',
    title: 'Create Event',
    overview: 'Plan and manage temple events, festivals, and celebrations.',
    steps: [
      'Navigate to Projects > Event Management > Create Event',
      'Enter event details (name, date, time, type)',
      'Set event capacity and requirements',
      'Assign staff and resources',
      'Configure event notifications',
      'Save and publish the event',
    ],
    tips: [
      'Plan events well in advance to ensure proper resource allocation',
      'Consider crowd capacity when scheduling major festivals',
      'Use the event calendar to avoid scheduling conflicts',
    ],
    related: ['event-management', 'event-calendar'],
  },
  'ritual-seva-booking': {
    id: 'ritual-seva-booking',
    title: 'Ritual, Seva & Booking Management',
    overview: 'Comprehensive management of rituals, seva services, and bookings.',
    steps: [
      'Define seva types and their requirements',
      'Schedule seva services in the calendar',
      'Create bookings for devotees',
      'Execute scheduled seva and rituals',
      'Track completion and manage cancellations',
    ],
    tips: [
      'Maintain an updated list of available seva types',
      'Schedule seva in advance to manage resources effectively',
      'Keep accurate records of all bookings and executions',
    ],
    related: ['create-booking', 'seva-calendar'],
  },
};

export function getHelpContent(context?: string, module?: string, feature?: string): HelpContent | null {
  const key = feature || module || context || 'dashboard';
  return helpContent[key] || helpContent.dashboard;
}

export function searchHelpContent(query: string): HelpContent[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(helpContent).filter((content) => {
    return (
      content.title.toLowerCase().includes(lowerQuery) ||
      content.overview.toLowerCase().includes(lowerQuery) ||
      content.steps?.some((step) => step.toLowerCase().includes(lowerQuery)) ||
      content.tips?.some((tip) => tip.toLowerCase().includes(lowerQuery)) ||
      content.faq?.some((item) => 
        item.question.toLowerCase().includes(lowerQuery) ||
        item.answer.toLowerCase().includes(lowerQuery)
      )
    );
  });
}
