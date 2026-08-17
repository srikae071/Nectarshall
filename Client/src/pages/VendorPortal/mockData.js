export const mockVendorData = {
  kpis: {
    openRequests: { value: 24, subtitle: '8 new this week', trend: [10, 15, 12, 18, 20, 18, 24] },
    workInProgress: { value: 18, subtitle: '12 due this week', trend: [5, 8, 12, 15, 12, 16, 18] },
    accepted: { value: 42, subtitle: '+12% this month', trend: [30, 32, 35, 38, 40, 41, 42] },
    rejected: { value: 6, subtitle: '2 this week', trend: [2, 3, 2, 4, 5, 5, 6] },
    openVacancies: { value: 15, subtitle: 'Across 6 positions', trend: [10, 12, 11, 14, 15, 14, 15] },
    onboarding: { value: 9, subtitle: '4 starting this week', trend: [2, 4, 5, 7, 8, 8, 9] },
  },
  pipeline: {
    open: 24,
    inProgress: 18,
    interview: 12,
    accepted: 8,
    onboarding: 5
  },
  chart: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    received: [40, 60, 45, 80, 55, 30, 70],
    completed: [20, 40, 35, 60, 50, 20, 60]
  },
  vacancies: [
    { id: 1, position: 'Software Developer', openings: 4, submitted: 18, status: 'Open' },
    { id: 2, position: 'Accountant', openings: 2, submitted: 7, status: 'Open' },
    { id: 3, position: 'IT Support', openings: 3, submitted: 12, status: 'Open' },
    { id: 4, position: 'Cleaner', openings: 6, submitted: 25, status: 'Urgent' },
  ],
  interviews: [
    { 
      id: 1, name: 'John Smith', initials: 'JS', position: 'Software Developer', date: 'Tomorrow · 10:30 AM', status: 'Pending', color: 'purple',
      details: {
        'Date': '2026-08-14',
        'Day': 'Friday',
        'Time': '10:30 AM',
        'Interview Type': 'Technical',
        'Interviewer': 'Sarah Jenkins',
        'Experience': '5 Years',
        'Notice Period': '30 Days',
        'Current CTC': '$85,000',
        'Expected CTC': '$100,000',
        'Resume Score': '8.5/10',
        'Status': 'Pending Approval',
        'Attachments': '2 Files'
      }
    },
    { 
      id: 2, name: 'Sarah Wilson', initials: 'SW', position: 'Accountant', date: 'Tomorrow · 2:00 PM', status: 'Confirmed', color: 'pink',
      details: {
        'Date': '2026-08-14',
        'Day': 'Friday',
        'Time': '02:00 PM',
        'Interview Type': 'HR Round',
        'Interviewer': 'Michael Scott',
        'Experience': '3 Years',
        'Notice Period': 'Immediate',
        'Current CTC': '$60,000',
        'Expected CTC': '$75,000',
        'Resume Score': '9.0/10',
        'Status': 'Confirmed',
        'Attachments': '1 File'
      }
    },
    { 
      id: 3, name: 'Michael Brown', initials: 'MB', position: 'IT Support', date: '14 Aug · 11:00 AM', status: 'Confirmed', color: 'green',
      details: {
        'Date': '2026-08-14',
        'Day': 'Friday',
        'Time': '11:00 AM',
        'Interview Type': 'Technical',
        'Interviewer': 'Dwight Schrute',
        'Experience': '2 Years',
        'Notice Period': '15 Days',
        'Current CTC': '$45,000',
        'Expected CTC': '$55,000',
        'Resume Score': '7.5/10',
        'Status': 'Confirmed',
        'Attachments': '0 Files'
      }
    },
  ],
  activities: [
    { id: 1, type: 'accepted', title: 'PO-1024 accepted', time: '10 minutes ago' },
    { id: 2, type: 'submitted', title: 'Candidate submitted for Software Developer', time: '2 hours ago' },
    { id: 3, type: 'invoice', title: 'Invoice INV-2045 submitted', time: '5 hours ago' },
    { id: 4, type: 'rejected', title: 'Request REQ-1021 rejected', time: '1 day ago' },
    { id: 5, type: 'new', title: 'New vacancy received', time: '1 day ago' },
    { id: 6, type: 'onboarding', title: 'Candidate moved to onboarding', time: '2 days ago' },
  ],
  purchaseOrders: [
    { id: 'PO-1024', desc: 'Software Licenses Q3', issueDate: '2025-08-10', amount: '$4,500.00', dueDate: '2025-09-10', status: 'Accepted' },
    { id: 'PO-1025', desc: 'Office Equipment', issueDate: '2025-08-11', amount: '$1,250.00', dueDate: '2025-09-11', status: 'Pending Approval' },
    { id: 'PO-1026', desc: 'Consulting Services', issueDate: '2025-08-12', amount: '$8,000.00', dueDate: '2025-09-12', status: 'Draft' },
  ],
  invoices: [
    { id: 'INV-2045', poNumber: 'PO-1010', amount: '$2,400.00', date: '2025-08-01', dueDate: '2025-08-31', status: 'Under Review' },
    { id: 'INV-2046', poNumber: 'PO-1015', amount: '$5,000.00', date: '2025-07-15', dueDate: '2025-08-15', status: 'Paid' },
  ]
};
