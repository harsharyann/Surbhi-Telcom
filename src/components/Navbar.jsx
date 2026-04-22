import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, LogIn, LogOut, Menu, X, Building2, Upload } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { isAdminLoggedIn, adminLogout, isConnected } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/records', label: 'Records', icon: FileText },
    { to: '/uploads', label: 'Uploads', icon: Upload },
  ];

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      navigate('/admin');
    } else {
      navigate('/admin-login');
    }
    setMenuOpen(false);
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #001f5b 0%, #003A8F 60%, #0052CC 100%)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.22)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
          {/* Logo */}
          <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'linear-gradient(135deg, #E31E24, #ff4040)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(227,30,36,0.4)',
              flexShrink: 0,
            }}>
              <Building2 size={24} color="#fff" />
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                Surbhi Telcom
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.68rem', fontWeight: 400, letterSpacing: '0.05em' }}>
                UNION BANK OF INDIA
              </div>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-nav">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: isActive ? '#FFD700' : 'rgba(255,255,255,0.82)',
                  background: isActive ? 'rgba(255,215,0,0.10)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.88rem',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid rgba(255,215,0,0.25)' : '1px solid transparent',
                })}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            <button onClick={handleAdminClick} style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.82)',
              fontSize: '0.88rem',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              padding: '8px 16px',
              transition: 'all 0.2s ease',
              fontWeight: 400,
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.82)'}
            >
              Shailesh Kumar Nirala
            </button>
            {isAdminLoggedIn && (
              <button onClick={() => { adminLogout(); navigate('/'); }} style={{
                padding: '8px 14px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.8rem', cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Poppins, sans-serif',
              }}>
                Logout
              </button>
            )}
            
            {/* Connection Status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '20px',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.1)',
              marginLeft: '8px'
            }}>
              <div style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: isConnected ? '#10b981' : '#ef4444',
                boxShadow: isConnected ? '0 0 8px #10b981' : '0 0 8px #ef4444'
              }} />
              <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isConnected ? 'DB Live' : 'DB Offline'}
              </span>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none', background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#fff',
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px',
          }} className="mobile-menu">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} end={to === '/'}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '11px 16px', borderRadius: '10px',
                  textDecoration: 'none',
                  color: isActive ? '#FFD700' : 'rgba(255,255,255,0.85)',
                  background: isActive ? 'rgba(255,215,0,0.10)' : 'rgba(255,255,255,0.05)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.92rem',
                })}
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
            <button onClick={handleAdminClick} style={{
              background: 'rgba(255,255,255,0.05)',
              border: 'none',
              borderRadius: '10px',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.92rem',
              cursor: 'pointer',
              textAlign: 'left',
              padding: '11px 16px',
              fontWeight: 400,
              textTransform: 'uppercase',
              width: '100%',
              fontFamily: 'Poppins, sans-serif',
            }}>
              Shailesh Kumar Nirala
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}
