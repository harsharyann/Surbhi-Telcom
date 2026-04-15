import { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const { adminLogin } = useApp();
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await adminLogin(creds.email, creds.password);
    setLoading(false);
    if (ok) {
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } else {
      setError('Invalid email or password.');
      toast.error('Access denied.');
    }
  };

  return (
    <div className="page-enter" style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'linear-gradient(135deg, #001838 0%, #003A8F 50%, #0052CC 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '72px', height: '72px',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <ShieldCheck size={36} color="#FFD700" />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>
            Admin Access
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>
            Restricted area — authorized personnel only
          </p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                   className="neu-input"
                   type="email"
                   placeholder="admin@example.com"
                   value={creds.email}
                   onChange={e => setCreds(p => ({ ...p, email: e.target.value }))}
                   autoComplete="email"
                   style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  className="neu-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={creds.password}
                  onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                  style={{ paddingLeft: '42px', paddingRight: '44px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex',
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fca5a5',
                borderRadius: '10px', padding: '10px 14px',
                fontSize: '0.8rem', color: '#991b1b', marginBottom: '16px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span className="spinner" /> Verifying...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <ShieldCheck size={16} /> Login to Admin Panel
                </span>
              )}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.72rem', color: '#94a3b8' }}>
            Surbhi Telcom — Secure Admin Access
          </div>
        </div>
      </div>
    </div>
  );
}
