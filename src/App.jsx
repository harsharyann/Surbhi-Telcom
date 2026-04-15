import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Uploads from './pages/Uploads';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.85rem',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          success: {
            style: { background: '#d1fae5', color: '#065f46', border: '1px solid #34d399' },
            iconTheme: { primary: '#059669', secondary: '#fff' },
          },
          error: {
            style: { background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
            iconTheme: { primary: '#E31E24', secondary: '#fff' },
          },
        }}
      />
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
