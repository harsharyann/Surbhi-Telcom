import { useState, useRef } from 'react';
import {
  Hash, Calendar, User, Users, CreditCard, Fingerprint,
  Landmark, Phone, MapPin, Camera, PenLine, CheckCircle, Loader2, Upload, X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  slNo: '',
  dateOfOpening: new Date().toISOString().split('T')[0],
  customerName: '',
  fatherName: '',
  customerId: '',
  aadharNumber: '',
  accountNumber: '',
  mobileNumber: '',
  address: '',
  nomineeName: '',
  nomineeAge: '',
  schemeApy: false,
  schemePmsby: false,
  schemePmjjby: false,
};

const InputField = ({ label, icon: Icon, type = 'text', value, onChange, placeholder, required, maxLength }) => (
  <div className="form-group">
    <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.06em' }}>
      {label} {required && <span style={{ color: '#E31E24' }}>*</span>}
    </label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
        <Icon size={16} />
      </div>
      <input
        className="neu-input"
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        style={{ paddingLeft: '44px', fontWeight: 700, color: '#002560' }}
      />
    </div>
  </div>
);

const FileZone = ({ label, value, onUpload, field, icon: Icon, type = "photo", refs, setForm }) => (
  <div style={{ flex: 1, minWidth: '240px' }}>
    <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.06em' }}>
      {label}
    </label>
    <div
      onClick={() => (field === 'photo' ? refs.photo : refs.sign).current.click()}
      style={{
        height: type === 'photo' ? '140px' : '100px',
        background: value ? '#fff' : '#f8faff',
        border: value ? '2px solid #003A8F' : '2px dashed #003A8F',
        borderRadius: '16px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: value ? '0 4px 12px rgba(0,58,143,0.15)' : 'none',
      }}
      onMouseEnter={e => !value && (e.currentTarget.style.borderColor = '#003A8F')}
      onMouseLeave={e => !value && (e.currentTarget.style.borderColor = '#e2e8f0')}
    >
      <input
        ref={field === 'photo' ? refs.photo : refs.sign}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => onUpload(e, field)}
      />
      
      {value ? (
        <>
          <img src={value.dataUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: type === 'photo' ? 'cover' : 'contain' }} />
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.2s'
          }} onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0}>
            <div style={{ background: '#fff', borderRadius: '50%', padding: '8px' }}>
              <Upload size={20} color="#003A8F" />
            </div>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setForm(p => ({ ...p, [field]: null })); }}
            style={{ position: 'absolute', top: '8px', right: '8px', background: '#E31E24', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
          >
            <X size={14} color="#fff" />
          </button>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '10px' }}>
          <div style={{ width: '44px', height: '44px', background: '#eef3ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Icon size={20} color="#003A8F" />
          </div>
          <div style={{ fontSize: '0.8rem', color: '#1e293b', fontWeight: 600 }}>Click to Upload</div>
          <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '4px' }}>Max 20KB (JPG/PNG)</div>
        </div>
      )}
    </div>
  </div>
);

