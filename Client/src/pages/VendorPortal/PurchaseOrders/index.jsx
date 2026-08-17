import React, { useState, useEffect, useCallback } from 'react';
import { vendorStore } from '../store';
import {
  FiSearch, FiX, FiChevronDown, FiCheck, FiAlertCircle,
  FiFileText, FiClock, FiCheckCircle, FiXCircle, FiSliders,
  FiChevronRight, FiEye, FiPlay, FiCornerUpRight
} from 'react-icons/fi';
import '../Dashboard/index.css';
import './index.css';

// ─── Helpers ────────────────────────────────────────────────────────────────
const calcItems = (items) => {
  const subtotal = items.reduce((s, it) => s + it.qty * it.rate, 0);
  const tax = items.reduce((s, it) => s + (it.qty * it.rate * it.tax) / 100, 0);
  return { subtotal, tax, total: subtotal + tax };
};

const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const STATUS_COLORS = {
  'Draft':            { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  'Pending Approval': { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' },
  'Accepted':         { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  'Rejected':         { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
  'Completed':        { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  'Cancelled':        { bg: '#fafafa', color: '#71717a', border: '#e4e4e7' },
};

const ALL_STATUSES = ['All', 'Draft', 'Pending Approval', 'Accepted', 'Rejected', 'Completed', 'Cancelled'];

const TIMELINE_ALL = ['Created', 'Issued', 'Accepted', 'Work Started', 'Completed'];

// ─── Status Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const s = STATUS_COLORS[status] || STATUS_COLORS['Draft'];
  return (
    <span className="po-status-badge" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {status}
    </span>
  );
};

// ─── Confirm Dialog ──────────────────────────────────────────────────────────
const ConfirmDialog = ({ title, message, confirmLabel, confirmClass, onConfirm, onCancel, children }) => (
  <div className="po-overlay" onClick={onCancel}>
    <div className="po-dialog" onClick={e => e.stopPropagation()}>
      <div className="po-dialog-header">
        <h3>{title}</h3>
        <button className="po-icon-btn" onClick={onCancel}><FiX /></button>
      </div>
      <div className="po-dialog-body">
        {message && <p className="po-dialog-msg">{message}</p>}
        {children}
      </div>
      <div className="po-dialog-footer">
        <button className="po-btn po-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className={`po-btn ${confirmClass}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </div>
);

// ─── PO Detail Drawer ────────────────────────────────────────────────────────
const PODetailDrawer = ({ po, invoices, onClose, onAction }) => {
  const [dialog, setDialog] = useState(null); // 'accept' | 'reject' | 'start'
  const [rejectReason, setRejectReason] = useState('');
  const [rejectErr, setRejectErr] = useState('');

  const { subtotal, tax, total } = calcItems(po.items);
  const relatedInvoices = invoices.filter(inv => inv.poId === po.id);

  const handleAccept = () => {
    onAction('accept', po.id);
    setDialog(null);
  };
  const handleReject = () => {
    if (!rejectReason.trim()) { setRejectErr('Please provide a reason for rejection.'); return; }
    onAction('reject', po.id, { rejectedReason: rejectReason });
    setDialog(null);
  };
  const handleStart = () => {
    onAction('start', po.id);
    setDialog(null);
  };

  return (
    <>
      <div className="po-overlay" onClick={onClose} />
      <div className="po-drawer">
        {/* Header */}
        <div className="po-drawer-header">
          <div>
            <div className="po-drawer-id">{po.id}</div>
            <StatusBadge status={po.status} />
          </div>
          <button className="po-icon-btn" onClick={onClose}><FiX size={18} /></button>
        </div>

        <div className="po-drawer-body">
          {/* Meta grid */}
          <div className="po-info-grid">
            <div className="po-info-item"><span>Issue Date</span><strong>{fmtDate(po.issueDate)}</strong></div>
            <div className="po-info-item"><span>Due Date</span><strong>{fmtDate(po.dueDate)}</strong></div>
            <div className="po-info-item"><span>Vendor</span><strong>{po.vendor}</strong></div>
            <div className="po-info-item"><span>Payment Terms</span><strong>{po.paymentTerms}</strong></div>
            <div className="po-info-item" style={{ gridColumn: '1 / -1' }}><span>Description</span><strong>{po.desc}</strong></div>
          </div>

          {/* Items */}
          <div className="po-drawer-section-title">PO Items</div>
          <table className="vendor-table po-detail-table">
            <thead>
              <tr><th>Item / Service</th><th>Qty</th><th>Unit Rate</th><th>Tax %</th><th>Total</th></tr>
            </thead>
            <tbody>
              {po.items.map((it, i) => (
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

          {/* Payment Summary */}
          <div className="po-drawer-section-title" style={{ marginTop: 20 }}>Payment Summary</div>
          <div className="po-summary-block">
            <div className="po-summary-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="po-summary-row"><span>Tax</span><span>{fmt(tax)}</span></div>
            <div className="po-summary-row po-summary-total"><span>Total Amount</span><span>{fmt(total)}</span></div>
            <div className="po-summary-row"><span>Payment Terms</span><span>{po.paymentTerms}</span></div>
          </div>

          {/* Timeline */}
          <div className="po-drawer-section-title" style={{ marginTop: 20 }}>PO Timeline</div>
          <div className="po-timeline">
            {TIMELINE_ALL.map((step, i) => {
              const done = po.timeline?.includes(step);
              return (
                <div className={`po-timeline-step ${done ? 'done' : 'pending'}`} key={i}>
                  <div className="po-timeline-dot">{done ? <FiCheck size={10} /> : null}</div>
                  {i < TIMELINE_ALL.length - 1 && <div className="po-timeline-line" />}
                  <div className="po-timeline-label">{step}</div>
                </div>
              );
            })}
          </div>

          {/* Reject reason display */}
          {po.status === 'Rejected' && po.rejectedReason && (
            <div className="po-alert po-alert-danger">
              <FiAlertCircle /> <span><strong>Rejection reason:</strong> {po.rejectedReason}</span>
            </div>
          )}

          {/* Related Invoices */}
          {relatedInvoices.length > 0 && (
            <>
              <div className="po-drawer-section-title" style={{ marginTop: 20 }}>Related Invoices</div>
              {relatedInvoices.map(inv => (
                <div className="po-related-item" key={inv.id}>
                  <div>
                    <div className="po-related-id">{inv.id}</div>
                    <div className="po-related-sub">{fmt(inv.amount)}</div>
                  </div>
                  <StatusBadge status={inv.status} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Actions footer */}
        <div className="po-drawer-footer">
          {po.status === 'Pending Approval' && (
            <>
              <button className="po-btn po-btn-danger-outline" onClick={() => setDialog('reject')}><FiXCircle /> Reject PO</button>
              <button className="po-btn po-btn-success" onClick={() => setDialog('accept')}><FiCheckCircle /> Accept PO</button>
            </>
          )}
          {po.status === 'Accepted' && (
            <button className="po-btn po-btn-primary" onClick={() => setDialog('start')}><FiPlay /> Start Work / Acknowledge</button>
          )}
          {(po.status === 'Draft' || po.status === 'Completed' || po.status === 'Rejected' || po.status === 'Cancelled') && (
            <button className="po-btn po-btn-ghost" onClick={onClose}>Close</button>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {dialog === 'accept' && (
        <ConfirmDialog
          title="Accept Purchase Order"
          message={`Are you sure you want to accept ${po.id}? This will notify the procurement team.`}
          confirmLabel="Accept PO"
          confirmClass="po-btn-success"
          onConfirm={handleAccept}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog === 'reject' && (
        <ConfirmDialog
          title="Reject Purchase Order"
          confirmLabel="Reject PO"
          confirmClass="po-btn-danger"
          onConfirm={handleReject}
          onCancel={() => { setDialog(null); setRejectReason(''); setRejectErr(''); }}
        >
          <label className="po-field-label">Reason for rejection <span style={{ color: '#ef4444' }}>*</span></label>
          <textarea
            className={`po-textarea ${rejectErr ? 'po-input-error' : ''}`}
            rows={3}
            placeholder="Enter the reason for rejecting this PO…"
            value={rejectReason}
            onChange={e => { setRejectReason(e.target.value); setRejectErr(''); }}
          />
          {rejectErr && <div className="po-inline-error"><FiAlertCircle size={12} /> {rejectErr}</div>}
        </ConfirmDialog>
      )}
      {dialog === 'start' && (
        <ConfirmDialog
          title="Acknowledge & Start Work"
          message={`Confirming that you are starting work on ${po.id}. This action cannot be undone.`}
          confirmLabel="Start Work"
          confirmClass="po-btn-primary"
          onConfirm={handleStart}
          onCancel={() => setDialog(null)}
        />
      )}
    </>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const VendorPortalPurchaseOrders = () => {
  const [pos, setPOs] = useState(() => vendorStore.getPOs());
  const [invoices, setInvoices] = useState(() => vendorStore.getInvoices());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedPO, setSelectedPO] = useState(null);

  useEffect(() => {
    const unsub = vendorStore.subscribe(() => {
      setPOs([...vendorStore.getPOs()]);
      setInvoices([...vendorStore.getInvoices()]);
      // Keep drawer in sync
      if (selectedPO) setSelectedPO(vendorStore.getPOs().find(p => p.id === selectedPO.id) || null);
    });
    return unsub;
  }, [selectedPO]);

  const handleAction = useCallback((action, poId, extra = {}) => {
    const now = new Date().toISOString().split('T')[0];
    if (action === 'accept') {
      vendorStore.updatePOStatus(poId, 'Accepted', {
        acceptedAt: now,
        timeline: [...(vendorStore.getPOs().find(p => p.id === poId)?.timeline || []), 'Accepted'],
      });
    } else if (action === 'reject') {
      vendorStore.updatePOStatus(poId, 'Rejected', {
        rejectedAt: now,
        ...extra,
      });
    } else if (action === 'start') {
      const po = vendorStore.getPOs().find(p => p.id === poId);
      vendorStore.updatePOStatus(poId, 'Accepted', {
        timeline: [...(po?.timeline || []), 'Work Started'],
      });
    }
  }, []);

  const filtered = pos.filter(po => {
    const q = search.toLowerCase();
    const matchesSearch = po.id.toLowerCase().includes(q) || po.desc.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'All' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="vendor-dashboard-wrapper">
      {/* Page Header */}
      <div className="vendor-dashboard-header">
        <div>
          <h1>Purchase Orders</h1>
          <p>Manage and track your purchase orders from the procurement team.</p>
        </div>
        <div className="vendor-header-actions">
          <div className="po-search-box">
            <FiSearch className="po-search-icon" />
            <input
              className="po-search-input"
              placeholder="Search by PO number or description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className="po-search-clear" onClick={() => setSearch('')}><FiX size={14} /></button>}
          </div>
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
              {s === 'All' ? pos.length : pos.filter(p => p.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="vendor-section-card">
        {filtered.length === 0 ? (
          <div className="po-empty-state">
            <FiFileText size={40} />
            <h3>No purchase orders found</h3>
            <p>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="vendor-table po-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Description</th>
                  <th>Issue Date</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(po => (
                  <tr key={po.id} className="po-row" onClick={() => setSelectedPO(po)} style={{ cursor: 'pointer' }}>
                    <td className="po-id-cell">{po.id}</td>
                    <td>{po.desc}</td>
                    <td>{fmtDate(po.issueDate)}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(po.amount)}</td>
                    <td>{fmtDate(po.dueDate)}</td>
                    <td><StatusBadge status={po.status} /></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="po-action-btns">
                        <button className="po-action-view" onClick={() => setSelectedPO(po)}>
                          <FiEye size={13} /> View
                        </button>
                        {po.status === 'Pending Approval' && (
                          <>
                            <button className="po-action-accept" onClick={() => {
                              handleAction('accept', po.id);
                            }}>
                              <FiCheck size={13} />
                            </button>
                            <button className="po-action-reject" onClick={() => setSelectedPO(po)}>
                              <FiX size={13} />
                            </button>
                          </>
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

      {/* Detail Drawer */}
      {selectedPO && (
        <PODetailDrawer
          po={selectedPO}
          invoices={invoices}
          onClose={() => setSelectedPO(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default VendorPortalPurchaseOrders;
