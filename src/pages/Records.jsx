import { useState } from 'react';
import {
  Search, Eye, Trash2, FileText, User, Phone, Hash, Calendar,
  ChevronLeft, ChevronRight, Download, X, AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PAGE_SIZE = 10;

export default function Records() {
  const { records } = useApp();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const filtered = records.filter(r =>
    [r.customerName, r.customerId, r.accountNumber, r.mobileNumber, r.aadharNumber]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Export ── */
  const exportExcel = () => {
    if (filtered.length === 0) { toast.error('No records to export.'); return; }
    const data = filtered.map((r, i) => ({
      'Serial No.':      r.slNo || '',
      'Customer Name':   r.customerName || '',
      'Account Number':  r.accountNumber || '',
      'Aadhar Number':   r.aadharNumber || '',
      'Contact No':      r.mobileNumber || '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 15 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    saveAs(
      new Blob([buf], { type: 'application/octet-stream' }),
      `SurbhiTelcom_Records_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.xlsx`
    );
    toast.success(`Exported ${filtered.length} record(s).`);
  };

  return (
    <div className="page-enter" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 60px' }}>

      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '12px', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#003A8F', marginBottom: '4px' }}>
            Customer Records
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {records.length} total account{records.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={exportExcel}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}
        >
          <Download size={16} /> Export to Excel
        </button>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '480px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            className="neu-input"
            placeholder="Search by name, Aadhar, account, contact..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ paddingLeft: '42px' }}
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: selected ? '1fr 340px' : '1fr',
        gap: '24px', alignItems: 'start',
      }}>
        {/* Table */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
              <div style={{ color: '#94a3b8', fontWeight: 500 }}>
                {search ? 'No records match your search.' : 'No records yet. Register customers from the Dashboard.'}
              </div>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Serial No.</th>
                      <th>Customer Name</th>
                      <th>Account No</th>
                      <th>Aadhar No</th>
                      <th>Contact No</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((r, i) => (
                      <tr key={r.id} style={{ background: selected?.id === r.id ? '#eef3ff' : undefined }}>
                        <td style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                        <td><span className="badge badge-blue">{r.slNo || '—'}</span></td>
                        <td style={{ fontWeight: 600 }}>{r.customerName}</td>
                        <td style={{ fontSize: '0.8rem' }}>{r.accountNumber || '—'}</td>
                        <td style={{ fontSize: '0.8rem' }}>{r.aadharNumber || '—'}</td>
                        <td style={{ fontSize: '0.8rem' }}>{r.mobileNumber || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                            <button
                              id={`view-${r.id}`}
                              onClick={() => setSelected(selected?.id === r.id ? null : r)}
                              title="View Details"
                              style={{
                                width: '32px', height: '32px',
                                background: selected?.id === r.id ? '#dbeafe' : '#f1f5f9',
                                border: 'none', borderRadius: '8px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                              onMouseLeave={e => e.currentTarget.style.background = selected?.id === r.id ? '#dbeafe' : '#f1f5f9'}
                            >
                              <Eye size={14} color="#0052CC" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', borderTop: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="btn-outline" style={{ padding: '6px 12px' }} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft size={15} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{
                      width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer',
                      background: page === p ? '#003A8F' : 'transparent',
                      color: page === p ? '#fff' : '#64748b',
                      border: page === p ? 'none' : '1.5px solid #e2e8f0',
                      fontWeight: page === p ? 600 : 400, fontSize: '0.82rem',
                    }}>{p}</button>
                  ))}
                  <button className="btn-outline" style={{ padding: '6px 12px' }} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="glass-card animate-slideLeft" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 700, color: '#003A8F', fontSize: '1rem' }}>Customer Details</h3>
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: '#f1f5f9', border: 'none', borderRadius: '8px',
                  padding: '6px', cursor: 'pointer', display: 'flex',
                }}
              >
                <X size={15} color="#64748b" />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Serial No.',     value: selected.slNo,          icon: Hash },
                { label: 'Customer Name',  value: selected.customerName,  icon: User },
                { label: 'Account No',     value: selected.accountNumber, icon: Hash },
                { label: 'Aadhar No',      value: selected.aadharNumber,  icon: Hash },
                { label: 'Contact No',     value: selected.mobileNumber,  icon: Phone },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} style={{
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  padding: '10px 12px', background: '#f8faff', borderRadius: '10px',
                }}>
                  <div style={{ color: '#94a3b8', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                  </div>
                  <div style={{ color: '#1e293b', fontWeight: 500, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icon size={13} color="#94a3b8" />
                    {value || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
