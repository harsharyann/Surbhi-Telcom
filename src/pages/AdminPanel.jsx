import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Search, Trash2, Download, Edit2, X,
  Users, FileText, TrendingUp, CheckCircle, ChevronLeft, ChevronRight,
  LogOut, Filter, Upload, FileSpreadsheet, AlertCircle, Eye, AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PAGE_SIZE = 10;

/* ─── Column name aliases – handles various Excel header formats ─── */
const COL = {
  slNo:          ['serial no.', 'serial no', 'sl no', 'sl.no', 'slno', 'serial no', 'sr no', 'sr.no'],
  dateOfOpening: ['date of opening', 'date of account opening', 'account opening date', 'date'],
  customerName:  ['customer name', 'name', 'full name'],
  fatherName:    ["father's name", 'father name', 'fathername', "father"],
  customerId:    ['customer id', 'customerid', 'cust id', 'cust. id'],
  aadharNumber:  ['aadhar number', 'aadhar no', 'aadhar', 'aadhaar', 'aadhaar number'],
  accountNumber: ['account number', 'account no', 'acc no', 'acc number', 'bank account'],
  mobileNumber:  ['mobile number', 'mobile', 'mobile no', 'phone', 'phone number'],
  address:       ['address', 'addr', 'residential address'],
};

function findVal(row, aliases) {
  for (const alias of aliases) {
    for (const key of Object.keys(row)) {
      if (key.toLowerCase().trim() === alias) return String(row[key] ?? '').trim();
    }
  }
  return '';
}

/* ─── Theme Delete Confirmation ─── */
function DeleteConfirm({ onConfirm, onCancel, title = "Delete Record?" }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,10,0.65)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div className="glass-card animate-fadeInUp" style={{ padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
        <div style={{
          width: '64px', height: '64px',
          background: 'linear-gradient(135deg, #fee2e2, #fca5a5)',
          borderRadius: '20px', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(227,30,36,0.15)',
        }}>
          <AlertTriangle size={30} color="#E31E24" />
        </div>
        <h3 style={{ fontWeight: 700, color: '#0f172a', fontSize: '1.2rem', marginBottom: '10px' }}>{title}</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '28px', lineHeight: 1.5 }}>
          Are you sure? This action is permanent and all associated data will be removed from the system.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-outline" onClick={onCancel} style={{ flex: 1, padding: '12px' }}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #E31E24, #ff5252)',
              color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              boxShadow: '0 4px 15px rgba(227,30,36,0.25)',
            }}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Modal ─── */
