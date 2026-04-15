import { ShieldCheck, Building2, MapPin } from 'lucide-react';
import CustomerForm from '../components/CustomerForm';

export default function Dashboard() {
  return (
    <div className="page-enter" style={{ background: 'linear-gradient(180deg, #F0F4FF 0%, #E8EEFF 100%)', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div className="hero-gradient" style={{ padding: '56px 24px 64px', position: 'relative' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div>
            {/* UBI badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.22)',
              borderRadius: '999px',
              padding: '6px 16px',
              marginBottom: '18px',
              fontSize: '0.75rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 500,
            }}>
              <ShieldCheck size={14} color="#FFD700" />
              Authorized Business Partner — Union Bank of India
            </div>

            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '12px',
            }}>
              Surbhi <span style={{ color: '#FFD700' }}>Telcom</span>
            </h1>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', fontWeight: 400, marginBottom: '24px' }}>
              Customer Account Registration Portal
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {[
                { icon: Building2, text: 'Union Bank of India' },
                { icon: MapPin, text: 'Authorized Center' },
                { icon: ShieldCheck, text: 'Secure & Verified' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)',
                }}>
                  <Icon size={13} color="rgba(255,215,0,0.8)" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, overflow: 'hidden', lineHeight: 0 }}>
          <svg viewBox="0 0 1440 50" style={{ display: 'block', width: '100%' }} preserveAspectRatio="none">
            <path d="M0,30 C360,55 1080,5 1440,30 L1440,50 L0,50 Z" fill="#F0F4FF" />
          </svg>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 60px' }}>
        <CustomerForm />
      </div>
    </div>
  );
}
