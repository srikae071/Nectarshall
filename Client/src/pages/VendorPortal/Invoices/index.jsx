import React, { useState, useEffect, useCallback } from 'react';
import { vendorStore } from '../store';
import {
  FiSearch, FiX, FiPlus, FiCheck, FiAlertCircle, FiFileText,
  FiChevronDown, FiEye, FiSend, FiSave, FiCheckCircle, FiXCircle
} from 'react-icons/fi';
import '../Dashboard/index.css';
import '../PurchaseOrders/index.css'; // shared PO/invoice CSS

// ─── Helpers ────────────────────────────────────────────────────────────────
const calcItems = (items) => {
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const tax = items.reduce((s, it) => s + (it.qty * it.rate * it.tax) / 100, 0);
  return { subtotal, tax, total: subtotal + tax };
};
const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const today = () => new Date().toISOString().split('T')[0];

const INV_STATUS_COLORS = {
  'Draft':        { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  'Submitted':    { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'Under Review': { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Approved':     { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Rejected':     { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Paid':         { bg: '#f0fdfa', color: '#0d9488', border: '#99f6e4' },
  'Overdue':      { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
};

const PO_STATUS_COLORS = {
  'Draft':            { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  'Pending Approval': { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'Accepted':         { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Rejected':         { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Completed':        { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Cancelled':        { bg: '#fafafa', color: '#71717a', border: '#e4e4e7' },
};

const ALL_STATUSES = ['All', 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Paid', 'Overdue'];
const INV_TIMELINE = ['Created', 'Submitted', 'Under Review', 'Approved', 'Paid'];
const ELIGIBLE_PO_STATUSES = ['Accepted', 'Completed'];

const StatusBadge = ({ status, colors }) => {
  const s = (colors || INV_STATUS_COLORS)[status] || INV_STATUS_COLORS['Draft'];
  return (
    <span className="po-status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {status}
    </span>
  );
};

// ─── Invoice Detail Drawer ───────────────────────────────────────────────────
const InvoiceDetailDrawer = ({ invoice, pos, invoices, onClose, onUpdateInvoice }) => {
  const po = pos.find(p => p.id === invoice.poId);
  const { subtotal, tax, total } = calcItems(invoice.items || []);
  const [confirmAction, setConfirmAction] = useState(null);

  const doAction = (action) => {
    const now = today();
    if (action === 'submit') {
      onUpdateInvoice(invoice.id, {
        status: 'Submitted',
        submittedAt: now,
        timeline: [...(invoice.timeline || []).filter(t => t !== 'Submitted'), 'Submitted'],
      });
    } else if (action === 'approve') {
      onUpdateInvoice(invoice.id, {
        status: 'Approved',
        approvedAt: now,
        timeline: [...(invoice.timeline || []), 'Approved'],
      });
    } else if (action === 'reject') {
      onUpdateInvoice(invoice.id, {
        status: 'Rejected',
        rejectedAt: now,
      });
    } else if (action === 'markPaid') {
      onUpdateInvoice(invoice.id, {
        status: 'Paid',
        paidAt: now,
        timeline: [...(invoice.timeline || []), 'Paid'],
      });
    }
    setConfirmAction(null);
  };

  return (
    <>
      <div className="po-overlay" onClick={onClose} />
      <div className="po-drawer">
        <div className="po-drawer-header">
          <div>
            <div className="po-drawer-id">{invoice.id}</div>
            <StatusBadge status={invoice.status} colors={INV_STATUS_COLORS} />
          </div>
          <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
        </div>

        <div className="po-drawer-body">
          {/* Meta */}
          <div className="po-info-grid">
            <div className="po-info-item"><span>Invoice Date</span><strong>{fmtDate(invoice.invoiceDate)}</strong></div>
            <div className="po-info-item"><span>Due Date</span><strong>{fmtDate(invoice.dueDate)}</strong></div>
            <div className="po-info-item"><span>Related PO</span>
              <strong style={{ color: '#3b82f6' }}>{invoice.poId}</strong>
            </div>
            <div className="po-info-item"><span>Notes</span><strong>{invoice.notes || '—'}</strong></div>
          </div>

          {/* Related PO card */}
          {po && (
            <>
              <div className="po-drawer-section-title">Related Purchase Order</div>
              <div className="po-related-item">
                <div>
                  <div className="po-related-id">{po.id}</div>
                  <div className="po-related-sub">{po.desc} · {fmt(po.amount)}</div>
                </div>
                <StatusBadge status={po.status} colors={PO_STATUS_COLORS} />
              </div>
            </>
          )}

          {/* Items */}
          <div className="po-drawer-section-title" style={{ marginTop: 20 }}>Invoice Items</div>
          <table className="vendor-table po-detail-table">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Rate</th><th>Tax %</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((it, i) => (
                <tr key={i}>
                  <td>{it.desc}</td>
                  <td style={{ textAlign: 'center' }}>{it.qty}</td>
                  <td>{fmt(it.rate)}</td>
                  <td style={{ textAlign: 'center' }}>{it.tax}%</td>
                  <td style={{ fontWeight: 600 }}>{fmt(it.qty * it.rate * (1 + it.tax / 100))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="po-drawer-section-title" style={{ marginTop: 20 }}>Billing Summary</div>
          <div className="po-summary-block">
            <div className="po-summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="po-summary-row"><span>Tax</span><span>{fmt(tax)}</span></div>
            <div className="po-summary-row po-summary-total"><span>Total Amount</span><span>{fmt(total)}</span></div>
          </div>

          {/* Timeline */}
          <div className="po-drawer-section-title" style={{ marginTop: 20 }}>Invoice Timeline</div>
          <div className="po-timeline">
            {INV_TIMELINE.map((step, i) => {
              const done = invoice.timeline?.includes(step);
              return (
                <div className={`po-timeline-step ${done ? 'done' : 'pending'}`} key={i}>
                  <div className="po-timeline-dot">{done ? <FiCheck size={10} /> : null}</div>
                  {i < INV_TIMELINE.length - 1 && <div className="po-timeline-line" />}
                  <div className="po-timeline-label">{step}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="po-drawer-footer">
          {invoice.status === 'Draft' && (
            <>
              <button className="po-btn po-btn-ghost" onClick={() => setConfirmAction('submit')}><FiSend /> Submit Invoice</button>
            </>
          )}
          {invoice.status === 'Submitted' && (
            <button className="po-btn po-btn-primary" onClick={() => setConfirmAction('approve')}><FiCheckCircle /> Mark Approved</button>
          )}
          {invoice.status === 'Approved' && (
            <button className="po-btn po-btn-success" onClick={() => setConfirmAction('markPaid')}><FiCheck /> Mark as Paid</button>
          )}
          {invoice.status === 'Rejected' && (
            <button className="po-btn po-btn-primary" onClick={() => setConfirmAction('submit')}><FiSend /> Resubmit</button>
          )}
          {(invoice.status === 'Paid' || invoice.status === 'Under Review') && (
            <button className="po-btn po-btn-ghost" onClick={onClose}>Close</button>
          )}
        </div>
      </div>

      {confirmAction && (
        <div className="po-overlay" style={{ zIndex: 1100 }} onClick={() => setConfirmAction(null)}>
          <div className="po-dialog" onClick={e => e.stopPropagation()}>
            <div className="po-dialog-header">
              <h3>
                {confirmAction === 'submit' ? 'Submit Invoice' :
                 confirmAction === 'approve' ? 'Approve Invoice' :
                 confirmAction === 'markPaid' ? 'Mark as Paid' : 'Confirm'}
              </h3>
              <button className="po-icon-btn" onClick={() => setConfirmAction(null)}><FiX /></button>
            </div>
            <div className="po-dialog-body">
              <p className="po-dialog-msg">
                {confirmAction === 'submit' ? `Submit ${invoice.id} for review? You will not be able to edit it after submission.` :
                 confirmAction === 'approve' ? `Approve ${invoice.id}? This will notify the vendor.` :
                 `Mark ${invoice.id} as Paid?`}
              </p>
            </div>
            <div className="po-dialog-footer">
              <button className="po-btn po-btn-ghost" onClick={() => setConfirmAction(null)}>Cancel</button>
              <button className="po-btn po-btn-success" onClick={() => doAction(confirmAction)}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Create Invoice Modal ────────────────────────────────────────────────────
const CreateInvoiceModal = ({ pos, invoices, onClose, onCreate }) => {
  const [selectedPOId, setSelectedPOId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(today());
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const eligiblePOs = pos.filter(p => ELIGIBLE_PO_STATUSES.includes(p.status));
  const selectedPO = pos.find(p => p.id === selectedPOId);

  const items = selectedPO ? selectedPO.items : [];
  const { subtotal, tax, total } = calcItems(items);

  // Compute invoiced amount already against this PO
  const alreadyInvoiced = invoices
    .filter(i => i.poId === selectedPOId && i.status !== 'Rejected')
    .reduce((s, i) => s + i.amount, 0);
  const remaining = selectedPO ? selectedPO.amount - alreadyInvoiced : 0;
  const exceeds = total > remaining + 0.01;

  const validate = () => {
    const e = {};
    if (!selectedPOId) e.po = 'Please select a Purchase Order.';
    if (!invoiceDate) e.invoiceDate = 'Invoice date is required.';
    if (!dueDate) e.dueDate = 'Due date is required.';
    if (items.length === 0) e.items = 'The selected PO has no items.';
    return e;
  };

  const handleSave = (submit = false) => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    const newId = vendorStore.getNextInvoiceId();
    const now = today();
    const invoice = {
      id: newId,
      poId: selectedPOId,
      amount: total,
      invoiceDate,
      dueDate,
      notes,
      status: submit ? 'Submitted' : 'Draft',
      createdAt: now,
      submittedAt: submit ? now : undefined,
      items: items.map(it => ({ ...it })),
      timeline: submit ? ['Created', 'Submitted'] : ['Created'],
    };
    onCreate(invoice);
    setSaving(false);
  };

  return (
    <div className="po-overlay" onClick={onClose}>
      <div className="po-modal" onClick={e => e.stopPropagation()}>
        <div className="po-drawer-header">
          <div className="po-drawer-id">Create Invoice</div>
          <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
        </div>

        <div className="po-modal-body">
          {/* PO Selection */}
          <div className="po-field-group">
            <label className="po-field-label">Purchase Order <span style={{ color: '#ef4444' }}>*</span></label>
            <div className="po-select-wrapper">
              <select
                className={`po-select ${errors.po ? 'po-input-error' : ''}`}
                value={selectedPOId}
                onChange={e => { setSelectedPOId(e.target.value); setErrors({}); }}
              >
                <option value="">— Select a Purchase Order —</option>
                {eligiblePOs.map(p => (
                  <option key={p.id} value={p.id}>{p.id} — {p.desc} ({fmt(p.amount)})</option>
                ))}
              </select>
              <FiChevronDown className="po-select-icon" />
            </div>
            {errors.po && <div className="po-inline-error"><FiAlertCircle size={12} /> {errors.po}</div>}
          </div>

          {/* Auto-populated PO info */}
          {selectedPO && (
            <div className="po-autofill-block">
              <div className="po-autofill-row"><span>Vendor</span><strong>{selectedPO.vendor}</strong></div>
              <div className="po-autofill-row"><span>PO Description</span><strong>{selectedPO.desc}</strong></div>
              <div className="po-autofill-row"><span>Payment Terms</span><strong>{selectedPO.paymentTerms}</strong></div>
              <div className="po-autofill-row"><span>PO Amount</span><strong>{fmt(selectedPO.amount)}</strong></div>
              <div className="po-autofill-row"><span>Already Invoiced</span><strong>{fmt(alreadyInvoiced)}</strong></div>
              <div className="po-autofill-row"><span>Remaining Balance</span>
                <strong style={{ color: remaining < 0 ? '#ef4444' : '#16a34a' }}>{fmt(remaining)}</strong>
              </div>
            </div>
          )}

          {/* Invoice date fields */}
          <div className="po-field-row">
            <div className="po-field-group">
              <label className="po-field-label">Invoice Date <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="date" className={`po-input ${errors.invoiceDate ? 'po-input-error' : ''}`}
                value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
              {errors.invoiceDate && <div className="po-inline-error"><FiAlertCircle size={12} /> {errors.invoiceDate}</div>}
            </div>
            <div className="po-field-group">
              <label className="po-field-label">Due Date <span style={{ color: '#ef4444' }}>*</span></label>
              <input type="date" className={`po-input ${errors.dueDate ? 'po-input-error' : ''}`}
                value={dueDate} onChange={e => setDueDate(e.target.value)} />
              {errors.dueDate && <div className="po-inline-error"><FiAlertCircle size={12} /> {errors.dueDate}</div>}
            </div>
          </div>

          <div className="po-field-group">
            <label className="po-field-label">Reference / Notes</label>
            <textarea className="po-textarea" rows={2} placeholder="Optional reference or notes…"
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>

          {/* Items table */}
          {selectedPO && items.length > 0 && (
            <>
              <div className="po-drawer-section-title" style={{ margin: '16px 0 10px' }}>Invoice Items</div>
              <table className="vendor-table po-detail-table">
                <thead>
                  <tr><th>Item</th><th>Qty</th><th>Rate</th><th>Tax %</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {items.map((it, i) => (
                    <tr key={i}>
                      <td>{it.desc}</td>
                      <td style={{ textAlign: 'center' }}>{it.qty}</td>
                      <td>{fmt(it.rate)}</td>
                      <td style={{ textAlign: 'center' }}>{it.tax}%</td>
                      <td style={{ fontWeight: 600 }}>{fmt(it.qty * it.rate * (1 + it.tax / 100))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="po-summary-block" style={{ marginTop: 12 }}>
                <div className="po-summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="po-summary-row"><span>Tax</span><span>{fmt(tax)}</span></div>
                <div className="po-summary-row po-summary-total"><span>Total</span><span>{fmt(total)}</span></div>
              </div>

              {errors.amount && (
                <div className="po-alert po-alert-danger" style={{ marginTop: 10 }}>
                  <FiAlertCircle /> <span>{errors.amount}</span>
                </div>
              )}
            </>
          )}
          {errors.items && <div className="po-inline-error" style={{ marginTop: 8 }}><FiAlertCircle size={12} /> {errors.items}</div>}
        </div>

        <div className="po-drawer-footer">
          <button className="po-btn po-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="po-btn po-btn-outline" onClick={() => handleSave(false)} disabled={saving}>
            <FiSave /> Save Draft
          </button>
          <button className="po-btn po-btn-success" onClick={() => handleSave(true)} disabled={saving}>
            <FiSend /> Submit Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const VendorPortalInvoices = () => {
  const [invoices, setInvoices] = useState(() => vendorStore.getInvoices());
  const [pos, setPOs] = useState(() => vendorStore.getPOs());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInv, setSelectedInv] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const unsub = vendorStore.subscribe(() => {
      setInvoices([...vendorStore.getInvoices()]);
      setPOs([...vendorStore.getPOs()]);
      if (selectedInv) setSelectedInv(vendorStore.getInvoices().find(i => i.id === selectedInv.id) || null);
    });
    return unsub;
  }, [selectedInv]);

  const handleUpdateInvoice = useCallback((id, updates) => {
    vendorStore.updateInvoice(id, updates);
  }, []);

  const handleCreate = useCallback((invoice) => {
    vendorStore.addInvoice(invoice);
    setShowCreate(false);
  }, []);

  const filtered = invoices.filter(inv => {
    const q = search.toLowerCase();
    const matchSearch = inv.id.toLowerCase().includes(q) || inv.poId.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="vendor-dashboard-wrapper">
      <div className="vendor-dashboard-header">
        <div>
          <h1>Invoices</h1>
          <p>Track, submit and manage your invoices against purchase orders.</p>
        </div>
        <div className="vendor-header-actions">
          <div className="po-search-box">
            <FiSearch className="po-search-icon" />
            <input
              className="po-search-input"
              placeholder="Search by invoice or PO number…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="po-search-clear" onClick={() => setSearch('')}><FiX size={14} /></button>}
          </div>
          <button className="po-btn po-btn-success" onClick={() => setShowCreate(true)}>
            <FiPlus /> Create Invoice
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="po-filter-tabs">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            className={`po-filter-tab ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s}
            <span className="po-filter-count">
              {s === 'All' ? invoices.length : invoices.filter(i => i.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="vendor-section-card">
        {filtered.length === 0 ? (
          <div className="po-empty-state">
            <FiFileText size={40} />
            <h3>No invoices found</h3>
            <p>Try adjusting your search or create a new invoice.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="vendor-table po-table">
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>PO Number</th>
                  <th>Amount</th>
                  <th>Invoice Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id} className="po-row" onClick={() => setSelectedInv(inv)} style={{ cursor: 'pointer' }}>
                    <td className="po-id-cell">{inv.id}</td>
                    <td style={{ color: '#3b82f6', fontWeight: 500 }}>{inv.poId}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(inv.amount)}</td>
                    <td>{fmtDate(inv.invoiceDate)}</td>
                    <td>{fmtDate(inv.dueDate)}</td>
                    <td><StatusBadge status={inv.status} colors={INV_STATUS_COLORS} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="po-action-btns">
                        <button className="po-action-view" onClick={() => setSelectedInv(inv)}>
                          <FiEye size={13} /> View
                        </button>
                        {inv.status === 'Draft' && (
                          <button className="po-action-accept" title="Submit" onClick={() => {
                            vendorStore.updateInvoice(inv.id, {
                              status: 'Submitted',
                              submittedAt: today(),
                              timeline: ['Created', 'Submitted'],
                            });
                          }}>
                            <FiSend size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInv && (
        <InvoiceDetailDrawer
          invoice={selectedInv}
          pos={pos}
          invoices={invoices}
          onClose={() => setSelectedInv(null)}
          onUpdateInvoice={handleUpdateInvoice}
        />
      )}

      {showCreate && (
        <CreateInvoiceModal
          pos={pos}
          invoices={invoices}
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
};

export default VendorPortalInvoices;
