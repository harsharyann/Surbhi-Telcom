import FileSection from '../components/FileSection';
import { Upload, Info } from 'lucide-react';

export default function Uploads() {
  return (
    <div className="page-enter" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 60px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#003A8F', marginBottom: '4px' }}>
          Document Uploads
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Upload and manage all files and documents</p>
      </div>

      <div className="glass-card animate-fadeIn" style={{
        padding: '16px 20px', marginBottom: '24px',
        background: 'linear-gradient(135deg, #eef3ff, #e0eaff)',
        border: '1px solid #c7d9ff',
        display: 'flex', alignItems: 'flex-start', gap: '12px',
      }}>
        <Info size={18} color="#003A8F" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.82rem', color: '#1e3a8a', lineHeight: 1.6 }}>
          <strong>Upload Tip:</strong> You can drag and drop multiple files at once. Supported formats include PDF, JPG, PNG, and more. Files are stored locally in this session.
        </div>
      </div>

      <FileSection />
    </div>
  );
}