function EditModal({ record, onSave, onClose }) {
  const [form, setForm] = useState({ ...record });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const fields = [
    { key: 'slNo', label: 'Serial No.' },
    { key: 'dateOfOpening', label: 'Date of Opening', type: 'date' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'fatherName', label: "Father's Name" },
    { key: 'customerId', label: 'Customer ID' },
    { key: 'aadharNumber', label: 'Aadhar Number' },
    { key: 'accountNumber', label: 'Account Number' },
    { key: 'mobileNumber', label: 'Mobile Number' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div className="glass-card animate-fadeInUp" style={{ width: '100%', maxWidth: '560px', padding: '32px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontWeight: 700, color: '#003A8F', fontSize: '1.1rem' }}>Edit Record</h2>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer', display: 'flex' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          {fields.map(({ key, label, type }) => (
            <div key={key}>
              <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>{label}</label>
              <input
                className="neu-input"
                type={type || 'text'}
                value={form[key] || ''}
                onChange={e => set(key, e.target.value)}
                style={{ paddingLeft: '12px' }}
              />
            </div>
          ))}
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Address</label>
          <textarea className="neu-input" rows={2} value={form.address || ''} onChange={e => set('address', e.target.value)} style={{ paddingLeft: '12px', resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => {
            if (!form.customerName || !form.aadharNumber || !form.customerId) {
              toast.error('Name, Aadhar, and Customer ID are required.');
              return;
            }
            onSave(form);
          }}>
            <CheckCircle size={15} style={{ marginRight: '6px' }} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Excel Import Preview Modal ─── */
function ImportModal({ rows, onConfirm, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div className="glass-card animate-fadeInUp" style={{ width: '100%', maxWidth: '900px', padding: '32px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontWeight: 700, color: '#003A8F', fontSize: '1.1rem' }}>Preview Import</h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
              {rows.length} record(s) found — review before importing
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Info banner */}
        <div style={{
          background: 'linear-gradient(135deg, #eef3ff, #e0eaff)',
          border: '1px solid #c7d9ff', borderRadius: '10px',
          padding: '12px 16px', marginBottom: '16px',
          display: 'flex', gap: '10px', alignItems: 'flex-start',
        }}>
          <AlertCircle size={16} color="#003A8F" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '0.78rem', color: '#1e3a8a' }}>
            These records will be <strong>added</strong> to the existing data. Duplicates won't be removed automatically. Check your data before confirming.
          </div>
        </div>

        {/* Preview table */}
        <div style={{ overflowY: 'auto', flex: 1, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <table className="data-table" style={{ fontSize: '0.78rem' }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Serial No.</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Father's Name</th>
                <th>Customer ID</th>
                <th>Aadhar</th>
                <th>Account No</th>
                <th>Mobile</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: '#94a3b8' }}>{i + 1}</td>
                  <td>{r.slNo || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{r.dateOfOpening || '—'}</td>
                  <td style={{ fontWeight: 600 }}>{r.customerName || '—'}</td>
                  <td>{r.fatherName || '—'}</td>
                  <td><code style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '5px', fontSize: '0.72rem' }}>{r.customerId || '—'}</code></td>
                  <td style={{ fontFamily: 'monospace' }}>{r.aadharNumber || '—'}</td>
                  <td>{r.accountNumber || '—'}</td>
                  <td>{r.mobileNumber || '—'}</td>
                  <td style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.address}>{r.address || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onConfirm}>
            <CheckCircle size={15} style={{ marginRight: '6px' }} />
            Import {rows.length} Record{rows.length !== 1 ? 's' : ''} to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Excel Import Zone ─── */
function ExcelImportSection({ onImport }) {
  const inputRef = useRef();
  const [drag, setDrag] = useState(false);
  const [previewRows, setPreviewRows] = useState(null);
  const [fileName, setFileName] = useState('');

  const parseFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array', cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { defval: '' });
        if (!raw.length) { toast.error('No data found in the Excel file.'); return; }
        const mapped = raw.map(row => ({
          slNo:          findVal(row, COL.slNo),
          dateOfOpening: findVal(row, COL.dateOfOpening),
          customerName:  findVal(row, COL.customerName),
          fatherName:    findVal(row, COL.fatherName),
          customerId:    findVal(row, COL.customerId),
          aadharNumber:  findVal(row, COL.aadharNumber),
          accountNumber: findVal(row, COL.accountNumber),
          mobileNumber:  findVal(row, COL.mobileNumber),
          address:       findVal(row, COL.address),
        })).filter(r => r.customerName); // skip empty rows
        if (!mapped.length) { toast.error('Could not map any rows. Check column headers match the expected format.'); return; }
        setPreviewRows(mapped);
      } catch {
        toast.error('Failed to read Excel file. Please ensure it is a valid .xlsx or .xls file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirm = () => {
    onImport(previewRows);
    setPreviewRows(null);
    setFileName('');
  };

  return (
    <>
      <div className="glass-card animate-fadeInUp" style={{ padding: '28px', marginBottom: '28px' }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{
            width: '44px', height: '44px',
            background: 'linear-gradient(135deg, #1565C0, #1E88E5)',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(21,101,192,0.30)',
          }}>
            <FileSpreadsheet size={22} color="#fff" />
          </div>
          <div>
            <h3 style={{ fontWeight: 700, color: '#003A8F', fontSize: '1rem' }}>Import Excel Data</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
              Upload an Excel file (.xlsx / .xls) to bulk import customer records into the dashboard
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
          {/* Drop zone */}
          <div
            className={`upload-zone ${drag ? 'drag-over' : ''}`}
            style={{ padding: '28px', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); parseFile(e.dataTransfer.files[0]); }}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              style={{ display: 'none' }}
              onChange={e => parseFile(e.target.files[0])}
            />
            <div style={{
              width: '52px', height: '52px',
              background: 'linear-gradient(135deg, #e0eaff, #c7d9ff)',
              borderRadius: '14px', margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: drag ? 'scale(1.1) rotate(-4deg)' : 'scale(1)',
              transition: 'transform 0.3s',
            }}>
              <Upload size={24} color="#003A8F" />
            </div>
            {fileName ? (
              <div>
                <div style={{ fontWeight: 600, color: '#003A8F', fontSize: '0.88rem' }}>✓ {fileName}</div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>Click to change file</div>
              </div>
            ) : (
              <>
                <div style={{ fontWeight: 600, color: '#334155', fontSize: '0.88rem' }}>
                  {drag ? 'Drop your Excel file here' : <>Drop Excel file or <span style={{ color: '#0052CC' }}>browse</span></>}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '6px' }}>Supports .xlsx and .xls formats</div>
              </>
            )}
          </div>

          {/* Column mapping guide */}
          <div style={{
            background: '#f8faff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px',
            minWidth: '220px',
            fontSize: '0.72rem',
          }}>
            <div style={{ fontWeight: 700, color: '#003A8F', marginBottom: '10px', fontSize: '0.78rem' }}>
              📋 Expected Column Headers
            </div>
            {[
              ['Serial No.', 'serial no. / slno'],
              ['Date', 'date of opening'],
              ['Name', 'customer name'],
              ['Father', "father's name"],
              ['Customer ID', 'customer id'],
              ['Aadhar', 'aadhar number'],
              ['Account', 'account number'],
              ['Mobile', 'mobile number'],
              ['Address', 'address'],
            ].map(([field, hint]) => (
              <div key={field} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>{field}</span>
                <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>{hint}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {previewRows && (
        <ImportModal rows={previewRows} onConfirm={handleConfirm} onClose={() => { setPreviewRows(null); setFileName(''); }} />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   Main Admin Panel
══════════════════════════════════════════════ */
export default function AdminPanel() {
  const { records, uploads, deleteRecord, updateRecord, addRecords, clearAllRecords, isAdminLoggedIn, adminLogout } = useApp();
  const navigate = useNavigate();
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [editRecord, setEditRecord] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [activeTab, setActiveTab]   = useState('records'); // 'records' | 'import'
  const [pendingDelete, setPendingDelete] = useState(null); // id or 'all'

  useEffect(() => {
    if (!isAdminLoggedIn) navigate('/admin-login');
  }, [isAdminLoggedIn, navigate]);

  if (!isAdminLoggedIn) return null;

  const filtered = records.filter(r => {
    const matchSearch = [r.customerName, r.customerId, r.accountNumber, r.mobileNumber, r.aadharNumber]
      .join(' ').toLowerCase().includes(search.toLowerCase());
    const matchDate = filterDate ? r.dateOfOpening === filterDate : true;
    return matchSearch && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirmAction = () => {
    if (pendingDelete === 'all') {
      clearAllRecords();
      toast.success('All records cleared successfully.');
    } else {
      deleteRecord(pendingDelete);
      toast.success('Record deleted.');
    }
    setPendingDelete(null);
  };

  const handleSave = (updated) => {
    updateRecord(updated.id, updated);
    setEditRecord(null);
    toast.success('Record updated successfully!');
  };

  const handleImport = (rows) => {
    addRecords(rows);
    toast.success(`✅ ${rows.length} record(s) imported successfully!`, { duration: 5000 });
    setActiveTab('records');
    setPage(1);
  };

  const exportExcel = () => {
    const data = filtered.map(r => ({
      'Serial No.':      r.slNo,
      'Date of Opening': r.dateOfOpening,
      'Customer Name':   r.customerName,
      "Father's Name":   r.fatherName,
      'Customer ID':     r.customerId,
      'Aadhar Number':   r.aadharNumber,
      'Account Number':  r.accountNumber,
      'Mobile':          r.mobileNumber,
      'Address':         r.address,
      'Registered At':   new Date(r.createdAt).toLocaleString('en-IN'),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `SurbhiTelcom_Records_Export_${Date.now()}.xlsx`);
    toast.success(`Exported ${filtered.length} record(s) to Excel!`);
  };

  const today     = new Date().toDateString();
  const todayCount = records.filter(r => new Date(r.createdAt).toDateString() === today).length;

  const tabs = [
    { id: 'records', label: 'Records & Data', icon: FileText },
    { id: 'import',  label: 'Import Excel', icon: FileSpreadsheet },
  ];

  return (
    <div className="page-enter" style={{ minHeight: 'calc(100vh - 68px)', background: '#f0f4ff' }}>
      {/* ── Admin Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #001440 0%, #002572 60%, #003A8F 100%)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <ShieldCheck size={22} color="#FFD700" />
              <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>Admin Control Panel</h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Surbhi Telcom — Full Administration Dashboard</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={exportExcel}>
              <Download size={14} style={{ marginRight: '6px' }} /> Export Excel
            </button>
            <button
              onClick={() => { adminLogout(); navigate('/'); toast.success('Logged out.'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 18px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer', fontSize: '0.88rem',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px 60px' }}>
        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Customers', value: records.length, icon: Users, gradient: 'linear-gradient(135deg,#003A8F,#0052CC)', shadow: 'rgba(0,58,143,0.3)' },
            { label: "Today's Entries", value: todayCount, icon: TrendingUp, gradient: 'linear-gradient(135deg,#E31E24,#ff5252)', shadow: 'rgba(227,30,36,0.3)' },
            { label: 'This Month', value: records.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length, icon: CheckCircle, gradient: 'linear-gradient(135deg,#1565C0,#1E88E5)', shadow: 'rgba(21,101,192,0.3)' },
            { label: 'Search Results', value: filtered.length, icon: FileText, gradient: 'linear-gradient(135deg,#4a00a0,#7c3aed)', shadow: 'rgba(124,58,237,0.3)' },
          ].map(({ label, value, icon: Icon, gradient, shadow }) => (
            <div key={label} className="stat-card" style={{ background: gradient, boxShadow: `0 6px 20px ${shadow}`, color: '#fff' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '4px' }}>{label}</div>
                </div>
                <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color="rgba(255,255,255,0.9)" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'rgba(255,255,255,0.7)', padding: '5px', borderRadius: '14px', width: 'fit-content', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.5)' }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '9px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif', fontWeight: activeTab === id ? 600 : 400,
                fontSize: '0.88rem',
                background: activeTab === id ? 'linear-gradient(135deg, #003A8F, #0052CC)' : 'transparent',
                color: activeTab === id ? '#fff' : '#64748b',
                boxShadow: activeTab === id ? '0 4px 12px rgba(0,58,143,0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={15} />
              {label}
              {id === 'import' && (
                <span style={{ background: 'rgba(255,215,0,0.9)', color: '#003A8F', fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: '999px' }}>NEW</span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Import Excel ── */}
        {activeTab === 'import' && (
          <ExcelImportSection onImport={handleImport} />
        )}

        {/* ── Tab: Records ── */}
        {activeTab === 'records' && (
          <>
            {/* Filters */}
            <div className="glass-card" style={{ padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1 }}>
                  <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      className="neu-input"
                      placeholder="Search name, ID, account, Aadhar..."
                      value={search}
                      onChange={e => { setSearch(e.target.value); setPage(1); }}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Filter size={15} color="#94a3b8" />
                    <input
                      className="neu-input"
                      type="date"
                      value={filterDate}
                      onChange={e => { setFilterDate(e.target.value); setPage(1); }}
                      style={{ paddingLeft: '12px', width: 'auto', minWidth: '160px' }}
                      title="Filter by account opening date"
                    />
                    {filterDate && (
                      <button
                        onClick={() => setFilterDate('')}
                        style={{ padding: '8px 12px', borderRadius: '10px', background: '#fee2e2', border: 'none', color: '#991b1b', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        Clear Filter
                      </button>
                    )}
                  </div>
                </div>
                {records.length > 0 && (
                  <button
                    onClick={() => setPendingDelete('all')}
                    style={{
                      background: 'rgba(227,30,36,0.08)',
                      border: '1px solid rgba(227,30,36,0.15)',
                      color: '#E31E24',
                      padding: '10px 16px', borderRadius: '10px',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px',
                    }}
                  >
                    <Trash2 size={14} /> Clear All Records
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              {paginated.length === 0 ? (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                  <div style={{ color: '#94a3b8' }}>No records found.</div>
                  <button className="btn-primary" onClick={() => setActiveTab('import')} style={{ marginTop: '16px', fontSize: '0.85rem' }}>
                    <Upload size={14} style={{ marginRight: '6px' }} /> Import from Excel
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Serial No.</th>
                          <th>Date</th>
                          <th>Customer Name</th>
                          <th>Father's Name</th>
                          <th>Customer ID</th>
                          <th>Aadhar</th>
                          <th>Account No</th>
                          <th>Mobile</th>
                          <th>Address</th>
                          <th>Photo</th>
                          <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginated.map((r, i) => (
                          <tr key={r.id}>
                            <td style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{(page - 1) * PAGE_SIZE + i + 1}</td>
                            <td><span className="badge badge-blue">{r.slNo}</span></td>
                            <td style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                              {r.dateOfOpening ? new Date(r.dateOfOpening).toLocaleDateString('en-IN') : '—'}
                            </td>
                            <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{r.customerName}</td>
                            <td style={{ fontSize: '0.82rem', color: '#475569' }}>{r.fatherName}</td>
                            <td><code style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '2px 7px', borderRadius: '6px' }}>{r.customerId}</code></td>
                            <td style={{ fontSize: '0.78rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{r.aadharNumber}</td>
                            <td style={{ fontSize: '0.8rem' }}>{r.accountNumber}</td>
                            <td style={{ fontSize: '0.8rem' }}>{r.mobileNumber}</td>
                            <td style={{ fontSize: '0.78rem', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.address}>{r.address}</td>
                            <td>
                              {r.photo?.dataUrl ? (
                                <img src={r.photo.dataUrl} alt="Photo" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '8px', border: '1.5px solid #003A8F' }} />
                              ) : <span style={{ color: '#cbd5e1', fontSize: '0.72rem' }}>None</span>}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button title="Edit" onClick={() => setEditRecord(r)}
                                  style={{
                                    width: '32px', height: '32px', background: '#dbeafe', border: 'none', borderRadius: '9px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#bfdbfe'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#dbeafe'}
                                >
                                  <Edit2 size={13} color="#1d4ed8" />
                                </button>
                                <button title="Delete" onClick={() => setPendingDelete(r.id)}
                                  style={{
                                    width: '32px', height: '32px', background: '#fee2e2', border: 'none', borderRadius: '9px',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                  }}
                                  onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                                  onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                                >
                                  <Trash2 size={13} color="#991b1b" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} records
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
                          fontWeight: page === p ? 600 : 400,
                          fontSize: '0.82rem', fontFamily: 'Poppins, sans-serif',
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
          </>
        )}
      </div>

      {editRecord && <EditModal record={editRecord} onSave={handleSave} onClose={() => setEditRecord(null)} />}

      {pendingDelete && (
        <DeleteConfirm
          title={pendingDelete === 'all' ? "Clear All Records?" : "Delete Record?"}
          onConfirm={confirmAction}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