export default function CustomerForm() {
  const { addRecord } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName || !form.aadharNumber || !form.customerId || !form.nomineeName || !form.nomineeAge) {
      toast.error('Name, Aadhar, Customer ID, and Nominee details are required.');
      return;
    }
    if (!/^\d{12}$/.test(form.aadharNumber)) {
      toast.error('Aadhar Number must be exactly 12 digits.');
      return;
    }
    if (form.mobileNumber && !/^\d{10}$/.test(form.mobileNumber)) {
      toast.error('Mobile Number must be exactly 10 digits.');
      return;
    }
    
    setLoading(true);
    const result = await addRecord(form);
    setLoading(false);

    if (result) {
      setForm(INITIAL_FORM);
      toast.success('Customer registered successfully!', {
        icon: '✅',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="glass-card animate-fadeInUp" style={{ 
      padding: '40px', 
      position: 'relative', 
      overflow: 'hidden',
      border: '1.5px solid rgba(0, 58, 143, 0.15)',
      boxShadow: '0 20px 50px rgba(0, 58, 143, 0.12), 0 0 20px rgba(0, 58, 143, 0.05)'
    }}>
      {/* Decorative background element */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,58,143,0.03) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #003A8F, #0052CC)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,58,143,0.2)' }}>
          <User size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#003A8F', marginBottom: '2px' }}>Customer Registration</h2>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Fill in the details to open a new account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        {/* Core Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <InputField label="Serial No." icon={Hash} placeholder="e.g. 001" value={form.slNo} onChange={e => setForm({ ...form, slNo: e.target.value })} />
          <InputField label="Date of Opening" icon={Calendar} type="date" value={form.dateOfOpening} onChange={e => setForm({ ...form, dateOfOpening: e.target.value })} />
          <InputField label="Customer Name" icon={User} placeholder="Full Name" required value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
          <InputField label="Father's Name" icon={Users} placeholder="Father's Full Name" value={form.fatherName} onChange={e => setForm({ ...form, fatherName: e.target.value })} />
          <InputField label="Customer ID" icon={CreditCard} placeholder="UID/Cust ID" required value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} />
          <InputField label="Aadhar Number" icon={Fingerprint} placeholder="12 Digit Aadhar" required value={form.aadharNumber} maxLength="12" onChange={e => setForm({ ...form, aadharNumber: e.target.value.replace(/\D/g, '') })} />
          <InputField label="Account Number" icon={Landmark} placeholder="Union Bank A/c No" value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} />
          <InputField label="Mobile Number" icon={Phone} placeholder="10 Digit Mobile" value={form.mobileNumber} maxLength="10" onChange={e => setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, '') })} />
          <InputField label="Nominee Name" icon={User} placeholder="Full name of nominee" required value={form.nomineeName} onChange={e => setForm({ ...form, nomineeName: e.target.value })} />
          <InputField label="Nominee Age" icon={Calendar} type="number" placeholder="Age" required value={form.nomineeAge} onChange={e => setForm({ ...form, nomineeAge: e.target.value })} />
        </div>

        {/* Address Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', alignItems: 'start' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.06em' }}>Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '16px', color: '#64748b' }}>
                <MapPin size={16} />
              </div>
              <textarea
                className="neu-input"
                rows={5}
                placeholder="Full residential address..."
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                style={{ paddingLeft: '44px', paddingTop: '14px', resize: 'vertical', minHeight: '140px', fontWeight: 700, color: '#002560' }}
              />
            </div>
          </div>
        </div>

        {/* Schemes Section */}
        <div style={{ background: '#f8faff', borderRadius: '18px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', background: '#003A8F', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={16} color="#fff" />
            </div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#003A8F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Government Schemes (Optional)</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { id: 'schemeApy', label: 'APY (Atal Pension Yojana)' },
              { id: 'schemePmsby', label: 'PMSBY (Accident Insurance)' },
              { id: 'schemePmjjby', label: 'PMJJBY (Life Insurance)' },
            ].map(scheme => (
              <div 
                key={scheme.id}
                onClick={() => setForm({ ...form, [scheme.id]: !form[scheme.id] })}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: form[scheme.id] ? '#003A8F' : '#fff',
                  border: `2.5px solid ${form[scheme.id] ? '#003A8F' : '#e2e8f0'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: form[scheme.id] ? '0 4px 12px rgba(0,58,143,0.3)' : 'none',
                  transform: form[scheme.id] ? 'translateY(-2px)' : 'none',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  border: `2px solid ${form[scheme.id] ? '#fff' : '#cbd5e1'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: form[scheme.id] ? '#fff' : 'transparent',
                }}>
                  {form[scheme.id] && <CheckCircle size={14} color="#003A8F" />}
                </div>
                <span style={{ 
                  fontSize: '0.78rem', 
                  fontWeight: 700, 
                  color: form[scheme.id] ? '#fff' : '#475569' 
                }}>{scheme.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              padding: '14px 40px',
              fontSize: '1rem',
              width: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Registering...</>
            ) : (
              <><CheckCircle size={18} /> Complete Registration</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
