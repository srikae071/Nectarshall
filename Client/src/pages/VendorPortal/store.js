// Vendor Portal — shared in-memory store (no backend yet)
// Designed so state can later be replaced with API calls without changing the UI.

const initialPOs = [
  {
    id: 'PO-1024',
    desc: 'Software Licenses Q3',
    issueDate: '2026-08-01',
    dueDate: '2026-09-01',
    amount: 4500,
    vendor: 'Wwe Vendors',
    paymentTerms: 'Net 30',
    status: 'Accepted',
    createdAt: '2026-07-28',
    issuedAt: '2026-08-01',
    acceptedAt: '2026-08-03',
    items: [
      { desc: 'Enterprise License – Seat x50', qty: 50, rate: 80, tax: 5 },
      { desc: 'Support Package – Annual', qty: 1, rate: 500, tax: 5 },
    ],
    timeline: ['Created', 'Issued', 'Accepted'],
  },
  {
    id: 'PO-1025',
    desc: 'Office Equipment & Furniture',
    issueDate: '2026-08-05',
    dueDate: '2026-09-05',
    amount: 1250,
    vendor: 'Wwe Vendors',
    paymentTerms: 'Net 15',
    status: 'Pending Approval',
    createdAt: '2026-08-03',
    issuedAt: '2026-08-05',
    items: [
      { desc: 'Ergonomic Chair', qty: 5, rate: 180, tax: 10 },
      { desc: 'Standing Desk', qty: 2, rate: 125, tax: 10 },
    ],
    timeline: ['Created', 'Issued'],
  },
  {
    id: 'PO-1026',
    desc: 'Consulting Services – IT Audit',
    issueDate: '2026-08-07',
    dueDate: '2026-09-07',
    amount: 8000,
    vendor: 'Wwe Vendors',
    paymentTerms: 'Net 45',
    status: 'Draft',
    createdAt: '2026-08-06',
    items: [
      { desc: 'IT Security Audit', qty: 1, rate: 5000, tax: 18 },
      { desc: 'Compliance Report', qty: 1, rate: 2500, tax: 18 },
    ],
    timeline: ['Created'],
  },
  {
    id: 'PO-1027',
    desc: 'Cleaning & Facilities Q3',
    issueDate: '2026-07-20',
    dueDate: '2026-08-20',
    amount: 3200,
    vendor: 'Wwe Vendors',
    paymentTerms: 'Net 30',
    status: 'Completed',
    createdAt: '2026-07-18',
    issuedAt: '2026-07-20',
    acceptedAt: '2026-07-22',
    completedAt: '2026-08-15',
    items: [
      { desc: 'Daily Cleaning Service – 30 days', qty: 30, rate: 80, tax: 5 },
      { desc: 'Deep Cleaning – Monthly', qty: 1, rate: 400, tax: 5 },
    ],
    timeline: ['Created', 'Issued', 'Accepted', 'Work Started', 'Completed'],
  },
  {
    id: 'PO-1028',
    desc: 'Marketing Materials Print',
    issueDate: '2026-07-10',
    dueDate: '2026-08-10',
    amount: 980,
    vendor: 'Wwe Vendors',
    paymentTerms: 'Net 30',
    status: 'Rejected',
    createdAt: '2026-07-08',
    issuedAt: '2026-07-10',
    rejectedAt: '2026-07-12',
    rejectedReason: 'Budget constraints for this quarter.',
    items: [
      { desc: 'Brochure Print – 500 units', qty: 500, rate: 1.5, tax: 5 },
      { desc: 'Banner Print – 2 units', qty: 2, rate: 115, tax: 5 },
    ],
    timeline: ['Created', 'Issued'],
  },
];

const initialInvoices = [
  {
    id: 'INV-2045',
    poId: 'PO-1024',
    amount: 2400,
    invoiceDate: '2026-08-08',
    dueDate: '2026-09-07',
    status: 'Under Review',
    notes: 'First invoice for Q3 software licenses.',
    createdAt: '2026-08-08',
    submittedAt: '2026-08-09',
    items: [
      { desc: 'Enterprise License – Seat x30', qty: 30, rate: 80, tax: 5 },
    ],
    timeline: ['Created', 'Submitted', 'Under Review'],
  },
  {
    id: 'INV-2046',
    poId: 'PO-1027',
    amount: 3360,
    invoiceDate: '2026-08-15',
    dueDate: '2026-09-14',
    status: 'Paid',
    notes: 'Facilities Q3 complete.',
    createdAt: '2026-08-15',
    submittedAt: '2026-08-16',
    approvedAt: '2026-08-18',
    paidAt: '2026-08-20',
    items: [
      { desc: 'Daily Cleaning Service – 30 days', qty: 30, rate: 80, tax: 5 },
      { desc: 'Deep Cleaning – Monthly', qty: 1, rate: 400, tax: 5 },
    ],
    timeline: ['Created', 'Submitted', 'Under Review', 'Approved', 'Paid'],
  },
];

// ─── Simple reactive store ──────────────────────────────────────────────────
let _pos = [...initialPOs];
let _invoices = [...initialInvoices];
const _subscribers = new Set();

const notify = () => _subscribers.forEach(fn => fn());

export const vendorStore = {
  subscribe(fn) {
    _subscribers.add(fn);
    return () => _subscribers.delete(fn);
  },

  getPOs() { return _pos; },
  getInvoices() { return _invoices; },

  // PO actions
  updatePOStatus(poId, status, extra = {}) {
    _pos = _pos.map(po => po.id === poId ? { ...po, status, ...extra } : po);
    notify();
  },

  // Invoice actions
  addInvoice(invoice) {
    _invoices = [invoice, ..._invoices];
    notify();
  },
  updateInvoice(invId, updates) {
    _invoices = _invoices.map(inv => inv.id === invId ? { ...inv, ...updates } : inv);
    notify();
  },

  // Helpers
  getNextInvoiceId() {
    const nums = _invoices.map(inv => parseInt(inv.id.replace('INV-', '')));
    return `INV-${Math.max(...nums, 2046) + 1}`;
  },
};


