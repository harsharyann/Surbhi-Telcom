export default function CustomerForm() {
  const { addRecord, records } = useApp();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  // Auto-calculate next Serial No
  useEffect(() => {
    const nextSl = records.length > 0 
      ? Math.max(...records.map(r => parseInt(r.slNo) || 0)) + 1 
      : 1;
    setForm(prev => ({ ...prev, slNo: nextSl.toString() }));
  }, [records]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    const result = await addRecord(form);
    setLoading(false);

    if (result) {
      // Form slNo will be updated by useEffect
      setForm({ ...INITIAL_FORM });
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
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,58,143,0.03) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
        <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #003A8F, #0052CC)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,58,143,0.2)' }}>
          <User size={22} color="#fff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#003A8F', marginBottom: '2px' }}>Customer Registration</h2>
          <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Fill in the details to register a new customer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div className="form-group">
            <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '0.06em' }}>
              Serial No.
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                <Hash size={16} />
              </div>
              <input
                className="neu-input"
                type="text"
                value={form.slNo}
                readOnly
                style={{ paddingLeft: '44px', fontWeight: 700, color: '#64748b', background: '#f8fafc', cursor: 'not-allowed' }}
              />
            </div>
          </div>
          <InputField label="Customer Name" icon={User} placeholder="Full Name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
          <InputField label="Aadhar Number" icon={Fingerprint} placeholder="12 Digit Aadhar" value={form.aadharNumber} maxLength="12" onChange={e => setForm({ ...form, aadharNumber: e.target.value.replace(/\D/g, '') })} />
          <InputField label="Account Number" icon={Landmark} placeholder="Account No" value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} />
          <InputField label="Contact No" icon={Phone} placeholder="10 Digit Mobile" value={form.mobileNumber} maxLength="10" onChange={e => setForm({ ...form, mobileNumber: e.target.value.replace(/\D/g, '') })} />
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

