export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #001440 0%, #002268 100%)',
      color: 'rgba(255,255,255,0.7)',
      padding: '32px 24px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center', gap: '16px',
        }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>
              Surbhi Telcom
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
              Authorized Service Partner — Union Bank of India
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
              © {new Date().getFullYear()} Surbhi Telcom. All rights reserved.
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Designed & Developed by</div>
            <div style={{
              color: '#FFD700', fontWeight: 600, fontSize: '0.9rem', marginTop: '2px',
            }}>
              ✦ Harsh Aryan
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
