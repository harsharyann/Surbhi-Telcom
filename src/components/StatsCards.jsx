import { Users, FileText, TrendingUp, CalendarCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StatsCards() {
  const { records } = useApp();

  const today = new Date().toDateString();
  const todayCount = records.filter(r => new Date(r.createdAt).toDateString() === today).length;

  // This month count
  const now = new Date();
  const monthCount = records.filter(r => {
    const d = new Date(r.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      label: 'Today',
      value: todayCount,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #E31E24 0%, #ff5252 100%)',
      shadow: 'rgba(227,30,36,0.25)',
      sub: 'New registrations',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
    }}>
      {stats.map(({ label, value, icon: Icon, gradient, shadow, sub }, i) => (
        <div
          key={label}
          className={`stat-card animate-fadeInUp delay-${(i + 1) * 100}`}
          style={{
            background: gradient,
            boxShadow: `0 8px 24px ${shadow}`,
            color: '#fff',
          }}
        >
          {/* Background decoration */}
          <div style={{
            position: 'absolute', top: '-20px', right: '-20px',
            width: '100px', height: '100px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, marginTop: '6px', opacity: 0.9 }}>{label}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.65, marginTop: '4px' }}>{sub}</div>
              </div>
              <div style={{
                width: '48px', height: '48px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)',
              }}>
                <Icon size={24} color="rgba(255,255,255,0.9)" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
